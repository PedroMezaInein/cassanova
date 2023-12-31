import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import '../../styles/select_custom.css';

class Select extends Component {

    state = {
        selectValido: !this.props.requirevalidation
    }

    validarSelect(e) {
        const { value } = e.target
        const { requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                if (value > 0) {
                    this.setState({
                        selectValido: true
                    })
                } else {
                    this.setState({
                        selectValido: false
                    })
                }
            } else {
                this.setState({
                    selectValido: true
                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    selectValido: false
                })
            } else {
                this.setState({
                    selectValido: true
                })
            }
        }
        if (value === 'personaFisica' || value === 'personaMoral' || value === 'elLibro' || value === 'laPoliza'){
            this.setState({
                selectValido: true
            })
        }
    }

    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    selectValido: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarSelect({ target: { value: this.props.value } })
                }
            }

    }

    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarSelect({ target: { value: value } })
        }
    }

    render() {
        const { options, tipo, placeholder, general, value, name, onChange, iconclass, messageinc, customclass, ...props } = this.props
        const { selectValido } = this.state
        return (
            <>
                {
                    general !== false ?
                        <>
                            <Form.Label className="col-form-label">{placeholder}</Form.Label>

                            <div className="input-icon">
                                <span className="input-icon input-icon-right">
                                    <span>
                                        <i className={iconclass + " kt-font-boldest text-primary"}></i>
                                    </span>
                                </span>
                                <Form.Control
                                    className={`form-control text-uppercase ${selectValido ? "is-valid sin_icono" : "is-invalid sin_icono"} ${customclass}`}
                                    onChange={(e) => { e.preventDefault(); this.validarSelect(e); onChange(e) }}
                                    name={name}
                                    value={value}
                                    as="select" {...props}>
                                    <option value={0} disabled>
                                        {placeholder}
                                    </option>
                                    {
                                        options.map((option, key) => {
                                            return (
                                                <option key={key} value={option.value}>
                                                    {option.text}
                                                </option>
                                            )
                                        })
                                    }
                                </Form.Control>
                            </div>
                            <span className={selectValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}> {messageinc} </span>
                            
                        </> : <></>
               }
                {
                            general === false ?
                            <>
                            <Form.Label className="col-form-label">{placeholder}</Form.Label>

                            <div className="input-icon">
                                <span className="input-icon input-icon-right">
                                    <span>
                                        <i className={iconclass + " kt-font-boldest text-primary"}></i>
                                    </span>
                                </span>
                                <Form.Control
                                    className={`form-control text-uppercase ${selectValido ? "is-valid sin_icono" : "is-invalid sin_icono"} ${customclass}`}
                                    onChange={(e) => { e.preventDefault(); 
                                    this.validarSelect(e);
                                    onChange(e) }}
                                    name={name}
                                    value={value}
                                    as="select" {...props}>
                                    <option value={'indicacion'} disabled>
                                        {placeholder}
                                            </option>
                                            {
                                            tipo === 'tipoPersona' ?
                                            <>     
                                            <option  value={'personaFisica'}>
                                            Persona Fisica
                                            </option>
                                            <option  value={'personaMoral'}>
                                            Persona Moral
                                            </option></>
                                        : <></>
                                            }
                                            {
                                            tipo === 'tipoConstancia' ?
                                            <>     
                                            <option  value={'elLibro'}>
                                            El Libro
                                            </option>
                                            <option  value={'laPoliza'}>
                                            La Póliza
                                            </option></>
                                        : <></>
                                            }
                                    
                                </Form.Control>
                            </div>
                            <span className={selectValido ? "form-text text-danger hidden" : "form-text text-danger is-invalid"}> {messageinc} </span>
                        </>
                        :
                        <></>
                }
            </>
        )
    }
}
export default Select



