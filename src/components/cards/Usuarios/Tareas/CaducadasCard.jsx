import React, { Component } from 'react'
import { Card } from 'react-bootstrap'
import { setDateTableLG } from '../../../../functions/setters'
export default class CaducadasCard extends Component {
    isActiveButton(direction){
        const { caducadas} = this.props
        if(caducadas.total_paginas>1){
            if(direction==='prev'){
                if(caducadas.numPage>0){
                    return true;
                }
            }else{
                if(caducadas.numPage<10){
                    if(caducadas.numPage < caducadas.total_paginas - 1){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    render() {
        const { caducadas, onClick, onClickPrev, onClickCard } = this.props
        return (
            <Card className="card-custom card-stretch gutter-b py-2">
                <Card.Header className="align-items-center border-0">
                    <div className="card-title align-items-start flex-column">
                        <span className="font-weight-bolder text-dark">Caducadas</span>
                    </div>
                    <div className="card-toolbar">
                        { this.isActiveButton('prev')?
                            <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClickPrev}><i className="ki ki-bold-arrow-back icon-xs"></i></span>
                            :''
                        }
                        { this.isActiveButton('next')?
                            <span className="btn btn-icon btn-xs btn-light-danger mr-2 my-1" onClick={onClick}><i className="ki ki-bold-arrow-next icon-xs"></i></span>
                            :''
                        }
                    </div>
                </Card.Header>
                <Card.Body className="py-2">
                    {/* <div className="timeline timeline-justified timeline-4 text-dark-75" id="nuevo">
                        <div className="timeline-items pb-0">
                            <div className="timeline-item pl-4 mb-4">
                                <div className="timeline-badge">
                                    <div className="bg-danger"></div>
                                </div>
                                <div className="px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    <span className="text-dark-75 font-weight-bolder">TI</span> - Desarrollo de back end para primera pantalla de presupuestos
                                </div>
                            </div>
                            <div className="timeline-item pl-4 mb-4">
                                <div className="timeline-badge">
                                    <div className="bg-danger"></div>
                                </div>
                                <div className="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Error al mostrar departamentos y proyectos de usuarios
                                </div>
                            </div>
                            <div className="timeline-item pl-4 mb-4">
                                <div className="timeline-badge">
                                    <div className="bg-danger"></div>
                                </div>
                                <div className="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                                </div>
                            </div>
                            <div className="timeline-item pl-4 mb-4">
                                <div className="timeline-badge">
                                    <div className="bg-danger"></div>
                                </div>
                                <div className="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Desarrollo de segunda pantalla para presupuestos
                                </div>
                            </div>
                            <div className="timeline-item pl-4 mb-4">
                                <div className="timeline-badge">
                                    <div className="bg-danger"></div>
                                </div>
                                <div className="timeline-label px-2 mb-0">
                                    <span className="font-size-xs text-dark font-weight-bolder">03/12/2020 - <span className="text-danger">28/12/2020</span></span>
                                </div>
                                <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light">
                                    Generar tres paginas de reportes nuevos, reporte de ventas
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="timeline timeline-5">
                        <div className="timeline-item">
                            <div className="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div className="timeline-badge"><i className="fa fa-genderless text-danger"></i></div>
                            <div className="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                <span className="text-dark-75 font-weight-bolder">TI</span> - Desarrollo de back end para primera pantalla de presupuestos
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div className="timeline-badge"><i className="fa fa-genderless text-danger"></i></div>
                            <div className="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Error al mostrar departamentos y proyectos de usuarios
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div className="timeline-badge"><i className="fa fa-genderless text-danger"></i></div>
                            <div className="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="font-size-xs text-dark font-weight-bolder text-center">03/12/2020 <div className="text-danger">28/12/2020</div></div>
                            <div className="timeline-badge"><i className="fa fa-genderless text-danger"></i></div>
                            <div className="timeline-content text-justify bg-white px-2 py-2 ml-2 font-weight-light">
                                Generar tres paginas de reportes nuevos, reporte de ventas
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="timeline timeline-6" id="timeline-departamentos">
                        <div className="timeline-items">
                            <div className="timeline-item">
                                <div className="timeline-media bg-light-danger">
                                    <i className="fas fa-laptop-code text-danger icon-1rem"></i>
                                </div>
                                <div className="timeline-desc timeline-desc-bg-gray-200">
                                    <span className="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p className="text-justify font-weight-light pb-2 mb-2">
                                        <span className="text-dark-75 font-weight-bolder">TI</span> - Generar tres paginas de reportes nuevos, reporte de ventas
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-media bg-light-danger">
                                    <i className="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div className="timeline-desc timeline-desc-bg-gray-200">
                                    <span className="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p className="text-justify font-weight-light pb-2 mb-2">
                                        Verificar ventas, compras, egresos e ingresos junto con adjuntos.
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-media bg-light-danger">
                                    <i className="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div className="timeline-desc timeline-desc-bg-gray-200">
                                    <span className="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p className="text-justify font-weight-light pb-2 mb-2">
                                        Error al mostrar departamentos y proyectos de usuarios
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-media bg-light-danger">
                                    <i className="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div className="timeline-desc timeline-desc-bg-gray-200">
                                    <span className="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p className="text-justify font-weight-light pb-2 mb-2">
                                        Desarrollo de back end para primera pantalla de presupuestos
                                    </p>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-media bg-light-danger">
                                    <i className="fas fa-mail-bulk text-danger icon-1rem"></i>
                                </div>
                                <div className="timeline-desc timeline-desc-bg-gray-200">
                                    <span className="font-weight-bolder font-size-sm">03/12/2020 -<span className="text-danger">28/12/2020</span></span>
                                    <p className="text-justify font-weight-light pb-2 mb-2">
                                        Actualización aceptar vacaciones
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="timeline timeline-justified timeline-4 text-dark-75" id="amarrillo">
                        <div className="timeline-items py-0">
                            {
                                caducadas.data.map((element, key)=>{
                                    return(
                                        <div onClick = { (e) => { e.preventDefault(); onClickCard(element); } } 
                                            className="timeline-item mb-4 pl-30px" key = { key }>
                                            <div className="timeline-badge border border-5 border-white bg-light-danger">
                                                {
                                                    element.departamento.nombre==='TI'?<i className="fas fa-laptop-code text-danger pt-1px icon-1-26rem"></i>:
                                                        element.departamento.nombre==='ADMINISTRACION'?<i className="fas fa-user-cog text-danger pl-2px pt-1px icon-1-2rem"></i>:
                                                            element.departamento.nombre==='CALIDAD'?<i className="fas fa-award text-danger icon-lg"></i>:
                                                                element.departamento.nombre==='COMPRAS'?<i className="flaticon2-shopping-cart text-danger pt-1px pr-2px icon-lg"></i>:
                                                                    element.departamento.nombre==='CONTABILIDAD'?<i className="fas fa-calculator text-danger icon-1-26rem"></i>:
                                                                        element.departamento.nombre==='FISCAL'?<i className="flaticon2-list text-danger pt-3px pl-2px icon-1-7rem"></i>:
                                                                            element.departamento.nombre==='MERCADOTECNIA'?<i className="fas fa-mail-bulk text-danger"></i>:
                                                                                element.departamento.nombre==='PERSONAL'?<i className="fas fa-user text-danger icon-lg pr-1px"></i>:
                                                                                    element.departamento.nombre==='PROYECTOS'?<i className="flaticon2-sheet text-danger pt-2px pl-4px icon-1-39rem"></i>:
                                                                                        element.departamento.nombre==='RECURSOS HUMANOS'?<i className="fas fa-users text-danger icon-md"></i>:
                                                                                            element.departamento.nombre==='VENTAS'?<i className="flaticon-price-tag text-danger icon-lg"></i>:
                                                                        ''
                                                }
                                            </div>
                                            <div className="px-2 mb-0">
                                                <span className="font-size-xs text-dark font-weight-bolder">{setDateTableLG(element.created_at)}
                                                    {
                                                        element.fecha_limite?
                                                        <span className="text-danger">- {setDateTableLG(element.fecha_limite)}</span>
                                                        :''
                                                    }
                                                </span>
                                            </div>
                                            <div className="timeline-content text-justify bg-white px-2 py-2 font-weight-light text-hover">
                                                <span className="text-dark-75 font-weight-bolder">
                                                    { element.departamento.nombre }
                                                </span> - { element.titulo }
                                            </div>
                                        </div>
                                    )        
                                })
                            }
                            
                        </div>
                    </div>
                    </Card.Body>
            </Card>
        )
    }
}