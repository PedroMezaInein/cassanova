import React, { Component } from 'react';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal, ItemSlider } from '../../../components/singles';
import NewTableServerRender from '../../../components/tables/NewTableServerRender';
import { PRESTAMOS_COLUMNS, URL_DEV } from '../../../constants'
import { setDateTable, setMoneyTable, setMoneyTableSinSmall, setTextTable } from '../../../functions/setters';
import axios from 'axios'
import { deleteAlert, doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert';
import { Button } from '../../../components/form-components'
import { Tab, Tabs } from 'react-bootstrap';
import Pagination from "react-js-pagination";
import { AbonoPrestamosForm } from '../../../components/forms';
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { PrestamosCard } from '../../../components/cards'

const $ = require('jquery');

class Prestamos extends Component {

    state = {
        modalDelete: false,
        modalAdjuntos: false,
        modalAbonos: false,
        modalSee: false,
        form:{
            adjuntos:{
                adjuntos:{
                    files: [],
                    value: ''
                }
            },
            abono: 0.0,
            fecha: new Date()
        },
        activePage: 1,
        itemsPerPage: 10
    }

    setPrestamos = prestamos => {
        let aux = []
        prestamos.map( (prestamo) => {
            aux.push({
                actions: this.setActions(prestamo),
                empleado: renderToString(setTextTable(prestamo.empleado ? prestamo.empleado.nombre : 'Sin definir')),
                fecha: renderToString(setDateTable(prestamo.fecha)),
                monto: renderToString(setMoneyTable(prestamo.monto)),
                descripcion: renderToString(setTextTable(prestamo.descripcion)),
                acumulado: renderToString(setMoneyTable(prestamo.acumulado)),
                restante: renderToString(setMoneyTable(prestamo.restante)),
                id: prestamo.id
            })
        })
        return aux
    }

    setActions = () => {
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
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Abonos',
                btnclass: 'primary',
                iconclass: 'flaticon-coins',
                action: 'abono'
            },
            {
                text: 'Ver',
                btnclass: 'dark',
                iconclass: 'flaticon2-expand',                  
                action: 'see',
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            }

        )
        return aux
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ... this.state,
            activePage
        })
    }

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        this.addAbonoAxios()
    }

    changePageEdit = prestamo => {
        const { history } = this.props
        history.push({
            pathname: '/rh/prestamos/edit',
            state: { prestamo: prestamo}
        });
    }

    openModalDelete = prestamo => {
        this.setState({
            ... this.state,
            modalDelete: true,
            prestamo: prestamo
        })
    }

    handleCloseDelete = () => {
        this.setState({
            ... this.state,
            modalDelete: false,
            prestamo: ''
        })
    }

    openModalAdjuntos = prestamo => {
        const { form } = this.state
        let aux = []
        prestamo.adjuntos.map((adj)=>{
            aux.push(adj)
        })
        form.adjuntos.adjuntos.files = aux
        this.setState({
            ... this.state,
            modalAdjuntos: true,
            form,
            prestamo: prestamo
        })
    }

    handleCloseAdjuntos = () => {
        const { form } = this.state
        form.adjuntos.adjuntos.files = []
        this.setState({
            ... this.state,
            modalAdjuntos: false,
            form,
            prestamo: ''
        })
    }

    openModalAbonos = prestamo => {
        this.setState({
            ... this.state,
            modalAbonos: true,
            prestamo: prestamo
        })
    }

    handleCloseAbonos = () => {
        const { form } = this.state
        form.fecha = new Date()
        form.abono = 0.0
        this.setState({
            ... this.state,
            modalAbonos: false,
            prestamo: '',
            form,
            active: 'listado'
        })
    }
    openModalSee = prestamo => {
        this.setState({
            ... this.state,
            modalSee: true,
            prestamo: prestamo
        })
    }

    handleCloseSee = () => {
        this.setState({
            ... this.state,
            modalSee: false,
            prestamo: ''
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

    deleteAbono = element => {
        deleteAlert('¿Deseas eliminar el abono?', () => this.deleteAbonoAxios(element))
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

    onSelect = value => {
        const { form } = this.state
        if(value === 'nuevo'){

        }
        this.setState({
            ... this.state,
            active: value,
            form
        })
    }

    async getPrestamosAxios(){
        $('#kt_datatable_prestamos').DataTable().ajax.reload();
    }

    async deletePrestamoAxios(){
        const { access_token } = this.props.authUser
        const { prestamo } = this.state
        await axios.delete(URL_DEV + 'prestamos/' + prestamo.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getPrestamosAxios()
                this.setState({
                    ... this.state,
                    modalDelete: '',
                    prestamo: ''
                })
                doneAlert('Préstamo eliminado con éxito')
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
        const { form, prestamo } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'prestamos/' + prestamo.id + '/adjuntos', data, { headers: { 'Content-Type': 'multipart/form-data;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { prestamo } = response.data
                const { form } = this.state
                let aux = []
                prestamo.adjuntos.map((adj)=>{
                    aux.push({
                        name: adj.name,
                        url: adj.url,
                        id: adj.id
                    })
                })
                form.adjuntos.adjuntos.files = aux
                form.adjuntos.adjuntos.value = ''
                this.setState({
                    ... this.state,
                    form
                })
                doneAlert('Adjunto creado con éxito')
                this.getPrestamosAxios()
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

    async addAbonoAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, prestamo } = this.state
        await axios.post(URL_DEV + 'prestamos/' + prestamo.id + '/abonos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                
                const { prestamo } = response.data
                form.abono = 0;
                form.fecha = new Date()
                this.setState({
                    ... this.state,
                    active: 'listado',
                    form,
                    prestamo: prestamo
                })
                doneAlert('Abono relacionado con éxito')
                this.getPrestamosAxios()
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
        const { form, prestamo } = this.state
        await axios.delete(URL_DEV + 'prestamos/' + prestamo.id + '/adjuntos/' +id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prestamo } = response.data
                this.setAdjuntos(prestamo.adjuntos)
                doneAlert('Adjunto eliminado con éxito')
                this.getPrestamosAxios()
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

    async deleteAbonoAxios(abono){
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, prestamo } = this.state
        await axios.delete(URL_DEV + 'prestamos/' + prestamo.id + '/abonos/' +abono.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { prestamo } = response.data
                this.setState({
                    ... this.state,
                    prestamo: prestamo
                })
                doneAlert('Abono eliminado con éxito')
                this.getPrestamosAxios()
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
        const { modalDelete, form, modalAdjuntos, modalAbonos, active, prestamo, activePage, itemsPerPage, modalSee } = this.state
        return (
            <Layout active = 'rh' { ... this.props }>
                <NewTableServerRender
                    columns = { PRESTAMOS_COLUMNS }
                    title = 'PRÉSTAMOS'
                    subtitle = 'Listado de préstamos'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/rh/prestamos/add'
                    mostrar_acciones = { true }
                    actions = {
                        {
                            'edit': { function: this.changePageEdit },
                            'delete': { function: this.openModalDelete },
                            'adjuntos': { function: this.openModalAdjuntos },
                            'abono': { function: this.openModalAbonos },
                            'see': { function: this.openModalSee },
                        }
                    }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setPrestamos }
                    urlRender = { URL_DEV + 'prestamos' }
                    idTable = 'kt_datatable_prestamos'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'/>
                <ModalDelete title = '¿Estás seguro que deseas eliminar el préstamo?'
                    show = { modalDelete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deletePrestamoAxios() } } />
                <Modal size="lg" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <ItemSlider items = { form.adjuntos.adjuntos.files } item = 'adjuntos' handleChange = { this.handleChange } 
                        deleteFile = { this.deleteFile }/>
                    {
                        form.adjuntos.adjuntos.value !== '' ?
                            <div className="d-flex justify-content-center mt-2 mb-4">
                                <Button icon='' text='ENVIAR'
                                    onClick = { (e) => { e.preventDefault(); this.sendAdjuntoAxios()}  } />
                            </div>
                        : ''
                    }
                </Modal>
                <Modal size = 'lg' title = 'Abonos del préstamo' show = { modalAbonos } handleClose = { this.handleCloseAbonos }>
                    {
                        prestamo ? 
                            <div className="row mx-0">
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-start p-3">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                {
                                                    setMoneyTableSinSmall(prestamo.monto)
                                                }
                                            </div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Monto</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-start p-3">
                                        <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                {
                                                    setMoneyTableSinSmall(prestamo.acumulado)
                                                }
                                            </div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Acumulado</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex justify-content-start p-3">
                                        <div className="symbol symbol-35 symbol-light-danger mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-danger">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                {
                                                    setMoneyTableSinSmall(prestamo.restante)
                                                }
                                            </div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Restante</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        :''
                    }
                    
                    <Tabs defaultActiveKey = "listado" className="mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100"
                        activeKey = { active } onSelect = { this.onSelect }>
                        <Tab eventKey="listado" title="Listado de abonos">
                            <div className="table-responsive d-flex justify-content-center">
                                <table className="table table-head-custom table-borderless table-vertical-center w-100 my-3">
                                    <thead className="bg-primary-o-20">
                                        <tr>
                                            <th className="text-center">
                                                <span className="text-dark-75 font-size-lg"></span>
                                            </th>
                                            <th className="text-center">
                                                <span className="text-dark-75 font-size-lg">Fecha</span>
                                            </th>
                                            <th className="text-right">
                                                <span className="text-dark-75 font-size-lg">Total</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            prestamo ?
                                                prestamo.abonos.length === 0 ?
                                                    <tr className = "border-bottom" >
                                                        <td colSpan="3" className="text-center">
                                                            <span className="text-center text-dark-75 d-block font-size-lg"> 
                                                                Aún no hay pagos registrados.
                                                            </span>
                                                        </td>
                                                    </tr>
                                                :''
                                            :''
                                        }
                                        {
                                            prestamo ? 
                                                prestamo.abonos.map( (abono, key) => {
                                                    let limiteInferior = (activePage - 1) * itemsPerPage
                                                    let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                    if(prestamo.abonos.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                        return(
                                                            <tr key = { key } className = "border-bottom" >
                                                                <td className="text-center">
                                                                    <button class="btn btn-actions-table btn-xs btn-icon btn-text-danger btn-hover-danger" title="Eliminar"
                                                                        onClick = { (e) => { e.preventDefault(); this.deleteAbono(abono)} }>
                                                                        <i class="flaticon2-rubbish-bin"></i>
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <span className="text-center text-dark-75 d-block font-size-lg"> 
                                                                        {
                                                                            setDateTable(abono.fecha)
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <span className="text-center text-dark-75 d-block font-size-lg">{setMoneyTable(abono.abono)}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                })
                                            : ''
                                        }
                                    </tbody>
                                </table>
                            </div>
                            {
                                prestamo ?
                                    prestamo.abonos ?
                                        prestamo.abonos.length > itemsPerPage ?
                                            <div className="d-flex justify-content-center my-2">
                                                <Pagination
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    firstPageText = 'Primero'
                                                    lastPageText = 'Último'
                                                    activePage = { activePage }
                                                    itemsCountPerPage = { itemsPerPage }
                                                    totalItemsCount = { prestamo.abonos.length }
                                                    pageRangeDisplayed = { 5 }
                                                    onChange={this.onChangePage.bind(this)}
                                                    itemClassLast="d-none"
                                                    itemClassFirst="d-none"
                                                    nextPageText= { '>' }
                                                    prevPageText= { '<' }
                                                />
                                            </div>
                                        : ''
                                    : ''
                                : ''
                            }
                        </Tab>
                        <Tab eventKey="nuevo" title="Nuevo abono">
                            <AbonoPrestamosForm
                                form = { form }
                                onChange = { this.onChange }
                                onSubmit = { this.onSubmit }
                                formeditado = { 0 }
                                />
                        </Tab>
                    </Tabs>  
                </Modal>
                <Modal size="lg" title="Prestamo" show = { modalSee } handleClose = { this.handleCloseSee } >
                    <PrestamosCard prestamo={prestamo}/>
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Prestamos)