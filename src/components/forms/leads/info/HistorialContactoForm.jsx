import React, { Component } from 'react'
import { RadioGroupGray, Calendar, InputGray, SelectSearchGray, CalendarDay, Button} from '../../../form-components'
import { DATE } from '../../../../constants'
import { ItemSlider } from '../../../../components/singles'

import { openWizard1_for2_wizard, openWizard2_for2_wizard } from '../../../../functions/wizard'
import { validateAlert } from '../../../../functions/alert'
import { Form } from 'react-bootstrap'
class HistorialContactoForm extends Component {

    state = {
        newTipoContacto: false
    }

    updateTipoContacto = value => {
        const { onChangeContacto } = this.props
        onChangeContacto({ target: { name: 'tipoContacto', value: value } })
        if (value === 'New') {
            this.setState({
                newTipoContacto: true
            })
        } else {
            this.setState({
                newTipoContacto: false
            })
        }
    }

    handleChangeDate = (date) => {
        const { onChangeContacto } = this.props
        onChangeContacto({ target: { name: 'fechaContacto', value: date } })
    }

    render() {
        
        const { form, onSubmit, formeditado, onChange, options, handleChange, formHistorial ,onChangeContacto, ...props } = this.props
        const { newTipoContacto } = this.state
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span> Datos de generales</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2_for2_wizard() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Adjunto y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-12">
                        <Form
                            onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    validateAlert(onSubmit, e, 'wizard-2-content')
                                }
                            }
                            {...props}
                        >
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <RadioGroupGray
                                            placeholder="Selecciona el estatus del intento de contacto"
                                            formeditado={formeditado}
                                            name={'success'}
                                            onChange={onChangeContacto}
                                            options={
                                                [
                                                    {
                                                        label: 'Contactado',
                                                        value: 'Contactado'
                                                    },
                                                    {
                                                        label: 'Sin respuesta',
                                                        value: 'Sin respuesta'
                                                    }
                                                ]
                                            }
                                            value={formHistorial.success}
                                        />
                                    </div>
                                    <div className={newTipoContacto ? 'col-md-4' : 'col-md-8'}>
                                        <SelectSearchGray
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            options={options.tiposContactos}
                                            placeholder="SELECCIONA EL MEDIO DE CONTACTO"
                                            name="tipoContacto"
                                            value={formHistorial.tipoContacto}
                                            onChange={this.updateTipoContacto}
                                        />
                                    </div>
                                    {
                                        newTipoContacto &&
                                        <div className="col-md-4">
                                            <InputGray
                                                formeditado={formeditado}
                                                requirevalidation={0}
                                                onChange={onChangeContacto}
                                                name="newTipoContacto"
                                                type="text"
                                                value={formHistorial.newTipoContacto}
                                                placeholder="NUEVO TIPO DE CONTACTO"
                                                iconclass={"fas fa-mail-bulk"}
                                            />
                                        </div>
                                    }
                                </div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <InputGray
                                            formeditado={formeditado}
                                            requirevalidation={0}
                                            as='textarea'
                                            name='descripcion'
                                            placeholder='DESCRIPCIÓN DEL CONTACTO'
                                            onChange={onChangeContacto}
                                            value={formHistorial.descripcion}
                                            rows='3'
                                            style={{ paddingLeft: "10px" }}
                                            messageinc="Incorrecto. Ingresa una descripción."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2_for2_wizard() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Adjunto y fecha de contacto</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6 d-flex justify-content-center">
                                        <ItemSlider 
                                            items={formHistorial.adjuntos.adjuntos.files}
                                            item='adjuntos' 
                                            handleChange={handleChange}
                                            multiple={false}
                                        />
                                    </div>
                                    <div className="col-md-6 d-flex justify-content-center">
                                        {/* <Calendar
                                            formeditado={formeditado}
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA DE CONTACTO"
                                            name="fechaContacto"
                                            value={formHistorial.fechaContacto}
                                            patterns={DATE}
                                        /> */}
                                        <CalendarDay
                                            id="contacto_lead"
                                            date = {formHistorial.fechaContacto} 
                                            onChange = { onChangeContacto } 
                                            name = 'fechaContacto'
                                        />
                                    </div>
                                </div>
                                <div className="border-top mt-3 pt-3">
                                    <div className="row">
                                        <div className="col-lg-6 text-left">
                                            <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1_for2_wizard() }} data-wizard-type="action-prev">Anterior</button>
                                        </div>
                                        <div className="col-lg-6 text-right">
                                            <div className="">
                                                <Button icon='' className="btn btn-primary font-weight-bold text-uppercase mr-2"
                                                    onClick={
                                                        (e) => {
                                                            e.preventDefault();
                                                            validateAlert(onSubmit, e, 'wizard-2-content')
                                                        }
                                                    }
                                                    text="Enviar" />
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        )
    }
}

export default HistorialContactoForm