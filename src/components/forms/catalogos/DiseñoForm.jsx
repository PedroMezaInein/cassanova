import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button, InputNumber, InputMoney, InputNumberSinText, InputMoneySinText } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
class DiseñoForm extends Component {
    render() {
        const { form, onChange, onSubmit, formeditado, requirevalidation, onChangeVariaciones, addRow, deleteRow, ...props } = this.props
        return (
            <>
                <Form id="form-diseño"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-diseño')
                        }
                    }
                    {...props}
                >
                    <div className="row">
                        <div className="col-md-6 px-0">
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-5">
                                    <InputMoney
                                        requirevalidation={1}
                                        formeditado={formeditado}
                                        thousandseparator={true}
                                        prefix={'$'}
                                        name="precio_inicial_diseño"
                                        value={form.precio_inicial_diseño}
                                        onChange={onChange}
                                        placeholder="PRECIO INICIAL"
                                        iconclass={"fas fa-coins"}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <InputNumber
                                        requirevalidation={0}
                                        formeditado={formeditado}
                                        name="m2"
                                        onChange={onChange}
                                        value={form.m2}
                                        type="text"
                                        placeholder="M2"
                                        iconclass={"fas fa-ruler-combined"}
                                        messageinc="Incorrecto. Ingresa los M2."
                                    />
                                </div>
                            </div>
                            <div className="row my-4 d-flex justify-content-center">
                                <div className="col-md-8">
                                    <div className="separator separator-dashed"></div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col-md-12 px-0">
                                    <div className="tab-content">
                                        <div className="table-responsive d-flex justify-content-center">
                                            <table className="table table-responsive-lg table-vertical-center text-center" id="esquemas">
                                                <thead>
                                                    <tr className="bg-gray-200">
                                                        <th></th>
                                                        <th>ESQUEMA 1</th>
                                                        <th>ESQUEMA 2</th>
                                                        <th>ESQUEMA 3</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row" className="bg-gray-200">PRECIO DISEÑO</th>
                                                        <td>
                                                            {
                                                                form.precio_esquema_1 !== '-' ?
                                                                    setMoneyTableForNominas(form.precio_esquema_1)
                                                                : '-'
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                form.precio_esquema_2 !== '-' ?
                                                                    setMoneyTableForNominas(form.precio_esquema_2)
                                                                : '-'
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                form.precio_esquema_3 !== '-' ?
                                                                    setMoneyTableForNominas(form.precio_esquema_3)
                                                                : '-'
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row" className="bg-gray-200">INCREMENTO</th>
                                                        <td>-</td>
                                                        <td className="px-1">
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation = { 0 }
                                                                    name = "incremento_esquema_2"
                                                                    onChange = { onChange }
                                                                    value = { form.incremento_esquema_2 }
                                                                    prefix = '%'
                                                                    identificador = 'incremento_esquema_2'
                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0 border-dark" 
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-1">
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation = { 0 }
                                                                    name = "incremento_esquema_3"
                                                                    onChange = { onChange }
                                                                    value = { form.incremento_esquema_3 }
                                                                    prefix = '%'
                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0 border-dark" 
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 px-0">
                            <div className="d-flex justify-content-end">
                                <Button
                                    icon=''
                                    onClick={addRow}
                                    className={"btn btn-icon btn-xs p-3 btn-light-success success2 mr-2"}
                                    only_icon={"flaticon2-plus icon-13px"}
                                    tooltip={{ text: 'AGREGAR' }}
                                />
                                <Button
                                    icon=''
                                    onClick={deleteRow}
                                    className={"btn btn-icon btn-xs p-3 btn-light-danger"}
                                    only_icon={"far fa-trash-alt icon-15px"}
                                    tooltip={{ text: 'Eliminar' }}
                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <table className="table table-separate table-responsive-sm text-center w-50">
                                    <thead>
                                        <tr>
                                            <th className="pb-0 border-bottom-0">Inferior</th>
                                            <th className="pb-0 border-bottom-0">Superior</th>
                                            <th className="pb-0 border-bottom-0">Cambio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            form.variaciones.map((variacion, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td className="px-1 pt-0 pb-2 border-0">
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation = { 1 }
                                                                    name = "inferior"
                                                                    formeditado = { 1 }
                                                                    value = { form['variaciones'][key]['inferior'] }
                                                                    onChange = { (e) => onChangeVariaciones(key, e, 'inferior')}
                                                                    // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                                    identificador = "inferior"
                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-1 pt-0 pb-2 border-0">
                                                            <div className="d-flex justify-content-center">
                                                                <InputNumberSinText
                                                                    requirevalidation = { 1 }
                                                                    formeditado = { 1 }
                                                                    name = "superior"
                                                                    value = { form['variaciones'][key]['superior'] }
                                                                    onChange = { (e) => onChangeVariaciones(key, e, 'superior') }
                                                                    // customstyle={{ width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' }}
                                                                    identificador = "superior"
                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-1 pt-0 pb-2 border-0">
                                                            <div className="d-flex justify-content-center">
                                                                <InputMoneySinText
                                                                    requirevalidation = { 1 }
                                                                    formeditado = { 1 }
                                                                    name = "cambio"
                                                                    value = { form['variaciones'][key]['cambio'] }
                                                                    onChange = { (e) => onChangeVariaciones(key, e, 'cambio') }
                                                                    thousandseparator={true}
                                                                    prefix = '$'
                                                                    // customstyle = { { width: "auto", borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none' } }
                                                                    identificador = "cambio"
                                                                    customclass="border-top-0 border-left-0 border-right-0 rounded-0 w-100px text-center pl-0" 
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button icon='' className="btn btn-primary mr-2"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-diseño')
                                        }
                                    }
                                    text="ENVIAR" />
                            </div>
                        </div>
                    </div>
                </Form>
            </>
        )
    }
}

export default DiseñoForm