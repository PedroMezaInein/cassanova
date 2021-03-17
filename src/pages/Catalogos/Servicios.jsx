import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { SERVICIOS_COLUMNS, URL_DEV } from '../../constants'
import { setOptions, setTextTable } from '../../functions/setters'
import { ServicioForm } from '../../components/forms'
import axios from 'axios'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
const $ = require('jquery');

class Servicios extends Component{

    state = {
        servicio: '',
        modal: false,
        modalDelete: false,
        form: {
            servicio: '',
            empresa: ''
        },
        options: {
            empresas: []
        },
        title: '',
        formeditado: 0
    }

    componentDidMount = () => {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!modulo)
            history.push('/')
        this.getOptions();
    }

    async updateTable() { $('#kt_datatable_servicios').DataTable().ajax.reload(); }

    getOptions = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/catalogos/servicios/options`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                const { empresas } = response.data
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({ ...this.state, options })
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addServicioAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(`${URL_DEV}v2/catalogos/servicios`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({ ...this.state, form: this.clearForm(), modal: false })
                doneAlert('Servicios generados con éxito.')
                this.updateTable()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateServicioAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, servicio } = this.state
        await axios.put(`${URL_DEV}v2/catalogos/servicios/${servicio.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({ ...this.state, form: this.clearForm(), modal: false, servicio: '' })
                doneAlert('Servicios actualizado con éxito.')
                this.updateTable()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteServicioAxios = async() => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { servicio } = this.state
        await axios.delete(`${URL_DEV}v2/catalogos/servicios/${servicio.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({ ...this.state, modalDelete: false, servicio: '' })
                doneAlert('Servicios eliminado con éxito.')
                this.updateTable()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Nuevo servicio')
            this.addServicioAxios()
        if (title === 'Editar servicio')
            this.updateServicioAxios()
    }

    openModal = () => { this.setState({ ...this.state, modal: true, form: this.clearForm(), title: 'Nuevo servicio', formeditado: 0 }) }
    openModalEdit = servicio => {
        const { form } = this.state
        if(servicio.empresa)
            form.empresa = servicio.empresa.id.toString()
        form.servicio = servicio.servicio
        this.setState({ ...this.state, modal: true, form, servicio: servicio, title: 'Editar servicio', formeditado: 1 })
    }
    openModalDelete = servicio => { this.setState({ modalDelete: true, servicio: servicio }) }

    handleClose = () => {
        const { form } = this.state
        form.empresa = ''
        form.servicio = ''
        this.setState({ ...this.state, modal: false, form, servicio: '' })
    }
    handleCloseDelete = () => { this.setState({ ...this.state, modalDelete: false, servicio: '' }) }

    setServicio = servicios => {
        let aux = []
        servicios.map((servicio) => {
            aux.push({
                actions: this.setActions(servicio),
                servicio: renderToString(setTextTable(servicio.servicio)),
                empresa: renderToString(setTextTable(servicio.empresa ? servicio.empresa.name : '')),
                id: servicio.id
            })
            return false
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
        )
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        form.empresa = ''
        form.servicio = ''
        return form
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state,form})
    }
    render(){
        const { modal, modalDelete, title, form, options, formeditado } = this.state
        return(
            <Layout active = 'catalogos' {...this.props} >
                <NewTableServerRender
                    columns = { SERVICIOS_COLUMNS }
                    title = 'Servicios solicitados'
                    subtitle = 'Listado de servicios solicitados'
                    mostrar_boton = { true }
                    abrir_modal = { true }
                    mostrar_acciones = { true }
                    onClick = { this.openModal } 
                    actions = { { 'edit': { function: this.openModalEdit }, 'delete': { function: this.openModalDelete } } }
                    idTable = 'kt_datatable_servicios'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setServicio }
                    urlRender = { `${URL_DEV}v2/catalogos/servicios` }
                />
                <Modal show = { modal } size = 'lg' title = { title } handleClose = { this.handleClose }>
                    <ServicioForm form = { form } title = { title } options = { options } onChange = { this.onChange } formeditado = { formeditado } 
                        onSubmit = { this.onSubmit } />
                </Modal>

                <ModalDelete title = '¿Deseas eliminar el servicio?' show = { modalDelete } handleClose = { this.handleCloseDelete }
                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.deleteServicioAxios() }} />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Servicios)