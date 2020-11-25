import React, { Component } from 'react'
import { Accordion, Card } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Button } from '../../../components/form-components'
import ClienteForm from '../../../components/forms/ClienteForm'
import Layout from '../../../components/layout/layout'
import { Modal } from '../../../components/singles'
import { CP_URL, URL_DEV } from '../../../constants'
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'
import ProyectosFormGray from '../../../components/forms/proyectos/ProyectosFormGray'
import { setOptions } from '../../../functions/setters'
import swal from 'sweetalert';
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { ProyectoCard } from '../../../components/cards'

class Contratar extends Component {

    state = {
        modal: false,
        formeditado: false,
        form: {
            colonias: [],
            empresa: '',
            nombre: '',
            puesto: '',
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            perfil: '',
            rfc: '',
            contacto:''
        },
        formProyecto:{
            fechaInicio: new Date(),
            fechaFin: new Date(),
            estatus:'',
            fase1: false,
            fase2: false,
            fase3: false,
            fase1_relacionado: false,
            fase2_relacionado: false,
            fase3_relacionado: false,
            proyecto: '',
            semana: '',
            nombre: '',
            cliente: '',
            contacto: '',
            numeroContacto: '',
            empresa: '',
            cp: '',
            estado: '',
            municipio: '',
            calle: '',
            colonia: '',
            porcentaje: '',
            descripcion: '',
            correo: '',
            correos: [],
            clientes: [],
            adjuntos: {
                image:{
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                }
            }
        },
        options:{
            empresas: [],
            clientes: [],
            colonias: [],
            estatus: [],
        },
        lead: ''
    }

    componentDidMount(){
        this.getOptionsAxios()
        this.getOneLead()
    }

    openModal = () => {
        this.setState({
            ...this.state,
            modal: true
        })
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            modal: false
        })
    }

    onChangeProyecto = e => {
        const { name, value } = e.target
        const { formProyecto } = this.state
        formProyecto[name] = value
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    onChange = event => {
        const { form } = this.state
        const { name, value } = event.target
        if (name === 'empresa') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeOptions = (e, arreglo) => {
        const { value } = e.target
        const { formProyecto, options } = this.state
        let auxArray = formProyecto[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxArray.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        formProyecto[arreglo] = auxArray
        this.setState({
            ...this.state,
            formProyecto,
            options
        })
    }
    deleteOption = (element, array) => {
        let { formProyecto } = this.state
        let auxForm = []
        formProyecto[array].map((elemento, key) => {
            if (element !== elemento) {
                auxForm.push(elemento)
            }
            return false
        })
        formProyecto[array] = auxForm
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    removeCorreo = value => {
        const { formProyecto } = this.state
        let aux = []
        formProyecto.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        formProyecto.correos = aux
        this.setState({
            ...this.state,
            formProyecto
        })
    }

    changeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
    }

    onChangeCPProyecto = event => {
        const { value, name } = event.target
        this.onChangeProyecto({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpProyectosAxios(value)
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if (element === 'colonias')
                form[element] = []
            else
                form[element] = ''
            return false
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        this.addClienteAxios();
    }

    async getOneLead() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { location: { state: historyState } } = this.props
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/opciones', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { clientes, empresas, estatus } = response.data
                const { options } = this.state
                options['clientes'] = setOptions(clientes, 'empresa', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['estatus'] = setOptions(estatus, 'estatus', 'id')
                this.setState({
                    ...this.state,
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

    async addClienteAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    modal: false,
                    form: this.clearForm()
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente agregado con éxito.')
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

    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { form } = this.state
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia.toUpperCase() })
                    return false
                })
                form.municipio = municipio.toUpperCase()
                form.estado = estado.toUpperCase()
                form.colonias = aux
                this.setState({
                    ...this.state,
                    form
                })
            },
            (error) => {
            }
        ).catch((error) => {
        })
    }

    async cpProyectosAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { error } = response.data
                const { formProyecto, options } = this.state
                if (!error) {
                    const { municipio, estado, asentamiento } = response.data.response
                    formProyecto['municipio'] = municipio.toUpperCase()
                    formProyecto['estado'] = estado.toUpperCase()
                    let aux = []
                    asentamiento.map((element) => {
                        aux.push({ name: element.toString().toUpperCase(), value: element.toString().toUpperCase() })
                        return false
                    })
                    options['colonias'] = aux
                    this.setState({
                        ...this.state,
                        formProyecto,
                        options
                    })
                }
            },
            (error) => {
            }
        ).catch((error) => {
            console.log('error catch', error)
        })
    }
    tagInputChange = (nuevosCorreos) => {
        const uppercased = nuevosCorreos.map(tipo => tipo.toUpperCase()); 
        const { formProyecto } = this.state 
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formProyecto.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            formProyecto
        })
    }

    render() {
        const { modal, form, formProyecto, options, formeditado, lead } = this.state
        return (
            <Layout active = 'leads' { ... this.props }>
                <Card className="card-custom card-stretch">
                    <Card.Header className="border-0 mt-4 pt-3">
                        <div class="card-title d-flex justify-content-between">
                            <span class="font-weight-bolder text-dark align-self-center font-size-h3">CONVERTIR LEAD</span>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button
                                icon=''
                                className={"btn btn-icon btn-xs p-3 btn-light-success mr-2"}
                                onClick = { this.openModal }
                                only_icon={"flaticon2-plus icon-13px"}
                                tooltip={{ text: 'AGREGAR NUEVO CLIENTE' }}
                            />
                        </div>
                    </Card.Header>
                    {/* <Card.Header className="mt-4">
                        <h3 className="card-title d-flex justify-content-between w-100">
                            <span className="font-weight-bolder text-dark align-self-center">
                                CONVERTIR LEAD
                            </span>
                            <div>
                                <Button
                                    icon =''
                                    className = "btn btn-icon btn-xs w-auto p-3 btn-success"
                                    onClick = { this.openModal }
                                    only_icon = "flaticon-price-tag icon-15px mr-2"
                                    text = 'NUEVO CLIENTE'
                                    tooltip = { { text: 'NUEVO CLIENTE' } }
                                    />
                            </div>
                        </h3>
                    </Card.Header> */}
                    <Card.Body className="pt-0">
                        <ProyectosFormGray 
                            form = { formProyecto }
                            options = { options } 
                            onChange = { this.onChangeProyecto } 
                            onChangeOptions = { this.onChangeOptions } 
                            removeCorreo = { this.removeCorreo } 
                            deleteOption = { this.deleteOption } 
                            onChangeCP = { this.onChangeCPProyecto }
                            tagInputChange={(e) => this.tagInputChange(e)}
                        >
                            <Accordion>
                                {
                                    lead !== '' ? 
                                        lead.prospecto ?
                                            <div className="d-flex justify-content-end">
                                                <Accordion.Toggle as = { Button } icon = { faEye } pulse="pulse-ring" 
                                                eventKey = 'prospecto' className="btn btn-icon btn-light-info pulse pulse-info" />
                                            </div>
                                        : ''
                                    : ''
                                }
                                <Accordion.Collapse eventKey='prospecto'  className="px-md-5 px-2">
                                    <div>
                                        {
                                            lead !== ''?
                                                lead.prospecto ?
                                                    <div>
                                                        <ProyectoCard data={lead.prospecto} />
                                                    </div>
                                                : ''
                                            : ''
                                        }
                                    </div>
                                </Accordion.Collapse>
                            </Accordion>
                        </ProyectosFormGray>
                    </Card.Body>
                </Card>
                <Modal size = 'xl' title = 'Nuevo cliente' show = { modal }
                    handleClose = { this.handleClose }>
                        <ClienteForm
                            formeditado = { formeditado }
                            form = { form }
                            onChange = { this.onChange }
                            changeCP = { this.changeCP }
                            onSubmit = { this.onSubmit }
                            />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Contratar)
