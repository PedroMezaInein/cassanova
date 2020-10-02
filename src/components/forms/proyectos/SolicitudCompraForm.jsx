import React, { Component } from 'react'
import { Form } from 'react-bootstrap' 
import { Input, Select, SelectSearch, Button, Calendar, InputMoney, RadioGroup, FileInput } from '../../form-components'
import { openWizard1, openWizard2, openWizard3 } from '../../../functions/wizard'
import { validateAlert } from '../../../functions/alert'


class SolicitudCompraForm extends Component {

    updateProyecto = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proyecto' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
        onChange({ target: { value: '', name: 'cuenta' } })

        const { options: { empresas: empresas } } = this.props

        const aux = empresas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('cuentas', element.cuentas)
            }
        })
    }

    updateArea = value => {
        const { onChange, setOptions } = this.props

        onChange({ target: { value: value, name: 'area' } })
        onChange({ target: { value: '', name: 'subarea' } })

        const { options: { areas: areas } } = this.props
        const aux = areas.find(function (element, index) {
            if (value.toString() === element.value.toString()) {
                setOptions('subareas', element.subareas)
            }
        })

    }

    updateProveedor = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'proveedor' } })
    }

    updateSubarea = value => {
        const { onChange } = this.props
        onChange({ target: { name: 'subarea', value: value.toString() } })
    }


    handleChangeDate = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fecha' } })
    }

    render() {
        const { title, options, form, onChange, children, onChangeAdjunto, clearFiles, onSubmit, formeditado, ...props } = this.props
        return (
            <div className="wizard wizard-3" id="wizardP" data-wizard-state="step-first">
                <div className="wizard-nav">
                    <div className="wizard-steps">
                        <div id="wizard-1" className="wizard-step" data-wizard-state="current" data-wizard-type="step" onClick={() => { openWizard1() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>1.</span>Soliciar compra</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-2" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard2() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>2.</span> Área y fecha</h3>
                                <div className="wizard-bar"></div>
                            </div>
                        </div>
                        <div id="wizard-3" className="wizard-step" data-wizard-type="step" onClick={() => { openWizard3() }}>
                            <div className="wizard-label">
                                <h3 className="wizard-title">
                                    <span>3.</span> Presupuesto</h3>
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
                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                }
                            }
                            {...props}
                        >
                            {children}
                            <div id="wizard-1-content" className="pb-3 px-2" data-wizard-type="step-content" data-wizard-state="current">
                                <h5 className="mb-4 font-weight-bold text-dark">Ingresa los datos</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-6">
                                        <SelectSearch
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.proyectos}
                                            placeholder="SELECCIONA EL PROYECTO"
                                            name="proyecto"
                                            value={form.proyecto}
                                            onChange={this.updateProyecto}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <SelectSearch
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.proveedores}
                                            placeholder="SELECCIONA EL PROVEEDOR"
                                            name="proveedor"
                                            value={form.proveedor}
                                            onChange={this.updateProveedor}
                                        />
                                    </div>
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-4">
                                        <SelectSearch
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.empresas}
                                            placeholder="SELECCIONA LA EMPRESA"
                                            name="empresa"
                                            value={form.empresa}
                                            onChange={this.updateEmpresa}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputMoney
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            thousandseparator={1}
                                            placeholder="MONTO"
                                            value={form.total}
                                            name="total" onChange={onChange}
                                            iconclass={" fas fa-money-check-alt"}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <Select
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            placeholder="SELECCIONA EL TIPO DE PAGO"
                                            options={options.tiposPagos}
                                            name="tipoPago"
                                            value={form.tipoPago}
                                            onChange={onChange}
                                            messageinc="Incorrecto. Selecciona el tipo de pago."
                                            iconclass={"fas fa-coins"}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2"></div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-2-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el área y fecha</h5>
                                <div className="form-group row form-group-marginless">
                                    <div className={form.area.length ?'col-md-4':'col-md-6'}>
                                        <Calendar
                                            onChangeCalendar={this.handleChangeDate}
                                            placeholder="FECHA"
                                            name="fecha"
                                            value={form.fecha}
                                        />
                                    </div>
                                    <div className={form.area.length ?'col-md-4':'col-md-6'}>
                                        <SelectSearch
                                            requirevalidation={1}
                                            formeditado={formeditado}
                                            options={options.areas}
                                            placeholder="SELECCIONA EL ÁREA"
                                            name="areas"
                                            value={form.area}
                                            onChange={this.updateArea}
                                        />
                                    </div>
                                    {
                                        form.area ?
                                            <div className={form.area.length ?'col-md-4':'col-md-6'}>
                                                <SelectSearch
                                                    requirevalidation={1}
                                                    formeditado={formeditado}
                                                    options={options.subareas}
                                                    placeholder="SELECCIONA EL SUBÁREA"
                                                    name="subarea"
                                                    value={form.subarea}
                                                    onChange={this.updateSubarea}
                                                />
                                            </div>
                                            : ''
                                    }
                                </div>
                                <div className="separator separator-dashed mt-1 mb-2"></div>
                                <div className="form-group row form-group-marginless">
                                    <div className="col-md-12">
                                        <Input
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            as="textarea"
                                            placeholder="DESCRIPCIÓN"
                                            rows="3"
                                            value={form.descripcion}
                                            name="descripcion"
                                            onChange={onChange}
                                            style={{ paddingLeft: "10px" }}
                                            messageinc="Incorrecto. Ingresa la descripción."
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard1() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-primary font-weight-bold text-uppercase" onClick={() => { openWizard3() }} data-wizard-type="action-next">Siguiente</button>
                                    </div>
                                </div>
                            </div>
                            <div id="wizard-3-content" className="pb-3" data-wizard-type="step-content">
                                <h5 className="mb-4 font-weight-bold text-dark">Selecciona el presupuesto</h5>
                                <div className="form-group row form-group-marginless mb-0">
                                    <div className="col-md-4">
                                        <RadioGroup
                                            name='factura'
                                            onChange={onChange}
                                            options={
                                                [
                                                    {
                                                        label: 'Si',
                                                        value: 'Con factura'
                                                    },
                                                    {
                                                        label: 'No',
                                                        value: 'Sin factura'
                                                    }
                                                ]
                                            }
                                            placeholder={' Lleva factura '}
                                            value={form.factura}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <FileInput
                                            requirevalidation={0}
                                            formeditado={formeditado}
                                            onChangeAdjunto={onChangeAdjunto}
                                            placeholder={form.adjuntos.adjunto.placeholder}
                                            value={form.adjuntos.adjunto.value}
                                            name='adjunto' id='adjunto'
                                            accept="image/*, application/pdf"
                                            files={form.adjuntos.adjunto.files}
                                            deleteAdjunto={clearFiles} multiple
                                        />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between border-top mt-3 pt-3">
                                    <div className="mr-2">
                                        <button type="button" className="btn btn-light-primary font-weight-bold text-uppercase" onClick={() => { openWizard2() }} data-wizard-type="action-prev">Anterior</button>
                                    </div>
                                    <div>
                                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" 
                                            onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(onSubmit, e, 'wizard-3-content')
                                                }
                                            }
                                            text="ENVIAR" />
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

export default SolicitudCompraForm