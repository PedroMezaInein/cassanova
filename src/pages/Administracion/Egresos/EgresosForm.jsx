import React, { Component } from 'react'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import NewTable from '../../../components/tables/NewTable'

import { EgresosForm as EgresosFormulario } from '../../../components/forms'

class EgresosForm extends Component{

    state = {
        title: 'Nuevo egreso',
        options:{
            empresas:[],
            cuentas:[],
            areas:[],
            subareas:[],
            tiposPagos:[],
            tiposImpuestos:[],
            estatusCompras:[],
            proveedores: [],
        },form:{
            factura: 'Sin factura',
            
            rfc: '',
            proveedor: '',
            empresa: '',
            cuenta: '',
            area:'',
            subarea: '',
            total: '',
            comision: '',
            descripcion: '',
            facturaObject: '',

            tipoPago: 0,
            tipoImpuesto: 0,
            estatusCompra: 0,
            
            fecha: new Date(),
            
            adjuntos:{
                factura:{
                    value: '',
                    placeholder: 'Factura',
                    files: []
                },
                pago:{
                    value: '',
                    placeholder: 'Pago',
                    files: []
                },
                presupuesto:{
                    value: '',
                    placeholder: 'Presupuesto',
                    files: []
                }
            }
        },
        data:{
            proveedores:[],
            empresas: []
        }
    }

    // On change
    onChange = e => {
        const {form} = this.state
        const {name, value} = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
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
                if(extension === 'xml'){
                    waitAlert()
                    const reader = new FileReader()
                    reader.onload = async (e) => { 
                        const text = (e.target.result)
                        var XMLParser = require('react-xml-parser');
                        var xml = new XMLParser().parseFromString(text);
                        const emisor = xml.getElementsByTagName('cfdi:Emisor')[0]
                        const receptor = xml.getElementsByTagName('cfdi:Receptor')[0]
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
                            numero_certificado: xml.attributes.NoCertificado ? xml.attributes.NoCertificado : '',
                            folio: xml.attributes.Folio ? xml.attributes.Folio : '',
                            serie: xml.attributes.Serie ? xml.attributes.Serie : '',
                        }
                        if(obj.numero_certificado === ''){
                            let NoCertificado = text.search('NoCertificado="')
                            if(NoCertificado)
                                obj.numero_certificado = text.substring(NoCertificado+15, NoCertificado + 35)
                        }
                        let aux = ''
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
                            if(element.razon_social === obj.nombre_emisor){
                                auxEmpresa = element
                            }
                        });
                        let auxProveedor = ''
                        data.proveedores.find(function(element, index) {
                            if(element.razon_social === obj.nombre_receptor){
                                auxProveedor = element
                            }
                        });
                        if(auxEmpresa){
                            options['cuentas'] = setOptions(auxEmpresa.cuentas, 'nombre', 'id')
                            form.empresa = auxEmpresa.name
                        }else{
                            errorAlert('No existe la empresa')
                        }
                        if(auxProveedor){
                            form.proveedor = auxProveedor.id.toString()
                        }else{
                            errorAlert('No existe el proveedor')
                        }
                        if(auxEmpresa && auxProveedor){
                            swal.close()
                        }
                        form.facturaObject = obj
                        form.rfc = obj.rfc_emisor
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

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
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
                        factura:{
                            value: '',
                            placeholder: 'Factura',
                            files: []
                        },
                        pago:{
                            value: '',
                            placeholder: 'Pago',
                            files: []
                        },
                        presupuesto:{
                            value: '',
                            placeholder: 'Presupuesto',
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

    onSubmit = e => {
        e.preventDefault()
        const{ title } = this.state
        waitAlert()
        if(title === 'Editar egreso'){
            this.editEgresoAxios()
        }else
            this.addEgresoAxios()
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        
        const egresos = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return  pathname === '/' + url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nuevo egreso'
                })
                break;
            case 'edit':
                if(state){
                    if(state.egreso)
                    {
                        const { egreso } = state
                        const { form, options } = this.state
                        if(egreso.empresa){
                            form.empresa = egreso.empresa.id.toString()
                            options['cuentas'] = setOptions(egreso.empresa.cuentas, 'nombre', 'id')
                            form.cuenta = egreso.cuenta.id.toString()
                        }
                        if(egreso.subarea){
                            form.area = egreso.subarea.area.id.toString()
                            options['subareas'] = setOptions(egreso.subarea.area.subareas, 'nombre', 'id')
                            form.subarea = egreso.subarea.id.toString()
                        }
                        
                        form.tipoPago = egreso.tipo_pago ? egreso.tipo_pago.id : 0
                        form.tipoImpuesto = egreso.tipo_impuesto ? egreso.tipo_impuesto.id : 0
                        form.estatusCompra = egreso.estatus_compra ? egreso.estatus_compra.id : 0
                        form.total = egreso.monto
                        form.fecha = new Date(egreso.created_at)
                        form.descripcion = egreso.descripcion
                        form.comision = egreso.comision
                        if(egreso.proveedor)
                            form.proveedor = egreso.proveedor.id.toString()
                        if(egreso.pago){
                            form.adjuntos.pago.files = [{
                                name: egreso.pago.name, url: egreso.pago.url
                            }]
                        }
                        if(egreso.presupuesto){
                            form.adjuntos.presupuesto.files = [{
                                name: egreso.presupuesto.name, url: egreso.presupuesto.url
                            }]
                        }
                        this.setState({
                            ... this.state,
                            title: 'Editar egreso',
                            form,
                            options,
                            egreso: egreso
                        })
                    }
                    else
                        history.push('/administracion/egresos')
                }else
                    history.push('/administracion/egresos')
                break;
            default:
                break;
        }
        if(!egresos)
            history.push('/')
        this.getEgresosAxios()
    }

    //Setters
    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    //ASYNC
    async getEgresosAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'egresos', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proveedores, empresas, areas, tiposPagos, tiposImpuestos, estatusCompras } = response.data
                const { options, data } = this.state
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'nombre', 'id')
                options['tiposPagos'] = setSelectOptions( tiposPagos, 'tipo' )
                options['tiposImpuestos'] = setSelectOptions( tiposImpuestos, 'tipo' )
                options['estatusCompras'] = setSelectOptions( estatusCompras, 'estatus' )
                data.proveedores = proveedores
                data.empresas = empresas
                this.setState({
                    ... this.state,
                    options,
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

    async addEgresoAxios(){
        
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                case 'facturaObject':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            if(form.adjuntos[element].value !== ''){
                for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                    data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                    data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
                }
                data.append('adjuntos[]', element)
            }
        })

        await axios.post(URL_DEV + 'egresos', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                    history.push({
                    pathname: '/administracion/egresos'
                });
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

    async editEgresoAxios(){

        const { access_token } = this.props.authUser
        const { form, egreso } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                case 'facturaObject':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'egresos/update/' + egreso.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                    history.push({
                    pathname: '/administracion/egresos'
                });
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

    render(){
        const { form, title, options } = this.state
        return(
            <Layout active={'administracion'}  { ...this.props}>
                    
             {/* <NewTable columns = {['Proyecto', 'Proveedor', 'Cuenta','Factura','Monto','Comisión','Impuesto','Total','Tipo de pago','Descripción','Área','Sub-Área','Estatus compra','Adjuntos','Fecha','Opciones']} 

                    data = {
                        [
                            [
                                'Proyecto 1','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$18,750','$1,000','IVA','$22,750','Total','Testing factura','Acabados','Equipos','Completo','Pago Presupuesto','20/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                            [
                                'Proyecto 2','Galt Asset Management S.A.P.I. DE C.V.','Empresa:INEIN','Con factura','$100,000','$1,000','IVA','$117,000','Avance','Nueva factura','Acessorios','Mano de obra','Completo','Pago Presupuesto','21/05/2020','1'
                            ],
                        ]
                    }/> */}
                <EgresosFormulario 
                            title = { title } 
                            form = { form }
                            onChange = { this.onChange } 
                            onChangeAdjunto = { this.onChangeAdjunto } 
                            clearFiles = { this.clearFiles } 
                            options = { options } 
                            setOptions = { this.setOptions } 
                            onSubmit = {this.onSubmit}/> 
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EgresosForm);