import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, FACTURAS_COLUMNS } from '../../constants'
import NewTable from '../../components/tables/NewTable'
import { Small, B } from '../../components/texts'
import { setTextTable, setMoneyTable, setDateTable, setOptions, setLabelTable } from '../../functions/setters'
import { errorAlert, forbiddenAccessAlert, doneAlert, waitAlert, createAlert} from '../../functions/alert'
import { Modal, ItemSlider} from '../../components/singles'
import { Button, FileInput } from '../../components/form-components'
import swal from 'sweetalert'
import { Tabs, Tab,Form } from 'react-bootstrap'
import NewTableServerRender from '../../components/tables/NewTableServerRender'

const $ = require('jquery');
class Facturacion extends Component {

    state = {
        formeditado: 0,
        modalFacturas: false,
        modalCancelar: false,
        facturas: [],
        factura: '',
        data: {
            facturas: []
        },
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            clientes: [],
            proyectos: [],
            formasPago: [],
            metodosPago: [],
            estatusFacturas: [],
            contratos: []
        },
        form: {
            adjuntos: {
                factura:{
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                adjuntos: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        tipo: 'Ventas',
        key: 'ventas'
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        let aux = pathname.substr(1, pathname.length - 1)
        const facturas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!facturas)
            history.push('/')
        this.getOptionsAxios()
    }

    async getOptionsAxios(){
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas/options', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas, clientes} = response.data
                const { data } = this.state
                
                data.clientes = clientes
                data.empresas = empresas
                swal.close()
                this.setState({
                    ... this.state,
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    
    setFactura = facturas => {
        let aux = []
        facturas.map((factura) => {
            aux.push(
                {
                    actions: this.setActions(factura),
                    folio: renderToString(setTextTable(factura.folio)),
                    estatus: renderToString(this.setLabelTable(factura)),
                    fecha: renderToString(setDateTable(factura.fecha)),
                    serie: renderToString(setTextTable(factura.serie)),
                    emisor: renderToString(this.setInfoTable(factura.rfc_emisor, factura.nombre_emisor)),
                    receptor: renderToString(this.setInfoTable(factura.rfc_receptor, factura.nombre_receptor)),
                    subtotal: renderToString(setMoneyTable(factura.subtotal)),
                    total: renderToString(setMoneyTable(factura.total)),
                    acumulado: renderToString(setMoneyTable(factura.ventas_compras_count + factura.ingresos_egresos_count)),
                    restante: renderToString(setMoneyTable(factura.total - factura.ventas_compras_count - factura.ingresos_egresos_count)),
                    adjuntos: renderToString(this.setAdjuntosTable(factura)),
                    descripcion: renderToString(setTextTable(factura.descripcion)),
                    noCertificado: renderToString(setTextTable(factura.numero_certificado)),
                    usoCFDI: renderToString(setTextTable(factura.uso_cfdi)),
                    id: factura.id,
                    objeto: factura
                }
            )
        })
        return aux
    }

    setActions = factura => {

        let aux = []

        if (!factura.cancelada) {
            aux.push(
                {
                    text: 'Cancelar',
                    btnclass: 'danger',
                    iconclass: "flaticon-close",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }

        if(factura.cancelada){
            aux.push(
                {
                    text: 'Mostrar adjuntos',
                    btnclass: 'success',
                    iconclass: "flaticon-attachment",
                    action: 'cancelarFactura',
                    tooltip: { id: 'delete-Adjunto', text: 'Eliminar', type: 'error' },
                })
        }

        return aux
    }

    setLabelTable = objeto => {
        let restante = objeto.total - objeto.ventas_count - objeto.ingresos_count
        let text = {}
        if (objeto.cancelada) {
            text.letra = '#8950FC'
            text.fondo = '#EEE5FF'
            text.estatus = 'CANCELADA'
        } else {
            if (restante <= 1) {
                text.letra = '#388E3C'
                text.fondo = '#E8F5E9'
                text.estatus = 'PAGADA'
            } else {
                text.letra = '#F64E60'
                text.fondo = '#FFE2E5'
                text.estatus = 'PENDIENTE'
            }
        }

        return setLabelTable(text)
    }


    setAdjuntosTable = factura => {
        return (
            <div>
                {
                    factura.xml ?
                        <a href={factura.xml.url} target="_blank">
                            <Small>
                                factura.xml
                            </Small>
                        </a>
                        : ''
                }
                <br />
                {
                    factura.pdf ?
                        <a href={factura.pdf.url} target="_blank">
                            <Small>
                                factura.pdf
                            </Small>
                        </a>
                        : ''
                }
            </div>
        )
    }

    setInfoTable = (rfc, nombre) => {
        return (
            <div>
                <Small className="mr-1" >
                    <B color="gold">
                        RFC:
                    </B>
                </Small>
                <Small>
                    {rfc}
                </Small>
                <br />
                <Small className="mr-1" >
                    <B color="gold">
                        Nombre:
                    </B>
                </Small>
                <Small>
                    {nombre}
                </Small>
            </div>
        )
    }

    cancelarFactura = (factura) => {
        const { form } = this.state

        let aux = []
        factura.adjuntos_cancelados.map((adjunto)=> {
            aux.push({
                name: adjunto.name,
                url: adjunto.url
            })
        })

        form.adjuntos.adjuntos.files = aux

        this.setState({
            ... this.state,
            modalCancelar: true,
            // tipo: 'Ventas',
            factura: factura,
            form
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Ingresa los adjuntos',
                            files: []
                        },
                        factura:{
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleChange = (files, item) => {
        this.onChangeAdjunto({ target: { name: item, value: files, files: files } })
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
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    async cancelarFacturaAxios() {
        const { access_token } = this.props.authUser
        const { form, factura } = this.state
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
        })
        await axios.post(URL_DEV + 'facturas/cancelar/' + factura.id, data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
                })
                doneAlert('Factura cancelada con éxito')
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

    async getFacturas() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'facturas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { facturas, facturasVentas } = response.data
                data.facturas = facturasVentas
                this.setState({
                    facturas: this.setFactura(facturasVentas),
                    data
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

    handleClose = () => {
        const { modalCancelar } = this.state
        this.setState({
            ... this.state,
            modalCancelar: !modalCancelar,
            form: this.clearForm()
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.cancelarFacturaAxios(e)
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modalFacturas: true,
            title: 'Agregar Factura',
            // tipo: 'Compras',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    handleCloseFacturas = () => {
        const { modalFacturas } = this.state
        this.setState({
            ... this.state,
            modalFacturas: !modalFacturas,
            // form: this.clearForm()
        })
    }

    onChangeAdjunto = e => {
        const { form, data, options } = this.state
        const { files, value, name } = e.target
        let aux = []
        for(let counter = 0; counter < files.length; counter ++){
            if(name === 'factura')
            {
                let extension = files[counter].name.slice((Math.max(0, files[counter].name.lastIndexOf(".")) || Infinity) + 1);
                if(extension.toUpperCase() === 'XML'){
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => { 
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
                        const timbreFiscalDigital = xml.getElementsByTagName('tfd:TimbreFiscalDigital')[0]
                        const concepto = xml.getElementsByTagName('cfdi:Concepto')[0]
                        let relacionados = xml.getElementsByTagName('cfdi:CfdiRelacionados')
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
                            descripcion: concepto.attributes.Descripcion,
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        let tipoRelacion = ''
                        if(relacionados){
                            if(relacionados.length){
                                relacionados = relacionados[0]
                                tipoRelacion = relacionados.attributes.TipoRelacion
                                let uuidRelacionado = xml.getElementsByTagName('cfdi:CfdiRelacionado')[0]
                                uuidRelacionado = uuidRelacionado.attributes.UUID
                                obj.tipo_relacion = tipoRelacion
                                obj.uuid_relacionado = uuidRelacionado
                            }
                        }
                        if(obj.numero_certificado === ''){
                            let NoCertificado = text.search('NoCertificado="')
                            if(NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado+15, NoCertificado + 35)
                        }
                        if(obj.subtotal === ''){
                            let Subtotal = text.search('SubTotal="')
                            if(Subtotal)
                                Subtotal = text.substring(Subtotal+10)
                                aux = Subtotal.search('"')
                                Subtotal = Subtotal.substring(0,aux)
                                obj.subtotal = Subtotal
                        }
                        if(obj.fecha === ''){
                            let Fecha = text.search('Fecha="')
                            if(Fecha)
                                Fecha = text.substring(Fecha+7)
                                aux = Fecha.search('"')
                                Fecha = Fecha.substring(0,aux)
                                obj.fecha = Fecha
                        }
                        let auxEmpresa = ''
                        data.empresas.find(function(element, index) {
                            if(element.rfc === obj.rfc_emisor){
                                auxEmpresa = element
                            }
                        });
                        let auxCliente = ''
                        data.clientes.find(function(element, index) {
                            let cadena = obj.nombre_receptor.replace(' S. C.',  ' SC').toUpperCase()
                            cadena = cadena.replace(',S.A.',  ' SA').toUpperCase()
                            cadena = cadena.replace(/,/g, '').toUpperCase()
                            cadena = cadena.replace(/\./g, '').toUpperCase()
                            if (element.empresa === obj.nombre_receptor ||
                                element.empresa === cadena){
                                auxCliente = element
                            }
                        });
                        if(auxEmpresa){
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        }else{
                            errorAlert('No existe la empresa')
                        }
                        if(auxCliente){
                            options['proyectos'] = setOptions(auxCliente.proyectos, 'nombre', 'id')
                            form.cliente = auxCliente.empresa
                            if(auxCliente.contratos){
                                options['contratos'] = setOptions(auxCliente.contratos, 'nombre', 'id')
                            }
                        }else{
                            createAlert('No existe el cliente', '¿Lo quieres crear?', () => this.addClienteAxios(obj))
                        }
                        if(auxEmpresa && auxCliente){
                            swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_receptor
                        this.setState({
                            ... this.state,
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
                    url: URL.createObjectURL(files[counter]) ,
                    key: counter
                }
            )
        }
        form['adjuntos'][name].value = value
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }
    
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for(let counter = 0; counter < form['adjuntos'][name].files.length; counter ++){
            if(counter !== key){
                aux.push(form['adjuntos'][name].files[counter])
            }
        }
        if(aux.length < 1){
            form['adjuntos'][name].value = ''
            if(name === 'factura')
                form['facturaObject'] = ''
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }    

    async getComprasAxios() {
        $('#kt_datatable_compras').DataTable().ajax.reload();
    }

    async getVentasAxios() {
        $('#kt_datatable_ventas').DataTable().ajax.reload();
    }

    controlledTab = value => {
        if (value === 'compras') {
            this.getComprasAxios()
        }
        if (value === 'ventas') {
            this.getVentasAxios()
        }
        this.setState({
            ... this.state,
            key: value
        })
    }


    render() {
        const { facturas, data, modalCancelar, form, modalFacturas, key} = this.state
        return (
            <Layout active={'administracion'}  {...this.props}>
                <Tabs defaultActiveKey="ventas" activeKey={key} onSelect={(value) => { this.controlledTab(value) }}>
                    <Tab eventKey="ventas" title="Ventas">
                        <NewTableServerRender
                            columns={FACTURAS_COLUMNS}
                            title='Facturas'
                            subtitle='Listado de facturas'
                            mostrar_boton={true}
                            abrir_modal={true}
                            mostrar_acciones={true}
                            onClick={this.openModal}
                            actions={{
                                'cancelarFactura': { function: this.cancelarFactura }
                            }}
                            idTable='kt_datatable_ventas'
                            accessToken={this.props.authUser.access_token}
                            setter={this.setFactura}
                            urlRender={URL_DEV + 'facturas/ventas'}
                            cardTable='cardTable_ventas'
                            cardTableHeader='cardTableHeader_ventas'
                            cardBody='cardBody_ventas'
                            isTab={true}
                            tipo_validacion='facturas'
                        />
                    </Tab>
                    <Tab eventKey="compras" title="Compras">
                        <NewTableServerRender
                            columns={FACTURAS_COLUMNS}
                            title='Facturas'
                            subtitle='Listado de facturas'
                            mostrar_boton={true}
                            abrir_modal={true}
                            mostrar_acciones={true}
                            onClick={this.openModal}
                            actions={{
                                'cancelarFactura': { function: this.cancelarFactura }
                            }}
                            idTable='kt_datatable_compras'
                            accessToken={this.props.authUser.access_token}
                            setter={this.setFactura}
                            urlRender={URL_DEV + 'facturas/compras'}
                            cardTable='cardTable_compras'
                            cardTableHeader='cardTableHeader_compras'
                            cardBody='cardBody_compras'
                            isTab={true}
                            tipo_validacion='facturas'
                        />
                    </Tab>
                </Tabs>

                {/* <NewTable
                    data={facturas}
                    elements={data.facturas}
                /> */}
                <Modal size="lg" title={"Agregar adjuntos"} show={modalCancelar} handleClose={this.handleClose} >
                    <div className="mt-4 mb-4">
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            handleChange={this.handleChange}
                            item="adjuntos"
                            multiple = {true}
                        />
                    </div>
                    <div className="card-footer py-3 pr-1">
                        <div className="row">
                            <div className="col-lg-12 text-right pr-0 pb-0">
                                <Button text='ENVIAR' 
                                    onClick = { (e) => { e.preventDefault(); waitAlert(); this.cancelarFacturaAxios() }}
                                    className="btn btn-primary mr-2" />
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal title={"Agregar facturas"} show={modalFacturas} handleClose={this.handleCloseFacturas} >
                    <Form
                    // onSubmit = { (e) => { e.preventDefault(); waitAlert(); this.sendFacturaAxios();}}
                    >
                        <div className="mt-3 mb-4">
                            <FileInput
                                onChangeAdjunto={this.onChangeAdjunto}
                                placeholder={form['adjuntos']['factura']['placeholder']}
                                value={form['adjuntos']['factura']['value']}
                                name={'factura'}
                                id={'factura'}
                                accept="text/xml, application/pdf"
                                files={form['adjuntos']['factura']['files']}
                                deleteAdjunto={this.clearFiles}
                                multiple
                            />
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="mx-auto" type="submit" text="ENVIAR" />
                                </div>
                            </div>
                        </div>

                    </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);