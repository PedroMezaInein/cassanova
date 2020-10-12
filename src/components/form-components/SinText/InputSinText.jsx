import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
class InputSinText extends Component {
    state = {
        inputValido: !this.props.requirevalidation
    }
    validarInput(e) {
        const { value } = e.target
        const { patterns, requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                var expRegular = new RegExp(patterns);
                if (expRegular.test(value)) {
                    this.setState({
                        inputValido: true
                    })
                } else {
                    this.setState({
                        inputValido: false
                    })
                }
            } else {
                this.setState({
                    inputValido: true
                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    inputValido: false
                })
            } else {
                this.setState({
                    inputValido: true
                })
            }
        }
    }
    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ...this.state,
                    inputValido: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarInput({ target: { value: this.props.value } })
                }
            }
    }
    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarInput({ target: { value: value } })
        }
    }
    letterCase = (e) => {
        const { letterCase } = this.state
        if (letterCase === undefined)
            e.target.value = ("" + e.target.value).toUpperCase();
        else {
            if (letterCase === 'Upper')
                e.target.value = ("" + e.target.value).toUpperCase();
            else {
                e.target.value = e.target.value
            }
        }
    }
    render() {
        const { error, onChange, placeholder, iconclass, messageinc, letterCase, customstyle, ...props } = this.props
        const { inputValido } = this.state
        const toInputUppercase = e => {
            if (letterCase === undefined)
                e.target.value = ("" + e.target.value).toUpperCase();
            else {
                if (letterCase === true)
                    e.target.value = ("" + e.target.value).toUpperCase();
            }
        };
        return (
            <Form.Control
                placeholder={placeholder}
                className={inputValido ? " form-control form-control-sm is-valid  sin_icono" : " form-control form-control-sm is-invalid sin_icono"}
                onChange={(e) => { e.preventDefault(); this.validarInput(e); onChange(e) }}
                onInput={toInputUppercase}
                {...props}
                style={customstyle}
            />
        )
    }
}
export default InputSinText
