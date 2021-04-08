import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, COMPRAS_COLUMNS } from '../../../constants'
import { setOptions, setSelectOptions, setTextTable, setDateTableReactDom, setMoneyTable, setArrayTable, setTextTableCenter, setTextTableReactDom } from '../../../functions/setters'
import { errorAlert, waitAlert, createAlert, printResponseErrorAlert, deleteAlert, doneAlert, errorAlertRedirectOnDissmis, createAlertSA2WithActionOnClose, customInputAlert } from '../../../functions/alert'
import Layout from '../../../components/layout/layout'
import { Button, FileInput, SelectSearchGray, CalendarDaySwal } from '../../../components/form-components'
import { Modal, ModalDelete } from '../../../components/singles'
import { FacturaTable } from '../../../components/tables'
import { ComprasCard } from '../../../components/cards'
import { Form } from 'react-bootstrap'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import {AdjuntosForm, FacturaExtranjera} from '../../../components/forms'
import Select from '../../../components/form-components/Select'
import { Update } from '../../../components/Lottie'
import { printSwalHeader } from '../../../functions/printers'
const $ = require('jquery');

class Compras extends Component {
    state = {
        // modal: false,
        modalDelete: false,
        modalFacturas: false,
        modalAskFactura: false,
        modalSee: false,
        modalFacturaExtranjera: false,
        title: 'Nueva compra',
        form: {
            factura: 'Sin factura',
            facturaObject: '',
            contrato: '',
            rfc: '',
            total: '',
            cliente: '',
            proveedor: '',
            proyecto: '',
            empresa: '',
            cuenta: '',
            area: '',
            subarea: '',
            comision: '',
            solicitud: '',
            //Factura
            formaPago: '',
            metodoPago: '',
            estatusPago: '',
            //Fin factura
            tipoAdjunto: 'presupuesto',
            tipoImpuesto: 0,
            tipoPago: 0,
            estatusCompra: 0,
            fecha: new Date(),
            adjuntos: {
                factura: {
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                pago: {
                    value: '',
                    placeholder: 'Pago',
                    files: []
                },
                presupuesto: {
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                },
                facturas_pdf: {
                    value: '',
                    placeholder: 'Facturas extranjeras',
                    files: []
                },
            }
        },
        options: {
            empresas: [],
            cuentas: [],
            areas: [],
            subareas: [],
            clientes: [],
            proyectos: [],
            proveedores: [],
            tiposImpuestos: [],
            tiposPagos: [],
            estatusCompras: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: [],
        },
        data: {
            clientes: [],
            empresas: [],
            cuentas: [],
            proyectos: [],
            proveedores: [],
            compras: [],
            adjuntos: []
        },
        formeditado: 0,
        solicitud: '',
        compras: [],
        compra: '',
        porcentaje: '',
        facturas: [],
        adjuntos: []
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const compras = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!compras)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                this.setState({
                    ...this.state,
                    modalSee: true
                })
                this.getCompraAxios(id)
            }
        }
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'tipoAdjunto':
                    form[element] = 'presupuesto'
                    break;
                case 'tipoImpuesto':
                case 'tipoPago':
                case 'estatusCompra':
                    form[element] = 0
                    break;
                case 'factura':
                    form[element] = 'Sin factura'
                    break;
                case 'fecha':
                    form[element] = new Date()
                    break;
                case 'adjuntos':
                    form[element] = {
                        factura: {
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        },
                        pago: {
                            value: '',
                            placeholder: 'Pago',
                            files: []
                        },
                        presupuesto: {
                            value: '',
                            placeholder: 'Presupuesto',
                            files: []
                        },
                        facturas_pdf: {
                            value: '',
                            placeholder: 'Facturas extranjeras',
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
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    handleChange = (files, item)  => {
        const { form } = this.state
        let aux = form.adjuntos[item].files
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
        this.setState({...this.state,form})
        createAlertSA2WithActionOnClose(
            '¿DESEAS AGREGAR EL ARCHIVO?',
            '',
            () => this.addAdjuntoCompraAxios(files, item),
            () => this.cleanAdjuntos(item)
        )
    }

    cleanAdjuntos = (item) => {
        const { form } = this.state
        let aux = []
        form.adjuntos[item].files.map((file) => {
            if(file.id) aux.push(file)
            return ''
        })
        form.adjuntos[item].value = ''
        form.adjuntos[item].files = aux
        this.setState({...this.state,form})
    }
    
    onChangeAdjunto = e => {
        const { form, data, options } = this.state
        const { files, value, name } = e.target
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            if (name === 'factura') {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if (extension.toUpperCase() === 'XML') {
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => {
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
                        const conceptos = xml.getElementsByTagName('cfdi:Concepto')
                        let relacionados = xml.getElementsByTagName('cfdi:CfdiRelacionados')
                        let desc = ''
                        conceptos.forEach(element => {
                            desc = desc + element.attributes.Descripcion + '. ';
                        });
                        let obj = {
                            rfc_receptor: receptor.attributes.Rfc ? receptor.attributes.Rfc : '',
                            nombre_receptor: receptor.attributes.Nombre ? receptor.attributes.Nombre : '',
                            uso_cfdi: receptor.attributes.UsoCFDI ? receptor.attributes.UsoCFDI : '',
                            rfc_emisor: emisor.attributes.Rfc ? emisor.attributes.Rfc : '',
                            nombre_emisor: emisor.attributes.Nombre ? emisor.attributes.Nombre : '',
                            regimen_fiscal: emisor.attributes.RegimenFiscal ? emisor.attributes.RegimenFiscal : '',
                            lugar_expedicion: xml.attributes.LugarExpedicion ? xml.attributes.LugarExpedicion : '',
                            fecha: xml.attributes.Fecha ? new Date(xml.attributes.Fecha) : '',
                            metodo_pago: xml.attributes.MetodoPago ? xml.attributes.MetodoPago : '',
                            tipo_de_comprobante: xml.attributes.TipoDeComprobante ? xml.attributes.TipoDeComprobante : '',
                            total: xml.attributes.Total ? xml.attributes.Total : '',
                            subtotal: xml.attributes.SubTotal ? xml.attributes.SubTotal : '',
                            tipo_cambio: xml.attributes.TipoCambio ? xml.attributes.TipoCambio : '',
                            moneda: xml.attributes.Moneda ? xml.attributes.Moneda : '',
                            numero_certificado: timbreFiscalDigital.attributes.UUID ? timbreFiscalDigital.attributes.UUID : '',
                            descripcion: desc,
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        let tipoRelacion = ''
                        if (relacionados) {
                            if (relacionados.length) {
                                relacionados = relacionados[0]
                                tipoRelacion = relacionados.attributes.TipoRelacion
                                let uuidRelacionado = xml.getElementsByTagName('cfdi:CfdiRelacionado')[0]
                                uuidRelacionado = uuidRelacionado.attributes.UUID
                                obj.tipo_relacion = tipoRelacion
                                obj.uuid_relacionado = uuidRelacionado
                            }
                        }
                        if (obj.numero_certificado === '') {
                            let NoCertificado = text.search('NoCertificado="')
                            if (NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado + 15, NoCertificado + 35)
                        }
                        let aux = ''
                        if (obj.subtotal === '') {
                            let Subtotal = text.search('SubTotal="')
                            if (Subtotal)
                                Subtotal = text.substring(Subtotal + 10)
                            aux = Subtotal.search('"')
                            Subtotal = Subtotal.substring(0, aux)
                            obj.subtotal = Subtotal
                        }
                        aux = ''
                        if (obj.total === '') {
                            let Total = text.search('Total="')
                            if (Total)
                                Total = text.substring(Total + 7)
                            aux = Total.search('"')
                            Total = Total.substring(0, aux)
                            obj.total = Total
                        }
                        if (obj.fecha === '') {
                            let Fecha = text.search('Fecha="')
                            if (Fecha)
                                Fecha = text.substring(Fecha + 7)
                            aux = Fecha.search('"')
                            Fecha = Fecha.substring(0, aux)
                            obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        data.empresas.find(function (element, index) {
                            if (element.rfc === obj.rfc_receptor) {
                                auxEmpresa = element
                            }
                            return false
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function (element, index) {
                            if(element.rfc)
                                if (element.rfc.toUpperCase() === obj.rfc_emisor.toUpperCase()) {
                                    auxProveedor = element
                                }
                            return false
                        });
                        if (auxEmpresa) {
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        } else {
                            errorAlert('No existe la empresa')
                        }
                        if (auxProveedor) {
                            form.proveedor = auxProveedor.id.toString()
                            if (auxProveedor.contratos) {
                                options['contratos'] = setOptions(auxProveedor.contratos, 'nombre', 'id')
                            }
                        } else {
                            if(obj.nombre_emisor === ''){
                                const { history } = this.props
                                errorAlertRedirectOnDissmis('LA FACTURA NO TIENE RAZÓN SOCIAL, CREA EL PROVEEDOR DESDE LA SECCIÓN DE PROVEEDORES EN LEADS.', history, '/leads/proveedores')
                            }else {
                                createAlert('NO EXISTE EL PROVEEDOR', '¿LO QUIERES CREAR?', () => this.addProveedorAxios(obj))
                            }
                        }
                        if (auxEmpresa && auxProveedor) {
                            Swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_emisor
                        this.setState({
                            ...this.state,
                            options,
                            form
                        })
                    }
                    reader.readAsText(files[counter])
                }
            }
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form['adjuntos'][name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if (aux.length < 1) {
            form['adjuntos'][name].value = ''
            if (name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    setCompras = compras => {
        let aux = []
        let _aux = []
        compras.map((compra) => {
            _aux = []
            if (compra.presupuestos) {
                compra.presupuestos.map((presupuesto) => {
                    _aux.push({
                        name: 'Presupuesto', text: presupuesto.name, url: presupuesto.url
                    })
                    return false
                })
            }
            if (compra.pagos) {
                compra.pagos.map((pago) => {
                    _aux.push({
                        name: 'Pago', text: pago.name, url: pago.url
                    })
                    return false
                })
            }
            aux.push(
                {
                    actions: this.setActions(compra),
                    identificador: renderToString(setTextTableCenter(compra.id)),
                    cuenta: renderToString(setArrayTable(
                        [
                            { name: 'Empresa', text: compra.empresa ? compra.empresa.name : '' },
                            { name: 'Cuenta', text: compra.cuenta ? compra.cuenta.nombre : '' },
                            { name: '# de cuenta', text: compra.cuenta ? compra.cuenta.numero : '' }
                        ],'153px'
                    )),
                    proyecto: setTextTableReactDom(compra.proyecto ? compra.proyecto.nombre : '', this.doubleClick, compra, 'proyecto', 'text-center'),
                    proveedor: renderToString(setTextTable(compra.proveedor ? compra.proveedor.razon_social : '')),
                    factura: renderToString(setTextTable(compra.factura ? 'Con factura' : 'Sin factura')),
                    monto: renderToString(setMoneyTable(compra.monto)),
                    comision: renderToString(setMoneyTable(compra.comision ? compra.comision : 0.0)),
                    impuesto: setTextTableReactDom(compra.tipo_impuesto ? compra.tipo_impuesto.tipo : 'Sin definir', this.doubleClick, compra, 'tipoImpuesto', 'text-justify'),
                    tipoPago: setTextTableReactDom(compra.tipo_pago.tipo, this.doubleClick, compra, 'tipoPago', 'text-justify'),
                    descripcion: setTextTableReactDom(compra.descripcion !== null ? compra.descripcion :'', this.doubleClick, compra, 'descripcion', 'text-justify'),
                    area: renderToString(setTextTableCenter(compra.subarea ? compra.subarea.area ? compra.subarea.area.nombre : '' : '')),
                    subarea: renderToString(setTextTableCenter(compra.subarea ? compra.subarea.nombre : '')),
                    estatusCompra: setTextTableReactDom(compra.estatus_compra ? compra.estatus_compra.estatus : '', this.doubleClick, compra, 'estatusCompra', 'text-justify'),
                    total: renderToString(setMoneyTable(compra.total)),
                    fecha: setDateTableReactDom(compra.created_at, this.doubleClick, compra, 'fecha', 'text-center'),
                    id: compra.id,
                    objeto: compra
                }
            )
            return false
        })
        return aux
    }
    doubleClick = (data, tipo) => {
        const { form } = this.state
        switch(tipo){
            case 'proyecto':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'fecha':
                form.fecha = new Date(data.created_at)
                break
            case 'tipoImpuesto':
                form[tipo] = data.tipo_impuesto.id
                break
            case 'tipoPago':
                form[tipo] = data.tipo_pago.id
                break
            case 'estatusCompra':
                form[tipo] = data.estatus_compra.id
                break
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    tipo === 'descripcion' &&
                        <div className="input-group input-group-solid rounded-0 mb-2 mt-7">
                            <textarea name="descripcion" rows="6" id='descripcion-form' defaultValue = { data.descripcion }
                                onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} }
                                className="form-control text-dark-50 font-weight-bold form-control text-uppercase text-justify">
                            </textarea>
                        </div>
                }
                {
                    (tipo === 'tipoImpuesto') || (tipo === 'tipoPago') || (tipo === 'estatusCompra')?
                        <div className="input-icon my-3">
                            <span className="input-icon input-icon-right">
                                <span>
                                    <i className={"flaticon2-search-1 icon-md text-dark-50"}></i>
                                </span>
                            </span>
                            <Form.Control className = "form-control text-uppercase form-control-solid"
                                onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } name = { tipo }
                                defaultValue = { form[tipo] } as = "select">
                                <option value={0}>{this.setSwalPlaceholder(tipo)}</option>
                                {
                                    this.setOptions(data, tipo).map((tipo, key) => {
                                        return (
                                            <option key={key} value={tipo.value} className="bg-white" >{tipo.text}</option>
                                        )
                                    })
                                }
                            </Form.Control>
                        </div>
                    :<></>
                }
                {
                    tipo === 'fecha' ?
                        <CalendarDaySwal value = { form[tipo] } onChange = { (e) => {  this.onChangeSwal(e.target.value, tipo)} } name = { tipo } date = { form[tipo] } withformgroup={0} />
                    :<></>
                }
                {
                    // ||(tipo === 'cliente') || (tipo === 'empresa') || (tipo === 'tipo_contrato') 
                    (tipo === 'proyecto')  ?
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                        onChange = { (value) => { this.onChangeSwal(value, tipo)} } name = { tipo }
                        value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                        placeholder={this.setSwalPlaceholder(tipo)}/>
                    :<></>
                }
            </div>,
            <Update />,
            () => { this.patchCompras(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    setSwalPlaceholder = (tipo) => {
        switch(tipo){
            case 'proyecto':
                return 'SELECCIONA EL PROYECTO'
            case 'tipoImpuesto':
                return 'SELECCIONA EL IMPUESTO'
            case 'tipoPago':
                return 'SELECCIONA EL TIPO DE PAGO'
            case 'estatusCompra':
                return 'SELECCIONA EL ESTATUS DE COMPRA'
            default:
                return ''
        }
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchCompras = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/proyectos/compras/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El rendimiento fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'estatusCompra':
                return options.estatusCompras
            case 'tipoPago':
                return options.tiposPagos
            case 'tipoImpuesto':
                return options.tiposImpuestos
            case 'proyecto':
                return options.proyectos
            default: return []
        }
    }
    
    setActions = compra => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
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
                tooltip: { id: 'adjuntos', text: 'Adjuntos'}
            },
            {
                text: 'Factura&nbsp;extranjera',
                btnclass: 'warning',
                iconclass: 'flaticon-interface-10',
                action: 'facturaExtranjera',
                tooltip: { id: 'facturaExtranjera', text: 'Factura extranjera'},
            }
        )
        if (compra.factura) {
            aux.push(
                {
                    text: 'Facturas',
                    btnclass: 'dark',
                    iconclass: 'flaticon2-paper',
                    action: 'facturas',
                    tooltip: { id: 'taxes', text: 'Facturas' },
                }
            )
        }
        return aux
    }
    
    changePageEdit = compra => {
        const { history } = this.props
        history.push({
            pathname: '/proyectos/compras/edit',
            state: { compra: compra },
            formeditado: 1
        });
    }
    openModalDelete = (compra) => {
        this.setState({
            ...this.state,
            modalDelete: true,
            compra: compra
        })
    }

    openModalDeleteAdjuntos = adjunto => {
        deleteAlert('¿SEGURO DESEAS BORRAR EL ADJUNTO?', adjunto.name, () => { waitAlert(); this.deleteAdjuntoAxios(adjunto.id) })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            compra: ''
        })
    }
    handleCloseFacturas = () => {
        this.setState({
            ...this.state,
            modalFacturas: false,
            venta: '',
            facturas: [],
            porcentaje: 0,
            form: this.clearForm()
        })
    }
    handleCloseAdjuntos = () => {
        const { data } = this.state
        data.adjuntos = []
        this.setState({
            ...this.state,
            modalAdjuntos: false,
            modalFacturaExtranjera: false,
            form: this.clearForm(),
            adjuntos: [],
            data
        })
    }

    handleCloseSee = () => { this.setState({ ...this.state, modalSee: false, compra: '' }) }
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }

    openModalSee = async(compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/compras/${compra.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                Swal.close()
                this.setState({ ...this.state, modalSee: true, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openFacturaExtranjera = async(compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/compras/adjuntos/${compra.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { compra } = response.data
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                Swal.close()
                this.setState({ ...this.state, form, modalFacturaExtranjera: true, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalAdjuntos = async(compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/compras/adjuntos/${compra.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { form } = this.state
                const { compra } = response.data
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                Swal.close()
                this.setState({ ...this.state, form, modalAdjuntos: true, compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    openModalFacturas = async(compra) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/compras/facturas/${compra.id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                form = this.clearForm()
                if(compra)
                    if(compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, modalFacturas: true, compra, facturas: compra.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addProveedorAxios = async (obj) => {
        const { access_token } = this.props.authUser
        const data = new FormData();
        let cadena = obj.nombre_emisor.replace(' S. C.', ' SC').toUpperCase()
        cadena = cadena.replace(',S.A.', ' SA').toUpperCase()
        cadena = cadena.replace(/,/g, '').toUpperCase()
        cadena = cadena.replace(/\./g, '').toUpperCase()
        data.append('nombre', cadena)
        data.append('razonSocial', cadena)
        data.append('rfc', obj.rfc_emisor.toUpperCase())
        await axios.post(URL_DEV + 'proveedores', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proveedores } = response.data
                const { options, data, form } = this.state
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                data.proveedores = proveedores
                proveedores.map((proveedor) => {
                    if (proveedor.razon_social === cadena)
                        form.proveedor = proveedor.id.toString()
                    return false
                })
                this.setState({ ...this.state, form, data, options })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getComprasAxios = async() => { $('#compras').DataTable().ajax.reload(); }
    
    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.get(URL_DEV + 'compras/options', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, areas, tiposPagos, tiposImpuestos, estatusCompras, proyectos,
                    proveedores, formasPago, metodosPago, estatusFacturas } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions(tiposPagos, 'tipo')
                options['tiposImpuestos'] = setSelectOptions(tiposImpuestos, 'tipo')
                options['estatusCompras'] = setSelectOptions(estatusCompras, 'estatus')
                options['estatusFacturas'] = setOptions(estatusFacturas, 'estatus', 'id')
                options['formasPago'] = setOptions(formasPago, 'nombre', 'id')
                options['metodosPago'] = setOptions(metodosPago, 'nombre', 'id')
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getCompraAxios = async (id) => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/proyectos/compras/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                this.setState({ ...this.state, compra: compra })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteCompraAxios = async() => {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(URL_DEV + 'compras/' + compra.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getComprasAxios()
                this.setState({ ...this.state, form: this.clearForm(), modalDelete: false, })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue eliminado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    sendFacturaAxios = async() => {
        const { access_token } = this.props.authUser
        const { form, compra } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'estatusCompra':
                    data.append(element, form[element]);
                    break;
                default: break
            }
            return false
        })
        aux = Object.keys(form.adjuntos)
        aux.map((element) => {
            if (form.adjuntos[element].value !== '' && element === 'factura') {
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
                return false
            }
            return false
        })
        data.append('id', compra.id)
        await axios.post(`${URL_DEV}v2/proyectos/compras/${compra.id}/factura`, data, { headers: {'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                form = this.clearForm()
                if(compra)
                    if(compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.')
                this.setState({ ...this.state, form, modalFacturas: true, compra, facturas: compra.facturas })
                this.getComprasAxios()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    deleteFacturaAxios = async(id) => {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(`${URL_DEV}v2/proyectos/compras/${compra.id}/facturas/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                let { form } = this.state
                const { compra } = response.data
                form = this.clearForm()
                if(compra)
                    if(compra.estatus_compra)
                        form.estatusCompra = compra.estatus_compra.id
                Swal.close()
                this.setState({ ...this.state, form, compra, facturas: compra.facturas })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    exportComprasAxios = async() =>{
        let headers = []
        let documento = ''
        COMPRAS_COLUMNS.map((columna, key) => {
            if (columna !== 'actions' && columna !== 'adjuntos') {
                documento = document.getElementById(columna.accessor+'-compras')
                if (documento) {
                    if (documento.value) {
                        headers.push({
                            name: columna.accessor,
                            value: documento.value
                        })
                    }
                }
            }
            return false
        })
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.post(`${URL_DEV}v2/exportar/proyectos/compras`, { columnas: headers }, { responseType: 'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'compras.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addAdjuntoCompraAxios = async(files, item)=>{
        waitAlert()
        const { access_token } = this.props.authUser
        const { compra } = this.state
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        data.append('tipo', item)
        data.append('id', compra.id)
        await axios.post(`${URL_DEV}v2/proyectos/compras/${compra.id}/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                const { form } = this.state
                form.adjuntos.pago.files = compra.pagos
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                this.getComprasAxios()
                this.setState({ ...this.state, form })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteAdjuntoAxios = async (id) => {
        const { access_token } = this.props.authUser
        const { compra } = this.state
        await axios.delete(`${URL_DEV}v2/proyectos/compras/${compra.id}/adjuntos/${id}`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { compra } = response.data
                const { form } = this.state
                form.adjuntos.presupuesto.files = compra.presupuestos
                form.adjuntos.pago.files = compra.pagos
                form.adjuntos.facturas_pdf.files = compra.facturas_pdf
                this.setState({...this.state, form })
                this.getComprasAxios()
                doneAlert(response.data.message !== undefined ? response.data.message : 'Eliminaste el adjunto con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    addFacturaExtranjera= async(files, item)=>{
        waitAlert()
        const { access_token } = this.props.authUser
        const data = new FormData();
        files.map((file) => {
            data.append(`files_name_${item}[]`, file.name)
            data.append(`files_${item}[]`, file)
            return ''
        })
        await axios.post(`${URL_DEV}compras/adjuntos`, data, { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({ ...this.state })
                doneAlert(response.data.message !== undefined ? response.data.message : 'Archivo adjuntado con éxito.')
            },
            (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const {modalDelete, modalFacturas, modalAdjuntos, form, options, compras, facturas, compra, data, modalSee, modalFacturaExtranjera } = this.state
        return (
            <Layout active={'proyectos'}  {...this.props}>
                <NewTableServerRender columns={COMPRAS_COLUMNS} data={compras}
                    title='Compras' subtitle='Listado de compras'
                    url='/proyectos/compras/add'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete },
                        'facturas': { function: this.openModalFacturas },
                        'adjuntos': { function: this.openModalAdjuntos },
                        'see': { function: this.openModalSee },
                        'facturaExtranjera': { function: this.openFacturaExtranjera}
                    }}
                    elements={data.compras}
                    idTable='compras'
                    exportar_boton={true}
                    onClickExport={() => this.exportComprasAxios()}
                    accessToken={this.props.authUser.access_token}
                    setter={this.setCompras}
                    urlRender = { `${URL_DEV}v2/proyectos/compras`}
                    validateFactura={true}
                    tipo_validacion='compras'
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'
                />
                <ModalDelete title={"¿Estás seguro que deseas eliminar la compra?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); waitAlert(); this.deleteCompraAxios() }}>
                </ModalDelete>
                <Modal size="xl" title={"Facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas}>
                    {/* <div className="form-group row form-group-marginless pt-4">
                        <div className="col-md-12">
                            <ProgressBar animated label={`${porcentaje}`}
                                variant={porcentaje > 100 ? 'danger' : porcentaje > 75 ? 'success' : 'warning'}
                                now={porcentaje} />
                        </div>
                    </div> */}
                    <Form onSubmit={(e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios(); }}>
                        <div className="row mx-0 pt-4">
                            <div className="col-md-6 px-2">
                                <FileInput
                                    onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder={form['adjuntos']['factura']['placeholder']}
                                    value={form['adjuntos']['factura']['value']}
                                    name={'factura'}
                                    id={'factura'}
                                    accept="text/xml, application/pdf"
                                    files={form['adjuntos']['factura']['files']}
                                    deleteAdjunto={this.clearFiles} multiple />
                            </div>
                            <div className="col-md-6 px-2">
                                <Select
                                    requirevalidation={1}
                                    formeditado={1}
                                    placeholder="SELECCIONA EL ESTATUS DE COMPRA"
                                    options={options.estatusCompras}
                                    name="estatusCompra"
                                    value={form.estatusCompra}
                                    onChange={this.onChange}
                                    iconclass={"flaticon2-time"}
                                    messageinc="Incorrecto. Selecciona el estatus de compra."
                                />
                            </div>
                            <div className="col-md-12 px-2 align-items-center d-flex mt-4">
                                <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                            </div>
                        </div>
                    </Form>
                    <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
                </Modal>
                <Modal size = "xl" title = "Adjuntos" show = { modalAdjuntos } handleClose = { this.handleCloseAdjuntos } >
                    <AdjuntosForm form = { form } onChangeAdjunto = { this.handleChange } deleteFile = { this.openModalDeleteAdjuntos } />
                </Modal>
                <Modal size="lg" title="Compra" show={modalSee} handleClose={this.handleCloseSee} >
                    <ComprasCard compra={compra} />
                </Modal>
                <Modal size="lg" title="Factura extranjera" show={modalFacturaExtranjera} handleClose={this.handleCloseAdjuntos} >
                    <FacturaExtranjera form={form}  onChangeAdjunto = { this.handleChange }  deleteFile = { this.openModalDeleteAdjuntos }/>
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(Compras);