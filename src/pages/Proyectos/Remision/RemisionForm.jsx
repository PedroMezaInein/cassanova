import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'

//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, GOLD, REMISION_COLUMNS } from '../../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../../functions/setters'
import { errorAlert, waitAlert, forbiddenAccessAlert } from '../../../functions/alert'

//
import Layout from '../../../components/layout/layout'
import { RemisionForm as RemisionFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'


class RemisionForm extends Component{

    state = {
        title: 'Nueva remisión',
        remision: '',
        options:{
            proyectos: [],
            areas: [],
            subareas: []
        },
        form:{
            proyecto: '',
            fecha: new Date(),
            area: '',
            subarea: '',
            descripcion: '',
            adjuntos:{
                adjunto:{
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        },
    }

    componentDidMount(){
        const { authUser: { user : { permisos : permisos } } } = this.props
        const { history : { location: { pathname: pathname } } } = this.props
        const { match : { params: { action: action } } } = this.props
        const { history, location: { state: state} } = this.props
        const remisiones = permisos.find(function(element, index) {
            const { modulo: { url: url } } = element
            return pathname === url + '/' + action
        });
        switch(action){
            case 'add':
                this.setState({
                    ... this.state,
                    title: 'Nueva remisión'
                })
                break;
            case 'edit':
                if(state){
                    if(state.remision)
                    {
                        const { form, options } = this.state
                        const { remision } = state
                        
                        form.proyecto = remision.proyecto ? remision.proyecto.id.toString() : ''
                        if(remision.subarea)
                        {
                            if(remision.subarea.area){
                                if(remision.subarea.area.subareas){
                                    console.log(remision.subarea, 'subarea')
                                    options.subareas = setOptions(remision.subarea.area.subareas, 'nombre', 'id')
                                    form.area = remision.subarea.area.id.toString()
                                    form.subarea = remision.subarea.id.toString()
                                }
                            }
                        }
                        form.fecha = new Date(remision.created_at)
                        form.descripcion = remision.descripcion
                        if(remision.adjunto){
                            form.adjuntos.adjunto.files = [{
                                name: remision.adjunto.name, url: remision.adjunto.url
                            }]
                        }
                        this.setState({
                            ... this.state,
                            form,
                            options,
                            remision: remision,
                            title: 'Editar remisión'
                        })
                    }
                    else
                        history.push('/proyectos/remision')
                }else
                    history.push('/proyectos/remision')
                break;
            default:
                break;
        }
        if(!remisiones)
            history.push('/')
        this.getRemisionesAxios()
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
        }
        form['adjuntos'][name].files = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const{ title } = this.state
        waitAlert()
        if(title === 'Editar remisión'){
            this.editRemisionAxios()
        }else
            this.addRemisionAxios()
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
    
    async getRemisionesAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'remision', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { proyectos, areas, remisiones } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options
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

    async addRemisionAxios(){
        
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

        await axios.post(URL_DEV + 'remision', data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { remision } = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                    history.push({
                    pathname: '/proyectos/remision'
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

    async editRemisionAxios(){

        const { access_token } = this.props.authUser
        const { form, remision } = this.state
        const data = new FormData();
        
        let aux = Object.keys(form)
        aux.map( (element) => {
            switch(element){
                case 'fecha':
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
        aux.map( (element) => {
            for (var i = 0; i < form.adjuntos[element].files.length; i++) {
                data.append(`files_name_${element}[]`, form.adjuntos[element].files[i].name)
                data.append(`files_${element}[]`, form.adjuntos[element].files[i].file)
            }
            data.append('adjuntos[]', element)
        })
        
        await axios.post(URL_DEV + 'remision/update/' + remision.id, data, { headers: {Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const {remision} = response.data
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                    history.push({
                    pathname: '/proyectos/remision'
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

                
                <Card className="m-2 p-2 m-md-4 p-md-4">
                    <Card.Body>
                        <RemisionFormulario 
                            title = { title } 
                            form = { form }
                            onChange = { this.onChange } 
                            options = { options } 
                            setOptions = { this.setOptions } 
                            onSubmit = {this.onSubmit}
                            onChangeAdjunto = { this.onChangeAdjunto }
                            clearFiles = { this.clearFiles }
                            /> 

                    </Card.Body>    
                </Card>

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

export default connect(mapStateToProps, mapDispatchToProps)(RemisionForm);