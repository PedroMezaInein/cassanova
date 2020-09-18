import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import Card from 'react-bootstrap/Card'
export default class SolicitudCompraCard extends Component {
    render() {
        const { data, children } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className=""> {/*  le quité border-nav mt-4 mb-5 */}
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0">
                            <div className="mr-2">
                                {
                                    data.proyecto ?
                                        <>
                                            <p className="font-size-h3 mb-0">Proyecto:&nbsp;<strong className="font-size-h4"> {data.proyecto.nombre}</strong></p>
                                        </>
                                        : ''
                                }
                                {
                                    data.empresa ?
                                        <>
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">Empresa:&nbsp;<strong className="font-size-h6"> {data.empresa.name} </strong></p>
                                        </>
                                        : ''
                                }
                            </div>
                            {children}
                        </div>
                        <div className="separator separator-solid mb-3"></div>
                            <div className="row row-paddingless mb-4">
                                {
                                    data.monto ?
                                        <div className="col-md-3">
                                            <div className="d-flex align-items-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Money.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">
                                                        <NumberFormat
                                                            value={data.monto}
                                                            displayType={'text'}
                                                            thousandSeparator={true}
                                                            prefix={'$'}
                                                            renderText={value => <div>{value}</div>}
                                                        />
                                                    </div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Monto </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    data.subarea ?
                                        <>
                                            {
                                                data.subarea.area ?
                                                    <div className="col-md-3">
                                                        <div className="d-flex justify-content-start">
                                                            <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                                <div className="symbol-label">
                                                                    <span className="svg-icon svg-icon-lg svg-icon-info">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Layout-top-panel-6.svg')} />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.area.nombre}</div>
                                                                <div className="font-size-sm text-muted font-weight-bold mt-1">ÁREA</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ''
                                            }
                                            <div className="col-md-3">
                                                <div className="d-flex align-items-start mr-2">
                                                    <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                        <div className="symbol-label">
                                                            <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                                <SVG src={toAbsoluteUrl('/images/svg/Folder-cloud.svg')} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.subarea.nombre}</div>
                                                        <div className="font-size-sm text-muted font-weight-bold mt-1">SUBÁREA </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        : ''
                                }

                                {
                                    data.proveedor ?
                                        <div className="col-md-3">
                                            <div className="d-flex align-items-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/User.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.proveedor.nombre}</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">Proveedor </div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                            </div>
                            <div className="row row-paddingless mb-4">

                                <div className="col-md-3">
                                    <div className="d-flex align-items-center mr-2">
                                        <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                            <div className="symbol-label">
                                                <span className="svg-icon svg-icon-lg svg-icon-info">
                                                    <SVG src={toAbsoluteUrl('/images/svg/File.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.factura ? 'Con factura' : 'Sin factura'}</div>
                                            <div className="font-size-sm text-muted font-weight-bold mt-1">Factura</div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    data.tipo_pago ?
                                        <div className="col-md-3">
                                            <div className="d-flex align-items-center mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Dollar.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">{data.tipo_pago.tipo}</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">TIPO DE PAGO</div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    data.created_at ?
                                        <div className="col-md-3">
                                            <div className="d-flex justify-content-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-info mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-info">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Box1.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder"><Moment format="DD/MM/YYYY">{data.created_at}</Moment></div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">FECHA</div>
                                                </div>
                                            </div>
                                        </div>
                                        : ''
                                }
                                {
                                    data.adjunto ?
                                        <div className="col-md-3">
                                            <div className="d-flex justify-content-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <a href={data.adjunto.url} target="_blank" className="font-size-h6 text-dark-75 font-weight-bolder text-hover-primary">{data.adjunto.name}</a>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">ADJUNTO</div>
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div className="col-md-3">
                                            <div className="d-flex justify-content-start mr-2">
                                                <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0">
                                                    <div className="symbol-label">
                                                        <span className="svg-icon svg-icon-lg svg-icon-primary">
                                                            <SVG src={toAbsoluteUrl('/images/svg/Attachment1.svg')} />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-size-h6 text-dark-75 font-weight-bolder">Sin adjunto</div>
                                                    <div className="font-size-sm text-muted font-weight-bold mt-1">ADJUNTO</div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>
                        {
                            data.descripcion ?
                                <div className="mt-5">
                                    <div className="bg-gray-100 p-3 font-size-lg font-weight-light mt-4">
                                        <strong >Descripción: </strong>{data.descripcion}
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                </Card>
            </div>

        )
    }
}