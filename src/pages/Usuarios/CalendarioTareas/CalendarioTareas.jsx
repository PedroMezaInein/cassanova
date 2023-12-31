import React, { Component } from 'react'
import $ from "jquery"
import axios from 'axios'
import Swal from 'sweetalert2'
import Echo from 'laravel-echo'
import { connect } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Modal } from '../../../components/singles'
import esLocale from '@fullcalendar/core/locales/es'
import bootstrapPlugin from '@fullcalendar/bootstrap'
import Layout from '../../../components/layout/layout'
import interactionPlugin from '@fullcalendar/interaction'
import { PUSHER_OBJECT, URL_DEV } from '../../../constants'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import FormCalendarioTareas from '../../../components/forms/usuarios/FormCalendarioTareas'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../functions/alert'
/* import Pusher from 'pusher-js'; */

class Calendario extends Component {
    state = {
        events: [],
        checador: [],
        json: {},
        tipo: 'own',
        title:'',
        modal: {
            tareas:false
        },
        form: {
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            },
            comentario: ''
        },
        options:{ users: [] },
        tareas: []
    };

    componentDidMount() {
        $("body").removeClass('bg-white d-flex justify-content-center');
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getCalendarioTareasAxios('own')
        if(process.env.NODE_ENV === 'production'){
            const pusher = new Echo( PUSHER_OBJECT );
            pusher.channel('responsable-tarea').listen('ResponsableTarea', (data) => {
                const { tipo, tareas, tarea } = this.state
                const { user } = this.props.authUser
                if(data.type ==='delete'){ this.getCalendarioTareasAxios(tipo) }
                else{
                    if(tarea)
                        if(tarea.id === data.tarea)
                            this.getTareas({id: data.tarea})
                    if(tipo === 'own'){
                        let found = tareas.find((elemento) => { return elemento.id === data.tarea })
                        if(found){ this.getCalendarioTareasAxios(tipo) }
                        else{
                            found = data.responsables.find((elemento) => { return elemento === user.id })
                            if(found){ this.getCalendarioTareasAxios(tipo) }
                        }
                    }else{ this.getCalendarioTareasAxios(tipo) }
                }
            })
        }
    }

    actualizarChecadorAxios = async(tipo) => {
        const { access_token } = this.props.authUser
        const { json } = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/usuarios/checador/${tipo}`, {ip: json}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => { 
                const { usuario } = response.data
                if(tipo === 'entrada')
                    doneAlert('Entrada checada con éxito')
                else
                    doneAlert('Salida checada con éxito')
                this.setState({...this.state, checador: usuario.checadores})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleDateClick = (arg) => {
        waitAlert()
        this.getEventsOneDateAxios(arg.dateStr)
    }

    async getEventsOneDateAxios(date) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'vacaciones/single/' + date, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { eventos } = response.data
                this.setState({
                    ...this.state,    
                    eventos: eventos
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async getCalendarioTareasAxios(tipo) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v3/usuarios/calendario-tareas/${tipo}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { tareas } = response.data
                let aux = []
                tareas.forEach((tarea) => {  aux.push( { title: tarea.titulo, start: tarea.fecha_limite, end: tarea.fecha_limite, tarea: tarea } )  })
                this.setState({ ...this.state, events: aux, tipo: tipo, tareas: tareas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    setProyectoName = nombre => {
        let arreglo = nombre.split(' ')
        let texto = '#'
        arreglo.forEach( (elemento) => {
            if(elemento !== '' && elemento !== '-')
                texto = texto + elemento.charAt(0).toUpperCase() + elemento.slice(1).toLowerCase()
        })
        return texto
    }

    getTareas = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/calendario-tareas/options/${tarea.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { tarea, usuarios, proyectos } = response.data
                const { modal, options } = this.state
                modal.tareas = true
                options.users = []
                options.proyectos = []
                usuarios.forEach((element) => { options.users.push({ id: element.id, display: element.name }) })
                proyectos.forEach((element) => { options.proyectos.push({ id: element.id, display: this.setProyectoName(element.nombre), name: element.nombre }) })
                Swal.close()
                this.setState({ ...this.state, modal, tarea: tarea, title: tarea.titulo, form: this.clearForm(), options })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    
    handleCloseModalT = () => {
        const { modal } = this.state
        modal.tareas = false
        this.setState({ ...this.state, modal, tarea: '' })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form
    }
    renderEventContent = (eventInfo) => {
        const { tarea } = eventInfo.event._def.extendedProps
        return (
            <OverlayTrigger rootClose overlay={<Tooltip>{eventInfo.event.title}</Tooltip>}>
                <div className="text-hover container p-1 bg-info rounded-xl" onClick={(e) => { e.preventDefault(); this.getTareas(tarea) }}>
                    <div className="row mx-0 row-paddingless">
                        <div className="col-md-auto mr-2 text-truncate">
                            {
                                this.responsablesSymbol(tarea.responsables)
                            }
                        </div>
                        <div className="col align-self-center text-truncate">
                            <span className="text-white font-weight-bold">{eventInfo.event.title}</span>
                        </div>
                    </div>
                </div>
            </OverlayTrigger>
        )
    }
    responsablesSymbol = (responsables) => {
        if(responsables.length > 3){
            let obtenerTresR = responsables.slice(0, 3);
            let obtenerRestantes = responsables.slice(3, responsables.length);
            return(
                <div className="symbol-group symbol-hover justify-content-center">
                    {
                        obtenerTresR.map((responsable, key) => {
                            return (
                                <OverlayTrigger rootClose key={key} overlay={<Tooltip>{responsable.name}</Tooltip>}>
                                    <div className="symbol symbol-25 symbol-circle border-0">
                                        <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                    </div>
                                </OverlayTrigger>
                            )
                        })
                    }
                    <OverlayTrigger rootClose overlay={
                        <Tooltip>
                            {
                                obtenerRestantes.map((responsable, key) => {
                                    return (
                                        <div className="d-flex align-items-center mb-1" key={key}>
                                            <div className="symbol-list d-flex flex-wrap">
                                                <div className="symbol symbol-20 symbol-circle mr-3" style={{ width: '' }}>
                                                    <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column flex-grow-1">
                                                <div className="text-dark-75 mb-1 font-size-sm font-weight-bold text-left">{responsable.name.split(" ", 1)}</div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Tooltip>
                    }>
                        <div className="symbol symbol-25 symbol-circle border-0 symbol-light-primary">
                            <span className="symbol-label font-weight-bolder">{obtenerRestantes.length}+</span>
                        </div>
                    </OverlayTrigger>
                </div>
            )
        }else{
            return(
                <div className="symbol-group symbol-hover justify-content-center">
                    {
                        responsables.map((responsable, key) => {
                            return (
                                <OverlayTrigger rootClose key={key} overlay={<Tooltip>{responsable.name}</Tooltip>}>
                                    <div className="symbol symbol-25 symbol-circle border-0">
                                        <img alt='user-avatar' src={responsable.avatar ? responsable.avatar : "/default.jpg"} />
                                    </div>
                                </OverlayTrigger>
                            )
                        }) 
                    }
                </div>
            )
        }
    }
    
    openCalendarMisTareas = () => { this.getCalendarioTareasAxios('own') }
    
    openCalendarDeptos = () => { this.getCalendarioTareasAxios('all') }

    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, tarea } = this.state
        const data = new FormData();
        form.adjuntos.adjunto_comentario.files.forEach(( adjunto) => {
            data.append(`files[]`, adjunto.file)
        })
        data.append(`comentario`, form.comentario)
        await axios.post(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/comentario`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { tarea } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({ ...this.state, form, tarea: tarea })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
    handleChangeComentario = (files, item) => {
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
            ...this.state,
            form
        })
    }

    hasIcon = () => {
        const { tarea } = this.state
        if(tarea)
            if(tarea.prioritario)
                return 'flaticon-star text-warning mx-2'
        return null
    }

    render() {
        const { events, tipo, title, modal, tarea, form, options } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <div className="align-items-start flex-column">
                                <span className="font-weight-bolder text-dark font-size-h3">Calendario de tareas</span>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="btn-toolbar btn-group justify-content-center mb-7">
                            <div className="btn-group btn-group-sm">
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'own' ? 'btn-success' : 'btn-light-success'}`} onClick={this.openCalendarMisTareas}>
                                    <i className="fas fa-tasks"></i> MIS TAREAS
                                </button>
                                <button type="button" className={`btn font-weight-bolder ${tipo === 'all' ? 'btn-primary' : 'btn-light-primary'}`}  onClick={this.openCalendarDeptos}>
                                    <i className="fas fa-list-ol"></i> TAREAS DEPTOS
                                </button>
                            </div>
                        </div>
                        <FullCalendar locale = { esLocale } plugins = { [dayGridPlugin, interactionPlugin, bootstrapPlugin] }
                            initialView = "dayGridMonth" weekends = { true } events = { events } eventContent = { this.renderEventContent }
                            firstDay = { 1 } themeSystem = 'bootstrap' height = '1290.37px' />
                    </Card.Body>
                </Card>
                <Modal size="lg" title={title} show={modal.tareas} handleClose={this.handleCloseModalT} icon = { this.hasIcon() } >
                    <FormCalendarioTareas tarea = { tarea } addComentario = { this.addComentarioAxios } form = { form } proyectos = { options.proyectos }
                        onChange = { this.onChange } handleChange = { this.handleChangeComentario } users = { options.users } />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Calendario)
