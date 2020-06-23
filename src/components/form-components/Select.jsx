import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'

import '../../styles/select_custom.css';
 
class Select extends Component{
    /* constructor(props){
        super(props)
    } */ 

    state = {
        selectValido: false
    }

    validarSelect(e){
        const { value } = e.target
        
        if(value > 0){
            this.setState({
                selectValido: true
            })
        }else{
            this.setState({
                selectValido: false     
                
            })
        }
    }

    render(){
        const { options, placeholder, value, name, onChange, iconclass, messageinc, ...props } = this.props
        const { selectValido } = this.state
        return(
            <>
                <Form.Label className="col-form-label">{ placeholder }</Form.Label>
                
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text">
                            <i className={iconclass+" kt-font-boldest text-primary"}></i>
                        </span>
                    </div>
                    <Form.Control 
                        className={ selectValido ? " form-control is-valid " : " form-control is-invalid" }
                        onChange={ (e) => { e.preventDefault(); this.validarSelect(e); onChange(e) }} 
                        name={ name } 
                        value={ value } 
                        as="select" {... props}>
                        <option value={0} disabled>
                            {placeholder}
                        </option>
                        {
                            options.map((option, key) => {
                                return(
                                    <option key={key} value={option.value}>
                                        { option.text }
                                    </option>
                                )
                            })
                        }
                    </Form.Control>                
                    <div className="invalid-feedback msgValidation">{messageinc}</div>
                </div>
            </>
        )
    }
}
export default Select



