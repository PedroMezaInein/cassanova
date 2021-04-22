import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import axios from 'axios'
import Swal from 'sweetalert2'
import moment from 'moment'
import { URL_DEV } from '../../constants'
import { connect } from 'react-redux'
import { Tags, ListPanel, Task, AddTaskForm} from '../../components/forms'
import { Modal } from '../../components/singles'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../functions/alert'
import { setSingleHeader } from '../../functions/routers'
class Tareas extends Component {

    state = {
        modal_tarea: false,
        form: {
            titulo: '',
            descripcion: '',
            fecha_entrega: null,
            responsables: [],
            tags: [],
            comentario: '',
            tipo: '',
            tipoTarget: {taget: '', value: ''},
            filtrarTarea: 'own',
            color: '',
            mostrarColor: false,
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
            },
            nuevo_tag:''
        },
        options: {
            responsables: [],
            tags: [],
            filtrarTareas: [
                { text: "Tareas personales", value: "own" },
                { text: "Tareas generales", value: "all" },
            ],
        },
        showTask: false,
        showListPanel : true,
        pagination:{
            page: 0,
            limit: 10,
            numTotal: 0,
        },
        tareas: [],
        tarea: '',
        etiquetas: [],
        title: 'AGREGAR NUEVA TAREA',
        formeditado: 1,
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const tareas = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!tareas)
            history.push('/')
        this.getOptionsAxios()
        const { pagination } = this.state
        this.getTasks(pagination)
    }

    mostrarListPanel() {
        this.setState({
            ...this.state,
            showListPanel : true ,
            showTask: false,
            tarea: ''
        })
    }

    nextPage = () => {
        const { pagination } = this.state
        pagination.page = pagination.page+1;
        this.setState({...this.state, pagination})
        this.getTasks(pagination)
    }

    prevPage = () => {
        const { pagination } = this.state
        pagination.page = pagination.page-1;
        this.setState({...this.state, pagination})
        this.getTasks(pagination)
    }

    completarTareaAxios = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/completar`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                this.setState({ ...this.state, showTask: false, showListPanel: true, tarea: '' })
                doneAlert('Tarea completada con éxito')
                const { pagination } = this.state
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    mostrarTarea = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v3/usuarios/tareas/${tarea.id}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { tarea } = response.data
                this.setState({ ...this.state, showTask: true, showListPanel: false, tarea: tarea })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
        
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'EDITAR NUEVA TAREA')
            this.editTask()
        else
            this.addTask()
    }

    addTask = async(e) =>  {
        e.preventDefault();
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/usuarios/tareas`, form, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { pagination } = this.state
                this.setState({
                    ...this.state,
                    modal_tarea: false,
                    form: this.clearForm(),
                })
                doneAlert('Tarea generada con éxito')
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    editTask = async(e) =>  {
        const { access_token } = this.props.authUser
        const { tarea, form} = this.state
        waitAlert()
        await axios.put(`${URL_DEV}v3/usuarios/tareas${tarea.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    modal_tarea: false
                })
                doneAlert('Fue editado con éxito');
                this.getLeadsWeb()
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    getTasks = async(pagination) => {
        const { access_token } = this.props.authUser
        const { form, etiquetas } = this.state
        waitAlert()
        let aux = ''
        console.log(etiquetas, 'etiquetas get tasks')
        etiquetas.map((element, index) => {
            aux = aux + '&etiquetas[]='+element.id
        })
        await axios.get(`${URL_DEV}v3/usuarios/tareas?page=${pagination.page}&limit=${pagination.limit}${aux}&type=${form.filtrarTarea}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                Swal.close()
                const { tareas, num } = response.data
                pagination.numTotal = num
                this.setState({ ...this.state, tareas, pagination })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateFavAxios = async(tarea) => {
        const { access_token } = this.props.authUser
        waitAlert()
        let tipo = tarea.prioritario === 0 ? 'si' : 'no'
        await axios.put(`${URL_DEV}v3/usuarios/tareas/${tarea.id}/importancia`, {prioritario: tipo}, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { tarea } = response.data
                Swal.close()
                this.setState({...this.state, tarea: tarea})
                const { pagination } = this.state
                this.getTasks(pagination)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.options(`${URL_DEV}v3/usuarios/tareas`, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { usuarios, etiquetas } = response.data
                const { options } = this.state
                options.responsables = []
                options.tags = [ { label: ' + Nueva etiqueta', value: 'nueva_etiqueta', name: 'Nueva etiqueta'} ]
                usuarios.forEach( ( element ) => {
                    options.responsables.push({
                        name: element.name,
                        value: element.id.toString(),
                        label: element.name
                    })
                });
                etiquetas.forEach( (element) => {
                    options.tags.push({
                        name: element.titulo,
                        value: element.id.toString(),
                        label: element.titulo,
                        color:element.color
                    })
                })
                this.setState({...this.state, options})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendTagAxios = async(e) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        waitAlert()
        await axios.post(`${URL_DEV}v3/usuarios/tareas/etiquetas`, form, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { etiquetas, etiqueta } = response.data
                const { options, form } = this.state
                options.tags = [ { label: ' + Nueva etiqueta', value: 'nueva_etiqueta', name: 'Nueva etiqueta'} ]
                etiquetas.forEach( (element) => {
                    options.tags.push({
                        name: element.titulo,
                        value: element.id.toString(),
                        label: element.titulo,
                        color:element.color
                    })
                })
                form.nuevo_tag = ''
                form.color = ''
                if(etiqueta)
                    form.tags.push({value: etiqueta.id.toString(), name: etiqueta.titulo, label: etiqueta.titulo})
                this.setState({...this.state, options, form})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addLabel = async(etiqueta) => {
        const { etiquetas, pagination } = this.state
        let flag = true
        etiquetas.forEach((elemento) => {
            if(elemento.id === etiqueta.id)
                flag = false
        })
        if(flag){
            etiquetas.push(etiqueta)
            this.setState({...this.state, etiquetas})
            this.getTasks(pagination)
        }
    }

    removeTag = async(etiqueta) => {
        let { etiquetas, pagination } = this.state
        let aux = []
        etiquetas.forEach((element) => {
            console.log(element, etiqueta)
            if(element.id !== etiqueta.id)
                aux.push(element)
        })
        etiquetas = aux
        this.setState({...this.state, etiquetas})
        waitAlert()
        setTimeout(
            () => {
                this.getTasks(pagination)        
            }, 100
        )
        
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal_tarea: true,
            form: this.clearForm(),
            title: 'AGREGAR NUEVA TAREA'
        })
    }
    handleCloseModal = () => {
        this.setState({
            ...this.state,
            modal_tarea: false
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case ' mostrarColor':
                    form[element] = false;
                    break;
                case 'rolTarget':
                    form[element] = { target: '', value: ''}
                    break;
                case 'responsables':
                    form[element] = [];
                    break;
                case 'fecha_entrega':
                    form[element] = null
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = '';
                    break;
            }
            return ''
        })
        return form
    }
    onChange = e => {
        const { name, value } = e.target
        const { form,pagination } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
        if(name === 'filtrarTarea')
            this.getTasks(pagination)
    }
    handleChangeCreate = newValue => {
        const { form } = this.state
        if(newValue == null){
            newValue = { "label":"","value":"" }
        }
        let nuevoValue = {
            "label":newValue.label,
            "value":newValue.value,
            "color":""
        }
        form.tipo = newValue.value
        form.tipoTarget = nuevoValue
        this.setState({
            ...this.state,
            form
        })
    }
    handleCreateOption = inputValue => {
        let { options, form } = this.state
        let newOption = {
            'label': inputValue,
            'value': inputValue,
            'text': inputValue,
        }
        options.tipos.push(newOption)
        form.tipoTarget = newOption
        form.tipo = inputValue
        form.mostrarColor = true
        this.setState({
            ...this.state,
            form,
            options
        });
    }

    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    openModalEdit = tarea => {
        const { form } = this.state
        form.titulo = tarea.titulo
        let auxResponsables = []
        let auxrTag = []
        if (tarea.responsables) {
            tarea.responsables.forEach(responsable => {
                auxResponsables.push({
                    value: responsable.id.toString(),
                    name: responsable.name,
                    label: responsable.name
                })
            });
            form.responsables = auxResponsables
        }
        form.descripcion = tarea.descripcion
        if (tarea.etiquetas) {
            tarea.etiquetas.forEach(tag => {
                auxrTag.push({
                    value: tag.id.toString(),
                    name: tag.titulo,
                    label: tag.titulo
                })
            });
            form.tags = auxrTag
        }
        form.fecha_entrega = new Date(moment(tarea.fecha_limite))
        this.setState({
            ...this.state,
            tarea: tarea,
            form,
            formeditado: 1,
            modal_tarea: true,
            title: 'EDITAR NUEVA TAREA'
        })
    }
    handleCloseModalEdit = () => {
        this.setState({
            ...this.state,
            modal_tarea: false,
            lead: ''
        })
    }
    render() {
        const { modal_tarea, form, options, showListPanel, showTask, tareas, pagination, tarea, title, etiquetas } = this.state
        const { user } = this.props.authUser
        return (
            <Layout active='usuarios' {...this.props}>
                <div className="d-flex flex-row">
                    <div className="flex-row-fluid ">
                        <div className="d-flex flex-column flex-grow-1 ">
                            <Tags etiquetas = { etiquetas } removeTag = { this.removeTag } options = { options }/>
                            <div className="row">
                                <ListPanel openModal = { this.openModal } options = { options } onChange = { this.onChange } form = { form }
                                    mostrarTarea = { this.mostrarTarea } showListPanel = { showListPanel } tareas = { tareas } 
                                    user = { user } updateFav = { this.updateFavAxios } pagination = { pagination } prev = { this.prevPage }
                                    next = { this.nextPage } addLabel = { this.addLabel } />
                                <Task showTask={showTask} tarea = { tarea } mostrarListPanel = { () => { this.mostrarListPanel() } }
                                    completarTarea = { this.completarTareaAxios } updateFav = { this.updateFavAxios } form = { form }
                                    onChange = { this.onChange } clearFiles={this.clearFiles} 
                                    openModalEdit = { this.openModalEdit}/>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal size="xl" title={title} show={modal_tarea} handleClose={this.handleCloseModal}>
                    <AddTaskForm onSubmit = { this.onSubmit } form = { form } options = { options } onChange = { this.onChange }
                        handleChangeCreate = { this.handleChangeCreate } handleCreateOption = { this.handleCreateOption } sendTag = { this.sendTagAxios } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(Tareas);