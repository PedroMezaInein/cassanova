import React, { Component } from 'react'
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap'
import { setDateTableLG } from '../../../functions/setters'

class LeadContrato extends Component {
    isActiveButton(direction) {
        const { leads } = this.props
        if (leads.total_paginas > 1) {
            if (direction === 'prev') {
                if (leads.numPage > 0) {
                    return true;
                }
            } else {
                if (leads.numPage < 10) {
                    if (leads.numPage < leads.total_paginas - 1) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { leads, onClickPrev, onClickNext} = this.props
        return (
            <div className="tab-content">
                <div className="table-responsive-lg">
                    <table className="table table-borderless table-vertical-center">
                        <thead>
                            <tr className="text-left text-uppercase bg-light-green text-green">
                                <th style={{ minWidth: "100px" }} className="pl-7">
                                    <span>Nombre del cliente y proyecto</span>
                                </th>
                                <th style={{ minWidth: "120px" }}>Fecha</th>
                                <th style={{ minWidth: "120px" }}>Empresa</th>
                                <th style={{ minWidth: "100px" }}>Origen</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Vendedor</th>
                                <th style={{ minWidth: "100px" }} className="text-center">Estatus</th>
                                <th style={{ minWidth: "70px" }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                leads.data.map((lead, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="pl-0 py-8">
                                                <div className="d-flex align-items-center">
                                                    <div className="symbol symbol-45 symbol-light-success mr-3">
                                                        <span className="symbol-label font-size-h5">{lead.nombre.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <a href={`mailto:+${lead.email}`} className="text-dark-75 font-weight-bolder text-hover-success mb-1 font-size-lg">{lead.nombre}</a>
                                                        <span className="text-muted font-weight-bold d-block">
                                                            {
                                                                lead.prospecto.tipo_proyecto?
                                                                    lead.prospecto.tipo_proyecto.tipo
                                                                :''
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="font-size-lg text-left font-weight-bolder">
                                                <span>Ingreso: </span><span className="text-muted font-weight-bold font-size-sm">{setDateTableLG(lead.created_at)}</span><br />
                                                <span>Último contacto: </span><span className="text-muted font-weight-bold font-size-sm">
                                                    {setDateTableLG(lead.prospecto.contactos[0].created_at)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-dark-75 font-weight-bolder d-block font-size-lg">{lead.empresa.name}</span>
                                            </td>
                                            <td>
                                                {
                                                    lead.origen ?
                                                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg">
                                                            {lead.origen.origen}
                                                        </span>
                                                        : ''
                                                }
                                            </td>
                                            <td className="d-flex justify-content-center">
                                                <div className="symbol-group symbol-hover">
                                                    {
                                                        lead.prospecto.vendedores.map((vendedor, index) => {
                                                            return (
                                                                <OverlayTrigger key={index} overlay={<Tooltip>{vendedor.name}</Tooltip>}>
                                                                    <div className="symbol symbol-35 symbol-circle">
                                                                        <img alt="Pic" src={vendedor.avatar ? vendedor.avatar : "/default.jpg"} />
                                                                    </div>
                                                                </OverlayTrigger>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className="label label-md label-light-success label-inline font-weight-bold">CONTRATADO</span>
                                            </td>
                                            <td className="pr-0 text-center">
                                                <OverlayTrigger overlay={<Tooltip>Ver más</Tooltip>}>
                                                    <a href='/leads/crm/info/info' className="btn btn-default btn-icon btn-sm mr-2 btn-hover-text-success">
                                                        <i className="flaticon2-plus icon-nm"></i>
                                                    </a>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    {
                        this.isActiveButton('prev') ?
                            <span className="btn btn-icon btn-xs btn-light-success mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            : ''
                    }
                    {
                        this.isActiveButton('next') ?
                            <span className="btn btn-icon btn-xs btn-light-success mr-2 my-1" onClick={onClickNext}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            : ''
                    }
                </div>
            </div>
        )
    }
}

export default LeadContrato