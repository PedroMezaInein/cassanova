import React, { Component } from 'react'
import Swal from 'sweetalert2'
import j2xParser from 'fast-xml-parser'
import { Form, Col } from 'react-bootstrap'
import { FacturaTable } from '../../components/tables'
import withReactContent from 'sweetalert2-react-content'
import { setOptionsWithLabel } from '../../functions/setters'
import { FileInput, Button, ReactSelectSearchGray } from '../form-components'
import { apiGet, apiOptions, apiPostForm, apiPutForm, apiDelete, catchErrors } from '../../functions/api'
import { validateAlert, waitAlert, errorAlert, printResponseErrorAlert, doneAlert } from '../../functions/alert'

class PermisosForm extends Component {
    state = {
        form: {
            estatusCompra: '',
            facturaObject: null,
            factura: null,
            adjuntos: {
                xml: {
                    files: [], value: ''
                },
                pdf: {
                    files: [], value: ''
                }
            },
        },
        options: {
            clientes: [],
            empresa: [],
            proveedores: [],
            estatusCompra: []
        },
        response: {},
        facturas: [],
        url_factura:''
    }
    componentDidMount = () => {
        this.getOptions()
        this.getFacturas()
    }
    getOptions = async() => {
        const { tipo_factura, at } = this.props
        apiOptions(`v2/administracion/facturas/${tipo_factura}`, at).then(
            (response) => {
                const { estatusCompras, clientes, empresas, proveedores } = response.data
                const { options } = this.state
                options.clientes = setOptionsWithLabel(clientes, 'empresa', 'id')
                options.empresa = setOptionsWithLabel(empresas, 'name', 'id')
                options.proveedores = setOptionsWithLabel(proveedores, "razon_social", "id")
                options.estatusCompra = setOptionsWithLabel(estatusCompras, 'estatus', 'id')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }
    getFacturas = () => {
        waitAlert()
        const { at } = this.props
        apiGet(this.getUrl('getFacturas'), at).then(
            (response) => {                
                this.getResponse(response.data)
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    getUrl = (type, id_factura) => {
        const { id, tipo_factura } = this.props
        let url = ''
        switch (type) {
            case 'getFacturas':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/facturas/${id}`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/facturas/${id}`
                        break;
                    default:
                        break;
                }
                break;
            case 'deleteFactura':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/${id}/facturas/${id_factura}`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/${id}/facturas/${id_factura}`
                        break;
                    default:
                        break;
                }
                break;
            case 'sendFactura':
                switch (tipo_factura) {
                    case 'compras':
                    case 'ventas':
                        url = `v2/proyectos/${tipo_factura}/${id}/factura`
                        break;
                    case 'egresos':
                    case 'ingresos':
                        url = `v2/administracion/${tipo_factura}/${id}/factura`
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        return url
    }
    getResponse = (response) => {
        const { options, form } = this.state
        let { facturas } = this.state
        let aux = ''
        if(response.compra){
            aux = response.compra
            facturas = aux.facturas
        }else if(response.venta){
            aux = response.venta
            facturas = aux.facturas
        }else if(response.ingreso){
            aux = response.ingreso
            facturas = aux.facturas
        }else{
            aux = response.egreso
            facturas = aux.facturas
        }
        
        if (aux.estatus_compra) {
            let estatus = options.estatusCompra.find((elemento) => {
                return elemento.value === aux.estatus_compra.id.toString()
            })
            form.estatusCompra = estatus
        }
        this.setState({ ...this.state, form, facturas })
    }
    deleteFactura = id => { waitAlert(); this.deleteFacturaAxios(id) }
    
    deleteFacturaAxios = async (id) => {
        const { at } = this.props
        apiDelete(this.getUrl('deleteFactura', id), at).then(
            (response) => {
                this.getResponse(response.data)
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    updateSelect = ( value, name) => {
        if (value === null) {
            value = []
        }
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    onChangeFactura = (e) => {
        waitAlert()
        const MySwal = withReactContent(Swal)
        const { files, name, value } = e.target
        const { form } = this.state
        form.adjuntos[name].files = []
        form.facturaObject = {}
        form.factura = ''
        form.adjuntos[name].value = value
        files.forEach((file, index) => {
            form.adjuntos[name].files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        const reader = new FileReader()
        reader.onload = async (event) => { 
            const text = (event.target.result)
            let jsonObj = j2xParser.parse(text, {
                ignoreAttributes: false,
                attributeNamePrefix: ''
            })
            if(jsonObj['cfdi:Comprobante']){
                jsonObj = jsonObj['cfdi:Comprobante']
                const keys = Object.keys(jsonObj)
                let obj = { }
                let errores = []
                if( keys.includes('cfdi:Receptor') ){
                    obj.rfc_receptor = jsonObj['cfdi:Receptor']['Rfc']
                    obj.nombre_receptor = jsonObj['cfdi:Receptor']['Nombre']
                    obj.uso_cfdi = jsonObj['cfdi:Receptor']['UsoCFDI']
                }else{ errores.push( 'El XML no tiene el receptor' ) }
                if( keys.includes('cfdi:Emisor') ){
                    obj.rfc_emisor = jsonObj['cfdi:Emisor']['Rfc']
                    obj.nombre_emisor = jsonObj['cfdi:Emisor']['Nombre']
                    obj.regimen_fiscal = jsonObj['cfdi:Emisor']['RegimenFiscal']
                }else{ errores.push( 'El XML no tiene el emisor' ) }
                obj.lugar_expedicion = jsonObj['LugarExpedicion']
                obj.fecha = jsonObj['Fecha'] ? new Date(jsonObj['Fecha']) : null
                obj.metodo_pago = jsonObj['MetodoPago']
                obj.tipo_de_comprobante = jsonObj['TipoDeComprobante']
                obj.total = jsonObj['Total']
                obj.subtotal = jsonObj['SubTotal']
                obj.tipo_cambio = jsonObj['TipoCambio']
                obj.moneda = jsonObj['Moneda']
                if( keys.includes('cfdi:Complemento') ){
                    if(jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']){
                        obj.numero_certificado = jsonObj['cfdi:Complemento']['tfd:TimbreFiscalDigital']['UUID']
                    }else{ errores.push( 'El XML no tiene el UUID' ) }
                }else{ errores.push( 'El XML no tiene el UUID' ) }
                obj.descripcion = ''
                if( keys.includes('cfdi:Conceptos') ){
                    if( jsonObj['cfdi:Conceptos']['cfdi:Concepto'] ){
                        if(Array.isArray(jsonObj['cfdi:Conceptos']['cfdi:Concepto'])){
                            jsonObj['cfdi:Conceptos']['cfdi:Concepto'].forEach((element, index) => {
                                if(index){
                                    obj.descripcion += ' - '
                                }
                                obj.descripcion += element['Descripcion']
                            })
                        }else{
                            obj.descripcion += jsonObj['cfdi:Conceptos']['cfdi:Concepto']['Descripcion']
                        }
                    }
                }
                obj.folio = jsonObj['Folio']
                obj.serie = jsonObj['Serie']
                if(keys.includes('cfdi:CfdiRelacionados')){
                    if(Array.isArray(jsonObj['cfdi:CfdiRelacionados'])){
                        obj.tipo_relacion = jsonObj['cfdi:CfdiRelacionados'][0]['TipoRelacion']   
                    }
                }
                if(keys.includes('cfdi:CfdiRelacionado')){
                    if(Array.isArray(jsonObj['cfdi:CfdiRelacionado'])){
                        obj.uuid_relacionado = jsonObj['cfdi:CfdiRelacionado'][0]['UUID']   
                    }
                }
                if(errores.length){
                    let textError = ''    
                    errores.forEach((mistake, index) => {
                        if(index){
                            textError += '\\n'
                        }
                        textError += mistake
                    })
                    form.adjuntos[name].files = []
                    form.facturaObject = {}
                    form.factura = ''
                    form.adjuntos[name].value = ''
                    this.setState({ ...this.state, form })
                    Swal.close()
                    MySwal.close()
                    setTimeout(function(){ 
                        errorAlert(textError)
                    }, 100);
                }else{
                    form.facturaObject = obj
                    Swal.close()
                    this.setState({ ...this.state, form })
                    this.checkFactura(obj)
                }
            }else{ 
                form.facturaObject = {}
                form.factura = ''
                form.adjuntos.xml.files = []
                form.adjuntos.xml.value = ''
                this.setState({ ...this.state, form })
                errorAlert(`La factura no tiene el formato correcto`) 
            }
        };
        reader.readAsText(files[0])
    }
    checkFactura = async(obj) => {
        const { at, tipo_factura } = this.props
        apiPutForm(`v2/administracion/facturas/check?${tipo_factura}`, obj, at).then(
            (response) => {
                const { factura } = response.data
                const { form } = this.state
                form.factura = factura
                this.setState({ ...this.state, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }
    onChangeAdjunto = e => {
        const { name, value, files } = e.target
        const { form } = this.state
        form.adjuntos[name].value = value
        form.adjuntos[name].files = []
        files.forEach((file, index) => {
            form.adjuntos[name].files.push({
                name: file.name,
                file: file,
                url: URL.createObjectURL(file),
                key: index
            })
        })
        this.setState({ ...this.state, form })
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        if(name === 'xml'){
            form.facturaObject = {}
            form.factura = ''
        }
        form.adjuntos[name].files.splice(key, 1)
        if(form.adjuntos[name].files.length === 0){
            form.adjuntos[name].value = ''
        }
        this.setState({ ...this.state, form })
    }
    sendFacturaAxios = async () => {
        const { at } = this.props
        const { form } = this.state
        apiPostForm(this.getUrl('sendFactura'), form, at).then(
            (response) => {
                this.getResponse(response.data)
                doneAlert(response.data.message !== undefined ? response.data.message : 'Las facturas fueron actualizadas con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    
    render() {
        const { form, options, facturas } = this.state
        const { venta } = this.props
        console.log(venta, 'venta')
        return (
            <>
            <Form id='form-factura' onSubmit={(e) => { e.preventDefault(); validateAlert(this.sendFacturaAxios, e, 'form-factura') }}>
                <div className='row mx-0 mt-5'>
                    <Col md="12">
                        <div className="mb-4 row form-group-marginless text-center">
                            <div className="col-md-4 text-left">
                                <ReactSelectSearchGray placeholder='ESTATUS DE LA COMPRA' defaultvalue={form.estatusCompra}
                                    iconclass='las la-check-circle icon-xl' requirevalidation={1} options={options.estatusCompra}
                                    onChange={(value) => this.updateSelect(value, 'estatus')} messageinc='Selecciona el estatus de la compra.' />
                            </div>
                            <div className="col-md-4">
                                <label className="col-form-label font-weight-bold text-dark-60">XML DE LA FACTURA</label>
                                <br />
                                <FileInput onChangeAdjunto={this.onChangeFactura} placeholder='Factura XML' value={form.adjuntos.xml.value}
                                    name='xml' id='xml' accept='text/xml' files={form.adjuntos.xml.files} deleteAdjunto={this.clearFiles}
                                    messageinc='Agrega el XML de la factura' iconclass='las la-file-alt icon-xl' classinput='file-input'
                                    classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                                    requirevalidation={1} formeditado={0} />
                            </div>
                            <div className="col-md-4">
                                <label className="col-form-label font-weight-bold text-dark-60">PDF DE LA FACTURA</label>
                                <br />
                                <FileInput requirevalidation={0} formeditado={0} onChangeAdjunto={this.onChangeAdjunto}
                                    placeholder='Factura PDF' value={form.adjuntos.pdf.value} name='pdf' id='pdf' classinput='file-input'
                                    accept='application/pdf' files={form.adjuntos.pdf.files} iconclass='las la-file-pdf icon-xl'
                                    classbtn='btn btn-sm btn-light font-weight-bolder mb-0'
                                    deleteAdjunto={this.clearFiles} />
                            </div>
                        </div>
                    </Col>
                </div>
                <div className="d-flex justify-content-center border-top mt-3 pt-3">
                    <div>
                        <Button icon='' className="btn btn-primary font-weight-bold text-uppercase" type='submit' text="ENVIAR" />
                    </div>
                </div>
            </Form>
            <div className="separator separator-dashed mb-6 mt-5"></div>
            <FacturaTable deleteFactura={this.deleteFactura} facturas={facturas} />
            </>
        )
    }
}

export default PermisosForm