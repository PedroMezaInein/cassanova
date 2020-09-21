import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { URL_DEV, DOCUMENTOS_COLUMNS } from '../../../constants'
import { setDateTable, setTextTable } from '../../../functions/setters'
import { waitAlert, errorAlert, doneAlert, forbiddenAccessAlert, deleteAlert } from '../../../functions/alert'
import axios from 'axios'
import { Button } from '../../../components/form-components'


const $ = require('jquery');

class Documentos extends Component {

    state = {
        modalDelete: false,
        modalAdjuntos: false,
        documento: '',
        form:{
            adjuntos:{
                adjuntos:{
                    value: '',
                    placeholder: 'Adjuntos',
                    files: []
                }
            }
        }
    }

    setDocumentos = documentos => {
        let aux = []
        documentos.map( (documento) => {
            aux.push({
                actions: this.setActions(documento),
                empresa: renderToString(setTextTable(documento.empresa ? documento.empresa.name : 'Sin definir')),
                nombre: renderToString(setTextTable(documento.nombre)),
                fecha: renderToString(setDateTable(documento.created_at)),
                id: documento.id
            })
        })
        return aux
    }

    setActions = herramienta => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Adjuntos',
                btnclass: 'primary',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
        )
        return aux
    }

    setAdjuntos = adjuntos => {
        const { form } = this.state
        let aux = []
        adjuntos.map( (adj) => {
            aux.push({
                name: adj.name,
                url: adj.url,
                id: adj.id
            })
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    changePageEdit = documento => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/documentos/edit',
            state: { documento: documento}
        });
    }

    openModalDelete = documento => {
        this.setState({
            ... this.state,
            documento: documento,
            modalDelete: true
        })
    }

    openModalAdjuntos = documento => {
        const { form } = this.state
        let aux = []
        if(documento.adjuntos)
        {
            documento.adjuntos.map( (adj) => {
                aux.push({
                    id: adj.id,
                    name: adj.name,
                    url: adj.url
                })
            })
        }
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            form,
            documento: documento
        })
    }

    handleCloseDelete = () => {
        this.setState({
            ... this.state,
            documento: '',
            modalDelete: false
        })
    }

    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ... this.state,
            documento: '',
            form,
            modalAdjuntos: false
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    deleteFile = element => {
        deleteAlert('¿Deseas eliminar el archivo?', () => this.deleteAdjuntoAxios(element.id))
    }

    async getDocumentosAxios(){
        $('#kt_datatable_documentos').DataTable().ajax.reload();
    }

    async deleteDocumentoAxios(){
        const { access_token } = this.props.authUser
        const { documento } = this.state
        await axios.delete(URL_DEV + 'documentos/' + documento.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getDocumentosAxios()
                this.setState({
                    ... this.state,
                    modalDelete: '',
                    documento: ''
                })
                doneAlert('Documento eliminado con éxito')
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async sendAdjuntoAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, documento } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'documentos/' + documento.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { documento } = response.data
                const { form } = this.state
                let aux = []
                documento.adjuntos.map((adj)=>{
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                })
                form.adjuntos.adjuntos.files = aux
                this.setState({
                    ... this.state,
                    form
                })
                doneAlert('Adjunto creado con éxito')
                this.getDocumentosAxios()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAdjuntoAxios(id){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, state, documento } = this.state
        await axios.delete(URL_DEV + 'documentos/' + documento.id + '/adjuntos/' +id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { documento } = response.data
                this.setAdjuntos(documento.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
                this.getDocumentosAxios()
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { modalDelete, modalAdjuntos, form } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <NewTableServerRender
                    columns = { DOCUMENTOS_COLUMNS }
                    title = 'Documentos'
                    subtitle = 'Listado de documentos'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/administracion/documentos/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.openModalAdjuntos }
                        }
                    }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setDocumentos }
                    urlRender = { URL_DEV + 'documentos' }
                    idTable = 'kt_datatable_documentos'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'/>
                <ModalDelete title = '¿Estás seguro que deseas eliminar el documento?'
                    show = { modalDelete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteDocumentoAxios() } } />
                <Modal size="lg" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' handleChange = { this.handleChange } 
                        deleteFile = { this.deleteFile }/>
                    {
                        form.adjuntos.adjuntos.value ?
                            <div className="d-flex justify-content-center mt-2 mb-4">
                                <Button icon='' text='ENVIAR'
                                    onClick = { (e) => { e.preventDefault(); this.sendAdjuntoAxios()}  } />
                            </div>
                        : ''
                    }
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Documentos)