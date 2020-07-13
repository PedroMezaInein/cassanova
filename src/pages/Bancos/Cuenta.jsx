import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { faPlus, faTrash, faEdit, faFile, faBox, faFolderPlus, faPaperclip, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Button, Input } from '../../components/form-components'
import { Modal } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CUENTAS_COLUMNS, EDOS_CUENTAS_COLUMNS, DARK_BLUE } from '../../constants'
import { CuentaForm } from '../../components/forms'
import Moment from 'react-moment'
import { Small, Subtitle, B } from '../../components/texts'
import DataTable from '../../components/tables/Data'
import NumberFormat from 'react-number-format';
import { Form, Badge, Tabs, Tab } from 'react-bootstrap'
import Calendar from '../../components/form-components/Calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NewTable from '../../components/tables/NewTable'
import TableForModals from '../../components/tables/TableForModals'

import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { data } from 'jquery'
class Cuentas extends Component {

    state = {
        modal: false,
        modalDelete: false,
        modalEstado: false,
        bancos: [],
        tipos: [],
        estatus: [],
        estados: [],
        empresas: [],
        empresasOptions: [],
        tipo: 'Bancaria',
        form: {
            nombre: '',
            numero: '',
            descripcion: '',
            balance: 0.0,
            banco: '',
            tipo: '',
            estatus: '',
            empresa: 0,
            empresas: []
        },
        data: {
            cuentas: []
        },
        formeditado:0,
        cuentas: [],
        cajas: [],
        cuenta: null,
        adjunto: '',
        adjuntoFile: '',
        adjuntoName: '',
        fecha: new Date()
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const leads = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!leads)
            history.push('/')
        this.getCuentas()
    }

    //
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    onChangeEmpresa = e => {
        const { name, value } = e.target
        const { empresas, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        empresas.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
        })

        form['empresas'] = auxEmpresa
        this.setState({
            ... this.state,
            form,
            empresas: aux
        })
    }

    updateEmpresa = empresa => {
        const { form, empresas } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                empresas.push(element)
            }
        })
        form.empresas = aux
        this.setState({
            ... this.state,
            empresas,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        this.addCuentaAxios()
    }

    onSubmitEstado = e => {
        e.preventDefault()
        const { adjunto, adjuntoFile, adjuntoName } = this.state
        if (adjunto) {
            swal({
                title: '¡Un momento!',
                text: 'Se está enviando tu estado de cuenta.',
                buttons: false
            })
            this.addEstadoAxios()
        }

    }

    onEditSubmit = e => {
        e.preventDefault()
        this.editCuentaAxios()
    }

    safeDelete = e => () => {
        this.deleteCuentaAxios()
    }

    onChangeAdjunto = (e) => {
        this.setState({
            ... this.state,
            adjuntoFile: e.target.files[0],
            adjunto: e.target.value,
            adjuntoName: e.target.files[0].name
        })
    }

    onChangeCalendar = date => {
        this.setState({
            ... this.state,
            fecha: date
        })
    }

    deleteAdjunto = () => {
        this.setState({
            ... this.state,
            adjuntoFile: '',
            adjunto: '',
            adjuntoName: ''
        })
    }

    // Setters

    setEmptyForm = () => {
        return {
            nombre: '',
            numero: '',
            descripcion: '',
            empresa: '',
            balance: 0.0,
            banco: 0,
            tipo: 0,
            estatus: 0,
            empresa: 0,
            empresas: []
        }
    }

    setCuentas = cuentas => {

        let aux = []
        cuentas.map((cuenta, key) => {
            aux.push({

                actions: this.setActions(cuenta),

                nombre: renderToString(setTextTable(cuenta.nombre)),
                numero: renderToString(setTextTable(cuenta.numero)),

                balance: renderToString(setMoneyTable(cuenta.balance)),

                descripcion: renderToString(setTextTable(cuenta.descripcion)),

                banco: renderToString(setTextTable(cuenta.banco ? cuenta.banco.nombre : '')),
                tipo: renderToString(setTextTable(cuenta.tipo ? cuenta.tipo.tipo : '')),
                estatus: renderToString(setTextTable(cuenta.estatus ? cuenta.estatus.estatus : '')),
                empresa: renderToString(setListTable(cuenta.empresa, 'name')),

                fecha: renderToString(setDateTable(cuenta.created_at)),
                id: cuenta.id
            })
        })
        return aux
    }

    setEstados = estados => {

        let aux = []
        estados.map((estado, key) => {
            aux.push({
                actions: this.setActionsEstado(estado),
                estado: renderToString(setArrayTable([{ url: estado.url, text: estado.name }])),
                fecha: renderToString(setDateTable(estado.created_at)),
                id:estado.id
            })
        })
        this.setState({
            ... this.state,
            estados: aux
        })
    }

    setEmpresasTable = arreglo => {
        let aux = []
        arreglo.map((element) => {
            aux.push({ text: element.name })
        })
        setArrayTable(aux)
    }

    setDateTable = date => {
        return (
            <Small>
                <Moment format="DD/MM/YYYY">
                    {date}
                </Moment>
            </Small>
        )
    }

    setActionsEstado = estado => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAction',
                tooltip: { id: 'deleteEstado', text: 'Eliminar', type: 'error' }
            }            
        )        
        return aux
    }

    openModalDeleteEstado = (estado) => {
        swal({
            title: '¿Estás seguro?',
            icon: 'warning',
            buttons: {
                cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "button__green btn-primary cancel",
                    closeModal: true,
                },
                confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "button__red btn-primary",
                    closeModal: true
                }
            }
        }).then((result) => {
            if (result) {
                this.deleteEstadoAxios(estado.id)                
            }            
        })
    } 

    /*setActionsEstado = (estado) => {
        return (
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" text='' icon={faTrash} color="red"
                        onClick={() => {
                            swal({
                                title: '¿Estás seguro?',
                                icon: 'warning',
                                buttons: {
                                    cancel: {
                                        text: "Cancelar",
                                        value: null,
                                        visible: true,
                                        className: "button__green btn-primary cancel",
                                        closeModal: true,
                                    },
                                    confirm: {
                                        text: "Aceptar",
                                        value: true,
                                        visible: true,
                                        className: "button__red btn-primary",
                                        closeModal: true
                                    }
                                }
                            }).then((result) => {
                                if (result) {
                                    this.deleteEstadoAxios(estado.id)
                                }
                            })
                        }} />
                </div>
            </>
        )
    }
*/

    setText = text => {
        return (
            <Small className="">
                {text}
            </Small>
        )
    }

    setMoney = value => {
        return (
            <NumberFormat value={value} displayType={'text'} thousandSeparator={true} prefix={'$'}
                renderText={value => <Small> {value} </Small>} />
        )
    }

    setLinks = value => {
        return (
            <a href={value.url} target="_blank">
                <Small>
                    {
                        value.name
                    }
                </Small>
            </a>
        )
    }

    setActions = cuenta => {
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
                text: 'Agregar&nbsp;estado&nbsp;de&nbsp;cuenta',
                btnclass: 'primary',
                iconclass: 'flaticon2-infographic',
                action: 'estado',
                tooltip: { id: 'estado', text: 'Agregar estados de cuenta', type: 'error' }
            }
        )
        return aux
    }

    /*setActions = cuenta => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(cuenta)}  text='' icon={faEdit} 
                        color="transparent" tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(cuenta) } text='' icon={faTrash} color="red" 
                        tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                </div>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalAddEstado(e)(cuenta)}  text='' icon={faFolderPlus} 
                        color="transparent" tooltip={{id:'estado', text:'Agregar estados de cuenta'}} />
                </div>
            </>
        )
    }*/

    setOptions = (array, name) => {
        const { form } = this.state
        let aux = []
        array.map((element, key) => {
            if (key === 0) {
                switch (name) {
                    case 'nombre':
                        form['banco'] = element.id
                        break;
                    default:
                        form[name] = element.id
                        break;
                }
                this.setState({
                    ... this.state,
                    form
                })
            }
            aux.push({
                value: element.id,
                text: element[name]
            })
        })
        return aux
    }

    // Modal

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            cuenta: null,
            form: this.setEmptyForm()
        })
    }

    handleDeleteModal = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            cuenta: null
        })
    }

    handleEstadoClose = () => {
        const { modalEstado } = this.state
        this.setState({
            modalEstado: !modalEstado,
            cuenta: null,
            estados: [],
            fecha: new Date(),
            adjunto: '',
            adjuntoFile: '',
            adjuntoName: ''
        })
    }

    openModal = () => {
        const { empresasOptions } = this.state
        let aux = []
        empresasOptions.map((option) => {
            aux.push(option)
        })
        this.setState({
            modal: true,
            cuenta: null,
            form: this.setEmptyForm(),
            empresas: aux,
            formeditado:0,
            tipo: 'Bancaria'
        })
    }

    openModalCajaChica = () => {
        const { empresasOptions } = this.state
        let aux = []
        empresasOptions.map((option) => {
            aux.push(option)
        })
        this.setState({
            modal: true,
            cuenta: null,
            form: this.setEmptyForm(),
            empresas: aux,
            formeditado:0,
            tipo: 'Caja chica'
        })
    }

    openModalEdit = cuenta => {
        const { empresasOptions } = this.state

        let empresaFormAux = []
        cuenta.empresa.map((empresa, key) => {
            empresaFormAux.push({ value: empresa.id, text: empresa.name })
        })

        let empresaOptionsAux = []

        empresasOptions.map((option) => {
            let aux = true
            cuenta.empresa.map((empresa) => {
                if (empresa.id.toString() === option.value.toString()) {
                    aux = false
                }
            })
            if (aux)
                empresaOptionsAux.push(option)
        })

        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : 0,
            tipo: cuenta.tipo ? cuenta.tipo.id : 0,
            estatus: cuenta.estatus ? cuenta.estatus.id : 0,
            empresa: 0,
            empresas: empresaFormAux
        }

        this.setState({
            modal: true,
            cuenta: cuenta,
            form: aux,
            empresas: empresaOptionsAux,
            formeditado:1,
            tipo: 'Bancaria'
        })
    }

    openModalEditCajaChica = cuenta => {
        const { empresasOptions } = this.state

        let empresaFormAux = []
        cuenta.empresa.map((empresa, key) => {
            empresaFormAux.push({ value: empresa.id, text: empresa.name })
        })

        let empresaOptionsAux = []

        empresasOptions.map((option) => {
            let aux = true
            cuenta.empresa.map((empresa) => {
                if (empresa.id.toString() === option.value.toString()) {
                    aux = false
                }
            })
            if (aux)
                empresaOptionsAux.push(option)
        })

        let aux = {
            nombre: cuenta.nombre,
            numero: cuenta.numero,
            descripcion: cuenta.descripcion,
            balance: cuenta.balance,
            banco: cuenta.banco ? cuenta.banco.id : 0,
            tipo: cuenta.tipo ? cuenta.tipo.id : 0,
            estatus: cuenta.estatus ? cuenta.estatus.id : 0,
            empresa: 0,
            empresas: empresaFormAux
        }

        this.setState({
            modal: true,
            cuenta: cuenta,
            form: aux,
            empresas: empresaOptionsAux,
            formeditado:1,
            tipo: 'Caja chica'
        })
    }

    openModalAddEstado = cuenta => {
        const { data } = this.state
        data.estados = cuenta ? cuenta.estados : []
        
        this.setState({
            modalEstado: true,
            cuenta: cuenta,
            data,
            estados: [],
            formeditado:0
        })

        this.setEstados(cuenta ? cuenta.estados : [])
    }

    openModalDelete = cuenta => {

        this.setState({
            modalDelete: true,
            cuenta: cuenta
        })
        
    }

    // Axios

    // Get

    async getCuentas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'cuentas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { bancos, estatus, tipo, cuentas, empresas, cuentasCajaChica } = response.data
                data.cuentas = cuentas
                data.cajas = cuentasCajaChica
                let aux = []
                bancos.map( (banco) => {
                    if(banco.nombre !== 'CAJA CHICA')
                        aux.push(banco)
                })
                
                this.setState({
                    ... this.state,
                    bancos: this.setOptions(aux, 'nombre'),
                    estatus: this.setOptions(estatus, 'estatus'),
                    tipos: this.setOptions(tipo, 'tipo'),
                    empresas: this.setOptions(empresas, 'name'),
                    empresasOptions: this.setOptions(empresas, 'name'),
                    data,
                    cuentas: this.setCuentas(cuentas),
                    cajas: this.setCuentas(cuentasCajaChica)
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

    // Post

    async addCuentaAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        const { tipo } = this.state
        form.tipoBanco = tipo
        await axios.post(URL_DEV + 'cuentas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas, cuentasCajaChica } = response.data
                const { data } = this.state
                data.cuentas = cuentas
                data.cajas = cuentasCajaChica
                this.setState({
                    modal: false,
                    form: this.setEmptyForm(),
                    cuentas: this.setCuentas(cuentas),
                    cajas: this.setCuentas(cuentasCajaChica),
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Cuenta agregada con éxito.',
                    icon: 'success',
                    timer: 1500
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

    async addEstadoAxios() {
        const { access_token } = this.props.authUser
        const { fecha, adjunto, adjuntoName, adjuntoFile, cuenta } = this.state
        const data = new FormData();
        data.append('adjunto', adjuntoFile)
        data.append('adjuntoName', adjuntoName)
        data.append('id', cuenta.id)
        data.append('fecha', (new Date(fecha)).toDateString())
        await axios.post(URL_DEV + 'cuentas/estado', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas, cuenta, cuentasCajaChica } = response.data
                const { data } = this.state
                data.estados = cuenta.estados
                data.cajas = cuentasCajaChica
                data.cuentas = cuentas
                this.setState({
                    adjunto: '',
                    adjuntoFile: '',
                    adjuntoName: '',
                    fecha: new Date(),
                    data,
                    cuentas: this.setCuentas(cuentas),
                    cajas: this.setCuentas(cuentasCajaChica)
                })
                this.setEstados(cuenta.estados)
                swal.close()
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

    // PUT

    async editCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.put(URL_DEV + 'cuentas/' + cuenta.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas, cuentasCajaChica } = response.data
                const { data } = this.state
                data.cuentas = cuentas
                data.cuentasCajaChica = cuentasCajaChica
                this.setState({
                    modal: false,
                    form: this.setEmptyForm(),
                    cuenta: null,
                    data,
                    cuentas: this.setCuentas(cuentas),
                    cajas: this.setCuentas(cuentasCajaChica)
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Cuenta editada con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
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

    //delete
    async deleteCuentaAxios() {
        const { access_token } = this.props.authUser
        const { cuenta, form } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas, cuentasCajaChica } = response.data
                const { data } = this.state
                data.cuentas = cuentas
                data.cajas = cuentasCajaChica

                
                this.setState({
                    modalDelete: false,
                    cuenta: null,
                    data,
                    cuentas: this.setCuentas(cuentas),
                    cajas: this.setCuentas(cuentasCajaChica)
                })
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Cuenta eliminada con éxito.',
                    icon: 'success',
                    timer: 1500
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

    async deleteEstadoAxios(id) {
        const { access_token } = this.props.authUser
        const { cuenta } = this.state
        await axios.delete(URL_DEV + 'cuentas/' + cuenta.id + '/estado/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { cuentas, cuenta, cuentasCajaChica } = response.data
                const { data } = this.state
                data.cuentas = cuentas
                data.cuentasCajaChica = cuentasCajaChica
                data.estados = cuenta.estados
                this.setState({
                    ... this.state,
                    data,
                    cuentas: this.setCuentas(cuentas),
                    cuentasCajaChica: this.setCuentas(cuentasCajaChica)
                })
                this.setEstados(cuenta.estados)
                swal({
                    title: '¡Listo 👋!',
                    text: response.data.message !== undefined ? response.data.message : 'Estado de cuenta eliminado con éxito.',
                    icon: 'success',
                    timer: 1500
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

    render() {
        const { modal, modalDelete, modalEstado, bancos, estatus, tipos, form, cuentas, cuenta, empresas, estados, adjunto, adjuntoName, fecha, data,title, formeditado, tipo, cajas } = this.state
        return (
            <Layout active={'bancos'}  {...this.props}>

                <Tabs defaultActiveKey="bancos">
                    <Tab eventKey="bancos" title="Banco">
                        <NewTable 
                            columns = {CUENTAS_COLUMNS} 
                            data = {cuentas}
                            title = 'Cuentas' 
                            subtitle = 'Listado de cuentas'
                            mostrar_boton = { true }
                            abrir_modal = { true }
                            onClick = { this.openModal }
                            mostrar_acciones = { true }
                            actions={{
                                'edit': { function: this.openModalEdit },
                                'delete': { function: this.openModalDelete },
                                'estado': { function: this.openModalAddEstado }
                            }}
                            elements = {data.cuentas}
                            idTable = 'cuentas_bancos'
                        />
                    </Tab>
                    <Tab eventKey="cajas" title="Caja chica">
                        <NewTable 
                            columns = { CUENTAS_COLUMNS }
                            data = { cajas }
                            title = 'Cajas chicas' 
                            subtitle = 'Listado de cajas chicas'
                            mostrar_boton = { true }
                            abrir_modal = { true }
                            onClick = { this.openModalCajaChica }
                            mostrar_acciones = { true }
                            actions = {{
                                'edit': { function: this.openModalEditCajaChica },
                                'delete': { function: this.openModalDelete },
                                'estado': { function: this.openModalAddEstado }
                            }}
                            elements = { data.cajas }
                            idTable = 'cuentas_cajas'
                        />
                    </Tab>
                </Tabs>
                

                <Modal  title={cuenta === null ? "Nueva cuenta" : 'Editar cuenta'}  show={modal} handleClose={this.handleClose} >
                    <CuentaForm tipo = { tipo } bancos={bancos} estatus={estatus} tipos={tipos}
                        empresas={empresas} form={form} onChange={this.onChange} onChangeEmpresa={this.onChangeEmpresa}
                        updateEmpresa={this.updateEmpresa} onSubmit={cuenta === null ? this.onSubmit : this.onEditSubmit} formeditado={formeditado} />
                </Modal>
                <Modal title= {cuenta === null ? "¿Estás seguro que deseas eliminar la cuenta ": "¿Estás seguro que deseas eliminar la cuenta "+ cuenta.nombre +" ?"} show={modalDelete} handleClose={this.handleDeleteModal} >
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleDeleteModal} text="Cancelar" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeDelete(e)() }} text="Continuar" className={"btn btn-danger font-weight-bold mr-2"}/>
                    </div>
                </Modal> 
                <Modal title= {cuenta === null ? "Estados de cuenta para": "Estados de cuenta para "+cuenta.nombre} show={modalEstado} handleClose={this.handleEstadoClose} >
                    
                    <Form onSubmit={this.onSubmitEstado} >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-4">
                                <Calendar
                                    onChangeCalendar={this.onChangeCalendar}
                                    placeholder="Fecha"
                                    name="fecha"
                                    value={fecha}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className = "col-form-label ">Adjunto de estado de cuenta</label>
                                <div className="col-md-6 px-2">
                                    <div className="d-flex align-items-center">
                                        <div className="image-upload d-flex align-items-center">
                                            <div className="no-label">
                                                <input
                                                    onChange={this.onChangeAdjunto}
                                                    value={adjunto}
                                                    name="adjunto"
                                                    type="file"
                                                    id="adjunto"
                                                    accept="application/pdf" />
                                            </div>
                                            {                                            
                                                adjuntoName &&
                                                <div className="">
                                                    <div className="tagify form-control p-1" tabIndex="-1" style={{borderWidth:"0px"}}>
                                                            <div className="tagify__tag tagify__tag--primary tagify--noAnim">
                                                                <div 
                                                                    title="Borrar archivo" 
                                                                    className="tagify__tag__removeBtn" 
                                                                    role="button" 
                                                                    aria-label="remove tag" 
                                                                    onClick={(e) => { e.preventDefault(); this.deleteAdjunto() }}
                                                                    >
                                                                </div>                                                            
                                                                    <div><span className="tagify__tag-text p-1 white-space">{adjuntoName}</span></div>
                                                            </div>
                                                    </div>
                                                </div> 
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                                
                        </div>
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-12 text-center">
                                {
                                    adjuntoName &&
                                    <div className="d-flex align-items-center justify-content-center">
                                        <Button className="ml-4" type="submit" text="Enviar" />
                                    </div>
                                }
                            </div>
                        </div>
                    </Form>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    {/* estados.length > 0 &&  <NewTable columns={EDOS_CUENTAS_COLUMNS} data={estados} />*/}
                    {estados.length > 0 && 
                    <TableForModals 
                            columns={EDOS_CUENTAS_COLUMNS} 
                            data={estados} 
                            mostrar_acciones={true}
                            actions={{
                                'deleteAction': { function: this.openModalDeleteEstado}
                            }}
                            elements={data.estados}
                            idTable = 'kt_datatable_estado'
                        />
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(Cuentas);