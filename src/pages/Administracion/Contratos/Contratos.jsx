import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { renderToString } from 'react-dom/server'
import { waitAlert, errorAlert, forbiddenAccessAlert, validateAlert, doneAlert } from '../../../functions/alert'
import { setTextTable, setDateTable, setMoneyTable, setArrayTable } from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { Tabs, Tab, Form } from 'react-bootstrap'
import { CONTRATOS_PROVEEDORES_COLUMNS, CONTRATOS_CLIENTES_COLUMNS, URL_DEV, ADJ_CONTRATOS_COLUMNS } from '../../../constants'
import { Modal, ModalDelete } from '../../../components/singles'
import { Button } from '../../../components/form-components'
import FileInput from '../../../components/form-components/FileInput'
import TableForModals from '../../../components/tables/TableForModals'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { ContratoCard } from '../../../components/cards'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
const $ = require('jquery');
class Contratos extends Component {
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
        adjuntos: [],
        modal: {
            delete: false,
            adjuntos: false,
            see: false,
        },
        // options: {
        //     empresas: [],
        //     clientes: [],
        //     proveedores: [],
        //     tiposContratos: []
        // },
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
        // title: 'Nuevo contrato de cliente',
        tipo: 'Cliente',
        contrato: '',
        clientes: [],
        key: 'cliente'
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const contratos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!contratos)
            history.push('/')
        // this.getOptionsAxios()
    }
    changePageEdit = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/contratos/edit',
            state: { contrato: contrato, tipo:'Cliente'}

        });
    }
    changePageEditProveedor = contrato => {
        const { history } = this.props
        history.push({
            pathname: '/administracion/contratos/edit',
            state: { contrato: contrato, tipo:'Proveedor'}
        });
    }
    openModalDeleteCliente = contrato => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            tipo: 'Cliente',
            contrato: contrato
        })
    }
    openModalDeleteProveedor = contrato => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            tipo: 'Proveedor',
            contrato: contrato
        })
    }
    openModalSee = contrato => {
        const { modal } = this.state
        modal.see = true
        this.setState({
            ...this.state,
            modal,
            contrato: contrato
        })
    }
    openModalAdjuntos = contrato => {
        const { modal, data } = this.state
        modal.adjuntos = true
        data.adjuntos = contrato.adjuntos
        this.setState({
            ...this.state,
            modal,
            data,
            adjuntos: this.setAdjuntos(contrato.adjuntos),
            contrato: contrato
        })
    }
    openModalDeleteAdjunto = (adjunto) => {
        MySwal.fire({
            title: '¿DESEAS ELIMINAR EL ARCHIVO?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            reverseButtons: true,
            customClass: {
                content: 'd-none',
                confirmButton: 'btn-light-danger-sweetalert2',
                cancelButton:'btn-light-gray-sweetalert2'
            }
        }).then((result) => {
            if (result.value) {
                this.deleteAdjuntoContratoAxios(adjunto.id)
            }
        })
    }
    handleCloseModalDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            contrato: ''
        })
    }
    handleCloseSee = () => {
        const { modal } = this.state
        modal.see = false
        this.setState({
            ...this.state,
            modal,
            contrato: ''
        })
    }
    handleCloseModalAdjuntos = () => {
        const { modal } = this.state
        modal.adjuntos = false
        this.setState({
            ...this.state,
            form: this.clearForm(),
            modal,
            tipo: 'Cliente',
            adjuntos: [],
            contrato: ''
        })
    }
    // async getOptionsAxios() {
    //     waitAlert()
    //     const { access_token } = this.props.authUser
    //     await axios.get(URL_DEV + 'contratos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
    //         (response) => {
    //             swal.close()
    //             const { empresas, clientes, proveedores, tiposContratos } = response.data
    //             const { options } = this.state
    //             options.empresas = setOptions(empresas, 'name', 'id')
    //             options.proveedores = setOptions(proveedores, 'razon_social', 'id')
    //             options.clientes = setOptions(clientes, 'empresa', 'id')
    //             options.tiposContratos = setOptions(tiposContratos, 'tipo', 'id')
    //             this.setState({
    //                 ...this.state,
    //                 options
    //             })
    //         },
    //         (error) => {
    //             console.log(error, 'error')
    //             if (error.response.status === 401) {
    //                 forbiddenAccessAlert()
    //             } else {
    //                 errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
    //             }
    //         }
    //     ).catch((error) => {
    //         errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
    //         console.log(error, 'error')
    //     })
    // }
    async deleteContratoAxios() {
        const { access_token } = this.props.authUser
        const { contrato } = this.state
        await axios.delete(URL_DEV + 'contratos/' + contrato.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal, key } = this.state
                if (key === 'cliente') {
                    this.getBancosAxios()
                }
                if (key === 'proveedor') {
                    this.getCajasAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                modal.delete = false
                this.setState({
                    ...this.state,
                    contrato: '',
                    modal
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
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    form[element] = new Date()
                    break;
                case 'adjuntosEliminados':
                    form[element] = []
                    break;
                case 'adjuntos':
                    form[element] = {
                        adjunto: {
                            value: '',
                            placeholder: 'Adjunto(s)',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    setContratosCliente = (contratos) => {
        let aux = []
        contratos.map((contrato) => {
            aux.push({
                actions: this.setActionsCliente(contrato),
                nombre: renderToString(setTextTable(contrato.nombre)),
                cliente: renderToString(setTextTable(contrato.cliente.empresa)),
                empresa: contrato.empresa ? renderToString(setTextTable(contrato.empresa.name)) : '',
                fechaInicio: renderToString(setDateTable(contrato.fecha_inicio)),
                fechaFin: renderToString(setDateTable(contrato.fecha_fin)),
                monto: renderToString(setMoneyTable(contrato.monto)),
                acumulado: renderToString(setMoneyTable(contrato.sumatoria ? contrato.sumatoria : 0)),
                pendiente: renderToString(setMoneyTable(contrato.sumatoria ? contrato.monto - contrato.sumatoria : contrato.monto)),
                contrato: contrato.tipo_contrato ? renderToString((setTextTable(contrato.tipo_contrato.tipo))) : '',
                descripcion: renderToString(setTextTable(contrato.descripcion)),
                id: contrato.id
            })
            return false
        })
        return aux
    }
    setContratosProveedor = (contratos) => {
        let aux = []
        contratos.map((contrato) => {
            aux.push({
                actions: this.setActionsProveedor(contrato),
                nombre: renderToString(setTextTable(contrato.nombre)),
                empresa: contrato.empresa ? renderToString(setTextTable(contrato.empresa.name)) : '',
                proveedor: renderToString(setTextTable(contrato.proveedor.razon_social)),
                fechaInicio: renderToString(setDateTable(contrato.fecha_inicio)),
                fechaFin: renderToString(setDateTable(contrato.fecha_fin)),
                monto: renderToString(setMoneyTable(contrato.monto)),
                acumulado: renderToString(setMoneyTable(contrato.sumatoria ? contrato.sumatoria : 0)),
                pendiente: renderToString(setMoneyTable(contrato.sumatoria ? contrato.monto - contrato.sumatoria : contrato.monto)),
                contrato: contrato.tipo_contrato ? renderToString((setTextTable(contrato.tipo_contrato.tipo))) : '',
                descripcion: renderToString(setTextTable(contrato.descripcion)),
                id: contrato.id
            })
            return false
        })
        return aux
    }
    setActionsCliente = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }
        )
        return aux
    }
    setActionsProveedor = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            },
            {
                text: 'Adjuntos',
                btnclass: 'info',
                iconclass: 'flaticon-attachment',
                action: 'adjuntos',
                tooltip: { id: 'adjuntos', text: 'Adjuntos', type: 'error' }
            }

        )
        return aux
    }
    setAdjuntos = adjuntos => {
        let aux = []
        adjuntos.map((documento) => {
            aux.push({
                actions: this.setActionsAdjuntos(documento),
                adjunto: renderToString(setArrayTable([{ text: documento.name, url: documento.url }])),
                id: documento.id
            })
            return false
        })
        return aux
    }
    setActionsAdjuntos = () => {
        let aux = []
        aux.push(
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'deleteAdjunto',
                tooltip: { id: 'deleteAdjunto', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    async getBancosAxios() {
        $('#kt_datatable_cliente').DataTable().ajax.reload();
    }
    async getCajasAxios() {
        $('#kt_datatable_proveedor').DataTable().ajax.reload();
    }
    controlledTab = value => {
        if (value === 'cliente') {
            this.getBancosAxios()
        }
        if (value === 'proveedor') {
            this.getCajasAxios()
        }
        this.setState({
            ...this.state,
            key: value
        })
    }
    async addAdjuntoContratoAxios() {
        const { access_token } = this.props.authUser
        const { form, contrato } = this.state
        const data = new FormData();
        let aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
            return false
        })
        await axios.post(URL_DEV + 'contratos/' + contrato.id + '/adjunto/', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contrato } = response.data
                const { data, modal, key } = this.state
                if (key === 'cliente') {
                    this.getBancosAxios()
                }
                if (key === 'proveedor') {
                    this.getCajasAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                data.adjuntos = contrato.adjuntos
                this.setState({
                    ...this.state,
                    data,
                    modal,
                    adjuntos: this.setAdjuntos(contrato.adjuntos)
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
    async deleteAdjuntoContratoAxios(adjunto) {
        const { access_token } = this.props.authUser
        const { contrato } = this.state
        await axios.delete(URL_DEV + 'contratos/' + contrato.id + '/adjunto/' + adjunto, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { contrato } = response.data
                const { modal, key } = this.state
                if (key === 'cliente') {
                    this.getBancosAxios()
                }
                if (key === 'proveedor') {
                    this.getCajasAxios()
                }
                doneAlert(response.data.message !== undefined ? response.data.message : 'El contrato fue registrado con éxito.')
                this.setState({
                    ...this.state,
                    contrato: '',
                    modal,
                    adjuntos: this.setAdjuntos(contrato.adjuntos)
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
            ...this.state,
            form
        })
    }
    onChangeAdjunto = e => {
        const { form } = this.state
        const { files, value, name } = e.target
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
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmitAdjuntos = e => {
        e.preventDefault()
        waitAlert()
        this.addAdjuntoContratoAxios()
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    render() {
        const { data, contrato, form, modal, tipo, adjuntos, key } = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Tabs defaultActiveKey="cliente" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="cliente" title="Cliente">
                        <NewTableServerRender
                            columns={CONTRATOS_CLIENTES_COLUMNS}
                            title='Contratos de clientes'
                            subtitle='Listado de contratos de clientes'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url='/administracion/contratos/add?tipo=Cliente'
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.changePageEdit },
                                'delete': { function: this.openModalDeleteCliente },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee }
                            }}
                            idTable='kt_datatable_cliente'
                            accessToken={this.props.authUser.access_token}
                            setter={this.setContratosCliente}
                            urlRender={URL_DEV + 'contratos/clientes'}
                            cardTable='cardTable_cliente'
                            cardTableHeader='cardTableHeader_cliente'
                            cardBody='cardBody_cliente'
                            isTab={true}
                        />
                    </Tab>
                    <Tab eventKey="proveedor" title="Proveedor">
                        <NewTableServerRender
                            columns={CONTRATOS_PROVEEDORES_COLUMNS}
                            title='Contratos de proveedores'
                            subtitle='Listado de contratos de proveedores'
                            mostrar_boton={true}
                            abrir_modal={false}
                            url='/administracion/contratos/add?tipo=Proveedor'
                            mostrar_acciones={true}
                            actions={{
                                'edit': { function: this.changePageEditProveedor },
                                'delete': { function: this.openModalDeleteProveedor },
                                'adjuntos': { function: this.openModalAdjuntos },
                                'see': { function: this.openModalSee }
                            }}
                            idTable='kt_datatable_proveedor'
                            accessToken={this.props.authUser.access_token}
                            setter={this.setContratosProveedor}
                            urlRender={URL_DEV + 'contratos/proveedores'}
                            cardTable='cardTable_proveedor'
                            cardTableHeader='cardTableHeader_proveedor'
                            cardBody='cardBody_proveedor'
                            isTab={true}
                        />
                    </Tab>
                </Tabs>
                <ModalDelete title={tipo === 'Cliente' ? '¿Quieres eliminar el contrato de cliente?' : '¿Quieres eliminar el contrato de proveedor?'} show={modal.delete} handleClose={this.handleCloseModalDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteContratoAxios() }}>
                </ModalDelete>
                <Modal size="xl" title='Adjuntos del contrato' show={modal.adjuntos} handleClose={this.handleCloseModalAdjuntos}>
                    <Form id="form-adjuntos"
                        onSubmit={
                            (e) => {
                                e.preventDefault();
                                validateAlert(this.onSubmitAdjuntos, e, 'form-adjuntos')
                            }
                        }
                    >
                        <div className="form-group row form-group-marginless pt-4">
                            <div className="col-md-12">
                                <FileInput
                                    requirevalidation={0}
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form.adjuntos.adjunto.placeholder}
                                    value={form.adjuntos.adjunto.value}
                                    name='adjunto'
                                    id='adjunto'
                                    accept="image/*, application/pdf"
                                    files={form.adjuntos.adjunto.files}
                                    deleteAdjunto={this.clearFiles}
                                    multiple
                                />
                            </div>
                        </div>
                        <div className="mt-3 text-center">
                            <Button icon='' className="mx-auto"
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        validateAlert(this.onSubmitAdjuntos, e, 'form-adjuntos')
                                    }
                                }
                                text="ENVIAR" />
                        </div>
                    </Form>
                    <div className="separator separator-dashed mt-1 mb-2"></div>
                    <TableForModals
                        columns={ADJ_CONTRATOS_COLUMNS}
                        data={adjuntos}
                        mostrar_acciones={true}
                        actions={{
                            'deleteAdjunto': { function: this.openModalDeleteAdjunto }
                        }}
                        elements={data.adjuntos}
                        idTable='kt_datatable_estado'
                    />
                </Modal>
                <Modal size="lg" title="Contrato" show={modal.see} handleClose={this.handleCloseSee} >
                    <ContratoCard contrato={contrato} />
                </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(Contratos);