import React, { Component } from 'react'
import { InputGray, SelectSearchGray, InputPhoneGray, Button } from '../../form-components'
import { Form } from 'react-bootstrap'
import { TEL, EMAIL } from '../../../constants'
import { validateAlert } from '../../../functions/alert';

class FormLlamada extends Component {

    render() {
        const { form, onChange, updateTipoProyecto, options, onSubmit } = this.props
        return (
            <>
                <Form id="form-lead-telefono"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-lead-telefono')
                        }
                    }
                    {...this.props}>
                    <div className="form-group row form-group-marginless mt-4 mb-0">
                        <div className="col-md-4">
                            <InputGray
                                withtaglabel={1}
                                withtextlabel={1}
                                withplaceholder={1}
                                withicon={1}
                                placeholder='NOMBRE DEL LEAD'
                                iconclass="far fa-user"
                                name='name'
                                value={form.name}
                                onChange={onChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <SelectSearchGray
                                options={options.tipos}
                                placeholder="SELECCIONA EL TIPO DE PROYECTO"
                                onChange={updateTipoProyecto}
                                name="tipoProyecto"
                                value={form.tipoProyecto}
                                withtaglabel={1}
                                withtextlabel={1}
                            />
                        </div>
                        {
                            form.tipoProyecto !== '' ?
                                <>
                                    <div className="col-md-4 d-flex align-items-center">
                                        <div className="col-md-12">
                                            <div className="row">
                                                <div className="col-md-7 px-0">
                                                    <label className='col-form-label font-weight-bold text-dark-60'>¿Es un proyecto de obra y/o diseño?</label>
                                                </div>
                                                <div className="col-md-5 px-0">
                                                    <div className="checkbox-inline mt-2">
                                                        <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-secondary mr-3">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => onChange(e)}
                                                                name='diseño'
                                                                checked={form.diseño}
                                                                value={form.diseño}
                                                            />
                                                                            DISEÑO
                                                                    <span></span>
                                                        </label>
                                                        <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-secondary">
                                                            <input
                                                                type="checkbox"
                                                                onChange={(e) => onChange(e)}
                                                                name='obra'
                                                                checked={form.obra}
                                                                value={form.obra}
                                                            />
                                                                            OBRA
                                                                    <span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                : ''
                        }
                        {
                            form.diseño || form.obra !== '' ?
                                <div className="col-md-4">
                                    <InputGray
                                        withtaglabel={1}
                                        withtextlabel={1}
                                        withplaceholder={1}
                                        withicon={1}
                                        placeholder="CORREO ELECTRÓNICO DE CONTACTO"
                                        iconclass="fas fa-envelope"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={onChange}
                                        patterns={EMAIL}
                                    />
                                </div>
                                : ''
                        }
                        {
                            form.diseño || form.obra !== '' ?
                                <>
                                    <div className="col-md-4">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={1}
                                            name='empresa'
                                            value={form.empresa}
                                            placeholder='EMPRESA'
                                            onChange={onChange}
                                            iconclass='fas fa-building'
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <InputPhoneGray
                                            placeholder="TELÉFONO DE CONTACTO"
                                            withicon={1}
                                            iconclass="fas fa-mobile-alt"
                                            name="telefono"
                                            value={form.telefono}
                                            onChange={onChange}
                                            patterns={TEL}
                                            thousandseparator={false}
                                            prefix=''
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <InputGray
                                            withtaglabel={1}
                                            withtextlabel={1}
                                            withplaceholder={1}
                                            withicon={0}
                                            placeholder="COMENTARIO"
                                            name="comentario"
                                            value={form.comentario}
                                            onChange={onChange}
                                            rows={1}
                                            as='textarea'
                                        />
                                    </div>
                                </>
                                : ''
                        }
                    </div>
                    {
                        form.telefono ?
                            <div className="card-footer py-3 pr-1 text-right">
                                <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            validateAlert(onSubmit, e, 'form-lead-telefono')
                                        }
                                    } />
                            </div>
                            : ''
                    }
                </Form>
            </>
        )
    }
}

export default FormLlamada