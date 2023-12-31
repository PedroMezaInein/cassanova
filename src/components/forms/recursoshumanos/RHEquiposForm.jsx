import React, { Component } from 'react'
import SVG from "react-inlinesvg"
import $ from 'jquery'
import Swal from 'sweetalert2';
import { Row, Form, Col } from 'react-bootstrap'
import { Button, InputGray, ReactSelectSearchGray } from '../../form-components'
import { toAbsoluteUrl } from '../../../functions/routers'
import { apiDelete, apiGet, apiPostForm, catchErrors, apiOptions, apiPutForm } from '../../../functions/api'
import { validateAlert, waitAlert, doneAlert, printResponseErrorAlert, deleteAlert } from '../../../functions/alert'

import '../../../styles/_modal_form.scss'

class RHLicenciasForm extends Component {

    state = {
        form: {
            tipo: '',
            equipos: [
                {
                    equipo: '',
                    modelo: '',
                    marca: '',
                    serie: '',
                    descripcion: '',
                    empleado_id: this.props.adminView === "rh" ? this.props.empleado.id : ''
                }
            ],
            equipo: '',
        },
        equipos: [],
        options: {
            equipos: [{ value: 'alfa', label: 'alfa  1 5' }, { value: 'beta', label: 'beta' }],
            empleados: '',
        },
        activeHistorial: true,
    }

    submitAsignEquipo = async (e) => {
        e.preventDefault()
        const { form } = this.state
        let formulario = {
            id: form.equipo.data.id,
            equipo: form.equipo.data.equipo,
            marca: form.equipo.data.marca,
            modelo: form.equipo.data.modelo,
            serie: form.equipo.data.serie,
            descripcion: form.equipo.data.descripcion,
            empleado_id: this.props.adminView === "rh"? this.props.empleado.id:form.equipo.data.empleado_id

        }
    }

    
    
    componentDidMount = () => {
        this.getEquipos()
        this.getUsers()
    }

    handleChangeEmpleado = (e) => {
        const { form } = this.state
        form.empleado_id = e.value
        this.setState({ form })
    }
    

    getEquipos = async() => {
        const { at, empleado } = this.props
        if(empleado && empleado.id){
            apiGet(`v2/rh/empleados/equipos/${empleado.id}`, at).then(
                (response) => {
                    const { equipos } = response.data
                    if(equipos){
                        this.setState({
                            ...this.state,
                            equipos: equipos
                        })
                    }
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) } )
        }
    }

    //api no responde con los equipos para el select
    /* getOptions = async() => {
        waitAlert()
        const { at } = this.props
        let id = this.state.form.equipos[0].empleado_id
        apiGet(`v2/rh/empleados/equipos/${id}`, at).then( //falta url de equipos generales y no de usuario
            (response) => {
                //debugger
                if(response.data){
                   const { equipos } = response.data
                    const { options } = this.state
                    let aux =[]
                    equipos.forEach(elemento => {
                        aux.push({
                            name: elemento.serie,
                            label: `${elemento.equipo} || ${elemento.marca} || ${elemento.modelo}` ,
                            value: elemento.id.toString(),
                            data: elemento
                        })
                    })
                    
                    options.equipos = aux
                    this.setState({
                        ...this.state
                    })
                }
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) } )
    } */
    
    onSubmit = async () => {
        waitAlert()
        let aut = this.props.authUser
        const { at, empleado, authUser, adminView } = this.props
        const { form } = this.state
        let id = this.state.form.equipos[0].empleado_id
        console.log(form)
        adminView === "admin"? 
        apiPostForm(`v2/rh/empleados/equipos/${id}`, form, aut).then(
            (response) => {
                this.setState({
                    ...this.state,
                    activeHistorial: true
                })
                doneAlert(`Equipo registrado con éxito`,  () => { this.getEquipos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
        :
        apiPostForm(`v2/rh/empleados/equipos/${empleado.id}`, form, at).then(
            (response) => {
                this.setState({
                    ...this.state,
                    activeHistorial: true
                })
                doneAlert(`Equipo registrado con éxito`,  () => { this.getEquipos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })

        this.resetForm()
    }
    
    deleteEquipo = async(id) => {
        waitAlert()
        const { at, empleado } = this.props
        apiDelete(`v2/rh/empleados/equipos/${empleado.id}/equipo/${id}`, at).then(
            (response) => {
                doneAlert(`Equipo registrado con éxito`,  () => { this.getEquipos() })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    activeBtn = () => {
        let { activeHistorial } = this.state
        this.setState({
            ...this.state,
            activeHistorial: !activeHistorial
        })
        if(activeHistorial){
            this.getUsers()
        } else{
            this.getEquipos()
            
        }
    }
    
    onChangeEquipos = (key, e, name) => {
        const { value } = e.target
        const { form } = this.state
        form.equipos[key][name] = value
        this.setState({ ...this.state, form })
        console.log(form)
    }
    
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    addRowEquipo = () => { //deprecated
        const { form } = this.state
        form.equipos.push({
            equipo: '',
            modelo: '',
            marca: '',
            serie: '',
            descripcion: ''
        })
        this.setState({ ...this.state, form })
    }
    
    deleteRowEquipo = (key) => { //deprecated
        let aux = []
        const { form } = this.state
        form.equipos.forEach((element, index) => {
            if (index !== key)
                aux.push(element)
        })
        if (aux.length) {
            form.equipos = aux
        } else {
            form.equipos = [{
                equipo: '',
                modelo: '',
                marca: '',
                serie: '',
                descripcion: ''
            }]
        }
        this.setState({
            ...this.state,
            form
        })
    }

    resetForm = () => {
        this.setState({
            form: {
                tipo: '',
                equipos: [
                    {
                        equipo: '',
                        modelo: '',
                        marca: '',
                        serie: '',
                        descripcion: ''
                    }
                ],
            },
        })
    }

    updateSelect = (value, name) => {
        this.onChange({ target: { value: value, name: name } })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form, options } = this.state
        options.equipos.forEach(element => {
            if(element.value === value.value){
                form[name] = value
            }
        })
        this.setState({ ...this.state, form })
        
    }
    
    getUsers = () => {
        let aut = this.props.authUser
        apiGet('user/users/options', aut)
        .then(response => {
            console.log(response.data.empleados)
            this.setState({
                ...this.state,
                 options: {
                    ...this.state.options,  
                    empleados: response.data.empleados
                }}
            )
        })
    } 
 
    
    render() {
        const { form, activeHistorial, equipos, options } = this.state
        const {adminView, authUser, updateSelect, empleado, at} = this.props
        const reloadTableEquipos = (filter) => {
            $(`#equipos`).DataTable().search(JSON.stringify(filter)).draw();
        }

        return (
            <div>
                { adminView === "rh" ?
                    <div className="d-flex justify-content-end">
                        <button type="button" className="btn btn-sm btn-flex btn-light-info" onClick={() => { this.activeBtn() }} >
                            {
                                activeHistorial ?
                                    <div className = 'd-flex'>
                                        <span className="svg-icon">
                                            <SVG src={toAbsoluteUrl('/images/svg/Shield-protected.svg')} />
                                        </span>
                                        <div className="font-weight-bolder">ASIGNAR EQUIPO</div>
                                    </div>
                                : 
                                    <div className = 'd-flex'>
                                        <span className="svg-icon">
                                            <SVG src={toAbsoluteUrl('/images/svg/Clipboard-list.svg')} />
                                        </span>
                                        <div className="font-weight-bolder">EQUIPOS ASIGNADOS</div>
                                    </div>
                            }
                        </button>
                    </div>:null
                }
                {
                    adminView === "rh" && activeHistorial ?
                        <div className="table-responsive">
                            <table className="table w-100 table-vertical-center table-hover text-center">
                                <thead>
                                    <tr>
                                        <th className="w-5"></th>
                                        <th className="text-dark-75">Equipo</th>
                                        <th className="text-dark-75">Modelo</th>
                                        <th className="text-dark-75">Marca</th>
                                        <th className="text-dark-75">Serie</th>
                                        <th className="text-dark-75">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                
                                    {
                                        equipos.length === 0 ?
                                            <tr className="font-weight-light border-top">
                                                <td colSpan = '6' className = 'text-center'>
                                                    No hay datos disponibles
                                                </td>
                                            </tr>
                                        : 
                                            equipos[0] && equipos.map((equipo) => {
                                                return (
                                                    <tr key = { equipo.id } className="font-weight-light border-top">
                                                        <td>
                                                            <button className='btn btn-icon btn-xs btn-text-danger btn-hover-danger'
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    deleteAlert(
                                                                        `Eliminarás el equipo`,
                                                                        `¿Deseas continuar?`,
                                                                        () => { this.deleteEquipo(equipo.id) }
                                                                    )
                                                                }} >
                                                                <i className='flaticon2-rubbish-bin' />
                                                            </button>
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.equipo }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.modelo }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.marca }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.serie }
                                                        </td>
                                                        <td className = 'text-center'>
                                                            { equipo.descripcion }
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    : adminView === "rh" ? 
                    <Form id="form-equipos" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos') }}>
                    <div className="mb-8">
                        {/* <Button className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" 
                            icon='' onClick={this.addRowEquipo} text='AGREGAR EQUIPO' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" /> */}
                        <div className="mt-5">
                            {
                                form.equipos.map((equipo, key) => {
                                    return (
                                        <div key={key}>
                                            <div className="d-flex w-100" >
                                                <div className="w-auto align-self-center">
                                                    {/* <Button icon='' onClick={() => { this.deleteRowEquipo(key) }}
                                                        className="btn btn-icon btn-xs p-4 btn-bg-white btn-icon-danger btn-hover-danger"
                                                        only_icon="las la-trash text-danger icon-xl" /> */}
                                                </div>
                                                <div className="w-100">
                                                    <Row className="mx-0 form-group-marginless">
                                                        <Col md="3">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='EQUIPO'
                                                                value={form['equipos'][key]['equipo']}
                                                                withtaglabel={0}
                                                                name='equipo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'equipo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MODELO'
                                                                value={form['equipos'][key]['modelo']}
                                                                withtaglabel={0}
                                                                name='modelo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'modelo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MARCA'
                                                                value={form['equipos'][key]['marca']}
                                                                withtaglabel={0}
                                                                name='marca'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'marca')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='SERIE'
                                                                value={form['equipos'][key]['serie']}
                                                                withtaglabel={0}
                                                                name='serie'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'serie')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="3" className="mt-4 mt-lg-0 ">
                                                            <div className="form-container">
                                                                <select name = 'empleado_id' value={form.empleado_id} selected onChange={ e =>this.onChangeEquipos(key, e, 'empleado_id')}>
                                                                {adminView === "admin" ?<option hidden>elige a un colaborador</option>: null}
                                                                {
                                                                    options.empleados !== '' && adminView === "admin"?
                                                                    options.empleados.map((empleado, key) => {
                                                                        return (
                                                                            <option value={empleado.id} key={key}>{empleado.nombre}</option>
                                                                        )
                                                                    })
                                                                    : <option value={empleado.id} key={key}>{empleado.nombre}</option>
                                                                }
                                                                </select>
                                                            </div>
                                                            
                                                        </Col>
                                                        <Col md="12" className="mt-4">
                                                            <InputGray
                                                                requirevalidation={0}
                                                                placeholder='DESCRIPCIÓN'
                                                                value={form['equipos'][key]['descripcion']}
                                                                withtaglabel={0}
                                                                name='descripcion'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'descripcion')}
                                                                customclass="px-2"
                                                                as="textarea"
                                                                rows="2"
                                                            />
                                                        </Col>
                                                        
                                                    </Row>
                                                </div>
                                            </div>
                                            {
                                                form.equipos.length === 1 || key === form.equipos.length - 1 ? <></>
                                                    : <div className="separator separator-solid my-3 w-100"></div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="card-footer pt-3 pb-0 px-0 text-right">
                        <Button icon='' className="btn btn-primary" text="ENVIAR"
                            onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos'); reloadTableEquipos({}) }} />
                    </div>
                    </Form>              
                    :
                    <Form id="form-equipos" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos') }}>
                    <div className="mb-8">
                        {/* <Button className="btn btn-sm btn-bg-light btn-icon-success btn-hover-light-success text-success font-weight-bolder font-size-13px" 
                            icon='' onClick={this.addRowEquipo} text='AGREGAR EQUIPO' only_icon="flaticon2-plus icon-13px mr-2 px-0 text-success" /> */}
                        <div className="mt-5">
                            {
                                form.equipos.map((equipo, key) => {
                                    return (
                                        <div key={key}>
                                            <div className="d-flex w-100" >
                                                <div className="w-auto align-self-center">
                                                    {/* <Button icon='' onClick={() => { this.deleteRowEquipo(key) }}
                                                        className="btn btn-icon btn-xs p-4 btn-bg-white btn-icon-danger btn-hover-danger"
                                                        only_icon="las la-trash text-danger icon-xl" /> */}
                                                </div>
                                                <div className="w-100">
                                                    <Row className="mx-0 form-group-marginless">
                                                        <Col md="3">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='EQUIPO'
                                                                value={form['equipos'][key]['equipo']}
                                                                withtaglabel={0}
                                                                name='equipo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'equipo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MODELO'
                                                                value={form['equipos'][key]['modelo']}
                                                                withtaglabel={0}
                                                                name='modelo'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'modelo')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='MARCA'
                                                                value={form['equipos'][key]['marca']}
                                                                withtaglabel={0}
                                                                name='marca'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'marca')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="2" className="mt-4 mt-lg-0">
                                                            <InputGray
                                                                requirevalidation={1}
                                                                iconvalid={1}
                                                                placeholder='SERIE'
                                                                value={form['equipos'][key]['serie']}
                                                                withtaglabel={0}
                                                                name='serie'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'serie')}
                                                                customclass="px-2"
                                                            />
                                                        </Col>
                                                        <Col md="3" className="mt-4 mt-lg-0 ">
                                                            <div className="form-container">
                                                                <select name = 'empleado_id' value={form.empleado_id} selected onChange={ e =>this.onChangeEquipos(key, e, 'empleado_id')}>
                                                                <option hidden>Elige un colaborador</option>
                                                                {
                                                                    options.empleados !== '' ?
                                                                    options.empleados.map((empleado, key) => {
                                                                        return (
                                                                            <option value={empleado.id} key={key}>{empleado.nombre}</option>
                                                                        )
                                                                    })
                                                                    : null
                                                                }
                                                                </select>
                                                            </div>
                                                            
                                                        </Col>
                                                        <Col md="12" className="mt-4">
                                                            <InputGray
                                                                requirevalidation={0}
                                                                placeholder='DESCRIPCIÓN'
                                                                value={form['equipos'][key]['descripcion']}
                                                                withtaglabel={0}
                                                                name='descripcion'
                                                                withtextlabel={0}
                                                                withplaceholder={1}
                                                                withicon={0}
                                                                iconclass='las la-clipboard-list'
                                                                onChange={e => this.onChangeEquipos(key, e, 'descripcion')}
                                                                customclass="px-2"
                                                                as="textarea"
                                                                rows="2"
                                                            />
                                                        </Col>
                                                        
                                                    </Row>
                                                </div>
                                            </div>
                                            {
                                                form.equipos.length === 1 || key === form.equipos.length - 1 ? <></>
                                                    : <div className="separator separator-solid my-3 w-100"></div>
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="card-footer pt-3 pb-0 px-0 text-right">
                        <Button icon='' className="btn btn-primary" text="ENVIAR"
                            onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmit, e, 'form-equipos'); reloadTableEquipos({}) }} />
                    </div>
                    </Form>
                    
                    
                }
            </div>
        )
    }
}


export default RHLicenciasForm