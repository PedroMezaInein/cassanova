import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV } from '../../../constants'
import { setOptions } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { ContratoForm as ContratoFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
class ContratosForm extends Component {
    state = {
        contratos: {
            clientes: [],
            proveedores: []
        },
        data: {
            clientes: [],
            contratos: {
                clientes: [],
                proveedores: []
            },
            adjuntos: []
        },
        formeditado: 0,
        adjuntos: [],
        options: {
            empresas: [],
            clientes: [],
            proveedores: [],
            tiposContratos: []
        },
        form: {
            cliente: '',
            proveedor: '',
            empresa: '',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            monto: '',
            tipoContrato: '',
            descripcion: '',
            tipo: 'cliente',
            nombre: '',
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        title: 'Nuevo contrato de cliente',
        contrato: '',
        clientes: [],
    }
    componentDidMount() {
        let queryString = this.props.history.location.search
        let tipo = ''
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let type = params.get("tipo")
            if (type) {
                tipo = type
            }
        }
        let tipo_contrato=tipo
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { match: { params: { action: action } } } = this.props
        const { history, location: { state: state } } = this.props
        const contratos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        if (!contratos)
            history.push('/')
        this.getOptionsAxios()
        let aux =action
        aux = aux.split('?')
        switch (aux[0]) {
            case 'add':
                this.setState({
                    ... this.state,
                    tipo: tipo_contrato,
                    title: 'Nuevo contrato de '+tipo_contrato,
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.contrato) {
                        const { form } = this.state
                        const { contrato, tipo } = state
                        if (contrato.empresa) {
                            form.empresa = contrato.empresa.id.toString()
                        }
                        if (tipo === 'Cliente') 
                            if (contrato.cliente) {
                                form.cliente = contrato.cliente.id.toString()
                            }
                        if (tipo === 'Proveedor') 
                            if (contrato.proveedor) {
                                form.proveedor = contrato.proveedor.id.toString()
                            }
                        form.fechaInicio = new Date(contrato.fecha_inicio)
                        form.fechaFin = new Date(contrato.fecha_fin)
                        form.descripcion = contrato.descripcion
                        if (contrato.tipo_contrato)
                            form.tipoContrato = contrato.tipo_contrato.id.toString()
                        form.monto = contrato.monto
                        form.nombre = contrato.nombre
                        let aux = []
                        if (contrato.adjuntos)
                            contrato.adjuntos.map((adj) => {
                                aux.push(
                                    {
                                        name: adj.name, url: adj.url
                                    }
                                )
                            })
                        form.adjuntos.adjunto.files = aux
                        this.setState({
                            ... this.state,
                            form,
                            contrato: contrato,
                            tipo: tipo,
                            title: 'Editar contrato de '+tipo,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/administracion/contratos')
                } else
                    history.push('/administracion/contratos')
                break;
            default:
                break;
        }
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        const { title, tipo, form } = this.state
        if (tipo === 'Cliente') {
            form.tipo = 'cliente'
        }
        if (tipo === 'Proveedor') {
            form.tipo = 'proveedor'
        }
        this.setState({
            ... this.state,
            form
        })
        waitAlert()
        let aux = title.split(' ');
        if (aux.length) {
            if (aux[0] === 'Editar') {
                this.updateContratoAxios()
            } else {
                this.addContratoAxios()
            }
        }
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    // onChangeAdjunto = e => {
    //     const { form } = this.state
    //     const { files, value, name } = e.target
    //     let aux = []
    //     for (let counter = 0; counter < files.length; counter++) {
    //         aux.push(
    //             {
    //                 name: files[counter].name,
    //                 file: files[counter],
    //                 url: URL.createObjectURL(files[counter]),
    //                 key: counter
    //             }
    //         )
    //     }
    //     form.adjuntos[name].value = value
    //     form.adjuntos[name].files = aux
    //     this.setState({
    //         ... this.state,
    //         form
    //     })
    // }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'contratos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const { empresas, clientes, proveedores, tiposContratos } = response.data
                const { options } = this.state
                options.empresas = setOptions(empresas, 'name', 'id')
                options.proveedores = setOptions(proveedores, 'razon_social', 'id')
                options.clientes = setOptions(clientes, 'empresa', 'id')
                options.tiposContratos = setOptions(tiposContratos, 'tipo', 'id')
                this.setState({
                    ... this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async addContratoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })
        await axios.post(URL_DEV + 'contratos', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/administracion/contratos'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updateContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        await axios.put(URL_DEV + 'contratos/' + contrato.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/administracion/contratos'
                });
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ... this.state,
            form
        })
    }
    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })
    }
    render() {
        const { title, options, form, tipo, formeditado } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ContratoFormulario
                            tipo={tipo}
                            options={options}
                            form={form}
                            onChange={this.onChange}
                            onSubmit={this.onSubmit}
                            formeditado={formeditado}
                            onChangeRange={this.onChangeRange}
                            // onChangeAdjunto={this.onChangeAdjunto}
                            clearFiles={this.clearFiles}
                            title={title}
                            handleChange={this.handleChange}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContratosForm);