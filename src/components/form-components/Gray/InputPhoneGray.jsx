import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
class InputPhoneGray extends Component {
    state = {
        inputPhone: !this.props.requirevalidation
    }
    validarPhone(e) {
        const { value } = e.target
        const { patterns, requirevalidation } = this.props
        if (value !== '' && value !== null && value !== undefined) {
            if (requirevalidation) {
                var expRegular = new RegExp(patterns);
                if (value >= 0 && expRegular.test(value)) {
                    this.setState({
                        inputPhone: true
                    })
                } else {
                    this.setState({
                        inputPhone: false
                    })
                }
            } else {
                this.setState({
                    inputPhone: true
                })
            }
        } else {
            if (requirevalidation) {
                this.setState({
                    inputPhone: false
                })
            } else {
                this.setState({
                    inputPhone: true
                })
            }
        }
    }
    componentDidUpdate(nextProps) {
        if (nextProps.value !== this.props.value)
            if (!nextProps.requirevalidation) {
                this.setState({
                    ... this.state,
                    inputPhone: true
                })
            } else {
                if (this.props.value !== '') {
                    this.validarPhone({ target: { value: this.props.value } })
                }
            }
    }
    componentDidMount() {
        const { formeditado, value } = this.props
        if (formeditado) {
            this.validarPhone({ target: { value: value } })
        }
    }
    onChange = values => {
        const { onChange, name } = this.props
        this.validarPhone({ target: { value: values.value, name: name } })
        onChange({ target: { value: values.value, name: name } })
    }
    render() {
        const { error, onChange, placeholder, iconclass, value, thousandseparator, customlabel, customstyle, customclass, ...props } = this.props
        return (
            <div className="form-group">
                <label className={`col-form-label ${customlabel}`}>{placeholder}</label>
                <div className="input-group input-group-solid rounded-0">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass + " icon-lg text-dark-50"}></i>
                        </span>
                    </div>
                    <NumberFormat
                        value={value}
                        displayType={'input'}
                        thousandSeparator={thousandseparator ? thousandseparator : false}
                        renderText={value => <div> {value} </div>}
                        onValueChange={(values) => this.onChange(values)}
                        format="+52 1 (##) #### - ####"
                        allowEmptyFormatting
                        mask="_"
                        placeholder={placeholder}
                        className={`form-control text-dark-50 font-weight-bold ${customclass}`}
                        style={customstyle}
                        {...props}
                    />
                </div>
            </div>
        )
    }
}
export default InputPhoneGray