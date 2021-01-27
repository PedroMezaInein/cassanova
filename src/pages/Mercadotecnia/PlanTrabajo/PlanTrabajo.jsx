import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños, setOptions } from '../../../functions/setters'
import { deleteAlert, errorAlert, forbiddenAccessAlert, waitAlert } from '../../../functions/alert'
import moment from 'moment'
import { Modal } from '../../../components/singles'
import PlanTrabajoForm from '../../../components/forms/mercadotecnia/PlanTrabajoForm';
import Swal from 'sweetalert2'
import { P } from '../../../components/texts'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

class PlanTrabajo extends Component {

    state = {
        modal: {
            form: false
        },
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date(),
            nombre: '',
            responsable: '',
            rol: '',
            descripcion: '',
            color: '',
            usuarios: [],
            rolTarget: {taget: '', value: ''},
            mostrarColor: false
        },
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        dias: this.diasEnUnMes(meses[new Date().getMonth()],new Date().getFullYear()),
        data: {
            empresas: []
        },
        options: {
            empresas:[],
            usuarios: [],
            roles: []
        },
        formeditado: false,
        evento: ''
    }

    componentDidMount() {
        const { mes, año } = this.state
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios(mes, año)
    }

    getContentAxios = async (mes, año) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}mercadotecnia/plan-trabajo?mes=${mes}&anio=${año}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { empresas, users, roles } = response.data
                const { data, modal, options } = this.state
                modal.form = false

                empresas.map((empresa) => {
                    empresa.datos = empresa.planes
                    let response = this.getRowspan(empresa.datos)
                    empresa.rowSpanSize = response.size
                    empresa.calendars = response.calendars
                })
                options.usuarios = []
                options.roles = []
                options.empresas = setOptions(empresas, 'name', 'id')
                users.map((user) => {
                    options.usuarios.push({
                        text: user.name,
                        value: user.id.toString(),
                        label: user.name
                    })
                })
                roles.map((rol) => {
                    options.roles.push({
                        text: rol.nombre,
                        value: rol.id,
                        label: rol.nombre
                    })
                })
                data.empresas = empresas
                Swal.close()
                this.setState({ ...this.state, data, mes: mes, año: año, dias: this.diasEnUnMes(mes, año), modal, form: this.clearForm(), options, evento: '' })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() }
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addPlanAxios = async() => {
        const { form } = this.state
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}mercadotecnia/plan-trabajo`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { mes, año } = this.state
                this.getContentAxios( mes, año )
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() }
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updatePlanoAxios = async() => {
        const { form, evento } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}mercadotecnia/plan-trabajo/${evento.id}`, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { mes, año } = this.state
                this.getContentAxios( mes, año )
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() }
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deletePlanAxios = async() => {
        const { evento } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}mercadotecnia/plan-trabajo/${evento.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { mes, año } = this.state
                this.getContentAxios( mes, año )
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() }
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    diasEnUnMes(mes, año) { return new Date(año, meses.indexOf(mes) + 1, 0).getDate(); }

    updateMes = value => { 
        const { año } = this.state
        this.getContentAxios( value, año )
    }

    updateAño = value => { 
        const { mes } = this.state
        this.getContentAxios( mes, value )
    }

    isActiveBackButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if (actualMonth === 0) {
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let minimoAño = _año
            if (_mes > 9)
                minimoAño = _año - 3;
            else
                minimoAño = _año - 4;
            if (año.toString() === minimoAño.toString())
                return false
        }
        return true
    }

    isActiveForwardButton = () => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        if (actualMonth === 11) {
            let _mes = new Date().getMonth()
            let _año = new Date().getFullYear()
            let maximoAño = _año
            if (_mes > 9)
                maximoAño = _año + 1;
            else
                maximoAño = _año;
            if (año.toString() === maximoAño.toString())
                return false
        }
        return true
    }

    changeMonth = (direction) => {
        const { mes, año } = this.state
        let actualMonth = meses.indexOf(mes)
        let newMonth = meses[actualMonth]
        let newYear = año
        if (direction === 'back') {
            if (actualMonth === 0) {
                newMonth = meses[11]
                newYear = (año - 1).toString() 
            } else {
                newMonth = meses[actualMonth - 1]
            }
        } else {
            if (actualMonth === 11) {
                newMonth = meses[0]
                newYear = (parseInt(año) + 1).toString() 
            } else {
                newMonth = meses[actualMonth + 1]
            }
        }

        this.getContentAxios(newMonth, newYear)
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ...this.state,
            modal,
            title: 'Agendar plan',
            form: this.clearForm(),
        })
    }

    deletePlanAlert = () => { deleteAlert( 'DESEAS ELIMINAR EL ELEMENTO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deletePlanAxios() ) }

    clickedEvent = evento => {
        const { modal, form } = this.state
        modal.form = true
        form.fechaInicio = moment(evento.fechaInicio)
        form.fechaFin = moment(evento.fechaFin)
        form.descripcion = evento.descripcion
        form.nombre = evento.nombre
        form.empresa = evento.empresa_id.toString()
        form.rol = evento.rol ? evento.rol.id : ''
        form.rolTarget = evento.rol ? { value: evento.rol.id.toString(), label: evento.rol.nombre, text: evento.rol.nombre } : { value: '', label: '', text: ''}
        form.usuarios = []
        evento.usuarios.map((user)=>{
            form.usuarios.push({
                value: user.id.toString(),
                text: user.name,
                target: user.name
            })
        })
        this.setState({...this.state,modal, form, formeditado: true, title: 'EDITAR PLAN DE TRABAJO', evento: evento })
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
                case 'usuarios':
                    form[element] = [];
                    break;
                default:
                    form[element] = '';
                    break;
            }
            return ''
        })
        return form
    }

    handleCloseForm = () => {
        const { modal } = this.state
        modal.form = false
        this.setState({
            ...this.state,
            modal,
            empresa: '',
            form: this.clearForm(),
            formeditado: false
        })
    }

    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.setState({
                form
            })
        })
    }

    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        options[arreglo] = aux
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
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
        form.rol = newValue.value
        form.rolTarget = nuevoValue
        this.setState({...this.state, form})
    }

    handleCreateOption = inputValue => {
        let { options, form } = this.state
        let newOption = {
            'label': inputValue,
            'value': inputValue,
            'text': inputValue,
        }
        options.roles.push(newOption)
        form.rolTarget = newOption
        form.rol = inputValue
        form.mostrarColor = true
        this.setState({ ...this.state, form, options });
    }

    onSubmit = e => {
        const { title } = this.state
        if(title === 'Agendar plan')
            this.addPlanAxios()
        else
            this.updatePlanoAxios()
    }

    getRowspan = datos => {
        const { dias } = this.state
        let arregloOfCalendars = [];
        let _arreglo = [];
        [...Array(dias)].map((unusedElement, key) => {
            _arreglo.push(null)
        })
        arregloOfCalendars.push(_arreglo)
        for(let z = 0; z < datos.length; z++){
            let dato = datos[z];
            let numeroFechaInicio = moment(datos[z].fechaInicio).date() - 1
            let numeroFechaFin = moment(datos[z].fechaFin).date() - 1
            let bandera = false;
            for(let x = 0; x < arregloOfCalendars.length; x++){
                if(arregloOfCalendars[x][numeroFechaInicio] === null){
                    arregloOfCalendars[x][numeroFechaInicio] = datos[z]
                    for(let y = numeroFechaInicio + 1; y <= numeroFechaFin; y++)
                        arregloOfCalendars[x][y] = 'filled';
                    bandera = true
                    x = arregloOfCalendars.length
                }
            }
            if(bandera === false){
                _arreglo = [];
                [...Array(dias)].map((unusedElement, key) => {
                    _arreglo.push(null)
                })
                arregloOfCalendars.push(_arreglo)
                arregloOfCalendars[arregloOfCalendars.length - 1][numeroFechaInicio] = dato
                for(let y = numeroFechaInicio + 1; y <= numeroFechaFin; y++) {
                    arregloOfCalendars[arregloOfCalendars.length - 1][y] = 'filled';
                }
            }
        }
        return { calendars: arregloOfCalendars, size: arregloOfCalendars.length}
    }

    printTd = (empresa, conteo, diaActual) => {

        if(empresa.calendars[conteo][diaActual] === null)
            return (
                <td key = {`td-${empresa.name}-conteo`}></td>
            )
        else{
            if(empresa.calendars[conteo][diaActual] === 'filled'){
                return (<></>)
            }else{
                if(empresa.calendars[conteo][diaActual]){
                    return (
                        <td key = {`td-${empresa.name}-conteo`} colSpan = {empresa.calendars[conteo][diaActual].duracion} 
                            className = 'text-center position-relative p-0 text-hover' 
                            onClick = { (e) => { e.preventDefault(); this.clickedEvent(empresa.calendars[conteo][diaActual]) } } 
                            >
                            <OverlayTrigger key={diaActual} overlay={
                                <Tooltip className="tool-calendar">
                                    <div className="tool-titulo text-white font-weight-bolder letter-spacing-0-4"style={{ backgroundColor: empresa.calendars[conteo][diaActual].rol.color }}>
                                        {empresa.calendars[conteo][diaActual].nombre}
                                    </div>
                                    <div className="p-2">
                                        <div className="tool-horario">
                                            <div className="p-3 text-justify">
                                                {empresa.calendars[conteo][diaActual].descripcion}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center flex-lg-fill my-1">
                                            <div className="symbol-group symbol-hover">
                                                {
                                                    empresa.calendars[conteo][diaActual].usuarios.map((user, index) => {
                                                        return(
                                                            <div className="symbol symbol-30 symbol-circle" data-toggle="tooltip">
                                                                <img alt="Pic" src = { user.avatar ? user.avatar : "/default.jpg" } />
                                                            </div> 
                                                        )       
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Tooltip>}>
                                <div className="text-truncate w-100 position-absolute text-white px-1 top-20 " 
                                    style={{ backgroundColor: empresa.calendars[conteo][diaActual].rol.color, borderRadius: '4px' }}>
                                    <span className="font-weight-bold letter-spacing-0-4 ">
                                        {empresa.calendars[conteo][diaActual].nombre}
                                    </span>
                                </div>
                            </OverlayTrigger>
                        </td>
                    )
                }
            }
        }
    }

    deleteOption = (option, arreglo) => {
        const { form, options } = this.state
        let aux = []
        form[arreglo].map((element, key) => {
            if (option.value.toString() !== element.value.toString())
                aux.push(element)
            else
                options[arreglo].push(element)
            return false
        })
        form[arreglo] = aux
        this.setState({
            ...this.state,
            options,
            form
        })
    }

    render() {
        const { mes, año, data, form, modal, title, options, dias, formeditado } = this.state
        return (
            <Layout active='mercadotecnia' {... this.props}>
                <Card className='card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar align-items-center">
                            <div className='mr-3 d-flex'>
                                <SelectSearchGray name='mes' options={getMeses()} value={mes} customdiv='mb-0'
                                    onChange={this.updateMes} iconclass="fas fa-calendar-day"
                                    messageinc="Incorrecto. Selecciona el mes." requirevalidation={1} />
                            </div>
                            <div className='mr-3 d-flex'>
                                <SelectSearchGray name='año' options={getAños()} customdiv='mb-0'
                                    value={año} onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day" />
                            </div>
                            <Button icon='' className='btn btn-light-success btn-sm font-weight-bold'
                                only_icon='flaticon2-writing pr-0 mr-2' text='AGENDAR PLAN'
                                onClick={this.openModal} />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className='d-flex justify-content-between'>
                            <div className=''>
                                <h2 className="font-weight-bolder text-dark">{`${mes} ${año}`}</h2>
                            </div>
                            <div className=''>
                                <div className="btn-group">
                                    <span className={`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveBackButton() ? 'enabled' : 'disabled'}`}
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                if (this.isActiveBackButton())
                                                    this.changeMonth('back')
                                            }
                                        }>
                                        <i className="fa fa-chevron-left icon-xs" />
                                    </span>
                                    <span className={`btn btn-icon btn-xs btn-light-primary mr-2 my-1 ${this.isActiveForwardButton() ? 'enabled' : 'disabled'}`}
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                if (this.isActiveForwardButton())
                                                    this.changeMonth('forward')
                                            }
                                        }>
                                        <i className="fa fa-chevron-right icon-xs" />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive-xl">
                            <table className="table table-responsive table-bordered table-vertical-center">
                                <thead className="text-center">
                                    <tr>
                                        <th>Empresa</th>
                                        {
                                            [...Array(dias)].map((element, key) => {
                                                return (<th key={key}>{key <= 8 ? "0" + (key + 1) : key + 1}</th>)
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.empresas.map((empresa, index) => {
                                            return(
                                                [...Array(empresa.rowSpanSize)].map((element, conteo) => {
                                                    return(
                                                        <tr key = { `${index}-${conteo}-index-row-${empresa.name}` } className = 'h-30px'>
                                                            {
                                                                conteo === 0 ?
                                                                    <td key = { `rowspan-${index}-${conteo}-index-row-${empresa.name}` }
                                                                        rowSpan = { empresa.rowSpanSize} >{empresa.name}</td>
                                                                : <></>
                                                            }
                                                            {
                                                                [...Array(dias)].map((element, diaActual) => {
                                                                    return( <> {this.printTd(empresa, conteo, diaActual)} </> )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
                <Modal size="xl" title={title} show={modal.form} handleClose={this.handleCloseForm}>
                    <PlanTrabajoForm form = { form } onChange = { this.onChange } options = { options } onSubmit = { this.onSubmit }
                        onChangeAndAdd = { this.onChangeAndAdd } deleteOption = { this.deleteOption } formeditado = { formeditado }
                        handleChangeCreate = { this.handleChangeCreate } handleCreateOption = { this.handleCreateOption } 
                        title = { title } deletePlanAlert = { this.deletePlanAlert } />
                </Modal>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
