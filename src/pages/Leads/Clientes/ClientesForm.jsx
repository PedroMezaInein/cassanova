import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Card } from 'react-bootstrap';
import { ClienteForm } from '../../../components/forms'
import Layout from '../../../components/layout/layout';
import { URL_DEV, CP_URL } from '../../../constants'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../../functions/alert'
class ClientesForm extends Component {
    state = {
        clientes: [],
        cliente: '',
        title: 'Nuevo cliente',
        estado: '',
        municipio: '',
        data: {
            clientes: []
        },
        formeditado: 0,
        colonias: [],
        form: {
            empresa: '',
            nombre: '',
            puesto: '',
            cp: '',
            estado: '',
            municipio: '',
            colonia: '',
            calle: '',
            perfil: '',
            rfc: '',
            contacto:''
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { match: { params: { action: action } } } = this.props
        const { history, location: { state: state } } = this.props
        const cliente = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo cliente',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.cliente) {
                        const { form } = this.state
                        const { cliente } = state
                        if (cliente.cp) {
                            this.cpAxios(cliente.cp)
                            form['cp'] = cliente.cp
                        }
                        if (cliente.colonia) {
                            form['colonia'] = cliente.colonia
                        }
                        form['empresa'] = cliente.empresa
                        form['nombre'] = cliente.nombre
                        form['puesto'] = cliente.puesto
                        form['calle'] = cliente.calle
                        form['perfil'] = cliente.perfil
                        form['rfc'] = cliente.rfc
                        this.setState({
                            ... this.state,
                            cliente: cliente,
                            title: 'Editar cliente',
                            form,
                            formeditado: 1
                        })
                    }
                    else
                        history.push('/leads/clientes')
                } else
                    history.push('/leads/clientes')
                break;
            default:
                break;
        }
    }
    onSubmit = e => {
        e.preventDefault();
        const { title } = this.state
        waitAlert()
        if (title === 'Editar cliente') {
            this.editClienteAxios();
        } else {
            this.addClienteAxios();
        }
    }
    async addClienteAxios() {
        const { access_token } = this.props.authUser
        let { form } = this.state
        await axios.post(URL_DEV + 'cliente', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/clientes'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente agregado con éxito.')
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
    async editClienteAxios() {
        const { access_token } = this.props.authUser
        const { cliente, form } = this.state
        await axios.put(URL_DEV + 'cliente/' + cliente.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { history } = this.props
                history.push({
                    pathname: '/leads/clientes'
                });
                doneAlert(response.data.message !== undefined ? response.data.message : 'Cliente editado con éxito.')
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
    updateColonia = value => {
        this.onChange({ target: { name: 'colonia', value: value } })
    }
    onChange = event => {
        const { form } = this.state
        const { name, value } = event.target
        if (name === 'empresa') {
            let cadena = value.replace(/,/g, '')
            cadena = cadena.replace(/\./g, '')
            form[name] = cadena
        } else
            form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }
    changeCP = event => {
        const { value, name } = event.target
        this.onChange({ target: { name: name, value: value } })
        if (value.length === 5)
            this.cpAxios(value)
    }
    async cpAxios(value) {
        await axios.get(CP_URL + value + '?type=simplified').then(
            (response) => {
                const { municipio, estado, asentamiento } = response.data.response
                const { cliente } = this.state
                let aux = [];
                asentamiento.map((colonia, key) => {
                    aux.push({ value: colonia, name: colonia.toUpperCase() })
                })
                this.setState({
                    ... this.state,
                    municipio,
                    estado,
                    colonias: aux
                })
                if (cliente.colonia) {
                    aux.find(function (element, index) {
                        if (element.name === cliente.colonia) {
                            this.updateColonia(element)
                        }
                    })
                }
                this.onChange({ target: { name: 'cp', value: value } })
                this.onChange({ target: { name: 'municipio', value: municipio.toUpperCase() } })
                this.onChange({ target: { name: 'estado', value: estado.toUpperCase() } })
            },
            (error) => {
            }
        ).catch((error) => {
        })
    }
    render() {
        const { form, formeditado, estado, municipio, colonias, title } = this.state
        return (
            <Layout active='leads'  {...this.props} >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <ClienteForm
                            formeditado={formeditado}
                            onChange={this.onChange}
                            form={form}
                            changeCP={this.changeCP}
                            estado={estado}
                            municipio={municipio}
                            colonias={colonias}
                            updateColonia={this.updateColonia}
                            onSubmit={this.onSubmit}
                        />
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}
const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(ClientesForm)