import React, { Component } from 'react'
import ComentarioFormTarea from "../../forms/ComentarioFormTarea"
import TimelineComments from '../../forms/TimelineComments'
import { Tag } from '../../singles';
import Linkify from 'react-linkify';

class FormCalendarioTareas extends Component {
    state = {
        showForm: false,
    }
    responsables(responsables) {
        let aux = [];
        responsables.forEach((responsable) => {
            aux.push(responsable.name)
        })
        let result = ''
        for (let i = 0; i < aux.length; i++) {
            if (i < aux.length - 1) {
                result += aux[i] + ', '
            } else {
                result += aux[i]
            }
        }
        let text = ''
        if (aux.length === 1){
            text = result
        } else {
            var strReplacedWith = " y ";
            var currentIndex = result.lastIndexOf(",");
            result = result.substring(0, currentIndex) + strReplacedWith + result.substring(currentIndex + 1, result.length);
            text = result
        }
        return text
    }
    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    render() {
        const { tarea, addComentario, form, onChange, handleChange, users, proyectos } = this.props
        const componentDecorator = (href, text, key) => (
            <a href={href} key={key} target="_blank" rel="noopener noreferrer" className="font-weight-bold">
                {text}
            </a>
        );
        return (
            tarea&&
                <div className="mt-6 mx-4">
                    <div className="text-dark-50 font-weight-bold mr-2 mb-3">
                        <span className="text-dark-75 font-weight-bolder font-size-lg mr-3">{tarea.responsables.length>1?'Responsables':'Responsable'}:</span>
                        <i className="fas fa-user-friends font-size-lg text-primary mr-2"></i>
                        {this.responsables(tarea.responsables)}
                    </div>
                    <div className="text-dark-50 font-weight-bold mr-2 mb-5 d-flex flex-wrap">
                        {
                            tarea.etiquetas.map((elemento) => {
                                return(
                                    <div key = { elemento.id} className = {`mr-2`}>
                                        <Tag etiqueta = { elemento } customPadding = 'p-1' />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="text-muted-50 text-justify font-weight-light white-space-pre-wrap text-transform-none">
                        <Linkify componentDecorator={componentDecorator}>
                            {tarea.descripcion}
                        </Linkify>
                    </div>
                    <div className="separator separator-dashed separator-border-2 my-8"></div>
                    <div className="d-flex justify-content-end">
                        <span className="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary" onClick={() => { this.mostrarFormulario() }}>
                            <i className="las la-comment-medical text-primary icon-lg"></i>AGREGAR COMENTARIO
                        </span>
                    </div>
                    <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                        <ComentarioFormTarea users  = { users } proyectos = { proyectos } addComentario = { ()=> {this.mostrarFormulario(); addComentario();} }
                            form = { form } onChange = { onChange } handleChange = { handleChange } color = "primary" />
                    </div>
                    <TimelineComments comentariosObj = {tarea} col = '12' color = 'primary' proyectos = { proyectos } />
                </div>
        )
    }
}

export default FormCalendarioTareas