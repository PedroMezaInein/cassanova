import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import Moment from 'react-moment'
import { Card, Tab, Row, Col, Nav } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles'
export default class EgresosCard extends Component {
    setAdjuntosFacturas = facturas => {
        let aux = [];
        facturas.map((factura) => {
            if (factura.xml) {
                aux.push({
                    name: factura.folio + '-xml.xml',
                    url: factura.xml.url
                })
            }
            if (factura.pdf) {
                aux.push({
                    name: factura.folio + '-pdf.pdf',
                    url: factura.pdf.url
                })
            }
        })
        return aux
    }
    render() {
        const { egreso } = this.props
        return (
            <div className="col-md-12 mt-4">
                <Tab.Container defaultActiveKey="first">
                    <Row>
                        <Col md={3} className="pl-0 align-self-center">
                            <Nav className="navi navi-hover navi-active navi-bold">
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="first">
                                        <span className="navi-icon"><i className="flaticon2-file"></i></span>
                                        <span className="navi-text font-size-lg">Datos generales</span>
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item className="navi-item">
                                    <Nav.Link className="navi-link px-3" eventKey="second">
                                        <span className="navi-icon"><i className="fas fa-coins"></i></span>
                                        <span className="navi-text font-size-lg">Pago</span>
                                    </Nav.Link>
                                </Nav.Item>
                                {
                                    egreso !== '' ?
                                        egreso.presupuestos.length > 0 || egreso.pagos.length > 0 || egreso.facturas.length > 0 ?
                                            <Nav.Item className="navi-item">
                                                <Nav.Link className="navi-link px-3" eventKey="third" >
                                                    <span className="navi-icon"><i className="flaticon2-checking"></i></span>
                                                    <span className="navi-text font-size-lg">Facturas</span>
                                                </Nav.Link>
                                            </Nav.Item>
                                            : ''
                                        : ''
                                }
                            </Nav>
                        </Col>
                        <Col md={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="first">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ID:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.id ?
                                                                <span>{egreso.id}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">FECHA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.created_at ?
                                                                <span><Moment format="DD/MM/YYYY">{egreso.created_at}</Moment></span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.subarea ?
                                                                egreso.subarea.area ?
                                                                    <span>{egreso.subarea.area.nombre}</span>
                                                                    : <span>-</span>
                                                                : ''
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">SUBÁREA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.subarea ?
                                                                <span>{egreso.subarea.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">PROVEEDOR:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.proveedor ?
                                                                <span>{egreso.proveedor.razon_social}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary align-self-center">DESCRIPCIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.descripcion ?
                                                                <span>{egreso.descripcion}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <Card className="card card-without-box-shadown border-0">
                                        <Card.Body className="p-0">
                                            <div className="text-justify">
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">EMPRESA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.empresa ?
                                                                <span>{egreso.empresa.name}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.cuenta ?
                                                                <span>{egreso.cuenta.nombre}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">NO. CUENTA:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.cuenta ?
                                                                <span>{egreso.cuenta.numero}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TIPO DE PAGO:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.tipo_pago ?
                                                                <span>{egreso.tipo_pago.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">ESTATUS:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.estatus_compra ?
                                                                <span>{egreso.estatus_compra.estatus}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">IMPUESTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.tipo_impuesto ?
                                                                <span>{egreso.tipo_impuesto.tipo}</span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">MONTO:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.monto ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={egreso.monto}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">COMISIÓN:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.comision ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={egreso.comision}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row pb-1">
                                                    <label className="col-3 font-weight-bolder text-primary">TOTAL:</label>
                                                    <div className="col-9">
                                                        {
                                                            egreso.total ?
                                                                <span>
                                                                    <NumberFormat
                                                                        value={egreso.total}
                                                                        displayType={'text'}
                                                                        thousandSeparator={true}
                                                                        prefix={'$'}
                                                                        renderText={value => <div>{value}</div>}
                                                                    />
                                                                </span>
                                                                : <span>-</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="third">
                                    <Tab.Container defaultActiveKey={egreso.presupuestos !== 0 ? "first" : egreso.pagos !== 0 ? "second" : egreso.facturas !== 0 ? "third" : ''}>
                                        <Nav className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-2x border-0">
                                            {
                                                egreso.presupuestos !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="first"
                                                        >
                                                            <span className="nav-text font-weight-bold">PRESUPUESTO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                            {
                                                egreso.pagos !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="second"
                                                        >
                                                            <span className="nav-text font-weight-bold">PAGO</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                            {
                                                egreso.facturas !== 0 ?
                                                    <Nav.Item>
                                                        <Nav.Link className="pt-0" eventKey="third"
                                                        >
                                                            <span className="nav-text font-weight-bold">FACTURAS</span>
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    : ''
                                            }
                                        </Nav>
                                        <Tab.Content>
                                            <Tab.Pane eventKey="first">
                                                {
                                                    egreso.presupuestos ?
                                                        <ItemSlider items={egreso.presupuestos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="second">
                                                {
                                                    egreso.pagos ?
                                                        <ItemSlider items={egreso.pagos} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                            <Tab.Pane eventKey="third">
                                                {
                                                    egreso.facturas ?
                                                        <ItemSlider items={this.setAdjuntosFacturas(egreso.facturas)} item='' />
                                                        : ''
                                                }
                                            </Tab.Pane>
                                        </Tab.Content>
                                    </Tab.Container>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}