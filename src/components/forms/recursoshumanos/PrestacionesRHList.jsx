import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import { Form } from 'react-bootstrap'
import { dayDMY } from '../../../functions/setters'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiOptions, apiPutForm, catchErrors } from '../../../functions/api'
import { doneAlert, printResponseErrorAlert, questionAlertWithLottie } from '../../../functions/alert'
import { Button } from '../../form-components'
import { OfficeWork } from '../../../assets/animate'

class PrestacionesRHList extends Component {

    state = {
        prestaciones: [],
        form: {
            prestaciones: [{
                id: '',
                active: false
            }],
        }
    }

    componentDidMount = () => {
        this.getPrestaciones()
    }
    
    getPrestaciones = async () => {
        const { at, empleado } = this.props
        apiOptions(`v2/rh/empleados/prestaciones/${empleado.id}`, at).then(
            (response) => {
                const { form } = this.state
                const { prestaciones } = response.data
                let aux = []
                prestaciones.forEach((prestacion) => {
                    aux.push({
                        id: prestacion.id,
                        active: prestacion.isActive ? true : false,
                        prestacion: prestacion
                    })
                })
                form.prestaciones = aux
                this.setState({
                    ...this.state,
                    prestaciones: prestaciones
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    updatePrestacion = async(key) => {
        const { form } = this.state
        const { empleado, at } = this.props
        let prestacion = form.prestaciones[key].prestacion
        let formulario = {
            estatus: form.prestaciones[key].prestacion.isActive ? 'off' : 'on'
        }
        apiPutForm(`v2/rh/empleados/prestaciones/${empleado.id}/${prestacion.id}`, formulario, at).then(
            (response) => {
                doneAlert('Prestación actualizada con éxito',
                    () => { this.getPrestaciones() })
            },(error) => { printResponseErrorAlert(error) }
            ).catch((error) => catchErrors(error))
    }

    checkButton = (key, e) => {
        const { name, checked } = e.target
        const { form } = this.state
        form.prestaciones[key][name] = checked
        const { empleado } = this.props
        questionAlertWithLottie(
            '¿Deseas continuar?',
            form.prestaciones[key].prestacion.isActive ?
                `${empleado.nombre} ya no contará con ${form.prestaciones[key].prestacion.nombre}`
            :
                `${empleado.nombre} contará con ${form.prestaciones[key].prestacion.nombre}`,
            OfficeWork,
            { confirm: 'SI', cancel: 'NO' },
            {
                cancel: null,
                success: () => this.updatePrestacion(key)
            }
        )
    }

    getHistorial(historial, index){
        if(historial.pivot.fecha_activacion !== null && historial.pivot.fecha_cancelacion){
            let activacionDate = dayDMY(historial.pivot.fecha_activacion)
            let cancelacionDate = dayDMY(historial.pivot.fecha_cancelacion)
            if(activacionDate === cancelacionDate){
                return(
                    <div>
                        <span className="font-size-h6 text-success">
                            <span className="svg-icon svg-icon-dark svg-icon-lg">
                                <SVG src={toAbsoluteUrl('/images/svg/Cross-circle.svg')} />
                            </span>
                        </span> <span className="font-weight-bolder">{activacionDate}</span> - Se activó y canceló el mismo día 
                    </div>
                )
            }else{
                <div>
                    <span className="font-weight-bolder">Perido: </span> {activacionDate}
                </div>
            }
        }else{
            return(
                <div>
                    <span className="font-weight-bolder">Perido: </span>{dayDMY(historial.pivot.fecha_activacion)}
                </div>
            )
        }
    }

    onSubmit = (e) => {

    }
    
    render() {
        const { prestaciones, form } = this.state
        return (
            <Form id='form-prestaciones' onSubmit={ this.onSubmit }>
                <div className="mt-5">
                    {
                        prestaciones.map((prestaciones, key) => {
                            return (
                                <div key={key}>
                                    <div className={`d-flex align-items-center mb-8`}>
                                        <span className = {`bullet bullet-vertical h-40px w-4px 
                                            bg-${form.prestaciones[key].active ? 'success' : 'gray-300'}`} />
                                        <div className="d-flex align-items-center mx-4">
                                            <label className={`checkbox checkbox-lg checkbox-single 
                                                checkbox-${form.prestaciones[key].active ? 'success' : 'light'}`}>
                                                <input
                                                    type="checkbox"
                                                    onChange={(e) => { this.checkButton(key, e) }}
                                                    name='active'
                                                    checked={form.prestaciones[key].active}
                                                    value={form.prestaciones[key].active}
                                                />
                                                <span />
                                            </label>
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="text-gray-800 font-weight-bolder font-size-lg">{prestaciones.nombre}</div>
                                            <div className="font-size-sm text-muted align-self-center">
                                                {
                                                    prestaciones.active !== null ?
                                                        <div>
                                                            ACTIVADO: <span className="text-success">
                                                                {dayDMY(prestaciones.active.pivot.fecha_activacion)}
                                                            </span>
                                                        </div>
                                                    : 'DESACTIVADO'
                                                }
                                            </div>
                                        </div>
                                        {
                                            prestaciones.historial.length > 0 ?
                                                <span className="badge badge-light-success fs-8 fw-bolder">btn</span>
                                            : ''
                                        }
                                    </div>
                                    {
                                        prestaciones.historial.length > 0 ?
                                            prestaciones.historial.map((historial, key2) => {
                                                return (
                                                    <div key={key2}>
                                                        {this.getHistorial(historial, key2)}
                                                    </div>
                                                )
                                            })
                                        : ''
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </Form>
        )
    }
}

export default PrestacionesRHList