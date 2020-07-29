import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, Calendar, SelectSearch, Button, FileInput, InputMoneySinText, SelectSearchSinText} from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { DATE } from '../../../constants'
import { setMoneyTableForNominas } from '../../../functions/setters'

class NominaObraForm extends Component {

    handleChangeDateInicio = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaInicio' } })
    }
    handleChangeDateFin = date => {
        const { onChange } = this.props
        onChange({ target: { value: date, name: 'fechaFin' } })
    }

    updateEmpresa = value => {
        const { onChange, setOptions } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }

    updateProyecto = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'proyecto' } }, 'proyecto')
    }

    updateUsuario = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getTotal(key) {
        const { form } = this.props

        let nominImss = form.nominasObra[key].nominImss === undefined ? 0 : form.nominasObra[key].nominImss
        let restanteNomina = form.nominasObra[key].restanteNomina === undefined ? 0 : form.nominasObra[key].restanteNomina
        let extras = form.nominasObra[key].extras === undefined ? 0 : form.nominasObra[key].extras
        return parseFloat(nominImss) + parseFloat(restanteNomina) + parseFloat(extras)
    }


    getTotalNominaImss(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalRestanteNomina(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotalExtra(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            let aux = element[key] === undefined ? 0 : element[key]
            suma = suma + parseFloat(aux)
        })
        return suma
    }

    getTotales() {
        const { form } = this.props

        let sumaNomImss = 0;
        let sumaRestanteNomina = 0;
        let sumaExtras = 0;
        let sumaTotal = 0;

        form.nominasObra.forEach(element => {
            sumaNomImss += element.nominImss === undefined ? 0 : parseFloat(element.nominImss);
            sumaRestanteNomina += element.restanteNomina === undefined ? 0 : parseFloat(element.restanteNomina);
            sumaExtras += element.extras === undefined ? 0 : parseFloat(element.extras);
        });
        return sumaTotal = sumaNomImss + sumaRestanteNomina + sumaExtras
    }


    render() {
        const { options, addRowNominaObra, deleteRowNominaObra, onChangeNominasObra, onChange, clearFiles, onChangeAdjunto, form, onSubmit, formeditado, title} = this.props
        return (
            <Form id="form-nominaobra"
                onSubmit={
                    (e) => {
                        e.preventDefault();
                        validateAlert(onSubmit, e, 'form-nominaobra')
                    }
                }
            >
                <div className="form-group row form-group-marginless pt-4">
                    <div className="col-md-6">
                        <Input
                            requirevalidation={1}
                            formeditado={formeditado}
                            name="periodo"
                            value={form.periodo}
                            placeholder="PERIODO DE NÓMINA DE OBRA"
                            onChange={onChange}
                            iconclass={"far fa-window-maximize"}
                            messageinc="Incorrecto. Ingresa el periodo de nómina de obra."
                        />
                    </div>

                    <div className="col-md-6">
                        <SelectSearch
                            formeditado={formeditado}
                            options={options.empresas}
                            placeholder="Selecciona la empresa"
                            name="empresa"
                            value={form.empresa}
                            onChange={this.updateEmpresa}
                            iconclass={"far fa-building"}
                        />
                    </div>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateInicio}
                            placeholder="Fecha de inicio"
                            name="fechaInicio"
                            value={form.fechaInicio}
                            selectsStart
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                    <div className="col-md-6">
                        <Calendar
                            formeditado={formeditado}
                            onChangeCalendar={this.handleChangeDateFin}
                            placeholder="Fecha final"
                            name="fechaFin"
                            value={form.fechaFin}
                            selectsEnd
                            startDate={form.fechaInicio}
                            endDate={form.fechaFin}
                            minDate={form.fechaInicio}
                            iconclass={"far fa-calendar-alt"}
                            patterns={DATE}
                        />
                    </div>
                </div>
                {
                    title !== 'Editar nómina obra' ?
                        <>
                            <div className="form-group row form-group-marginless">
                                <div className="col-md-12">
                                    <FileInput
                                        requirevalidation={0}
                                        formeditado={formeditado}
                                        onChangeAdjunto={onChangeAdjunto}
                                        placeholder={form.adjuntos.adjunto.placeholder}
                                        value={form.adjuntos.adjunto.value}
                                        name='adjunto'
                                        id='adjunto'
                                        accept="image/*, application/pdf"
                                        files={form.adjuntos.adjunto.files}
                                        deleteAdjunto={clearFiles}
                                        multiple
                                    />
                                </div>
                            </div>
                        </>
                        : ''
                }

                <table className="table table-separate table-responsive" id="tabla_obra">
                    <thead>
                        <tr>
                            <th rowSpan="2"><div className="mt-2 pb-3">Empleado</div></th>
                            <th rowSpan="2"><div className="mt-2 pb-3">Proyecto</div></th>
                            <th rowSpan="2"><div className="mt-2 pb-3">Salario Hora</div></th>
                            <th rowSpan="2"><div className="mt-2 pb-3">1 Hora T</div></th>
                            <th rowSpan="2"><div className="mt-2 pb-3">2 Horas T</div></th>
                            <th rowSpan="2"><div className="mt-2 pb-3">3 Horas T</div></th>
                            <th className="pb-0 border-bottom-0">Nómina IMSS</th>
                            <th className="pb-0 border-bottom-0">Restante Nómina</th>
                            <th className="pb-0 border-bottom-0">Extras</th>
                            <th className="pb-0 border-bottom-0">Total</th>
                        </tr>
                        <tr>
                            <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalNominaImss("nominImss"))}</div></th>
                            <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalRestanteNomina("restanteNomina"))}</div></th>
                            <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotalExtra("extras"))}</div></th>
                            <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder">{setMoneyTableForNominas(this.getTotales())}</div></th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            form.nominasObra.map((nominas, key) => {
                                return (
                                    <tr key={key}>
                                        <td>
                                            <SelectSearchSinText
                                                formeditado={formeditado}
                                                options={options.usuarios}
                                                placeholder="Selecciona el empleado" 
                                                name="usuario"
                                                value={form['nominasObra'][key]['usuario']}
                                                onChange={(value) => this.updateUsuario(value, key)}
                                                customstyle={{ width: "269px" }}
                                            />
                                        </td>
                                        <td>
                                            <SelectSearchSinText
                                                formeditado={formeditado}
                                                options={options.proyectos}
                                                placeholder="Selecciona el proyecto"
                                                name="proyecto"
                                                value={form['nominasObra'][key]['proyecto']}
                                                onChange={(value) => this.updateProyecto(value, key)}
                                                customstyle={{ width: "269px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="sueldoh" 
                                                value={form['nominasObra'][key]['sueldoh']}
                                                onChange={e => onChangeNominasObra(key, e, 'sueldoh')}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora1T" 
                                                value={form['nominasObra'][key]['hora1T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora1T')}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora2T" 
                                                value={form['nominasObra'][key]['hora2T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora2T')}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="hora3T" 
                                                value={form['nominasObra'][key]['hora3T']}
                                                onChange={e => onChangeNominasObra(key, e, 'hora3T')}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="nominImss" 
                                                value={form['nominasObra'][key]['nominImss']}
                                                onChange={e => onChangeNominasObra(key, e, 'nominImss')}
                                                thousandSeparator={true} 
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="restanteNomina"
                                                value={form['nominasObra'][key]['restanteNomina']}
                                                onChange={e => onChangeNominasObra(key, e, 'restanteNomina')}
                                                thousandSeparator={true}
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <InputMoneySinText
                                                requirevalidation={1}
                                                formeditado={formeditado}
                                                name="extras"
                                                value={form['nominasObra'][key]['extras']}
                                                onChange={e => onChangeNominasObra(key, e, 'extras')}
                                                thousandSeparator={true} 
                                                prefix={'$'}
                                                customstyle={{ width: "121px" }}
                                            />
                                        </td>
                                        <td>
                                            <div className="font-size-lg font-weight-bolder text-center" style={{ width: "138px" }}>
                                                {
                                                    setMoneyTableForNominas(this.getTotal(key))
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="form-group d-flex justify-content-center">
                    <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaObra} >Agregar Fila</button>
                    <button type="button" className="btn btn-light-danger font-weight-bold mr-2" onClick={deleteRowNominaObra} >Eliminar Fila</button>
                </div>
                <div className="separator separator-dashed mt-1 mb-2"></div>
                <div className="d-flex justify-content-center mt-2 mb-4">
                    <Button text='Enviar' type='submit' />
                </div>
            </Form>
        )
    }
}

export default NominaObraForm