import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { SelectSearch } from '../../form-components'
import RangeCalendar from '../../form-components/RangeCalendar';
class FlujosReportes extends Component {
    updateEmpresa = value => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: 'empresa' } })
    }
    render() {
        const { form, onChangeRange, options } = this.props
        return (
            <Form>
                <div className="">
                    <SelectSearch
                        name='empresa'
                        options={options.empresas}
                        placeholder='SELECCIONA LA EMPRESA'
                        value={form.empresa}
                        onChange={this.updateEmpresa}
                        iconclass={"far fa-building"}
                        messageinc="Incorrecto. Selecciona la empresa."
                    />
                </div>
                <div className="mt-4 text-center">
                    <RangeCalendar
                        onChange={onChangeRange}
                        start={form.fechaInicio}
                        end={form.fechaFin}
                    />
                </div>
            </Form>
        )
    }
}

export default FlujosReportes