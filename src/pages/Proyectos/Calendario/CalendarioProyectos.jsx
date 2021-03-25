import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { SelectSearchGray } from '../../../components/form-components'
import { getMeses, getAños } from '../../../functions/setters'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import moment from 'moment'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class CalendarioProyectos extends Component {

    state = {
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear(),
        proyectos: [],
        data: {
            empresas: []
        },
        options: {
            empresas:[],
        }
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentCalendarAxios()
    }

    getContentCalendarAxios = async () => {
        const { access_token } = this.props.authUser
        const { mes, año } = this.state
        await axios.get(`${URL_DEV}v2/proyectos/calendario-proyectos?mes=${mes}&anio=${año}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                let dias = this.diasEnUnMes(mes, año)
                this.setState({
                    ...this.state,
                    mes: mes,
                    año: año,
                    dias: dias,
                    proyectos: proyectos
                })
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

    updateMes = value => { this.setState({ ...this.state, mes: value }) }

    updateAño = value => { this.setState({ ...this.state, año: value }) }

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
        if (direction === 'back') {
            if (actualMonth === 0) {
                this.setState({
                    ...this.state,
                    mes: meses[11],
                    año: (año - 1).toString()
                })
            } else {
                this.setState({
                    ...this.state,
                    mes: meses[actualMonth - 1],
                })
            }
        } else {
            if (actualMonth === 11) {
                this.setState({
                    ...this.state,
                    mes: meses[0],
                    año: (año + 1).toString()
                })
            } else {
                this.setState({
                    ...this.state,
                    mes: meses[actualMonth + 1],
                })
            }
        }
    }

    printTd = (proyecto, conteo, diaActual, fechaInicio, fechaFin) => {
        /* const { mes, año } = this.state
        let fechaIin = new moment([año, meses.indexOf(mes), diaActual + 1])
        console.log(`========== ${diaActual + 1} ==========`)
        let diff1 = fechaInicio.diff(fecha, 'minutes')
        let diff2 = fecha.diff(fechaFin, 'minutes')
        console.log(fechaInicio, fechaFin)
        console.log(diff1, diff2)
        if(diff1 >= 0 || diff2 < 0){
            return(
                <td>
                    SI
                </td>
            )
        }else{
            return(
                <td>
                    -
                </td>
            )
        } */
    }

    render() {
        const { mes, año, proyectos, dias } = this.state
        return (
            <Layout active='proyectos' {... this.props}>
                <Card className='card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Calendario de proyectos
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar row mx-0 row-paddingless d-flex justify-content-end ">
                            <div className="col-md-4 mr-4">
                                <SelectSearchGray name='mes' options={getMeses()} value={mes} customdiv='mb-0'
                                    onChange={this.updateMes} iconclass="fas fa-calendar-day"
                                    messageinc="Incorrecto. Selecciona el mes." requirevalidation={1} />
                            </div>
                            <div className="col-md-3">
                                <SelectSearchGray name='año' options={getAños()} customdiv='mb-0'
                                    value={año} onChange={this.updateAño}
                                    iconclass="fas fa-calendar-day" />
                            </div>
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
                        <div className="table-responsive-xl mt-5">
                            <table id="parrilla" className="table table-responsive table-bordered table-vertical-center  border-0">
                                <thead className="text-center">
                                    <tr>
                                        <th className="font-weight-bolder border-0">PROYECTO</th>
                                        {
                                            [...Array(this.diasEnUnMes(mes, año))].map((element, key) => {
                                                return (<th className="border-top-0" key={key}>{key <= 8 ? "0" + (key + 1) : key + 1}</th>)
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        proyectos.map((proyecto, index) => {
                                            let fechaInicio = moment(proyecto.fecha_inicio);
                                            let fechaFin = moment(proyecto.fecha_fin);
                                            let duracion = fechaFin.diff(fechaInicio, 'days') + 1;
                                            let diaInicio = fechaInicio.date()
                                            let diaFin = fechaFin.date()
                                            return(
                                                <tr key = { index } className = 'h-30px'>
                                                    <td className="text-center font-weight-bolder">
                                                        {proyecto.nombre}
                                                    </td>
                                                    {
                                                        [...Array(dias)].map((element, diaActual) => {
                                                            return(<>{this.printTd(proyecto, index, diaActual, fechaInicio, fechaFin)}</>)
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                    {/* {
                                        data.empresas.map((empresa, index) => {
                                            return (
                                                empresa.datos.map((dato, index1) => {
                                                    let fechaInicio = moment(dato.fechaInicio);
                                                    let fechaFin = moment(dato.fechaFin);
                                                    let duracion = fechaFin.diff(fechaInicio, 'days') + 1;
                                                    let diaInicio = fechaInicio.date()
                                                    let diaFin = fechaFin.date()
                                                    return (
                                                        <tr key={index} className="h-30px">
                                                            {
                                                                (index1 == 0) ?
                                                                    <td className="text-center font-weight-bolder" rowSpan={empresa.datos.length}>
                                                                        {empresa.name}
                                                                    </td> : ""
                                                            }
                                                            {
                                                                [...Array(this.diasEnUnMes(mes, año))].map((element, diaActual) => {
                                                                    return (
                                                                        (diaActual + 1 >= diaInicio && diaActual + 1 <= diaFin) ?
                                                                            (diaActual + 1 === diaInicio) ?
                                                                                <td key={diaActual} colSpan={duracion} className="text-center position-relative p-0"  >
                                                                                    {
                                                                                        <OverlayTrigger key={diaActual} overlay={
                                                                                            <Tooltip>
                                                                                                <span>
                                                                                                    <span className="mt-3 font-weight-bolder">
                                                                                                        {dato.nombre}
                                                                                                    </span>
                                                                                                    <div>
                                                                                                        <div>
                                                                                                            {dato.position}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </span>
                                                                                            </Tooltip>}>
                                                                                            <div className="text-truncate w-100 position-absolute text-white px-1 top-20" style={{ backgroundColor: dato.color, color: dato.textColor }}>
                                                                                                <span className="font-weight-bold">
                                                                                                    {dato.nombre}
                                                                                                </span>
                                                                                            </div>
                                                                                        </OverlayTrigger>
                                                                                    }
                                                                                </td>
                                                                                : ""
                                                                            :
                                                                            <td></td>
                                                                    )
                                                                })
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            )
                                        })
                                    } */}
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(CalendarioProyectos)