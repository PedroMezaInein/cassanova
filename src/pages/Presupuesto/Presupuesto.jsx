import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, PRESUPUESTO_COLUMNS, ADJUNTOS_PRESUPUESTOS_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setDateTable, setAdjuntosList } from '../../functions/setters'
import Layout from '../../components/layout/layout'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import { renderToString } from 'react-dom/server'
import { ModalDelete, Modal } from '../../components/singles'
import TableForModals from '../../components/tables/TableForModals'
const $ = require('jquery');
class Presupuesto extends Component {
    state = {
        formeditado: 0,
        modal: {
            form: false,
            delete: false,
            adjuntos: false,
        },
        presupuesto: '',
        title: 'Nuevo presupuesto',
        form: {
            proyecto: '',
            area: '',
            empresa: '',
            fecha: new Date(),
            tiempo_ejecucion: '',
            partida: '',
            subpartida: '',
        },
        options: {
            proyectos: [],
            empresas: [],
            areas: [],
            partidas: [],
            subpartidas: []
        },
        data: {
            adjuntos: []
        },
        adjuntos: []
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!presupuesto)
            history.push('/')
        this.getOptionsAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, proyectos, areas, partidas } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options
                })
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
    async deletePresupuestoAxios() {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        await axios.delete(URL_DEV + 'presupuestos/' + presupuesto.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.delete = false
                this.getPresupuestoAxios()
                this.setState({
                    ... this.state,
                    modal,
                    presupuesto: '',

                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.')
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
    openModalDelete = presupuesto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            presupuesto: presupuesto
        })
    }
    downloadPDF = presupuesto => {
        const { modal, data } = this.state
        data.adjuntos = presupuesto.pdfs
        modal.adjuntos = true
        this.setState({
            ... this.state,
            presupuesto: presupuesto,
            modal,
            adjuntos: this.setAdjuntosTable(presupuesto.pdfs),
            data
        })
    }
    handleClose = () => {
        const { modal, data } = this.state
        data.adjuntos = []
        modal.adjuntos = false
        this.setState({
            ... this.state,
            presupuesto: '',
            modal,
            adjuntos: [],
            data
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            modal,
            presupuesto: ''
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTable(adjunto.pivot.identificador)),
                id: adjunto.id
            })
        })
        return aux
    }
    async getPresupuestoAxios() {
        var table = $('#kt_datatable2_presupuesto').DataTable().ajax.reload();
    }
    setPresupuestos = presupuestos => {
        let aux = []
        if (presupuestos)
            presupuestos.map((presupuesto) => {
                aux.push(
                    {
                        actions: this.setActions(presupuesto),
                        proyecto: renderToString(setTextTable(presupuesto.proyecto ? presupuesto.proyecto.nombre : '')),
                        empresa: renderToString(setTextTable(presupuesto.empresa ? presupuesto.empresa.name : '')),
                        area: renderToString(setTextTable(presupuesto.area ? presupuesto.area.nombre : '')),
                        fecha: renderToString(setDateTable(presupuesto.fecha)),
                        tiempo_ejecucion: renderToString(setTextTable(presupuesto.tiempo_ejecucion)),
                        id: presupuesto.id,
                        objeto: presupuesto
                    }
                )
            })
        return aux
    }
    setActions = presupuesto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;presupuesto',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'finish',
                tooltip: { id: 'finish', text: 'Ver presupuesto', type: 'error' },
            }
        )
        if (presupuesto.pdfs) {
            aux.push(
                {
                    text: 'Descargar&nbsp;presupuesto',
                    btnclass: 'info',
                    iconclass: 'flaticon2-download-1',
                    action: 'download',
                    tooltip: { id: 'download', text: 'Decargar presupuesto' },
                }
            )
        }
        return aux
    }
    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/add'
        });
    }
    openModalEdit = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/update',
            state: { presupuesto: presupuesto }
        });
    }
    openUltimo = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/finish',
            state: { presupuesto: presupuesto }
        });
    }
    render() {

        const { modal, data, adjuntos } = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <NewTableServerRender
                    columns={PRESUPUESTO_COLUMNS}
                    title='Presupuesto'
                    subtitle='Listado de presupuestos'
                    url='/presupuesto/presupuesto/add'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'finish': { function: this.openUltimo },
                        'delete': { function: this.openModalDelete },
                        'download': { function: this.downloadPDF }
                    }}
                    idTable='kt_datatable2_presupuesto'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setPresupuestos}
                    urlRender={URL_DEV + 'presupuestos'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete
                    title={"¿Estás seguro que deseas eliminar el presupuesto?"}
                    show={modal.delete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePresupuestoAxios() }}
                />
                <Modal show={modal.adjuntos} handleClose={this.handleClose} title="Listado de presupuestos" >
                    <TableForModals
                        columns={ADJUNTOS_PRESUPUESTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={false}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Presupuesto);