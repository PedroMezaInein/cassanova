import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { AreasForm } from '../../components/forms'
import { URL_DEV, AREAS_COLUMNS } from '../../constants'
import { Modal, ModalDelete } from '../../components/singles'
import axios from 'axios'
import { AreaCard } from '../../components/cards'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import { setTextTable, setListTable} from '../../functions/setters'
import { Tabs, Tab } from 'react-bootstrap'

const $ = require('jquery');

class Areas extends Component {

    state = {
        form: {
            nombre: '',
            subarea: '',
            subareas: []
        },
        formeditado:0,
        modal: false,
        modalDelete: false,
        modalSee: false,
        title: 'Nueva área',
        area: '',
        tipo: 'compras',
        key: 'compras'
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
    }

    addSubarea = () => {
        const { form } = this.state
        if (form['subarea'] !== '') {
            let aux = false;
            aux = form.subareas.find(function (element, index) {
                if (element === form.subarea)
                    return true
            });
            if (aux !== true) {
                form.subareas.push(form.subarea)
                form.subarea = ''
                this.setState({
                    ...this.state,
                    form
                })
            }
        }
    }

    deleteSubarea = value => {
        const { form } = this.state
        let aux = []
        form.subareas.find(function (element, index) {
            if (element.toString() !== value.toString())
                aux.push(element)
        });
        form.subareas = aux
        this.setState({
            ...this.state,
            form
        })
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

    setAreas = areas => {
        let aux = []
        areas.map((area) => {
            aux.push({
                actions: this.setActions(area),
                area: renderToString(setTextTable(area.nombre)),
                subareas: renderToString(setListTable(area.subareas, 'nombre')),
                id: area.id
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
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',                  
                action: 'see',
                tooltip: {id:'see', text:'Mostrar', type:'info'},
            },
        )
        return aux
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'subareas':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            title: 'Nueva área',
            form: this.clearForm(),
            area: ''
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            area: ''
        })
    }

    openModal = () => {
        let { tipo } = this.state
        tipo = 'compras'
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm(),
            tipo,
            formeditado:0
        })
    }

    openModalVentas = () => {
        let { tipo } = this.state
        tipo = 'ventas'
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm(),
            tipo,
            formeditado:0
        })
    }

    openModalEgresos = () => {
        let { tipo } = this.state
        tipo = 'egresos'
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm(),
            tipo,
            formeditado:0
        })
    }

    openModalDelete = area => {
        this.setState({
            modalDelete: true,
            area: area
        })
    }

    openModalEdit = area => {
        const { form } = this.state
        let { tipo } = this.state
        tipo = 'compras'
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form,
            tipo,
            formeditado:1
        })
    }

    openModalEditVentas = area => {
        const { form } = this.state
        let { tipo } = this.state
        tipo = 'ventas'
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form,
            tipo,
            formeditado:1
        })
    }

    openModalEditEgresos = area => {
        const { form } = this.state
        let { tipo } = this.state
        tipo = 'egresos'
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form,
            tipo,
            formeditado:1
        })
    }

    openModalSee = area => {
        this.setState({
            ...this.state,
            modalSee: true,
            area: area
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            area: ''
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { form, title } = this.state
        if (title === 'Nueva área')
            this.addAreaAxios()
        if (title === 'Editar área')
            this.updateAreaAxios()
    }

    safeDelete = e => () => {
        this.deleteAreaAxios()
    }

    async addAreaAxios() {
        const { access_token } = this.props.authUser
        const { form, tipo } = this.state
        form.tipo = tipo
        this.setState({
            ...this.state,
            form
        })
        await axios.post(URL_DEV + 'areas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                this.controlledTab(key)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.')
                
                this.setState({
                    ...this.state,
                    modal: false,
                    form: this.clearForm(),
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateAreaAxios() {
        const { access_token } = this.props.authUser
        const { form, area } = this.state
        await axios.put(URL_DEV + 'areas/' + area.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { key } = this.state
                this.controlledTab(key)

                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.')
                
                this.setState({
                    ...this.state,
                    modal: false,
                    form: this.clearForm(),
                    area: ''
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAreaAxios() {
        const { access_token } = this.props.authUser
        const { area } = this.state
        await axios.delete(URL_DEV + 'areas/' + area.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { key } = this.state
                this.controlledTab(key)
                
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.')
                
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    form: this.clearForm(),
                    area: '',
                })

            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getComprasAxios() {
        $('#kt_datatable_compras').DataTable().ajax.reload();
    }

    async getVentasAxios() {
        $('#kt_datatable_ventas').DataTable().ajax.reload();
    }

    async getEgresosAxios() {
        $('#kt_datatable_egresos').DataTable().ajax.reload();
    }

    controlledTab = value => {
        switch(value){
            case 'compras':
                this.getComprasAxios();
                break;
            case 'ventas':
                this.getVentasAxios();
                break;
            case 'egresos':
                this.getEgresosAxios();
                break;
        }
        this.setState({
            ...this.state,
            key: value
        })
    }

    render() {
        const { form, modal, modalDelete, title, data, formeditado, key, modalSee, area} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Tabs id="tabsAreas" defaultActiveKey="compras" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="compras" title="Compras" >
                        {
                            key === 'compras' ?
                                <NewTableServerRender
                                    columns = { AREAS_COLUMNS }
                                    title = 'Áreas' 
                                    subtitle = 'Listado de áreas'
                                    mostrar_boton = { true }
                                    abrir_modal = { true }
                                    mostrar_acciones = { true }
                                    onClick = { this.openModal }
                                    actions = {
                                        {
                                            'edit': { function: this.openModalEdit },
                                            'delete': { function: this.openModalDelete },
                                            'see': { function: this.openModalSee },
                                        }
                                    }
                                    accessToken = { this.props.authUser.access_token }
                                    setter =  {this.setAreas }
                                    urlRender = { URL_DEV + 'areas/compras'}
                                    idTable = 'kt_datatable_compras'
                                    cardTable = 'cardTable_compras'
                                    cardTableHeader = 'cardTableHeader_compras'
                                    cardBody = 'cardBody_compras'
                                    isTab = {true}
                                    />
                            : ''
                        }
                    </Tab>
                    <Tab eventKey="ventas" title="Ventas e ingresos">
                        {
                            key === 'ventas' ?
                                <NewTableServerRender
                                    columns = { AREAS_COLUMNS }
                                    title = 'Áreas' 
                                    subtitle = 'Listado de áreas'
                                    mostrar_boton = { true }
                                    abrir_modal = { true }
                                    mostrar_acciones = { true }
                                    onClick = { this.openModalVentas }
                                    actions = {
                                        {
                                            'edit': { function: this.openModalEditVentas },
                                            'delete': { function: this.openModalDelete },
                                            'see': { function: this.openModalSee },
                                        }
                                    }
                                    accessToken = { this.props.authUser.access_token }
                                    setter =  {this.setAreas }
                                    urlRender = { URL_DEV + 'areas/ventas'}
                                    idTable='kt_datatable_ventas'
                                    cardTable='cardTable_ventas'
                                    cardTableHeader='cardTableHeader_ventas'
                                    cardBody='cardBody_ventas'
                                    isTab = {true}
                                    />
                            : ''
                        }
                    </Tab>
                    <Tab eventKey="egresos" title="Egresos">
                        {
                            key === 'egresos' ?
                                <NewTableServerRender
                                    columns = { AREAS_COLUMNS }
                                    title = 'Áreas' 
                                    subtitle = 'Listado de áreas'
                                    mostrar_boton = { true }
                                    abrir_modal = { true }
                                    mostrar_acciones = { true }
                                    onClick = { this.openModalEgresos }
                                    actions = {
                                        {
                                            'edit': { function: this.openModalEditEgresos },
                                            'delete': { function: this.openModalDelete },
                                            'see': { function: this.openModalSee },
                                        }
                                    }
                                    accessToken = { this.props.authUser.access_token }
                                    setter =  {this.setAreas }
                                    urlRender = { URL_DEV + 'areas/egresos'}
                                    idTable='kt_datatable_egresos'
                                    cardTable='cardTable_egresos'
                                    cardTableHeader='cardTableHeader_egresos'
                                    cardBody='cardBody_egresos'
                                    isTab = {true}
                                    />
                            : ''
                        }
                        
                    </Tab>
                </Tabs>

                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose}>
                    <AreasForm 
                        form={form} 
                        onChange={this.onChange}
                        addSubarea={this.addSubarea} 
                        deleteSubarea={this.deleteSubarea}
                        title={title} 
                        onSubmit={this.onSubmit} 
                        formeditado={formeditado}
                    />
                </Modal>
                
                <ModalDelete title={"¿Estás seguro que deseas eliminar el área?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); waitAlert(); this.safeDelete(e)() }}>
                </ModalDelete>

                <Modal title={key === 'egresos' ?'Egreso' : key === 'compras' ? 'Compra' : key === 'ventas' ? 'Venta/Ingreso' :''} show = { modalSee } handleClose = { this.handleCloseSee } >
                    <AreaCard area={area}/>
                </Modal>
            </Layout>
        )
    }
}


const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Areas);