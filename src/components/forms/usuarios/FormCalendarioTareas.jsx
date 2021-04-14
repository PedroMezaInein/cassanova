import React, { Component } from 'react'
import ComentarioForm from "../../forms/ComentarioForm"
import TimelineComments from '../../forms/TimelineComments'

class FormCalendarioTareas extends Component {
    state = {
        showForm: false,
    }
    responsables(responsables) {
        let aux = [];
        responsables.map((responsable) => {
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
        return result
    }
    mostrarFormulario() {
        const { showForm } = this.state
        this.setState({
            ...this.state,
            showForm: !showForm
        })
    }
    render() {
        const { tarea, addComentario, form, onChange, handleChange } = this.props
        console.log(tarea)
        return (
            <div className="mt-6 mx-4">
                <div className="text-dark-50 font-weight-bold mr-2 mb-5">
                    <span className="text-dark-75 font-weight-bolder font-size-lg mr-3">Responsables:</span>
                    <i className="fas fa-user-friends font-size-lg text-primary mr-2"></i>
                    {this.responsables(tarea.responsables)}
                </div>
                <div className="text-muted-50 text-justify font-weight-light salto">
                    {tarea.descripcion}
                </div>
                <div className="separator separator-dashed separator-border-2 my-8"></div>
                <div className="d-flex justify-content-end">
                    <span class="btn btn-sm btn-bg-light btn-icon-primary btn-hover-primary font-weight-bolder text-primary" onClick={() => { this.mostrarFormulario() }}>
                        <i class="las la-comment-medical text-primary icon-lg"></i>AGREGAR COMENTARIO
                    </span>
                </div>
                <div className={this.state.showForm ? 'col-md-12 mb-5' : 'd-none'}>
                    <ComentarioForm
                        addComentario={ ()=> {this.mostrarFormulario(); addComentario();}}
                        form={form}
                        onChange={onChange}
                        handleChange={handleChange}
                        color="primary"
                    />
                </div>
                <TimelineComments
                    comentariosObj = {tarea}
                    col='12'
                    color='primary'
                />
            </div>
        )
    }
}

export default FormCalendarioTareas