import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

class SelectCreate extends Component {

    
    render() {
        const { placeholder, onChange, onCreateOption, iconclass, requirevalidation, messageinc, options, elementoactual} = this.props
        const customStyles = {
            indicatorSeparator: () => ({ 
                backgroundColor:'transparent !important'
            }),
            multiValueLabel: () => ({ 
                color: '#2171c1!important',
                padding:'2px .46875em!important',
                fontSize:'13px!important',
                fontWeight: 500
            }),
            multiValue: () => ({ 
                backgroundColor: '#E1F0FF!important',
                borderRadius:'2px!important',
                color: '#2171c1!important',
                margin: '2px 3px!important',
                display:'flex', 
                minWidth:'0',
                boxSizing:'border-box'
            }),
            control: () => ({
                alignItems:'center',
                backgroundColor:'hsl(0,0%,100%)',
                borderStyle:'solid',
                borderWidth:'1px',
                cursor:'default',
                borderRadius:'2px!important',
                display:'flex',
                flexWrap:'wrap',
                justifyContent:'space-between',
                minHeight:'38px',
                outline:'0 !important',
                position:'relative',
                transition:'all 100ms',
                boxSizing:'border-box',
                borderColor: requirevalidation?(elementoactual.value !== undefined && elementoactual.value !== null ?'#388E3C !important':'#F64E60!important'):'#388E3C !important',
                paddingLeft:'calc(1.5em + 1.3rem + 2px) !important'
            }),
            dropdownIndicator: () => ({ 
                color:requirevalidation?(elementoactual.value !== undefined && elementoactual.value !== null ?'#388E3C !important':'#F64E60!important'):'#388E3C !important',
                display: 'flex',
                padding: '8px',
                boxSizing:'border-box',
            }),
            clearIndicator: () => ({ 
                color:requirevalidation?(elementoactual.value !== undefined && elementoactual.value !== null ?'#388E3C !important':'#F64E60!important'):'#388E3C !important',
                display: 'flex',
                padding: '8px',
                boxSizing:'border-box'
            }),
            placeholder: () => ({
                color: '#B5B5C3 !important',
                marginLeft: '2px',
                marginRight: '2px',
                position:'absolute',
                boxSizing:'border-box'
            })
        }
        return (
            <div>
                <label className="col-form-label">{placeholder}</label>
                <div className="input-icon">
                    <span className="input-icon input-icon-right">
                        <i className={iconclass + " m-0 kt-font-boldest text-primary zindex-2"} ></i>
                    </span>
                    <CreatableSelect
                        noOptionsMessage={() => "NO HAY OPCIONES"}
                        isClearable
                        onChange={onChange}
                        onCreateOption={onCreateOption}
                        options={options}
                        value={elementoactual}
                        styles={customStyles}
                        placeholder={placeholder}
                    />
                </div>
                {
                    requirevalidation ? (elementoactual.value !== undefined && elementoactual.value !== null ? '' : <span className={"form-text text-danger"}> {messageinc} </span>) : ''
                }
            </div>
        )
    }
}
export default SelectCreate 