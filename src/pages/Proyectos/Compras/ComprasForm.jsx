import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { ComprasFormulario } from '../../../components/forms'
import { errorAlert } from '../../../functions/alert'

class ComprasForm extends Component {

    state = {
        type: 'add',
        compra: null,
        solicitud: null
    }
    
    componentDidMount() {
        const {
            authUser: { user: { permisos } },
            history: { location: { pathname, state } },
            match: { params: { action } },
            history
        } = this.props

        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    type: action
                })
                break;
            case 'edit':
                if(state){
                    if(state.compra){
                        this.setState({
                            ...this.state,
                            compra: state.compra,
                            type: action
                        })
                    }else{
                        history.push( '/proyectos/compra' )
                    }
                }else{
                    history.push( '/proyectos/compra' )
                }
                break;
            case 'convert':
                if(state){
                    if(state.solicitud){
                        this.setState({
                            ...this.state,
                            solicitud: state.solicitud,
                            type: action
                        })
                    }else{
                        history.push( '/proyectos/solicitud-compra' )
                    }
                }else{
                    history.push( '/proyectos/solicitud-compra' )
                }
                break;
            default:
                history.push('/')
                break;
        }
        const modulo = permisos.find((element) => {
            return pathname === `${element.modulo.url}/${action}`
        })
        if (!modulo){
            errorAlert(
                `No tienes acceso a este módulo`,
                () => { history.push('/') }
            )
        }
    }

    setTitle = () => {
        const { type } = this.state
        switch(type){
            case 'add':
                return 'Nueva compra'
            case 'edit':
                return 'Editar compra'
            case 'convert':
                return 'Convertir solicitud de compra'
            default: break;
        }
    }

    render() {
        const { type, compra, solicitud } = this.state
        const { history, authUser: { access_token }, compras } = this.props
        return (
            <Layout active = 'proyectos'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label"> { this.setTitle() } </h3>
                        </div>
                    </Card.Header>
                    <Card.Body className="pt-0">
                        <ComprasFormulario type = { type } at = { access_token } 
                            dato = { compra } solicitud = { solicitud } 
                            history = { history } compras = {compras} />
                    </Card.Body>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser, compras: state.opciones.compras } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(ComprasForm);