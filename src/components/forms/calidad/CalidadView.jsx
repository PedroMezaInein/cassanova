import React, { Component } from 'react'
import { Card, Nav, Tab, Dropdown} from 'react-bootstrap'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import ItemSlider from '../../singles/ItemSlider';
import { ProcesoTicketForm } from '../../forms';
import { Button } from '../../../components/form-components'

class CalidadView extends Component {

    getIniciales = nombre => {
        let aux = nombre.split(' ');
        let iniciales = ''
        aux.map((element) => {
            if (element !== '-')
                iniciales = iniciales + element.charAt(0) + ' '
            return false
        })
        return iniciales
    }

    render() {

        const { data, changeEstatus, handleChange, form, options, onChange, onSubmit, generateEmail, deleteFile, openModalWithInput } = this.props
        return (
            <>
                <div className="card card-custom gutter-b">
                    <div className="card-body">
                        <div className="d-flex">
                            <div className="mr-4" id="symbol_calidad">
                                <div className="symbol symbol-50 symbol-lg-120 symbol-light-primary">
                                    <span className="font-size-h6 symbol-label font-weight-boldest ">
                                        {
                                            data ?
                                                data.proyecto ?
                                                    this.getIniciales(data.proyecto.nombre)
                                                    : ''
                                                : ''
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-start justify-content-between flex-wrap mt-2">
                                    <div className="mr-3">
                                        <div className="d-flex align-items-center text-dark font-size-h5 font-weight-bold mr-3">
                                            {
                                                data ?
                                                    data.proyecto ?
                                                        data.proyecto.nombre
                                                        : ''
                                                    : ''
                                            }
                                        </div>
                                        <div className="d-flex flex-wrap mt-2">
                                            <div className="text-muted font-weight-bold my-2">
                                                <i className="far fa-user-circle icon-md mr-2"></i>
                                                {
                                                    data ?
                                                        data.usuario ?
                                                            data.usuario.name
                                                            : ''
                                                        : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        {
                                            data ?
                                                data.estatus_ticket ?
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                style={
                                                                    {
                                                                        backgroundColor: data.estatus_ticket.fondo, 
                                                                        color: data.estatus_ticket.letra,
                                                                        border: 'transparent', padding: '2.8px 5.6px',
                                                                        width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '10.7px',
                                                                        fontWeight: 500, paddingTop:'3px'
                                                                    }
                                                                }
                                                            >
                                                                {data.estatus_ticket.estatus.toUpperCase()}
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu className="p-0">
                                                                <Dropdown.Header>
                                                                    <span className="font-size-sm">Elige una opción</span>
                                                                </Dropdown.Header>
                                                                {
                                                                    options.estatus?
                                                                        options.estatus.map((estatus, key) => {
                                                                            if(estatus.name === 'Rechazado' || estatus.name === 'Aceptado' || estatus.name === 'Terminado' || 
                                                                                estatus.name === 'En proceso' || estatus.name === 'Respuesta pendiente' || estatus.name === 'En revisión' || estatus.name === 'En espera')
                                                                            return (
                                                                                <>
                                                                                    <Dropdown.Item className="p-0" key={key} onClick={() => { changeEstatus(estatus.name) }} >
                                                                                        <span className="navi-link w-100">
                                                                                            <span className="navi-text">
                                                                                                <span className="label label-xl label-inline rounded-0 w-100 font-weight-bolder" 
                                                                                                    style = {{ 
                                                                                                        color: estatus.letra, 
                                                                                                        backgroundColor: estatus.fondo 
                                                                                                    }}>
                                                                                                    {
                                                                                                        estatus.name
                                                                                                    }
                                                                                                </span>
                                                                                            </span>
                                                                                        </span>
                                                                                    </Dropdown.Item>
                                                                                    <Dropdown.Divider className="m-0" style={{ borderTop: '1px solid #fff' }} />
                                                                                </>
                                                                            )
                                                                        })
                                                                    :''
                                                                }
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                        : ''
                                                    : ''
                                        }
                                    </div>
                                </div>

                                <div className="d-flex align-items-start flex-wrap justify-content-between">
                                    <div className="font-weight-bold text-dark-50 py-lg-2 col-md-10 text-justify pl-0">
                                        {
                                            data ?
                                                data.descripcion
                                                : ''
                                        }
                                    </div>
                                    {
                                        data ?
                                            data.estatus_ticket ?
                                                data.estatus_ticket.estatus === 'En revisión' ?
                                                    <>
                                                        <Button
                                                            icon=''
                                                            onClick={() => { changeEstatus('Aceptado') }} 
                                                            className={"btn btn-icon btn-light-success btn-sm mr-2 ml-auto"}
                                                            only_icon={"flaticon2-check-mark icon-sm"}
                                                            tooltip={{text:'ACEPTAR'}}
                                                        />
                                                        <Button
                                                            icon=''
                                                            onClick={() => { openModalWithInput('Rechazado') }}
                                                            className={"btn btn-icon btn-light-danger btn-sm pulse pulse-danger"}
                                                            only_icon={"flaticon2-cross icon-sm"}
                                                            tooltip={{text:'RECHAZAR'}}
                                                        />
                                                    </>
                                                : data.estatus_ticket.estatus === 'Rechazado' ?
                                                    <>
                                                        <div className="d-flex flex-wrap">
                                                            <div>
                                                                <div className="text-muted font-weight-bold">
                                                                    {
                                                                        data ?
                                                                            data.motivo_cancelacion    
                                                                        : ''
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                : ''
                                            : ''
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="separator separator-solid my-4"></div>
                        <div className="row row-paddingless">
                            <div className="col-md-4">
                                <div className="d-flex justify-content-center" id="partida_calidad" >
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.partida ?
                                                        data.partida.nombre
                                                        : ''
                                                    : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">PARTIDA</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex justify-content-center" id="tipoT_calidad">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Tools.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.tipo_trabajo ?
                                                        data.tipo_trabajo.tipo
                                                        : ''
                                                    : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE TRABAJO</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="d-flex justify-content-center" id="fecha_calidad">
                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                        <div className="symbol-label">
                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                            {
                                                data ?
                                                    data.created_at ?
                                                        <Moment format="DD/MM/YYYY">
                                                            {data.created_at}
                                                        </Moment>
                                                        : ''
                                                    : ''
                                            }
                                        </div>
                                        <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row gutter-b">
                    {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus !== 'En revisión' && data.estatus_ticket.estatus !== 'Rechazado') || (data.fotos.length) ?
                                    <div className={data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado' ? 'col-lg-4' : 'col-lg-12'}>
                                        <Card className="card-custom card-stretch">
                                            <Tab.Container defaultActiveKey="first">
                                                <Card.Header>
                                                    <Card.Title>
                                                        <span className="card-label">Adjuntos</span>
                                                    </Card.Title>
                                                    <div className="card-toolbar">
                                                        <Nav variant="pills">
                                                            {
                                                                data.fotos.length ?
                                                                    <Nav.Item>
                                                                        <Nav.Link eventKey={data.fotos.length === 0 ? "second" : "first"}>FOTOS</Nav.Link>
                                                                    </Nav.Item>
                                                                    : ''
                                                            }
                                                            {
                                                                data.estatus_ticket.estatus === 'Rechazado' ?
                                                                    '' :
                                                                    <Nav.Item>
                                                                        <Nav.Link eventKey={data.fotos.length === 0 ? "first" : "second"}>PRESUPUESTO</Nav.Link>
                                                                    </Nav.Item>

                                                            }
                                                        </Nav>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>

                                                    <Tab.Content>
                                                        <Tab.Pane eventKey={data.fotos.length === 0 ? "second" : "first"}>
                                                            {
                                                                data.fotos.length ?
                                                                    <>
                                                                        {/* <div className={data.estatus_ticket.estatus !== 'En espera' && data.estatus_ticket.estatus !== 'Rechazado' 
                                                                    ? 'col-md-6' : 'col-md-12'}> */}
                                                                        <ItemSlider items={data.fotos} item={'fotos'} />
                                                                        {/* </div> */}
                                                                    </>
                                                                    : ''
                                                            }
                                                        </Tab.Pane>
                                                        {
                                                            data.estatus_ticket.estatus === 'Rechazado' ?
                                                                '' :
                                                                <Tab.Pane eventKey={data.fotos.length === 0 ? "first" : "second"}>
                                                                    {/* <div className = { data.fotos.length ? 'col-md-6' : 'col-md-12'}> */}
                                                                    <ItemSlider multiple={false} items={form.adjuntos.presupuesto.files}
                                                                        item='presupuesto' handleChange={handleChange} />
                                                                    {/* </div> */}
                                                                </Tab.Pane>

                                                        }
                                                    </Tab.Content>
                                                </Card.Body>
                                            </Tab.Container>
                                        </Card>
                                    </div>
                                    : ''
                                : ''
                            : ''
                    }
                    {
                        data ?
                            data.estatus_ticket ?
                                (data.estatus_ticket.estatus === 'En proceso' || data.estatus_ticket.estatus === 'Terminado') ?
                                    <div className="col-lg-8">
                                        <div className="card card-custom card-stretch">
                                            <div className="card-header">
                                                <div className="card-title">
                                                    <h3 className="card-label">TICKET EN PROCESO</h3>
                                                </div>
                                            </div>
                                            <div className="card-body pt-0">

                                                <>
                                                    <ProcesoTicketForm form={form} options={options} onChange={onChange} formeditado={1}
                                                        handleChange={handleChange} onSubmit={onSubmit} generateEmail={generateEmail} estatus={data.estatus_ticket.estatus}
                                                        deleteFile={deleteFile} />
                                                </>

                                            </div>
                                        </div>
                                    </div>
                                    : ''
                                : ''
                            : ''
                    }
                </div>
            </>
        )
    }

}

export default CalidadView