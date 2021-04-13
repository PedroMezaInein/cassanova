import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { Modal, ModalDelete } from '../../../components/singles'
import { AvanceForm } from '../../../components/forms'
import axios from 'axios'
import { URL_DEV, PROYECTOS_COLUMNS, URL_ASSETS, TEL } from '../../../constants'
import { Small } from '../../../components/texts'
import { setTextTable, setArrayTable, setListTable, setLabelTableReactDom, setTextTableCenter, setDireccion, setTextTableReactDom, setDateTableReactDom, setArrayTableReactDom, setTagLabelProyectoReactDom} from '../../../functions/setters'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert, customInputAlert, questionAlert } from '../../../functions/alert'
import ItemSlider from '../../../components/singles/ItemSlider'
import { Nav, Tab, Col, Row, Card, Tabs, Dropdown } from 'react-bootstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { OneLead } from '../../../components/modal'
import Comentarios from '../../../components/forms/Comentarios'
import InformacionProyecto from '../../../components/cards/Proyectos/InformacionProyecto'
import moment from 'moment'
import { InputGray, RangeCalendarSwal, SelectSearchGray, InputPhoneGray } from '../../../components/form-components'
import { printSwalHeader } from '../../../functions/printers'
import { Update } from '../../../components/Lottie'
import { setOptions } from '../../../functions/setters'
const MySwal = withReactContent(Swal)
const $ = require('jquery');
class Proyectos extends Component {
    state = {
        proyectos: [],
        key: 'all',
        title: 'Nuevo proyecto',
        prospecto: '',
        proyecto: '',
        modal: false,
        modalDelete: false,
        modalAdjuntos: false,
        modalAvances: false,
        modalLead: false,
        modalComentarios: false,
        adjuntos: [],
        primeravista: true,
        defaultactivekey: "",
        showadjuntos: [
            {
                placeholder: 'Fotografías levantamiento',
                id: 'fotografias_levantamiento',
                value: '',
                files: []
            },
            {
                placeholder: 'Manuales de adaptación',
                id: 'manuales_de_adaptacion',
                value: '',
                files: []
            },
            {
                placeholder: 'Minutas',
                id: 'minutas',
                value: '',
                files: []
            },
            {
                placeholder: 'Oficios',
                id: 'oficios',
                value: '',
                files: []
            },
            {
                placeholder: 'Planos entregados por cliente',
                id: 'planos_entregados_por_cliente',
                value: '',
                files: []
            },
            {
                placeholder: 'Propuestas arquitectónicas preliminares',
                id: 'propuestas_arquitectonicas_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Referencias del diseño del proyecto',
                id: 'referencias_del_diseño_del_proyecto',
                value: '',
                files: []
            },
            {
                placeholder: 'Renders',
                id: 'renders',
                value: '',
                files: []
            },
            {
                placeholder: 'Sketch Up',
                id: 'sketch_up',
                value: '',
                files: []
            },
            {
                placeholder: 'Presupuestos preliminares',
                id: 'presupuestos_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Carta oferta',
                id: 'carta_oferta',
                value: '',
                files: []
            }
        ],
        data: {
            proyectos: []
        },
        formeditado: 0,
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
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
            correos: [],
            correo: '',
            comentario: '',
            adjuntos_grupo: [
                {
                    text: 'Inicio y planeación',
                    id: 'inicio_y_planeacion',
                    adjuntos: [
                        {
                            placeholder: 'Fotografías levantamiento',
                            id: 'fotografias_levantamiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Manuales de adaptación',
                            id: 'manuales_de_adaptacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas',
                            id: 'minutas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Oficios',
                            id: 'oficios',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos entregados por cliente',
                            id: 'planos_entregados_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Propuestas arquitectónicas preliminares',
                            id: 'propuestas_arquitectonicas_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Referencias del diseño del proyecto',
                            id: 'referencias_del_diseño_del_proyecto',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders',
                            id: 'renders',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up',
                            id: 'sketch_up',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos preliminares',
                            id: 'presupuestos_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carta oferta',
                            id: 'carta_oferta',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Ejecución de obra',
                    id: 'ejecucion_de_obra',
                    adjuntos: [
                        {
                            placeholder: 'Datos de cliente',
                            id: 'datos_de_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato cliente',
                            id: 'contrato_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato proveedores y contratistas',
                            id: 'contrato_proveedores_y_contratistas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Firmas de aprobación',
                            id: 'firmas_de_aprobacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte fotográfico de avance de obra',
                            id: 'reporte_fotografico_de_avance_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de materiales',
                            id: 'reporte_de_materiales',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de proyecto vs ejecutado',
                            id: 'reporte_de_proyecto_vs_ejecutado',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas de obra',
                            id: 'minutas_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuesto aprobado por cliente',
                            id: 'presupuesto_aprobado_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Programa de obra',
                            id: 'programa_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos durante obra',
                            id: 'planos_durante_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up aprobados',
                            id: 'sketch_up_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders aprobados',
                            id: 'renders_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estados de cuenta',
                            id: 'estados_de_cuenta',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estimaciones y cierre',
                            id: 'estimaciones_y_cierre',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fianzas y seguros',
                            id: 'fianzas_y_seguros',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Permisos de obra ante dependencias',
                            id: 'permisos_de_obra_ante_dependencias',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos extras',
                            id: 'presupuestos_extras',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Entrega',
                    id: 'entrega',
                    adjuntos: [
                        {
                            placeholder: 'Catálogo de conceptos ASBUILT',
                            id: 'catalogo_de_conceptos_asbuilt',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Consignas de matenimiento',
                            id: 'consignas_de_matenimiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos aprobados',
                            id: 'planos_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de los equipos',
                            id: 'garantia_de_los_equipos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de vicios ocultos',
                            id: 'garantia_de_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias de cálculo',
                            id: 'memorias_de_calculo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias descriptivas',
                            id: 'memorias_descriptivas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fichas técnicas',
                            id: 'fichas_tecnicas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Pruebas de instalaciones',
                            id: 'pruebas_de_instalaciones',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fotografías fin de obra',
                            id: 'fotografias_fin_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Acta de entrega',
                            id: 'acta_de_entrega',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carpeta de entrega ZIP',
                            id: 'carpeta_de_entrega_zip',
                            value: '',
                            files: []
                        },
                    ]
                },
                {
                    text: 'Mantenimiento',
                    id: 'mantenimiento',
                    adjuntos: [
                        {
                            placeholder: 'Fallas y reparaciones por vicios ocultos',
                            id: 'fallas_y_reparaciones_por_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento preventivo',
                            id: 'mantenimiento_preventivo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento correctivo',
                            id: 'mantenimiento_correctivo',
                            value: '',
                            files: []
                        },
                    ]
                },
            ],
            adjuntos: {
                image: {
                    value: '',
                    placeholder: 'Imagen',
                    files: []
                },
                avance: {
                    value: '',
                    placeholder: 'Avance',
                    files: []
                },
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                
            },
            avances: [
                {
                    descripcion: '',
                    avance: '',
                    adjuntos: {
                        value: '',
                        placeholder: 'Fotos del avance',
                        files: []
                    }
                }
            ],
            tipoProyecto:''
        },
        options: {
            clientes: [],
            empresas: [],
            colonias: [],
            tipos:[]
        },
        myBucket: '',
        tipo: ''
    }

    myBucket = ''

    seleccionaradj(adjuntos) {
        const { proyecto } = this.state;
        let newdefaultactivekey = "";
        for (var i = 0; i < adjuntos.length; i++) {
            var adjunto = adjuntos[i];
            if (proyecto[adjunto.id].length) {
                newdefaultactivekey = adjunto.id
                break;
            }
        }
        this.setState({
            ...this.state,
            primeravista: false,
            defaultactivekey: newdefaultactivekey,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const proyectos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        })
        if (!proyectos)
            history.push('/')
        const { search: queryString } = this.props.history.location
        if (queryString) {
            let id = parseInt( new URLSearchParams(queryString).get("id") )
            if(id){
                this.setState({ ...this.state, modalSee: true })
                this.getOneProyectoAxios(id)
            }
        }
    }
    updateActiveTabContainer = active => {
        this.setState({
            ...this.state,
            subActiveKey: active
        })
    }
    openModalDelete = proyecto => {
        this.setState({
            ...this.state,
            proyecto: proyecto,
            modalDelete: true
        })
    }
    changePageEdit = proyecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos/edit',
            state: { proyecto: proyecto }
        });
    }

    changePageRelacionar = proyecto => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/proyectos/relacionar',
            state: { proyecto: proyecto }
        });
    }

    openModalAvances = proyecto => {
        this.setState({
            ...this.state,
            modalAvances: true,
            title: 'Avances del proyecto',
            proyecto: proyecto,
            form: this.clearForm(),
            formeditado: 0,
        })
    }
    
    openModalSee = proyecto => {
        this.getOneProyectoAxios(proyecto.id)
    }
    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            proyecto: ''
        })
    }
    handleCloseLead = () => {
        this.setState({
            ...this.state,
            modalLead: false,
            lead: ''
        })
    }
    handleCloseComentarios = () => {
        this.setState({
            ...this.state,
            modalComentarios: false,
            proyecto: ''
        })
    }
    setAdjuntosSlider = proyecto => {
        let auxheaders = []
        let aux = []
        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: proyecto[element.name],
                form: element.form,
                url: ''
            })
            return false
        })
        return aux
    }
    handleCloseAvances = () => {
        const { modalAvances } = this.state
        this.setState({
            ...this.state,
            modalAvances: !modalAvances,
            form: this.clearForm(),
            proyecto: ''
        })
    }
    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            proyecto: '',
            prospecto: ''
        })
    }
    handleCloseAdjuntos = () => {
        const { modalAdjuntos } = this.state
        this.setState({
            ...this.state,
            modalAdjuntos: !modalAdjuntos,
            proyecto: '',
            prospecto: '',
            form: this.clearForm()
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
    onChangeAvance = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form['avances'][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeAdjuntoAvance = (e, key, name) => {
        const { form } = this.state
        const { files, value } = e.target
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
        form['avances'][key][name].value = value
        form['avances'][key][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onChangeAdjuntoGrupo = e => {
        const { form } = this.state
        const { files, value, name } = e.target
        let grupo = 0
        let adjunto = 0
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
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].value = value
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    clearFilesGrupo = (name, key) => {
        const { form } = this.state
        let aux = []
        let grupo = 0
        let adjunto = 0
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        for (let counter = 0; counter < form.adjuntos_grupo[grupo].adjuntos[adjunto].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos_grupo[grupo].adjuntos[adjunto].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos_grupo[grupo].adjuntos[adjunto].value = ''
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    clearFilesAvances = (name, key, _key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.avances[_key].adjuntos.files.length; counter++) {
            if (counter !== key) {
                aux.push(form.avances[_key].adjuntos.files[counter])
            }
        }
        if (aux.length < 1) {
            form.avances[_key].adjuntos.files = []
            form.avances[_key].adjuntos.value = ''
        }
        form.avances[_key].adjuntos.files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    addRowAvance = () => {
        const { form } = this.state
        form.avances.push(
            {
                descripcion: '',
                adjuntos: {
                    value: '',
                    placeholder: 'Fotos del avance',
                    files: []
                }
            }
        )
        this.setState({
            ...this.state,
            form
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'avances':
                    form[element] = [{
                        descripcion: '',
                        avance: '',
                        adjuntos: {
                            value: '',
                            placeholder: 'Fotos del avance',
                            files: []
                        }
                    }]
                    break;
                case 'adjuntos':
                    form[element] = {
                        image: {
                            value: '',
                            placeholder: 'Imagen',
                            files: []
                        },
                        avance: {
                            value: '',
                            placeholder: 'Avance',
                            files: []
                        },
                        adjunto_comentario: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        },
                    }
                    break;
                case 'adjuntos_grupo':
                    break;
                case 'correos':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            form.adjuntos[element].value = ''
            form.adjuntos[element].files = []
            return false
        })
        form.adjuntos_grupo.map((grupo) => {
            grupo.adjuntos.map((adjunto) => {
                adjunto.value = ''
                adjunto.files = []
                return false
            })
            return false
        })
        return form
    }
    deleteFile = element => {
        MySwal.fire({
            title: '¿DESEAS ELIMINAR EL ARCHIVO?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            reverseButtons: true,
            customClass: {
                content: 'd-none',
                confirmButton: 'btn-light-danger-sweetalert2',
                cancelButton:'btn-light-gray-sweetalert2'
            }
        }).then((result) => {
            if (result.value) {
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }

    handleChangeAvance = (files, item) => {
        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
    }
    
    handleChange = (files, item) => {
        this.onChangeAdjuntoGrupo({ target: { name: item, value: files, files: files } })
        MySwal.fire({
            title: '¿CONFIRMAS EL ENVIÓ DE ADJUNTOS?',
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ACEPTAR",
            cancelButtonText: "CANCELAR",
            reverseButtons: true,
            customClass: {
                content: 'd-none',
            }
        }).then((result) => {
            if (result.value) {
                waitAlert()
                this.addProyectoAdjuntoAxios(item)
            }
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
    onSubmitAvance = e => {
        e.preventDefault()
        waitAlert();
        this.addAvanceAxios()
    }
    onSubmitNewAvance = e => {
        e.preventDefault()
        waitAlert();
        this.addAvanceFileAxios()
    }

    safeDelete = (e) => () => {
        this.deleteProyectoAxios()
    }
    setProyectos = proyectos => {
        let aux = []
        proyectos.map((proyecto) => {
            aux.push({
                actions: this.setActions(proyecto),
                status: proyecto ? setLabelTableReactDom(proyecto.estatus, this.doubleClick, proyecto, 'status') : '',
                nombre: setTextTableReactDom(proyecto.nombre, this.doubleClick, proyecto, 'nombre', 'text-center'),
                cliente: setTagLabelProyectoReactDom(proyecto, proyecto.clientes, 'cliente', this.deleteElementAxios),
                tipo_proyecto: setTextTableReactDom(proyecto.tipo_proyecto?proyecto.tipo_proyecto.tipo:'Sin tipo de proyecto', this.doubleClick, proyecto, 'tipo_proyecto', 'text-center'),
                direccion: renderToString(setDireccion(proyecto)),
                contacto: setArrayTableReactDom(
                    [
                        { name: 'Nombre', text: proyecto.contacto },
                        { name: 'Teléfono', text: proyecto.numero_contacto, url: `tel:+${proyecto.numero_contacto}` }
                    ],'190px',  this.doubleClick, proyecto, 'contacto' ),
                empresa: renderToString(setTextTableCenter(proyecto.empresa ? proyecto.empresa.name : '')),
                porcentaje: renderToString(setTextTable(proyecto.porcentaje + '%')),
                fechaInicio: setDateTableReactDom(proyecto.fecha_inicio, this.doubleClick, proyecto, 'fecha_inicio', 'text-center'),
                fechaFin: proyecto.fecha_fin !== null ? setDateTableReactDom(proyecto.fecha_fin, this.doubleClick, proyecto, 'fecha_fin', 'text-center') : setTextTableCenter('Sin definir'),
                descripcion: setTextTableReactDom(proyecto.descripcion !== null ? proyecto.descripcion :'', this.doubleClick, proyecto, 'descripcion', 'text-justify'),
                adjuntos: renderToString(this.setAdjuntosTable(proyecto)),
                fases: renderToString(setListTable(this.setFasesList(proyecto), 'text')),
                id: proyecto.id
            })
            return false
        })
        return aux
    }
    deleteElementAxios = async(proyecto, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}/${tipo}/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'tipo_proyecto':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha_inicio':
            case 'fecha_fin':
                form.fechaInicio = new Date(data.fecha_inicio)
                form.fechaFin = new Date(data.fecha_fin)
                break
            case 'contacto':
                form.contacto = data.contacto
                form.numeroContacto = data.numero_contacto
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'status' &&
                    <>
                        {
                            data ?
                                data.estatus ?
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            style={
                                                {
                                                    backgroundColor: data.estatus.fondo, color: data.estatus.letra, border: 'transparent', padding: '0.4rem 0.75rem',
                                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem',
                                                    fontWeight: 600
                                                }}>
                                            {data.estatus.estatus.toUpperCase()}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="p-0" >
                                            <Dropdown.Header>
                                                <span className="font-size-sm">Elige una opción</span>
                                            </Dropdown.Header>
                                            <Dropdown.Item className="p-0" onClick={() => { this.changeEstatus('Detenido') }} >
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-danger rounded-0 w-100">DETENIDO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0" onClick={() => { this.changeEstatus('Terminado') }} >
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-primary rounded-0 w-100">TERMINADO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                            <Dropdown.Item className="p-0" onClick={() => { this.changeEstatus('En proceso') }} >
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline label-light-success rounded-0 w-100">EN PROCESO</span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    : ''
                                : ''
                                    }
                    </>
                }
                {
                    tipo === 'nombre' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }
                        />
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } letterCase = { false }
                        />
                }
                {
                    (tipo === 'fecha_inicio') || (tipo === 'fecha_fin') ?
                        <RangeCalendarSwal onChange = { this.onChangeRange } start = { form.fechaInicio } end = {form.fechaFin } />:<></>
                }
                {
                    tipo === 'tipo_proyecto' &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)}
                    />
                }
                {
                    tipo === 'contacto' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 0 } placeholder="NOMBRE DEL CONTACTO"
                            requirevalidation = { 0 }  value = { form.contacto } name = { 'contacto' } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />

                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="numeroContacto" value={form.numeroContacto} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'numeroContacto')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
            </div>,
            <Update />,
            () => { this.patchProyectos(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    changeEstatus = estatus =>  {
        estatus === 'Detenido'?
            questionAlert('¿ESTÁS SEGURO?', 'DETENDRÁS EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        : estatus === 'Terminado' ?
            questionAlert('¿ESTÁS SEGURO?', 'DARÁS POR TEMINADO EL PROYECTO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
        : 
            questionAlert('¿ESTÁS SEGURO?', 'EL PROYECTO ESTARÁ EN PROCESO ¡NO PODRÁS REVERTIR ESTO!', () => this.changeEstatusAxios(estatus))
    }
    async changeEstatusAxios(estatus){
        waitAlert()
        const { proyecto } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}proyectos/${proyecto.id}/estatus`,{estatus: estatus}, { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                doneAlert('Estado actualizado con éxito')
                const { history } = this.props
                history.push({
                    pathname: '/proyectos/proyectos'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'tipo_proyecto':
                return 'SELECCIONA EL TIPO DE PROYECTO'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ...this.state,
            form
        })
    }
    patchProyectos = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'fecha_inicio':
            case 'fecha_fin':
                value = {
                    fecha_inicio: form.fechaInicio,
                    fecha_fin: form.fechaFin
                }
                break;
            case 'contacto':
                value = { 
                    contacto: form.contacto,
                    numeroContacto: form.numeroContacto
                }
                break
            default:
                value = form[tipo]
                break
        }
        console.log(form, 'form')
        console.log(value, 'VALUE')
        /* waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/proyectos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                        break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        }) */
    }
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'tipo_proyecto':
                if(data.empresa)
                    if(data.empresa.tipos)
                        return setOptions(data.empresa.tipos, 'tipo', 'id')
                return []
            default: return []
        }
    }
    setFasesList = proyecto => {
        let aux = [];
        if(proyecto.fase1)
            aux.push({text: 'FASE 1'})
        if(proyecto.fase2)
            aux.push({text: 'FASE 2'})
        if(proyecto.fase3)
            aux.push({text: 'FASE 3'})
        if(proyecto.fase3 === 0 && proyecto.fase2 === 0 && proyecto.fase1=== 0)
            aux.push({text: 'SIN FASES'})
        return aux
    }
    setAdjuntosTable = proyecto => {
        return (
            <>
                {
                    proyecto.imagen ?
                        setArrayTable(
                            [
                                { name: 'Imagen', text: proyecto.imagen.name, url: proyecto.imagen.url }
                            ]
                        )
                        : ''
                }
                {
                    proyecto.adjuntos_count === 0 && !proyecto.imagen ?
                        <Small>
                            Sin adjuntos
                        </Small>
                    : ''
                }
            </>
        )
    }

    setActions = (proyecto) => {
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
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            },
            {
                text: 'Avances',
                btnclass: 'dark',
                iconclass: 'flaticon2-photo-camera',
                action: 'avances',
                tooltip: { id: 'avances', text: 'Avances' }
            }
        )
        if(proyecto.fase3 !== 1)
            aux.push({
                text: 'Contratar&nbsp;fases',
                btnclass: 'warning',
                iconclass: 'flaticon-tool',
                action: 'proyecto',
                tooltip: { id: 'fases', text: 'Contratar&nbsp;fases' }
            })
        if(proyecto.prospecto)
            aux.push({
                text: 'Información&nbsp;del&nbsp;lead',
                btnclass: 'primary',
                iconclass: 'flaticon2-website',
                action: 'lead',
                tooltip: { id: 'lead', text: 'Información&nbsp;del&nbsp;lead' }
            })
        aux.push({
            text: 'Comentarios',
            btnclass: 'info',
            iconclass: 'flaticon2-talk',
            action: 'comment',
            tooltip: { id: 'comment', text: 'Comentarios' }
        })
                
        return aux
    }

    openModalAdjuntos = async(proyecto) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                this.setState({
                    ...this.state,
                    modalAdjuntos: true,
                    proyecto: proyecto,
                    form: this.clearForm()
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalLead = async(proyecto) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/lead`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { lead } = response.data
                this.setState({
                    ...this.state,
                    modalLead: true,
                    lead: lead
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModalComment = async(proyecto) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/comentarios`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                Swal.close()
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    modalComentarios: true,
                    form: this.clearForm(),
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getOneProyectoAxios = async(id) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                this.setState({...this.state, proyecto: proyecto, modalSee: true,})
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const url = URL_ASSETS + '/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre + '.zip'); //or any other extension
                document.body.appendChild(link);
                link.click();
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteProyectoAxios() {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                        break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue eliminado con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false,
                    proyecto: ''
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deleteAdjuntoAxios(id) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id + '/adjunto/' + id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyecto } = response.data
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                        break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    adjuntos: this.setAdjuntosSlider(proyecto)
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addAvanceAxios() {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'semana':
                    data.append(element, form[element])
                    break;
                case 'avances':
                    break;
                case 'correos':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    break
            }
            return false
        })
        form.avances.map((avance, key) => {
            if (avance.adjuntos.value !== '') {
                for (var i = 0; i < avance.adjuntos.files.length; i++) {
                    data.append(`files_name[]`, avance.adjuntos.files[i].name)
                    data.append(`files[]`, avance.adjuntos.files[i].file)
                    data.append(`files_descripcion[]`, avance.descripcion)
                    data.append(`files_avance[]`, avance.avance)
                }
            }
            return false
        })

        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/avances', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { avance, proyecto } = response.data
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                        break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')
                var win = window.open(avance.pdf, '_blank');
                win.focus();
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    form: this.clearForm(),
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addAvanceFileAxios() {
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'semana':
                    data.append(element, form[element])
                    break;
                default:
                    break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
            }
            return ''
        })
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/avances/file', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { avance, proyecto } = response.data
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                        break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El avance fue adjuntado con éxito.')
                var win = window.open(avance.pdf, '_blank');
                win.focus();
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    form: this.clearForm()
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addProyectoAdjuntoAxios(name) {

        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();
        data.append('tipo', name)
        let grupo = 0
        let adjunto = 0
        for (let i = 0; i < form.adjuntos_grupo.length; i++) {
            for (let j = 0; j < form.adjuntos_grupo[i].adjuntos.length; j++) {
                if (form.adjuntos_grupo[i].adjuntos[j].id === name) {
                    grupo = i;
                    adjunto = j;
                }
            }
        }
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files.map((file) => {
            data.append(`files_name_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.name)
            data.append(`files_${form.adjuntos_grupo[grupo].adjuntos[adjunto].id}[]`, file.file)
            return false
        })
        
        /*
        form.adjuntos_grupo[grupo].adjuntos[adjunto].files.map((file)=>{
            const params = {
                ACL: 'public-read',
                Key: file.file.name,
                ContentType: file.file.type,
                Body: file.file,
                CrossOrigin: '*'
            }
            myBucket.putObject(params)
                .on('httpUploadProgress', (evt) => {})
                .send((err)=>{
                    if(err)
                        console.log(err, 'error')
                })
        }) */
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}`}, 
                maxContentLength: 100000000,
                maxBodyLength: 1000000000
            } ).then(
            (response) => {
                const { proyecto } = response.data
                const { key } = this.state
                switch(key){
                    case 'all':
                        this.getProyectoAxios();
                        break;
                    case 'fase1':
                        this.getProyectoFase1Axios();
                        break;
                    case 'fase2':
                        this.getProyectoFase2Axios();
                        break;
                    case 'fase3':
                        this.getProyectoFase3Axios();
                    break;
                    default: break;
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    adjuntos: this.setAdjuntosSlider(proyecto),
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    sendMail = avance => {
        waitAlert();
        this.sendMailAvanceAxios(avance);
    }
    async sendMailAvanceAxios(avance) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        await axios.get(URL_DEV + 'proyectos/' + proyecto.id + '/avances/' + avance, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue editado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProyectoAxios() {
        $('#proyecto').DataTable().ajax.reload();
    }

    async getProyectoFase1Axios() {
        $('#proyecto_fase1').DataTable().ajax.reload();
    }
    async getProyectoFase2Axios() {
        $('#proyecto_fase2').DataTable().ajax.reload();
    }
    async getProyectoFase3Axios() {
        $('#proyecto_fase3').DataTable().ajax.reload();
    }

    controlledTab = value => {
        switch(value){
            case 'all':
                this.getProyectoAxios();
                break;
            case 'fase1':
                this.getProyectoFase1Axios();
                break;
            case 'fase2':
                this.getProyectoFase2Axios();
                break;
            case 'fase3':
                this.getProyectoFase3Axios();
                break;
            default: break;
        }
        this.setState({
            ...this.state,
            key: value
        })
    }

    hasLead = () => {
        const { proyecto } = this.state
        if(proyecto)
            if(proyecto.prospecto)
                if(proyecto.prospecto.lead)
                    return true
        return false
    }

    addComentarioAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, proyecto } = this.state
        const data = new FormData();

        form.adjuntos.adjunto_comentario.files.map(( adjunto) => {
            data.append(`files_name_adjunto[]`, adjunto.name)
            data.append(`files_adjunto[]`, adjunto.file)
            return ''
        })

        data.append(`comentario`, form.comentario)
        await axios.post(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/comentarios`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert('Comentario agregado con éxito');
                const { proyecto } = response.data
                const { form } = this.state
                form.comentario = ''
                form.adjuntos.adjunto_comentario = {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
                this.setState({ ...this.state, form, proyecto: proyecto })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    printDates = dato => {
        let fechaInicio = ''
        let fechaFin = ''
        if(dato.fecha_fin === null){
            fechaInicio = moment(dato.fecha_inicio);
            fechaFin = moment(dato.fecha_inicio);
        }else{
            fechaInicio = moment(dato.fecha_inicio);
            fechaFin = moment(dato.fecha_fin);
        }
        let diffFechas = fechaFin.diff(fechaInicio, 'days')
        
        if(diffFechas === 0){
            return(
                <span>
                    {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}
                </span>
            )
        }else
            return(
                <span>
                    {fechaInicio.format('D')}/{fechaInicio.format('MM')}/{fechaInicio.format('YYYY')}  - {fechaFin.format('D')}/{fechaFin.format('MM')}/{fechaFin.format('YYYY')}
                </span>
            )
    }
    
    render() {
        const { modalDelete, modalAdjuntos, modalAvances, title, form, proyecto, formeditado, showadjuntos, primeravista, subActiveKey, defaultactivekey, modalSee, key, modalLead, lead, modalComentarios, tipo} = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <Tabs defaultActiveKey = 'all' activeKey = { key }
                    onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey = 'all' title = "Fases">
                        {
                            key === 'all' ?
                                <NewTableServerRender
                                    columns={PROYECTOS_COLUMNS}
                                    title='Proyectos'
                                    subtitle='Listado de proyectos'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/proyectos/proyectos/add'
                                    mostrar_acciones={true}
                                    actions={{
                                        'edit': { function: this.changePageEdit },
                                        'delete': { function: this.openModalDelete },
                                        'adjuntos': { function: this.openModalAdjuntos },
                                        'avances': { function: this.openModalAvances },
                                        'see': { function: this.openModalSee },
                                        'proyecto': { function: this.changePageRelacionar },
                                        'lead': { function: this.openModalLead },
                                        'comment': { function: this.openModalComment }
                                    }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setProyectos}
                                    urlRender={URL_DEV + 'proyectos/proyectos'}
                                    cardTable='cardTable'
                                    cardTableHeader='cardTableHeader'
                                    cardBody='cardBody'
                                    idTable='proyecto'
                                    isTab={true}
                                />
                            : ''
                        }
                    </Tab>
                    <Tab eventKey = 'fase1' title = "FASE 1">
                        {
                            key === 'fase1' ?
                                <NewTableServerRender
                                    columns={PROYECTOS_COLUMNS}
                                    title='Proyectos'
                                    subtitle='Listado de proyectos'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/proyectos/proyectos/add'
                                    mostrar_acciones={true}
                                    actions={{
                                        'edit': { function: this.changePageEdit },
                                        'delete': { function: this.openModalDelete },
                                        'adjuntos': { function: this.openModalAdjuntos },
                                        'avances': { function: this.openModalAvances },
                                        'see': { function: this.openModalSee },
                                        'proyecto': { function: this.changePageRelacionar },
                                        'lead': { function: this.openModalLead },
                                        'comment': { function: this.openModalComment }
                                    }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setProyectos}
                                    urlRender={URL_DEV + 'proyectos/proyectos/1'}
                                    cardTable='cardTable'
                                    cardTableHeader='cardTableHeader'
                                    cardBody='cardBody'
                                    idTable='proyecto_fase1'
                                    isTab={true}
                                />
                            : ''
                        }
                    </Tab>
                    <Tab eventKey = 'fase2' title = "FASE 2">
                        {
                            key === 'fase2' ?
                                <NewTableServerRender
                                    columns={PROYECTOS_COLUMNS}
                                    title='Proyectos'
                                    subtitle='Listado de proyectos'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/proyectos/proyectos/add'
                                    mostrar_acciones={true}
                                    actions={{
                                        'edit': { function: this.changePageEdit },
                                        'delete': { function: this.openModalDelete },
                                        'adjuntos': { function: this.openModalAdjuntos },
                                        'avances': { function: this.openModalAvances },
                                        'see': { function: this.openModalSee },
                                        'proyecto': { function: this.changePageRelacionar },
                                        'lead': { function: this.openModalLead },
                                        'comment': { function: this.openModalComment }
                                    }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setProyectos}
                                    urlRender={URL_DEV + 'proyectos/proyectos/2'}
                                    cardTable='cardTable'
                                    cardTableHeader='cardTableHeader'
                                    cardBody='cardBody'
                                    idTable='proyecto_fase2'
                                    isTab={true}
                                />
                            : ''
                        }
                    </Tab>
                    <Tab eventKey = 'fase3' title = "FASE 3">
                        {
                            key === 'fase3' ?
                                <NewTableServerRender
                                    columns={PROYECTOS_COLUMNS}
                                    title='Proyectos'
                                    subtitle='Listado de proyectos'
                                    mostrar_boton={true}
                                    abrir_modal={false}
                                    url='/proyectos/proyectos/add'
                                    mostrar_acciones={true}
                                    actions={{
                                        'edit': { function: this.changePageEdit },
                                        'delete': { function: this.openModalDelete },
                                        'adjuntos': { function: this.openModalAdjuntos },
                                        'avances': { function: this.openModalAvances },
                                        'see': { function: this.openModalSee },
                                        'lead': { function: this.openModalLead },
                                        'comentarios': { function: this.openModalComment },
                                    }}
                                    accessToken={this.props.authUser.access_token}
                                    setter={this.setProyectos}
                                    urlRender={URL_DEV + 'proyectos/proyectos/3'}
                                    cardTable='cardTable'
                                    cardTableHeader='cardTableHeader'
                                    cardBody='cardBody'
                                    idTable='proyecto_fase3'
                                    isTab={true}
                                />
                            : ''
                        }
                    </Tab>
                </Tabs>
                
                <ModalDelete title = "¿Estás seguro que deseas eliminar el proyecto?" show = { modalDelete } 
                    handleClose = { this.handleCloseDelete } onClick={(e) => { this.safeDelete(e)() }} />

                <Modal size="xl" title="Adjuntos del proyecto" show={modalAdjuntos} handleClose={this.handleCloseAdjuntos} >
                    <div className="p-2">
                        <Card className="card-custom card-without-box-shadown">
                            <Card.Header className="pl-0 pr-0 justify-content-start">
                                <div className="card-toolbar">
                                    <Nav as="ul" className="nav nav-bold nav-pills">
                                        {
                                            form.adjuntos_grupo.map((grupo, key) => {
                                                return (
                                                    <Nav.Item as="li" key={key}>
                                                        <Nav.Link data-toggle="tab" className={primeravista && key === 0 ? "active" : ""} eventKey={grupo.id} onClick={() => { this.seleccionaradj(grupo.adjuntos) }}>{grupo.text}</Nav.Link>
                                                    </Nav.Item>
                                                )
                                            })
                                        }
                                    </Nav>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Tab.Container id="left-tabs-example" activeKey={subActiveKey ? subActiveKey : defaultactivekey} defaultActiveKey={defaultactivekey}
                                    onSelect={(select) => { this.updateActiveTabContainer(select) }}>
                                    <Row>
                                        <Col md={4} className="navi navi-accent navi-hover navi-bold border-nav">
                                            <Nav variant="pills" className="flex-column navi navi-hover navi-active">
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Nav.Item className="navi-item" key={key}>
                                                                <Nav.Link className="navi-link" eventKey={adjunto.id}>
                                                                    <span className="navi-text">{adjunto.placeholder}</span>
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        )
                                                    })
                                                }
                                            </Nav>
                                        </Col>
                                        <Col md={8} className="align-self-center">
                                            <Tab.Content>
                                                {
                                                    showadjuntos.map((adjunto, key) => {
                                                        return (
                                                            <Tab.Pane key={key} eventKey={adjunto.id} className="">
                                                                <>
                                                                    {
                                                                        proyecto ?
                                                                            proyecto[adjunto.id] ?
                                                                                proyecto[adjunto.id].length ?
                                                                                    <div className="mt-2 d-flex justify-content-center">
                                                                                        <span className='btn btn-hover btn-text-success' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.id]) }}>
                                                                                            <i className="fas fa-file-archive"></i> Descargar ZIP
                                                                                        </span>
                                                                                    </div>
                                                                                    : ''
                                                                                : ''
                                                                            : ''
                                                                    }
                                                                    {
                                                                        proyecto ?
                                                                            proyecto[adjunto.id] ?
                                                                                <ItemSlider items={proyecto[adjunto.id]} handleChange={this.handleChange}
                                                                                    item={adjunto.id} deleteFile={this.deleteFile} />
                                                                                : ''
                                                                            : ''
                                                                    }
                                                                </>
                                                            </Tab.Pane>
                                                        )
                                                    })
                                                }
                                            </Tab.Content>
                                        </Col>
                                    </Row>
                                </Tab.Container>
                            </Card.Body>
                        </Card>
                    </div>
                </Modal>
                <Modal size="xl" title={title} show={modalAvances} handleClose={this.handleCloseAvances}>
                    <Tabs 
                        defaultActiveKey = "nuevo" 
                        className = "mt-4 nav nav-tabs justify-content-start nav-bold bg-gris-nav bg-gray-100">
                        <Tab eventKey = "nuevo" title = "Nuevo avance">
                            <AvanceForm
                                form = { form }
                                onChangeAvance = { this.onChangeAvance }
                                onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance }
                                clearFilesAvances = { this.clearFilesAvances }
                                addRowAvance = { this.addRowAvance }
                                onSubmit = { this.onSubmitAvance }
                                onChange = { this.onChange }
                                proyecto = { proyecto }
                                sendMail = { this.sendMail }
                                formeditado = { formeditado }
                            />
                        </Tab>
                        <Tab eventKey = "existente" title = "Cargar avance">
                            <AvanceForm
                                form = { form }
                                onChangeAvance = { this.onChangeAvance }
                                onChangeAdjuntoAvance = { this.onChangeAdjuntoAvance }
                                clearFilesAvances = { this.clearFilesAvances }
                                addRowAvance = { this.addRowAvance }
                                onSubmit = { this.onSubmitNewAvance }
                                onChange = { this.onChange }
                                proyecto = { proyecto }
                                sendMail = { this.sendMail }
                                handleChange = { this.handleChangeAvance }
                                formeditado = { formeditado }
                                isNew = { true }
                            />
                        </Tab>
                    </Tabs>
                    
                </Modal>
                <Modal size="lg" title="Proyecto" show={modalSee} handleClose={this.handleCloseSee} >
                    <InformacionProyecto proyecto={proyecto} printDates={this.printDates} tipo={tipo}/>
                </Modal>
                <Modal size = 'xl' title = 'Información del lead' show = { modalLead } handleClose = { this.handleCloseLead }>
                    {
                        lead ? <OneLead lead = { lead } />  : ''
                    }
                </Modal>
                <Modal size = 'lg' title = 'Comentarios' show = { modalComentarios } handleClose = { this.handleCloseComentarios }>
                    <Comentarios addComentario = { this.addComentarioAxios } form = { form } onChange = { this.onChange }
                        handleChange = { this.handleChangeComentario } proyecto = { proyecto } />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Proyectos);