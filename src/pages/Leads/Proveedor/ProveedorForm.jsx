import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setOptions, setSelectOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ProveedorForm as ProveedorFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import Swal from 'sweetalert2'

import moment from 'moment'

class ProveedorForm extends Component {
    state = {
        title: 'Nuevo proveedor',
        form: {
            nombre: '',
            razonSocial: '',
            rfc: '',
            correo: '',
            telefono: '',
            cuenta: '',
            numCuenta: '',
            tipo: 0,
            banco: 0,
            leadId: '',
            area: '',
            subarea: '',
            fecha_sociedad: new Date(),
            nombre_persona: '',
            direccion_persona: '',
            rfc_persona: '',
            telefono_persona: '',
            email_persona: '',
            tipo_consta: 'indicacion',
            numero_consta: '',
            nombre_notario: '',
            numero_notario: '',
            ciudad_notario: '',
            nombre_representante: '',
            tipo_persona: 'indicacion',
        },
        data: {
            proveedores: []
        },
        formeditado: 0,
        options: {
            areas: [],
            subareas: [],
            bancos: [],
            tipos: [], 
            tipo_persona: [
                { text: "SELECCIONA TIPO DE PERSONA", value: 'indicacion' },
                { text: "Persona Fisica", value: "personaFisica" },
                { text: "Persona Moral", value: "personaMoral" },
            ],
            tipo_consta: [
                { text: "SELECCIONA TIPO DE ACTA CONSTITUTIVA", value: 'indicacion' },
                { text: "El libro", value: "elLibro" },
                { text: "La poliza", value: "laPoliza" },
            ]
        },
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        let { personaElementos } = this.state
        this.setState({
            ...this.state,
            personaElementos,
        })
        const proveedores = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        })
        personaElementos = true;
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo proveedor',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.proveedor) {
                        this.setProveedor(state.proveedor)
                        this.setState({
                            ...this.state,
                            title: 'Editar proveedor',
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/leads/proveedores')
                } else
                    history.push('/leads/proveedores')
                break;
            case 'convert':
                if (state) {
                    if (state.lead) {
                        this.setLead(state.lead)
                        this.setState({
                            ...this.state,
                            title: 'Convertir lead en proveedor',
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/leads/proveedores')
                } else
                    history.push('/leads/proveedores')
                break;
            default:
                break;
        }
        if (!proveedores)
            history.push('/')
        this.getOptionsAxios()
        // if(this.state.form.tipo_persona!== "personaMoral"  ){
        //     let cambioClaseM = document.getElementsByClassName('personaMoralContenedor')
        //     cambioClaseM.classList.add('d-none')
        //     }

    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipo':
                case 'banco':
                    form[element] = 0
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        if (name === 'razonSocial') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    isActiveFactura = () => {
        const { form } = this.state
        const { type } = this.props
        if (type !== 'edit') {
            if (form.factura === 'Con factura') {
                return true
            }
            else {
                form.adjuntos.xml.value = ''
                form.adjuntos.xml.files = []
                form.adjuntos.pdf.files = []
                form.adjuntos.pdf.value = ''
            }
        }

        return false
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        waitAlert()
        if (title === 'Editar proveedor')
            this.updateProveedorAxios()
        else
            this.addProveedorAxios()
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    setProveedor = proveedor => {
        const { form, options } = this.state
        form.nombre = proveedor.nombre
        form.razonSocial = proveedor.razon_social
        form.rfc = proveedor.rfc
        form.correo = proveedor.email
        form.telefono = proveedor.telefono
        form.cuenta = proveedor.cuenta
        form.numCuenta = proveedor.numero_cuenta
        form.banco = proveedor.banco ? proveedor.banco.id : 0
        form.tipo = proveedor.tipo_cuenta ? proveedor.tipo_cuenta.id : 0
        form.tipo_persona = proveedor.tipo_persona
        form.nombre_persona = proveedor.nombre_persona
        form.direccion_persona = proveedor.direccion_persona
        form.rfc_persona = proveedor.rfc_persona
        form.telefono_persona = proveedor.telefono_persona
        form.email_persona = proveedor.email_persona
        form.tipo_consta = proveedor.tipo_consta
        form.numero_consta = proveedor.numero_consta
        form.nombre_notario = proveedor.nombre_notario
        form.numero_notario = proveedor.numero_notario
        form.ciudad_notario = proveedor.ciudad_notario
        form.fecha_sociedad = proveedor.fecha_sociedad !== null ? new Date(moment(proveedor.fecha_sociedad)) : ''
        form.nombre_representante = proveedor.nombre_representante

        if (proveedor.subarea) {
            form.area = proveedor.subarea.area.id.toString()
            options['subareas'] = setOptions(proveedor.subarea.area.subareas, 'nombre', 'id')
            form.subarea = proveedor.subarea.id.toString()
        }
        this.setState({
            ...this.state,
            options,
            proveedor: proveedor,
            form
        })
    }
    setLead = lead => {
        const { form } = this.state
        form.nombre = lead.nombre
        form.correo = lead.email
        form.telefono = lead.telefono
        form.leadId = lead.id
        this.setState({
            ...this.state,
            form
        })
    }
    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(URL_DEV + 'proveedores/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { areas, bancos, tipos_cuentas } = response.data
                const { options } = this.state
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['bancos'] = setSelectOptions(bancos, 'nombre')
                options['tipos'] = setSelectOptions(tipos_cuentas, 'tipo')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async addProveedorAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'proveedores', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    title: ''
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/leads/proveedores'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
                console.log(error.message)
                if(error.message ==='Request failed with status code 400'){
                    errorAlert('Favor de completar todos los campos de la persona moral, intenta de nuevo.')
                }else{   printResponseErrorAlert(error)  }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    async updateProveedorAxios() {
        const { access_token } = this.props.authUser
        const { form, proveedor, } = this.state
        await axios.put(URL_DEV + 'proveedores/' + proveedor.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                    title: '',
                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El provedor fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/leads/proveedores'
                });
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { form, title, options, formeditado} = this.state
        return (
            <Layout active={'leads'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0 heightCard">
                        <ProveedorFormulario
                            formeditado={formeditado}
                            title={title}
                            form={form}
                            onChange={this.onChange}
                            options={options}
                            setOptions={this.setOptions}
                            onSubmit={this.onSubmit}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ProveedorForm);