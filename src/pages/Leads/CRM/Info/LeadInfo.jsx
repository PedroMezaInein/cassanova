import { connect } from 'react-redux';
import React, { Component } from 'react'
import Layout from '../../../../components/layout/layout'
import { Col, Row, Card, Tab, Nav, Dropdown, Form } from 'react-bootstrap'
import { Button } from '../../../../components/form-components';
import { URL_DEV } from '../../../../constants'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../functions/routers"
import { setOptions, setDateTableLG } from '../../../../functions/setters';
import axios from 'axios'
import { doneAlert, errorAlert, forbiddenAccessAlert, waitAlert, questionAlert2, questionAlert, deleteAlert } from '../../../../functions/alert';
import Swal from 'sweetalert2'
import { HistorialContactoForm, AgendarCitaForm, PresupuestoDiseñoCRMForm, PresupuestoGenerado,InformacionGeneral} from '../../../../components/forms'
import { Modal } from '../../../../components/singles'
import Pagination from "react-js-pagination";
const $ = require('jquery');
class LeadInfo extends Component {
    state = {
        tipo: '',
        modal: {
            presupuesto: false,
        },
        messages: [],
        form: {
            name: '',
            empresa: '',
            empresa_dirigida: '',
            tipoProyecto: '',
            comentario: '',
            diseño: '',
            obra: '',
            email: '',
            tipoProyectoNombre: '',
            origen: '',
            telefono: '',
            proyecto: '',
            fecha: '',
        },
        formHistorial: {
            comentario: '',
            fechaContacto: '',
            success: 'Contactado',
            tipoContacto: '',
            newTipoContacto: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            }
        },
        formAgenda: {
            fecha: new Date(),
            hora_inicio: '08',
            minuto_inicio: '00',
            hora_final: '08',
            minuto_final: '15',
            cliente: '',
            tipo: 0,
            origen: 0,
            proyecto: '',
            empresa: 0,
            estatus: 0,
            correos: [],
            correo: '',
            lugar: 'presencial',
            url: '',
            ubicacion: '',
            si_empresa: '',
            no_empresa: '',
            cita_empresa: 'si_empresa'
        },
        formDiseño: {
            m2: '',
            tipo_partida: '',
            esquema: 'esquema_1',
            fecha: new Date(),
            tiempo_ejecucion_diseno: '',
            tiempo_ejecucion_construccion: 0,
            descuento: 0.0,
            conceptos: [
                {
                    value: '',
                    text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                    name: 'concepto1'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                    name: 'concepto2'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                    name: 'concepto3'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto4'
                },
                {
                    value: '',
                    text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO ,MODELO 3D Y V.º B.º DE DISEÑO ',
                    name: 'concepto5'
                },
                {
                    value: '',
                    text: 'DESARROLLO DEL PROYECTO',
                    name: 'concepto6'
                },
                {
                    value: '',
                    text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                    name: 'concepto7'
                },
            ],
            construccion_interiores_inf: '',
            construccion_interiores_sup: '',
            mobiliario_inf: '',
            mobiliario_sup: '',
            construccion_civil_inf: '',
            construccion_civil_sup: '',
            semanas: [
                {
                    lunes: false,
                    martes: false,
                    miercoles: false,
                    jueves: false,
                    viernes: false,
                    sabado: false,
                    domingo: false
                }
            ],
            partidas: [],
            planos: [],
            subtotal: 0.0,
            fase1: true,
            fase2: true,
            renders: ''
        },
        // tipo: '',
        options: {
            empresas: [],
            tipos: [],
            origenes: [],
            tiposContactos: [],
            precios: [],
            esquemas: []
        },
        formeditado: 0,
        showForm: false,
        showAgenda: false,
        data: {
            empresa: null,
            tipoProyecto: null,
            partidas: null
        },
        lead: '',
        itemsPerPage: 5,
        activePage: 1
    }

    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm,
            showAgenda: false
        })
    }
    mostrarAgenda() {
        const { showAgenda } = this.state
        this.setState({
            ...this.state,
            showAgenda: !showAgenda,
            showForm: false
        })
    }
    componentDidMount() {
        const { location: { state } } = this.props
        const { history } = this.props
        if (state) {
            if (state.lead) {
                const { form, options, formDiseño } = this.state
                const { lead, tipo } = state
                form.name = lead.nombre === 'SIN ESPECIFICAR' ? '' : lead.nombre.toUpperCase()
                form.email = lead.email.toUpperCase()
                form.telefono = lead.telefono
                form.proyecto = lead.prospecto?lead.prospecto.nombre_proyecto:''
                form.fecha = new Date(lead.created_at)
                
                if(formDiseño.esquema === 'esquema_1'){
                    formDiseño.tiempo_ejecucion_diseno = 7
                    formDiseño.semanas = this.calculateSemanas(formDiseño.tiempo_ejecucion_diseno)
                    formDiseño.conceptos = [
                        {
                            value: '1',
                            text: 'VISITA A INSTALACIONES Y REUNIÓN DE AMBOS EQUIPOS',
                            name: 'concepto1'
                        },
                        {
                            value: '1 AL 2',
                            text: 'DESARROLLO DEL MATERIAL PARA LA PRIMERA REVISIÓN PRESENCIAL',
                            name: 'concepto2'
                        },
                        {
                            value: '3',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA PRIMERA REVISIÓN DE LA PROPUESTA DE DISEÑO Y MODELO 3D',
                            name: 'concepto3'
                        },
                        {
                            value: '3 AL 4',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto4'
                        },
                        {
                            value: '5',
                            text: 'JUNTA PRESENCIAL/REMOTA PARA SEGUNDA REVISIÓN DE LA PROPUESTA DE DISEÑO ,MODELO 3D Y V.º B.º DE DISEÑO ',
                            name: 'concepto5'
                        },
                        {
                            value: '5 AL 6',
                            text: 'DESARROLLO DEL PROYECTO',
                            name: 'concepto6'
                        },
                        {
                            value: '7',
                            text: 'ENTREGA FINAL DEL PROYECTO DIGITAL',
                            name: 'concepto7'
                        },
                    ]
                }
                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formeditado: 1,
                    options,
                    tipo: tipo,
                    formDiseño
                })
                this.getPresupuestoDiseñoOptionsAxios(lead.id)
                this.getOneLead(lead)
            }
            else
                history.push('/leads/crm')
        }
        else
            history.push('/leads/crm')
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, medios } = response.data
                const { options } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['tiposContactos'] = setOptions(medios, 'tipo', 'id')
                options.esquemas = setOptions([
                    { name: 'Esquema 1', value: 'esquema_1' },
                    { name: 'Esquema 2', value: 'esquema_2' },
                    { name: 'Esquema 3', value: 'esquema_3' },
                ], 'name', 'value')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getPresupuestoDiseñoOptionsAxios(id) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'crm/options/presupuesto-diseño/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresa, tipo, partidas } = response.data
                const { data, formDiseño } = this.state
                let planos = []

                data.empresa = empresa
                data.tipoProyecto = tipo
                data.partidas = partidas

                if (tipo) {
                    formDiseño.construccion_interiores_inf = tipo.construccion_interiores_inf
                    formDiseño.construccion_interiores_sup = tipo.construccion_interiores_sup
                    formDiseño.construccion_civil_inf = tipo.construccion_civil_inf
                    formDiseño.construccion_civil_sup = tipo.construccion_civil_sup
                    formDiseño.mobiliario_inf = tipo.mobiliario_inf
                    formDiseño.mobiliario_sup = tipo.mobiliario_sup
                }

                formDiseño.partidas = this.setOptionsCheckboxes(partidas, true)

                if (empresa)
                    empresa.planos.map((plano) => {
                        if (plano[formDiseño.esquema])
                            planos.push(plano)
                    })

                formDiseño.planos = this.setOptionsCheckboxes(planos, true)

                this.setState({
                    ...this.state,
                    data,
                    formDiseño
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401)
                    forbiddenAccessAlert();
                else
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeHistorial = e => {
        const { formHistorial } = this.state
        const { name, value } = e.target
        formHistorial[name] = value
        this.setState({
            ...this.state,
            formHistorial
        })
    }
    onChangeAgenda = e => {
        const { name, value } = e.target
        const { formAgenda } = this.state
        formAgenda[name] = value
        this.setState({
            ...this.state,
            formAgenda
        })
    }

    handleChangeCheckbox = (array, type) => {
        const { formDiseño } = this.state
        formDiseño[type] = array
        this.setState({
            ...this.state,
            formDiseño: formDiseño
        })
    }

    onChangePresupuesto = e => {
        const { name, value, type, checked } = e.target
        const { formDiseño, data } = this.state
        formDiseño[name] = value
        switch (name) {
            case 'esquema':
                // Tiempo de ejecución
                switch(value){
                    case 'esquema_1':
                        formDiseño.tiempo_ejecucion_diseno = 7
                        formDiseño.semanas = this.calculateSemanas(7)
                        break;
                    case 'esquema_2':
                        formDiseño.tiempo_ejecucion_diseno = 10
                        formDiseño.semanas = this.calculateSemanas(10)
                        break;
                    case 'esquema_3':
                        formDiseño.tiempo_ejecucion_diseno = 15
                        formDiseño.semanas = this.calculateSemanas(15)
                        break;
                    default:
                        break;
                }
                
                // Planos
                let planos = []
                if (data.empresa)
                    data.empresa.planos.map((plano) => {
                        if (plano[formDiseño.esquema])
                            planos.push(plano)
                    })
                formDiseño.planos = this.setOptionsCheckboxes(planos, true)

                // Conceptos
                formDiseño.conceptos.map((concepto) => {
                    switch(concepto.name){
                        case 'concepto1':
                            concepto.value = "1";
                            break;
                        case 'concepto2':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "1 AL 2"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "2 AL 3"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "2 AL 4"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto3':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "3"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "4"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "5"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto4':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "3 AL 4"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "6 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto5':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "5"
                                    break;
                                case 'esquema_2':
                                    concepto.value = "7"
                                    break;
                                case 'esquema_3':
                                    concepto.value = "10"
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto6':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "5 AL 6"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "8 AL 9"
                                    concepto.text = 'DESARROLLO DEL PROYECTO'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "11 AL 14"
                                    concepto.text = 'DESARROLLO DEL PROYECTO EJECUTIVO'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 'concepto7':
                            switch(value){
                                case 'esquema_1':
                                    concepto.value = "7"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_2':
                                    concepto.value = "10"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO DIGITAL'
                                    break;
                                case 'esquema_3':
                                    concepto.value = "15"
                                    concepto.text = 'ENTREGA FINAL DEL PROYECTO EJECUTIVO EN DIGITAL'
                                    break;
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    return false
                })
                break;
            case 'tiempo_ejecucion_diseno':
                formDiseño.semanas = this.calculateSemanas(value)
                break;
            default:
                break;
        }
        if (name === 'm2' || name === 'esquema')
            if (formDiseño.m2 && formDiseño.esquema) {
                formDiseño.subtotal = this.getSubtotal(formDiseño.m2, formDiseño.esquema)
            }
        if (formDiseño.subtotal > 0) {
            formDiseño.total = formDiseño.subtotal * (1 - (formDiseño.descuento / 100))
        }
        if (type === 'checkbox')
            formDiseño[name] = checked
        else
            formDiseño[name] = value

        switch (name) {
            case 'construccion_interiores_inf':
            case 'construccion_interiores_sup':
            case 'construccion_civil_inf':
            case 'construccion_civil_sup':
            case 'mobiliario_inf':
            case 'mobiliario_sup':
                formDiseño[name] = value.replace(/[,]/gi, '')
                break
            default:
                break;
        }
        this.setState({
            ...this.state,
            formDiseño
        })
    }
    calculateSemanas = tiempo => {
        let modulo = parseFloat(tiempo) % 5
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        let semanas = []
        for (let i = 0; i < Math.floor(parseFloat(tiempo) / 5); i++) {
            semanas.push({
                lunes: true,
                martes: true,
                miercoles: true,
                jueves: true,
                viernes: true,
                sabado: false,
                domingo: false
            })
        }
        semanas.push({
            lunes: false,
            martes: false,
            miercoles: false,
            jueves: false,
            viernes: false,
            sabado: false,
            domingo: false
        })
        aux.map((element, key) => {
            if (key < modulo) {
                semanas[semanas.length - 1][element] = true
            } else {
                semanas[semanas.length - 1][element] = false
            }
            return false
        })
        if (modulo > 2) {
            semanas.push({
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            })
        }
        return semanas
    }
    handleChange = (files, item) => {
        const { formHistorial } = this.state
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
        formHistorial['adjuntos'][item].value = files
        formHistorial['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            formHistorial
        })
    }

    removeCorreo = value => {
        const { formAgenda } = this.state
        let aux = []
        formAgenda.correos.map((correo, key) => {
            if (correo !== value) {
                aux.push(correo)
            }
            return false
        })
        formAgenda.correos = aux
        this.setState({
            ...this.state,
            formAgenda
        })
    }

    onChangeConceptos = (e, key) => {
        const { value } = e.target
        const { formDiseño } = this.state
        formDiseño.conceptos[key].value = value
        this.setState({
            ...this.state,
            formDiseño
        })
    }

    checkButtonSemanas = (e, key, dia) => {
        const { formDiseño } = this.state
        const { checked } = e.target
        formDiseño.semanas[key][dia] = checked
        let count = 0;
        let aux = Object.keys(
            {
                lunes: false,
                martes: false,
                miercoles: false,
                jueves: false,
                viernes: false,
                sabado: false,
                domingo: false
            }
        )
        formDiseño.semanas.map((semana) => {
            aux.map((element) => {
                if (semana[element])
                    count++;
                return false
            })
            return false
        })
        formDiseño.tiempo_ejecucion_diseno = count
        this.setState({
            ...this.state,
            formDiseño
        })
    }

    setOptionsCheckboxes = (partidas, value) => {
        let checkBoxPartida = []
        partidas.map((partida, key) => {
            checkBoxPartida.push({ checked: value, text: partida.nombre, id: partida.id, tipo: partida.tipo })
            return false
        })
        return checkBoxPartida
    }

    getSubtotal = (m2, esquema) => {

        if (m2 === '')
            return 0.0

        const { data } = this.state

        let precio_inicial = 0
        let incremento = 0
        let aux = false
        let limiteInf = 0.0
        let limiteSup = 0.0
        let m2Aux = parseInt(m2)
        let acumulado = 0
        let total = 0

        if (data.empresa)
            precio_inicial = data.empresa.precio_inicial_diseño
        else {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        if (data.empresa.variaciones.length === 0) {
            errorAlert('No fue posible calcular el total')
            return 0.0
        }

        switch (esquema) {
            case 'esquema_2':
                incremento = data.empresa.incremento_esquema_2 / 100;
                break
            case 'esquema_3':
                incremento = data.empresa.incremento_esquema_3 / 100;
                break
            default:
                incremento = 0
                break
        }

        data.empresa.variaciones.sort(function (a, b) {
            return parseInt(a.inferior) - parseInt(b.inferior)
        })

        limiteInf = parseInt(data.empresa.variaciones[0].inferior)
        limiteSup = parseInt(data.empresa.variaciones[data.empresa.variaciones.length - 1].superior)

        if (limiteInf <= m2Aux && limiteSup >= m2Aux) {
            data.empresa.variaciones.map((variacion, index) => {
                if (index === 0) {
                    acumulado = parseFloat(precio_inicial) - ((parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(precio_inicial) - ((parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                } else {
                    if (m2Aux >= parseInt(variacion.superior))
                        acumulado = parseFloat(acumulado) - ((parseInt(variacion.superior) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    else {
                        acumulado = parseFloat(acumulado) - ((parseInt(m2) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                    }
                    if (m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                        total = parseFloat(acumulado) * parseFloat(m2)
                }
            })

            return total = total * (1 + incremento)
        }

        if (limiteSup < m2Aux) {
            errorAlert('Los m2 no están considerados en los límites')
            return 0.0
        }

    }

    async agregarContacto() {
        waitAlert()
        const { lead, formHistorial } = this.state
        const { access_token } = this.props.authUser
        const data = new FormData();
        let aux = Object.keys(formHistorial)
        aux.map((element) => {
            switch (element) {
                case 'fechaContacto':
                    data.append(element, (new Date(formHistorial[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, formHistorial[element]);
                    break
            }
            return false
        })
        aux = Object.keys(formHistorial.adjuntos)
        aux.map((element) => {
            if (formHistorial.adjuntos[element].value !== '') {
                for (var i = 0; i < formHistorial.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, formHistorial.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, formHistorial.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'crm/contacto/lead/' + lead.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    formHistorial: this.clearForm(),
                    lead: lead
                })
                doneAlert('Historial actualizado con éxito');
                const { history } = this.props
                history.push({
                    pathname: '/leads/crm/info/info',
                    state: { lead: lead }
                });
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
    clearForm = () => {
        const { formHistorial } = this.state
        let aux = Object.keys(formHistorial)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    formHistorial[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                case 'success':
                    formHistorial[element] = 'Contactado'
                    break;
                default:
                    formHistorial[element] = ''
                    break;
            }
            return false
        })
        return formHistorial;
    }
    async agendarEvento() {
        const { lead, formAgenda } = this.state
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'crm/agendar/evento/' + lead.id, formAgenda, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                formAgenda.fecha = new Date()
                formAgenda.hora_inicio = '08'
                formAgenda.minuto_inicio = '00'
                formAgenda.hora_final = '08'
                formAgenda.minuto_final = '15'
                formAgenda.titulo = ''
                formAgenda.correo = ''
                formAgenda.correos = []
                formAgenda.lugar = 'presencial'
                formAgenda.ubicacion = ''
                formAgenda.url = ''
                this.setState({
                    ...this.state,
                    formAgenda,
                    modal: false
                })
                this.getOneLead(lead)
                doneAlert('Evento generado con éxito');
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
    openModalWithInput = (estatus, id) => {
        questionAlert2('ESCRIBE EL MOTIVO DEL RECHAZO O CANCELACIÓN', '', () => this.changeEstatusCanceladoRechazadoAxios({ id: id, estatus: estatus }),
            <div>
                <Form.Control
                    placeholder='MOTIVO DE RECHAZO'
                    className="form-control form-control-solid h-auto py-7 px-6 text-uppercase"
                    id='motivo'
                    as="textarea"
                    rows="3"
                />
            </div>
        )
    }

    async getOneLead(lead) {

        let { tipo } = this.state
        const { access_token } = this.props.authUser

        if (tipo === '')
            tipo = lead.estatus.estatus

        let api = ''

        if (lead.estatus.estatus === 'En proceso'){
            api = 'crm/table/lead-en-contacto/';
        }else if(lead.estatus.estatus === 'En negociación'){
            api = 'crm/table/lead-en-negociacion/';
        }else{
            api = 'crm/table/lead-detenido/';
        }
        // console.log(api)
        // console.log(lead, 'lead')
        // console.log(lead.id, 'lead.id')
        await axios.get(URL_DEV + api + lead.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                const { history } = this.props
                const { form, formDiseño, data } = this.state

                form.name = lead.nombre
                form.email = lead.email
                form.telefono = lead.telefono
                form.proyecto = lead.prospecto.nombre_proyecto
                form.fecha = new Date(lead.created_at)
                
                if (lead.presupuesto_diseño) {

                    formDiseño.fase1 = lead.presupuesto_diseño.fase1
                    formDiseño.fase2 = lead.presupuesto_diseño.fase2
                    formDiseño.renders = lead.presupuesto_diseño.renders

                    let aux = JSON.parse(lead.presupuesto_diseño.actividades)
                    if (aux) {
                        aux = aux.actividades
                        formDiseño.conceptos = aux
                    }

                    aux = JSON.parse(lead.presupuesto_diseño.semanas)
                    if (aux) {
                        aux = aux.semanas
                        formDiseño.semanas = aux
                    }

                    let planos = []
                    if (data.empresa)
                        data.empresa.planos.map((plano) => {
                            if (plano[lead.presupuesto_diseño.esquema])
                                planos.push(plano)
                        })
                    formDiseño.planos = this.setOptionsCheckboxes(planos, true)

                    aux = JSON.parse(lead.presupuesto_diseño.planos)
                    if (aux) {
                        aux = aux.planos
                        aux.map((element) => {
                            formDiseño.planos.map((plano) => {
                                if (plano.id.toString() === element.toString())
                                    plano.checked = true
                                else
                                    plano.checked = false
                            })
                        })
                    }

                    aux = JSON.parse(lead.presupuesto_diseño.planos)
                    if (aux) {
                        aux = aux.planos
                        formDiseño.planos.map((plano) => {
                            let bandera = false
                            aux.map((element) => {
                                if (plano.id.toString() === element.toString())
                                    bandera = true
                            })
                            plano.checked = bandera
                        })
                    }

                    aux = JSON.parse(lead.presupuesto_diseño.partidas)
                    if (aux) {
                        aux = aux.partidas
                        formDiseño.partidas.map((partida) => {
                            let bandera = false
                            aux.map((element) => {
                                if (partida.id.toString() === element.toString())
                                    bandera = true
                            })
                            partida.checked = bandera
                        })
                    }

                    formDiseño.construccion_civil_inf = lead.presupuesto_diseño.construccion_civil_inf
                    formDiseño.construccion_civil_sup = lead.presupuesto_diseño.construccion_civil_sup
                    formDiseño.construccion_interiores_inf = lead.presupuesto_diseño.construccion_interiores_inf
                    formDiseño.construccion_interiores_sup = lead.presupuesto_diseño.construccion_interiores_sup
                    formDiseño.mobiliario_inf = lead.presupuesto_diseño.mobiliario_inf
                    formDiseño.mobiliario_sup = lead.presupuesto_diseño.mobiliario_sup
                    formDiseño.tiempo_ejecucion_construccion = lead.presupuesto_diseño.tiempo_ejecucion_construccion
                    formDiseño.tiempo_ejecucion_diseno = lead.presupuesto_diseño.tiempo_ejecucion_diseño
                    formDiseño.m2 = lead.presupuesto_diseño.m2
                    formDiseño.fecha = new Date(lead.presupuesto_diseño.fecha)
                    formDiseño.total = lead.presupuesto_diseño.total
                    formDiseño.subtotal = lead.presupuesto_diseño.subtotal
                    formDiseño.esquema = lead.presupuesto_diseño.esquema
                    formDiseño.descuento = lead.presupuesto_diseño.descuento

                }

                this.setState({
                    ...this.state,
                    lead: lead,
                    form,
                    formDiseño
                })

                history.push({
                    state: { lead: lead }
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
    async changeEstatusCanceladoRechazadoAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        data.motivo = document.getElementById('motivo').value
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push('/leads/crm')
                doneAlert('El estatus fue actualizado con éxito.')
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
    async changeEstatusAxios(data) {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'crm/lead/estatus/' + data.id, data, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push('/leads/crm')
                doneAlert('El estatus fue actualizado con éxito.')
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

    async eliminarContacto(contacto){
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.delete(URL_DEV + 'crm/prospecto/' + lead.id + '/contacto/' + contacto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Registro eliminado con éxito.');
                this.getOneLead(lead)
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

    changeEstatus = (estatus, id) => {
        questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios({ id: id, estatus: estatus }))
    }

    solicitarFechaCita = async () => {
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.put(URL_DEV + 'crm/email/lead-potencial/' + lead.id, {}, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Correo enviado con éxito');
                this.getOneLead(lead)
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

    sendCorreoPresupuesto = async (identificador) => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { lead } = this.state
        await axios.put(URL_DEV + 'crm/email/envio-cotizacion/' + lead.id, { identificador: identificador }, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                doneAlert('Correo enviado con éxito')
                history.push({
                    pathname: '/leads/crm'
                });
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

    submitForm = e => {
        this.addLeadInfoAxios()
    }

    async addLeadInfoAxios() {
        const { access_token } = this.props.authUser
        const { form, lead } = this.state
        await axios.put(URL_DEV + 'crm/update/lead-en-contacto/' + lead.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'Editaste con éxito el lead.')
                this.getOneLead(lead)
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

    onSubmitPDF = () => {
        this.onSubmitPresupuestoDiseñoAxios(true)
    }

    onSubmitPresupuestoDiseño = () => {
        this.onSubmitPresupuestoDiseñoAxios(false)
    }

    getTextAlert = url => {
        return (
            <div>
                <span className="text-dark-50 font-weight-bolder">
                    ¿Deseas mandar el
                    <u>
                        <a href={url} target='_blank' className='text-primary mx-2'>
                            presupuesto
                        </a>
                    </u>
                    al cliente?
                </span>
            </div>
        )
    }

    onClickSendPresupuesto = pdf => {
        questionAlert2('¡NO PODRÁS REVERTIR ESTO!', '',
            () => this.sendCorreoPresupuesto(pdf.pivot.identificador),
            this.getTextAlert(pdf.url)
        )
    }

    onSubmitPresupuestoDiseñoAxios = async (pdf) => {
        waitAlert();
        const { access_token } = this.props.authUser
        const { formDiseño, lead } = this.state
        formDiseño.pdf = pdf
        await axios.post(URL_DEV + 'crm/add/presupuesto-diseño/' + lead.id, formDiseño, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                if (formDiseño.pdf) {
                    const { presupuesto } = response.data
                    if (presupuesto)
                        if (presupuesto.pdfs)
                            if (presupuesto.pdfs[0])
                                if (presupuesto.pdfs[0].pivot) {
                                    Swal.close()
                                    questionAlert2('¡NO PODRÁS REVERTIR ESTO!', '',
                                        () => this.sendCorreoPresupuesto(presupuesto.pdfs[0].pivot.identificador),
                                        this.getTextAlert(presupuesto.pdfs[0].url)
                                    )
                                }
                }
                else
                    doneAlert('Presupuesto generado con éxito')
                this.getOneLead(lead)
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
    openModalPresupuesto = () => {
        const { modal } = this.state
        modal.presupuesto = true
        this.setState({
            ...this.state,
            modal
        })
    }
    handleCloseModalPresupuesto = () => {
        const { modal } = this.state
        modal.presupuesto = false
        this.setState({
            ...this.state,
            modal
        })
    }
    tagInputChange = (nuevosCorreos) => {
        const uppercased = nuevosCorreos.map(tipo => tipo.toUpperCase());
        const { formAgenda } = this.state
        let unico = {};
        uppercased.forEach(function (i) {
            if (!unico[i]) { unico[i] = true }
        })
        formAgenda.correos = uppercased ? Object.keys(unico) : [];
        this.setState({
            formAgenda
        })
    }
    onChangePage(pageNumber){
        let { activePage } = this.state
        activePage = pageNumber
        this.setState({
            ...this.state,
            activePage
        })
    }
    componentDidUpdate(){
        $(".pagination").removeClass("page-link");
    }
    render() {
        const { lead, form, formHistorial, options, formAgenda, formDiseño, modal, formeditado, itemsPerPage, activePage } = this.state
        // console.log(lead)
        return (
            <Layout active={'leads'}  {...this.props} botonHeader={this.botonHeader} >
                <Tab.Container defaultActiveKey="2" className="p-5">
                    <Row>
                        <Col md={12} className="mb-3">
                            <Card className="card-custom gutter-b">
                                <Card.Body className="p-2">
                                    <div className="d-flex">
                                        {
                                            lead ?
                                                <>
                                                    <div className="d-flex align-items-center flex-wrap justify-content-between col-md-12">
                                                        <div className="font-weight-bold text-dark-50 py-1">
                                                            <div className="d-flex align-items-center ">
                                                                <div className="symbol symbol-75">
                                                                    <span className="symbol-label font-weight-bolder font-size-h2">{lead.nombre.charAt(0)}</span>
                                                                </div>
                                                                <div className="d-flex flex-column font-weight-bold ml-2">
                                                                    <div>
                                                                        <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3 text-center ">{lead.nombre}
                                                                            {/* <span className="ml-3">
                                                                                <Button
                                                                                    icon=''
                                                                                    className="btn btn-light-success p-1"
                                                                                    only_icon="fab fa-whatsapp pr-0"
                                                                                    tooltip={{ text: 'CONTACTAR POR WHATSAPP' }}
                                                                                />
                                                                            </span> */}
                                                                            <span className="ml-3">
                                                                                {
                                                                                    lead ?
                                                                                        lead.prospecto?
                                                                                            lead.prospecto.estatus_prospecto ?
                                                                                                <Dropdown>
                                                                                                    <Dropdown.Toggle
                                                                                                        style={
                                                                                                            {
                                                                                                                backgroundColor: lead.prospecto.estatus_prospecto.color_fondo, color: lead.prospecto.estatus_prospecto.color_texto, border: 'transparent', padding: '0.15rem 0.75rem',
                                                                                                                width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem',
                                                                                                                fontWeight: 600
                                                                                                            }}>
                                                                                                        {lead.prospecto.estatus_prospecto.estatus.toUpperCase()}
                                                                                                    </Dropdown.Toggle>
                                                                                                    <Dropdown.Menu className="p-0" >
                                                                                                        <Dropdown.Header>
                                                                                                            <span className="font-size-sm">Elige una opción</span>
                                                                                                        </Dropdown.Header>
                                                                                                        <Dropdown.Item href="#" className="p-0" onClick={(e) => { e.preventDefault(); this.changeEstatus('Detenido', lead.id) }} >
                                                                                                            <span className="navi-link w-100">
                                                                                                                <span className="navi-text">
                                                                                                                    <span className="label label-xl label-inline bg-light-gray text-gray rounded-0 w-100">DETENIDO</span>
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </Dropdown.Item>
                                                                                                        <Dropdown.Item className="p-0" onClick={(e) => { e.preventDefault(); this.openModalWithInput('Rechazado', lead.id) }} >
                                                                                                            <span className="navi-link w-100">
                                                                                                                <span className="navi-text">
                                                                                                                    <span className="label label-xl label-inline label-light-danger rounded-0 w-100">Rechazado</span>
                                                                                                                </span>
                                                                                                            </span>
                                                                                                        </Dropdown.Item>
                                                                                                    </Dropdown.Menu>
                                                                                                </Dropdown>
                                                                                            : ''
                                                                                        : ''
                                                                                    : ''
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap mt-2 mb-1">
                                                                        <a href={`mailto:+${lead.email}`} className="text-muted text-hover-primary font-weight-bold mr-4">
                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Mail-notification.svg')} />
                                                                            </span>{lead.email}
                                                                        </a>
                                                                        <a href={`tel:+${lead.telefono}`} className="text-muted text-hover-primary font-weight-bold mr-4">
                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Active-call.svg')} />
                                                                            </span>{lead.telefono}
                                                                        </a>
                                                                    </div>
                                                                    <div className="d-flex flex-wrap mt-0 mb-2">
                                                                        <div className="text-muted text-hover-primary font-weight-bold mr-4">
                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Building.svg')} />
                                                                            </span>{lead.empresa.name}
                                                                        </div>
                                                                        <div className="text-muted text-hover-primary font-weight-bold">
                                                                            <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                <SVG src={toAbsoluteUrl('/images/svg/Mail-heart.svg')} />
                                                                            </span>{lead.origen.origen}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-wrap align-items-end py-2">
                                                            <div className="d-flex align-items-center">
                                                                <Nav className="navi navi-bold navi-hover navi-active navi-link-rounded d-inline-flex d-flex justify-content-center">
                                                                    <Nav.Item className="navi-item mr-3">
                                                                        <Nav.Link className="navi-link px-2" eventKey="1" style={{ display: '-webkit-box' }}>
                                                                            <span className="navi-icon mr-2">
                                                                                <span className="svg-icon">
                                                                                    <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                                                </span>
                                                                            </span>
                                                                            <div className="navi-text">
                                                                                <span className="d-block font-weight-bold">Información general</span>
                                                                            </div>
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item className="navi-item mr-3">
                                                                        <Nav.Link className="navi-link px-2" eventKey="2" style={{ display: '-webkit-box' }}>
                                                                            <span className="navi-icon mr-2">
                                                                                <span className="svg-icon">
                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Group-chat.svg')} />
                                                                                </span>
                                                                            </span>
                                                                            <div className="navi-text">
                                                                                <span className="d-block font-weight-bold">Historial de contacto</span>
                                                                            </div>
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                    <Nav.Item className="navi-item">
                                                                        <Nav.Link className="navi-link px-2" eventKey="3" style={{ display: '-webkit-box' }}>
                                                                            <span className="navi-icon mr-2">
                                                                                <span className="svg-icon">
                                                                                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                                                </span>
                                                                            </span>
                                                                            <div className="navi-text">
                                                                                <span className="d-block font-weight-bold">Presupuesto de diseño</span>
                                                                            </div>
                                                                        </Nav.Link>
                                                                    </Nav.Item>
                                                                </Nav>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : ''
                                        }
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={12} className="mb-3">
                            <Card className="card-custom card-stretch">
                                <Tab.Content>
                                    <Tab.Pane eventKey="1">
                                        <Card.Header className="align-items-center border-0 mt-4 pt-3 pb-0">
                                            <Card.Title>
                                                <h3 className="card-title align-items-start flex-column">
                                                    <span className="font-weight-bolder text-dark">Información general</span>
                                                </h3>
                                            </Card.Title>
                                        </Card.Header>
                                        <Card.Body className="py-0">
                                            <InformacionGeneral
                                                form={form}
                                                onChange={this.onChange}
                                                onSubmit={this.submitForm}
                                                user={this.props.authUser.user}
                                                lead={lead}
                                                formeditado={formeditado}
                                            />
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="2">
                                        <Card.Header className="border-0 mt-4 pt-3">
                                            <h3 className="card-title d-flex justify-content-between">
                                                <span className="font-weight-bolder text-dark align-self-center">Historial de contacto</span>
                                                <div className="text-center">
                                                    <Button
                                                        id={"solicitar_cita"}
                                                        icon=''
                                                        className={"btn btn-icon btn-xs w-auto p-3 btn-light-gray mr-2 mt-2"}
                                                        // onClick={() => { waitAlert(); this.solicitarFechaCita() }}
                                                        onClick={(e) => { questionAlert('¿ESTÁS SEGURO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.solicitarFechaCita()) }}
                                                        only_icon={"far fa-calendar-check icon-15px mr-2"}
                                                        text='SOLICITAR CITA'
                                                    />
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-primary mr-2 mt-2"}
                                                        onClick={() => { this.mostrarAgenda() }}
                                                        only_icon={"flaticon2-calendar-2 icon-md"}
                                                        tooltip={{ text: 'AGENDAR CITA' }}
                                                    />
                                                    <Button
                                                        icon=''
                                                        className={"btn btn-icon btn-xs p-3 btn-light-success mr-2 mt-2"}
                                                        onClick={() => { this.mostrarFormulario() }}
                                                        only_icon={"flaticon2-plus icon-13px"}
                                                        tooltip={{ text: 'AGREGAR NUEVO CONTACTO' }}
                                                    />
                                                </div>
                                            </h3>
                                        </Card.Header>
                                        <Card.Body className="d-flex justify-content-center pt-0 row">
                                            <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                                                <HistorialContactoForm
                                                    options={options}
                                                    formHistorial={formHistorial}
                                                    onChangeHistorial={this.onChangeHistorial}
                                                    handleChange={this.handleChange}
                                                    onSubmit={() => { waitAlert(); this.agregarContacto() }} />
                                            </div>
                                            <div className={this.state.showAgenda ? 'col-md-12 mb-5' : 'd-none'}>
                                                <AgendarCitaForm
                                                    formAgenda={formAgenda}
                                                    onChange={this.onChangeAgenda}
                                                    removeCorreo={this.removeCorreo}
                                                    // solicitarFechaCita={() => { waitAlert(); this.solicitarFechaCita() }}
                                                    onSubmit={() => { waitAlert(); this.agendarEvento() }}
                                                    tagInputChange={(e) => this.tagInputChange(e)}
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                {
                                                    lead ?
                                                        lead.prospecto ?
                                                            lead.prospecto.contactos.length === 0 ?
                                                                <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                                            :
                                                                lead.prospecto.contactos.map((contacto, key) => {
                                                                    let limiteInferior = (activePage - 1) * itemsPerPage
                                                                    let limiteSuperior = limiteInferior + (itemsPerPage - 1)
                                                                    if(contacto.length < itemsPerPage || ( key >= limiteInferior && key <= limiteSuperior))
                                                                        return(
                                                                            <div className="timeline timeline-6" key={key}>
                                                                                <div className="timeline-items">
                                                                                    <div className="timeline-item">
                                                                                        <div className={contacto.success ? "timeline-media bg-light-success" : "timeline-media bg-light-danger"}>
                                                                                            <span className={contacto.success ? "svg-icon svg-icon-success svg-icon-md" : "svg-icon svg-icon-danger  svg-icon-md"}>
                                                                                                {
                                                                                                    contacto.tipo_contacto ?
                                                                                                        contacto.tipo_contacto.tipo === 'Llamada' ?
                                                                                                            <SVG src={toAbsoluteUrl('/images/svg/Outgoing-call.svg')} />
                                                                                                            : contacto.tipo_contacto.tipo === 'Correo' ?
                                                                                                                <SVG src={toAbsoluteUrl('/images/svg/Outgoing-mail.svg')} />
                                                                                                                : contacto.tipo_contacto.tipo === 'VIDEO LLAMADA' ?
                                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Video-camera.svg')} />
                                                                                                                    : contacto.tipo_contacto.tipo === 'Whatsapp' ?
                                                                                                                        <i className={contacto.success ? "socicon-whatsapp text-success icon-16px" : "socicon-whatsapp text-danger icon-16px"}></i>
                                                                                                                        : contacto.tipo_contacto.tipo === 'TAWK TO ADS' ?
                                                                                                                            <i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"}></i>
                                                                                                                            : contacto.tipo_contacto.tipo === 'REUNIÓN PRESENCIAL' ?
                                                                                                                                <i className={contacto.success ? "fas fa-users text-success icon-16px" : "fas fa-users text-danger icon-16px"}></i>
                                                                                                                                : contacto.tipo_contacto.tipo === 'Visita' ?
                                                                                                                                    <i className={contacto.success ? "fas fa-house-user text-success icon-16px" : "fas fa-house-user text-danger icon-16px"}></i>
                                                                                                                                        :contacto.tipo_contacto.tipo === 'TAWK TO ORGANICO' ?
                                                                                                                                            <i className={contacto.success ? "fas fa-dove text-success icon-16px" : "fas fa-dove text-danger icon-16px"}></i>
                                                                                                                                            : <i className={contacto.success ? "fas fa-mail-bulk text-success icon-16px" : "fas fa-mail-bulk text-danger icon-16px"}></i>
                                                                                                        : ''
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className={contacto.success ? "timeline-desc timeline-desc-light-success" : "timeline-desc timeline-desc-light-danger"}>
                                                                                            <span className={contacto.success ? "font-weight-bolder text-success" : "font-weight-bolder text-danger"}>{setDateTableLG(contacto.created_at)}</span>
                                                                                            <div className="font-weight-light pb-2 text-justify position-relative mt-2 pr-3" style={{ borderRadius: '0.42rem', padding: '1rem 1.5rem', backgroundColor: '#F3F6F9' }}>
                                                                                                <div className="text-dark-75 font-weight-bold mb-2">
                                                                                                    <div className="d-flex justify-content-between">
                                                                                                        {contacto.tipo_contacto ? contacto.tipo_contacto.tipo : ''}
                                                                                                        <a className="text-muted text-hover-danger font-weight-bold a-hover"
                                                                                                            onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL CONTACTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.eliminarContacto(contacto)) }}>
                                                                                                            <i className="flaticon2-cross icon-xs" />
                                                                                                        </a>
                                                                                                    </div>
                                                                                                </div>
                                                                                                {contacto.comentario}
                                                                                                {
                                                                                                    contacto.adjunto ?
                                                                                                        <div className="d-flex justify-content-end">
                                                                                                            <a href={contacto.adjunto.url} target='_blank' rel="noopener noreferrer" className="text-muted text-hover-primary font-weight-bold">
                                                                                                                <span className="svg-icon svg-icon-md svg-icon-gray-500 mr-1">
                                                                                                                    <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                                                                                </span>VER ADJUNTO
                                                                                                            </a>
                                                                                                        </div>
                                                                                                        : ''
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )  
                                                                    return false
                                                                })
                                                            : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                                        : <div className="text-center text-dark-75 font-weight-bolder font-size-lg">No se ha registrado ningún contacto</div>
                                                }
                                                {
                                                    lead ? 
                                                        lead.prospecto ?
                                                            lead.prospecto.contactos.length > itemsPerPage ?
                                                                <div className="d-flex justify-content-center mt-4">
                                                                    <Pagination
                                                                        itemClass="page-item"
                                                                        linkClass="page-link"
                                                                        firstPageText = 'Primero'
                                                                        lastPageText = 'Último'
                                                                        activePage = { activePage }
                                                                        itemsCountPerPage = { itemsPerPage }
                                                                        totalItemsCount = { lead.prospecto.contactos.length }
                                                                        pageRangeDisplayed = { 5 }
                                                                        onChange={this.onChangePage.bind(this)}
                                                                        itemClassLast="d-none"
                                                                        itemClassFirst="d-none"
                                                                        prevPageText={<i className='ki ki-bold-arrow-back icon-xs'/>}
                                                                        nextPageText={<i className='ki ki-bold-arrow-next icon-xs'/>}
                                                                        linkClassPrev="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                        linkClassNext="btn btn-icon btn-sm btn-light-primary mr-2 my-1 pagination"
                                                                        linkClass="btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 pagination"
                                                                        activeLinkClass="btn btn-icon btn-sm border-0 btn-light btn-hover-primary active mr-2 my-1 pagination"
                                                                    />
                                                                </div>
                                                            : ''
                                                        : ''
                                                    : ''
                                                }
                                            </div>
                                        </Card.Body>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="3">
                                        <Card.Header className="border-0 mt-4 pt-3">
                                            <h3 className="card-title d-flex justify-content-between">
                                                <span className="font-weight-bolder text-dark align-self-center">Presupuesto de diseño</span>
                                                {
                                                    lead ?
                                                        lead.presupuesto_diseño ?
                                                            lead.presupuesto_diseño.pdfs ?
                                                                lead.presupuesto_diseño.pdfs.length ?
                                                                    <div>
                                                                        <Button
                                                                            icon=''
                                                                            className={"btn btn-icon btn-xs p-3 btn-light-primary mr-2"}
                                                                            onClick={() => { this.openModalPresupuesto() }}
                                                                            only_icon={"far fa-file-pdf icon-15px"}
                                                                            tooltip={{ text: 'COTIZACIONES GENERADAS' }}
                                                                        />
                                                                    </div>
                                                                    : ''
                                                                : ''
                                                            : ''
                                                        : ''
                                                }
                                            </h3>
                                        </Card.Header>
                                        <Card.Body className="pt-0">
                                            <PresupuestoDiseñoCRMForm
                                                options={options}
                                                formDiseño={formDiseño}
                                                onChange={this.onChangePresupuesto}
                                                onChangeConceptos={this.onChangeConceptos}
                                                checkButtonSemanas={this.checkButtonSemanas}
                                                onChangeCheckboxes={this.handleChangeCheckbox}
                                                onSubmit={this.onSubmitPresupuestoDiseño}
                                                submitPDF={this.onSubmitPDF}
                                                formeditado={formeditado}
                                            />
                                        </Card.Body>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card>
                        </Col>
                    </Row >
                </Tab.Container>
                <Modal title="Cotizaciones generadas" size={"lg"} show={modal.presupuesto} handleClose={this.handleCloseModalPresupuesto} >
                    {
                        lead ?
                            lead.presupuesto_diseño ?
                                lead.presupuesto_diseño.pdfs ?
                                    lead.presupuesto_diseño.pdfs.length ?
                                        <PresupuestoGenerado pdfs={lead.presupuesto_diseño.pdfs} onClick={this.onClickSendPresupuesto} />
                                        : ''
                                    : ''
                                : ''
                            : ''
                    }

                </Modal>
            </Layout >
        )
    }
}
const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadInfo)