import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { faPhone, faEnvelope, faEye} from '@fortawesome/free-solid-svg-icons'
import { Button } from '../../../components/form-components'
import { Modal, Card, ModalDelete} from '../../../components/singles'
import { ProspectoForm, ContactoLeadForm } from '../../../components/forms'
import axios from 'axios'
import { URL_DEV, PROSPECTOS_COLUMNS, CONTACTO_COLUMNS, EMPTY_PROSPECTO, EMPTY_CONTACTO, EMPTY_CLIENTE } from '../../../constants'
import swal from 'sweetalert'
import { P, Small} from '../../../components/texts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, Form } from 'react-bootstrap'
import Moment from 'react-moment'
import { setOptions, setTextTable, setDateTable, setArrayTable, setContactoTable } from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import TableForModals from '../../../components/tables/TableForModals'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'

const $ = require('jquery');

class Leads extends Component {

    state = {
        modal:{
            convert: false,
            historyContact: false,
            contactForm: false,
            delete: false
        },
        title: '',
        lead: '',
        prospecto: '',
        prospectos: '',
        clientes: '',
        tiposContactos: '',
        vendedores: '',
        estatusProspectos: '',
        tipoProyectos: '',
        formContacto:{
            comentario: '',
            fechaContacto: '',
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: ''
        },
        contactHistory: [],
        data: {
            prospecto: []
        },
        formeditado:0,
        options:{
            tiposContactos: []
        }

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
        this.getOptions();
    }

    //Funciones botones
    openSafeDelete = (prospecto) => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ... this.state,
            modal,
            prospecto: prospecto
        })
    }

    handleDeleteModal = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ... this.state,
            prospecto: '',
            modal
        })
    }

    activeFormContact = prospecto => {
        const { modal } = this.state
        modal.contactForm = true
        this.setState({
            ... this.state,
            prospecto,
            modal,
            formeditado:0,
            formContacto: this.clearContactForm()
        })
    }

    handleCloseFormContact = () => {
        const { modal } = this.state
        modal.contactForm = false
        this.setState({
            ... this.state,
            prospecto: '',
            modal,
            formContacto: this.clearContactForm()
        })
    }

    activeModalHistory =  prospecto => {
        const { modal } = this.state
        modal.historyContact = true
        let aux = []
        prospecto.contactos.map((contacto) => {
            aux.push(
                {
                    usuario: renderToString(contacto ? contacto.user ? contacto.user.name  ? setTextTable(contacto.user.name) : '' : '' : ''),
                    fecha: renderToString(setDateTable(contacto.created_at)),
                    medio: renderToString(setTextTable(contacto ? contacto.tipo_contacto ? contacto.tipo_contacto.tipo ? contacto.tipo_contacto.tipo : '' : '' : '')),
                    estado: renderToString(setTextTable(contacto.success ? 'Contactado' : 'Sin respuesta')),
                    comentario: renderToString(setTextTable(contacto.comentario)),
                }
            )
        })
        this.setState({
            ... this.state,
            modal,
            contactHistory: aux
        })
    }

    handleCloseHistoryModal = () => {
        const { modal } = this.state
        modal.historyContact = false
        this.setState({
            ... this.state,
            modal,
            contactHistory: []
        })
    }

    openConvert = (prospecto) => {
        const { modal } = this.state
        modal.convert = true
        this.setState({
            ... this.state,
            modal,
            prospecto: prospecto,
            formeditado:1
        })
    }

    handleCloseConvertModal = () => {
        const { modal } = this.state
        modal.convert = false
        this.setState({
            ... this.state,
            prospecto: '',
            modal
        })
    }

    changePageEdit = (prospecto) => {
        const { history } = this.props
        history.push({
            pathname: '/leads/prospectos/edit',
            state: { prospecto: prospecto }
        });
    }

    // Clear form
    clearContactForm = () => {
        const { formContacto } = this.state
        let aux = Object.keys(formContacto)
        aux.map( (element) => {
            switch(element){
                case 'success':
                    formContacto[element] = 'Contactado'
                    break;
                default:
                    formContacto[element] = ''
                    break;
            }
        })
        return formContacto;
    }

    // On change
    onChangeContacto = event => {
        const { formContacto } = this.state
        const { name, value } = event.target
        formContacto[name] = value
        this.setState({
            ... this.state,
            formContacto
        })
    }

    setProspectos = prospectos => {
        let aux = []
        prospectos.map((prospecto, key) => {
            aux.push({
                actions: this.setActions(prospecto),
                lead: prospecto.lead ? renderToString(setContactoTable(prospecto.lead)) : '',
                empresa: prospecto.lead ? prospecto.lead.empresa ?  renderToString(setTextTable(prospecto.lead.empresa.name)) : '' : '',
                cliente: prospecto.cliente ?
                    renderToString(setArrayTable([
                        { name: 'Nombre', text: prospecto.cliente.nombre },
                        { name: 'RFC', text: prospecto.cliente.rfc },
                        { name: 'Empresa', text: prospecto.cliente.empresa },
                    ]))
                    : '',
                tipoProyecto: prospecto.tipo_proyecto ?  renderToString(setTextTable(prospecto.tipo_proyecto.tipo)) : '',
                descripcion:  renderToString(setTextTable(prospecto.descripcion)),
                vendedor: prospecto.vendedor ?  renderToString(setTextTable(prospecto.vendedor.name)) : '',
                preferencia:  renderToString(setTextTable(prospecto.preferencia)),
                estatusProspecto: prospecto.estatus_prospecto ?  renderToString(setTextTable(prospecto.estatus_prospecto.estatus)) : '',
                motivo:  renderToString(setTextTable(prospecto.motivo)),
                fechaConversion:  renderToString(setDateTable(prospecto.created_at)),
                id: prospecto.id
            })
        })
        return aux
    }

    setActions = prospecto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: {id:'edit', text:'Editar'}
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin', 
                action: 'delete',
                tooltip: {id:'delete', text:'Eliminar', type:'error'}
            },
            {
                text: 'Contacto',
                btnclass: 'primary',
                iconclass: 'flaticon-support', 
                action: 'contacto',
                tooltip: {id:'contacto', text:'Contacto'}
            },                
            {
                text: 'Convertir&nbsp;en&nbsp;proyecto',
                btnclass: 'dark',
                iconclass: 'flaticon-folder-1', 
                action: 'convert',
                tooltip: {id:'convert', text:'Convertir en proyecto'}
            }
        )
        if (prospecto.contactos.length > 0) {
            aux.push(
                {
                    text: 'Historial&nbsp;de&nbsp;contacto',
                    btnclass: 'info',
                    iconclass: 'flaticon-list-1', 
                    action: 'historial',
                    tooltip: {id:'historial', text:'Historial de contacto'}
                }
            )        
        }
        return aux
    }

    submitContactForm = e => {
        e.preventDefault();
        this.addContactoAxios()
    }

    safeConvert = e => prospecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos',
            state: { prospectos: prospecto }
        });
    }

    async getOptions() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'prospecto/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { options } = this.state
                const { tiposContactos } = response.data
                options.tiposContactos = setOptions(tiposContactos, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                this.setState({
                    ... this.state,
                    options
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

    async getProspectoAxios(){
        var table = $('#kt_datatable_prospectos').DataTable();
        table.ajax.reload();
    }

    async deleteProspectoAxios() {
        const { prospecto } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(URL_DEV + 'prospecto/' + prospecto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getProspectoAxios()
                const { modal } = this.state
                const { prospectos } = response.data
                modal.delete = false
                this.setState({
                    ... this.state,
                    modal,
                    title: '',
                    prospecto: ''
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el lead con éxito.')

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

    async addContactoAxios() {
        const { access_token } = this.props.authUser
        const { formContacto, prospecto } = this.state
        await axios.post(URL_DEV + 'prospecto/' + prospecto.id + '/contacto', formContacto, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                this.getProspectoAxios()

                const { prospectos, tiposContactos } = response.data
                const { modal, options } = this.state
                
                modal.contactForm = false

                options.tiposContactos = setOptions(tiposContactos, 'tipo', 'id')
                options.tiposContactos.push({
                    value: 'New', name: '+ Agregar nuevo'
                })
                
                this.setState({
                    ... this.state,
                    modal,
                    prospecto: '',
                    options
                })

                doneAlert(response.data.message !== undefined ? response.data.message : 'Convertiste con éxisto el lead.')
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
        const { modal, options, formContacto, prospecto, data, contactHistory} = this.state

        return (
            <Layout active={'leads'}  {...this.props}>

                <NewTableServerRender 
                    columns = { PROSPECTOS_COLUMNS }
                    title = 'Prospectos'
                    subtitle = 'Listado de prospectos'
                    mostrar_boton = { false }
                    abrir_modal = { false }
                    mostrar_acciones = { true }
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openSafeDelete },
                        'contacto': { function: this.activeFormContact },
                        'historial': { function: this.activeModalHistory },
                        'convert': { function: this.openConvert }
                    }}
                    idTable='kt_datatable_prospectos'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setProspectos}
                    urlRender={URL_DEV + 'prospecto'}
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'/>

                
                <Modal 
                    size = "xl" 
                    show = { modal.historyContact } 
                    handleClose = { this.handleCloseHistoryModal } 
                    title = { "Historial de contacto"} >
                    {
                        contactHistory &&
                        <TableForModals
                            mostrar_boton={false}
                            abrir_modal={false}
                            mostrar_acciones={false}
                            columns={CONTACTO_COLUMNS} 
                            data={contactHistory} 
                            elements = { data.contactHistory }
                        />
                    }

                </Modal>
                <Modal 
                    size = "xl" 
                    title = "Agregar un nuevo contacto" 
                    show = { modal.contactForm } 
                    handleClose = { this.handleCloseFormContact } >
                    <Form className="mx-3" onSubmit={this.submitContactForm}>
                        <ContactoLeadForm 
                            options = { options } 
                            formContacto = { formContacto } 
                            onChangeContacto = { this.onChangeContacto } />
                            <div className="mt-3 text-center">
                                <Button icon='' className="mx-auto" type="submit" text="Enviar" />
                            </div>
                    </Form>
                </Modal> 

                <ModalDelete 
                    title = "¿Deseas eliminar el prospecto?" 
                    show = { modal.delete } 
                    handleClose = { this.handleDeleteModal }  
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteProspectoAxios() }} />

                <Modal 
                    size = "xl" 
                    show = { modal.convert }
                    handleClose = { this.handleCloseConvertModal }
                    title = "¿Estás seguro que deseas convertir el prospecto en un proyecto?">
                    <div className="d-flex justify-content-center mt-3">
                        <Button icon='' onClick={this.handleCloseConvertModal} text="Cancelar" className="mr-3" className={"btn btn-light-primary font-weight-bolder mr-3"} />
                        <Button icon='' onClick={(e) => { this.safeConvert(e)(prospecto) }} text="Continuar" className={"btn btn-success font-weight-bold mr-2"}/>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Leads);