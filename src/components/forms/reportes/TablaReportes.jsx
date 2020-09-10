import React, { Component } from 'react'


class TablaReportes extends Component {

    sumaVentasProyectos(ventas){
        let suma  =0
        ventas.map((venta)=>{
            suma = suma+venta.total
        }
        )
        return suma
    }

    render() {
        const { proyectos } = this.props
        console.log(proyectos)
        return (
            <div className="table-responsive">
                <table className="table table-head-custom table-head-bg table-borderless table-vertical-center">
                    <thead>
                        <tr className="text-left text-uppercase">
                            <th style={{ minWidth: "250px" }} className="pl-7">
                                <span className="text-dark-75 font-size-lg">Proyecto</span>
                            </th>
                            <th className="text-center" style={{ minWidth: "100px" }}>
                                <span className="text-muted font-weight-bold">Ventas</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">$8,000,000</span>
                            </th>
                            <th className="text-center" style={{ minWidth: "100px" }}>
                                <span className="text-muted font-weight-bold">Compras</span>
                                <span className="text-dark-75 font-weight-bolder d-block font-size-sm">$8,000,000</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            proyectos.map((proyecto,key)=>{
                                    return(
                                        <tr className="text-center" key={key}>
                                                <td className="p-2">
                                                    <div className="d-flex align-items-start">
                                                        <div>
                                                            <div className="text-dark-75 text-hover-primary mb-1 font-size-lg pl-2">{proyecto.nombre}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                        <td>
                                                                <span>{this.sumaVentasProyectos(proyecto.ventas)}</span>
                                                            </td>

                                        </tr>
                                    )  
                                }                                                         
                            )
                        }

                    </tbody>
                </table>
            </div>
        )
    }
}

export default TablaReportes