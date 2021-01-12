import React, { Component } from 'react'
import { CalendarDay, Button, InputGray, TagInputGray, SelectHorario, RadioGroupGray} from '../../../form-components'
import { Col, Form } from 'react-bootstrap'
import { messageAlert } from '../../../../functions/alert'
class AgendarCitaForm extends Component {
    addCorreo = () => {
        const { onChange, formAgenda } = this.props
        let aux = false
        let array = []
        if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,63}$/i.test(formAgenda.correo)) {
            if (formAgenda.correo) {
                formAgenda.correos.map((correo) => {
                    if (correo === formAgenda.correo) {
                        aux = true
                    }
                    return false
                })
                if (!aux) {
                    array = formAgenda.correos
                    array.push(formAgenda.correo)
                    onChange({ target: { name: 'correos', value: array } })
                    onChange({ target: { name: 'correo', value: '' } })
                }
            }
        } else {
            messageAlert("LA DIRECCIÓN DEL CORREO ELECTRÓNICO ES INCORRECTA");
        }
    }
    render() {
        const { formAgenda, onChange, onSubmit, tagInputChange} = this.props
        return (
            <Form>
                <div className="row">
                    <Col md="6" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless d-flex justify-content-center mb-0 pb-0">
                            <div className="col-md-12 text-center" style={{ height: '3px' }}>
                                <label className="text-center font-weight-bolder">Fecha</label>
                            </div>
                            <div className="col-md-12 text-center">
                                <CalendarDay date = { formAgenda.fecha } value={formAgenda.fecha} name='fecha' onChange={onChange} withformgroup={1}/>
                                <div className="d-flex justify-content-center">
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora de inicio</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_inicio, name: 'hora_inicio'}}
                                                minuto = {{ value: formAgenda.minuto_inicio, name: 'minuto_inicio'}} />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="col-form-label text-center font-weight-bolder">Hora final</label>
                                        <div className="form-group row d-flex justify-content-center">
                                            <SelectHorario onChange = { onChange } hora = {{ value: formAgenda.hora_final, name: 'hora_final'}}
                                                minuto = {{ value: formAgenda.minuto_final, name: 'minuto_final'}} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md="6" className="text-center align-self-center">
                        <div className="form-group row form-group-marginless mt-4 pb-0 mb-0">
                            <div className="col-md-8 text-left">
                                <InputGray
                                    withtaglabel={1}
                                    withtextlabel={1}
                                    withplaceholder={1}
                                    withicon={1}
                                    withformgroup={1}
                                    placeholder='NOMBRE DE LA REUNIÓN'
                                    iconclass="fas fa-users"
                                    name='titulo'
                                    value={formAgenda.titulo}
                                    onChange={onChange}
                                />
                            </div>
                        </div>
                        <div className="form-group row form-group-marginless pb-0 mb-0">
                            <div className={formAgenda.lugar === 'presencial' ?'col-md-4 text-left':'col-md-8 text-left'}>
                                <RadioGroupGray
                                    placeholder = "¿Cita presencial o remota?"
                                    name = 'lugar'
                                    onChange = { onChange }
                                    options = {
                                        [
                                            {
                                                label: 'Presencial',
                                                value: 'presencial'
                                            },
                                            {
                                                label: 'Remota',
                                                value: 'remota'
                                            }
                                        ]
                                    }
                                    value = { formAgenda.lugar }
                                    />
                            </div>
                            {
                                formAgenda.lugar === 'presencial' ?
                                    <div className='col-md-4 text-left'>
                                        <RadioGroupGray
                                            placeholder = "¿La cita es en la empresa?"
                                            name = 'cita_empresa'
                                            onChange = { onChange }
                                            options = {
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'si_empresa'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'no_empresa'
                                                    }
                                                ]
                                            }
                                            value = { formAgenda.cita_empresa }
                                        />
                                    </div>
                                :''
                            }
                            {
                                formAgenda.lugar === 'remota' ||  formAgenda.cita_empresa === 'no_empresa'?
                                    <div className='col-md-8 text-left'>
                                        <InputGray
                                            letterCase = { formAgenda.lugar === 'presencial' ? true : false }
                                            withtaglabel = { 1 }
                                            withtextlabel = { 1 }
                                            withplaceholder = { 1 }
                                            withicon = { 1 }
                                            withformgroup={1}
                                            placeholder = { formAgenda.lugar === 'presencial' ? 'UBICACIÓN' : 'URL' }
                                            iconclass = { formAgenda.lugar === 'presencial' ? 'fas fa-map-marker-alt' : ' fas fa-link' }
                                            name = { formAgenda.lugar === 'presencial' ? 'ubicacion' : 'url' }
                                            value = { formAgenda.lugar === 'presencial' ? formAgenda.ubicacion : formAgenda.url }
                                            onChange = { onChange }
                                        />
                                    </div>
                                :''
                            }
                            <div className="col-md-8 text-left">
                                <TagInputGray
                                    tags = { formAgenda.correos }
                                    onChange = { tagInputChange }
                                    placeholder = "CORREOS DE ASISTENTES"
                                    iconclass = "fas fa-envelope"
                                    letterCase = { false }
                                />
                            </div>
                        </div>
                    </Col>
                </div>
                <div className="card-footer pt-3 pr-1 pb-0">
                    <div className="row">
                        <div className="col-lg-12 text-right pr-0 pb-0">
                            <Button icon='' className="btn btn-primary mr-2"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        onSubmit()
                                    }
                                }
                            text="AGENDAR" 
                            />
                        </div>
                    </div>
                </div>
            </Form>
        )
    }
}

export default AgendarCitaForm