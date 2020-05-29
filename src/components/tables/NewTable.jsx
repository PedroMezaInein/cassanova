<<<<<<< HEAD
import React, { Component } from 'react'; 
=======
import React, { Component } from 'react';
/* import '../../styles/plugins.bundle.css';*/
/* import '../../styles/style.bundle.css';
import '../../styles/datables.css';  */
>>>>>>> 3d3033cbb8498b02a2edd42189031d98fb104138
import ReactDOM from 'react-dom'
import { renderToString } from 'react-dom/server' 
import {PlusCircle} from '../../assets/svg'
import '../../styles/custom_datatable.css'

const $ = require('jquery');
$.DataTable = require('datatables.net');
require("datatables.net-responsive");
require("datatables.net-select");
require("datatables.net-searchpanes");
require("datatables.net-colreorder");
require("datatables.net-buttons");
require("datatables.net-select");
require("datatables.net-fixedheader");

function reloadTableData(data) {
    const table = $('.data-table-wrapper')
        .find('table')
        .DataTable();
    table.clear();
    table.rows.add(data);
    table.draw();
}

class NewTable extends Component {
    componentDidMount() {
        const { actions, elements, data } = this.props
        var header = this.props.columns;
        var columns = [];
        var i=0;

        let aux = [];

        for (i = 0; i < header.length; i++) {
            var titulo = new Object();
                titulo["title"] = header[i].Header; 
                titulo["data"] = header[i].accessor; 
                columns[i] = titulo;
                if(aux > 0)
                    aux.push(i)
        }
        var table = $(this.refs.main);
        table.DataTable({  
            
            initComplete: function () {
                var html_append;
                var html;
                var contador =0;
                table.find("thead th").each( function () {
                    var title = $(this).text();
                
                /*Opcioón 1*/    
                //$(this).append('<br/><input class="form-control form-control-sm form-filter datatable-input" type="text"/>');
                
                 /*Opción 2 */
                 if (contador!=0)
                 {
                  
                $(this).append('<div class="mt-2 separator separator-dashed separator-border-2"></div><div class="mt-2 input-icon"><input type="text" class="form-control form-control-sm"/><span><i class="flaticon2-search-1 icon-sm"></i></span></div>');
                     
                 }
                 contador ++;
                

                //  html+='<th style="'+$(this).attr("style").toString()+'"><input class="form-control form-control-sm form-filter datatable-input" type="text"/></th>';
                } );
                
                //table.find("thead").append('<tr class="filter">'+html+'</tr>');
                // Apply the search
                this.api().columns().every( function () {
                    var that = this;
                    $( 'input', this.header() ).on( 'keyup change clear', function () {
                        if ( that.search() !== this.value ) {
                            that
                                .search( this.value )
                                .draw();
                        }
                    } );
                } );

                
            },
            
            colReorder: true,        
            responsive: true,
            data: data,
            columns,
            // DOM Layout settings
            dom: 
            `<'row'
                <'col-sm-12'tr>>
                <'row'<'col-sm-12 col-md-5'i>
                <'col-sm-12 col-md-7 dataTables_pager'lp>
            >`,
            language: {
                "sProcessing":    "Procesando...",
                "sLengthMenu":    "Mostrar _MENU_ registros",
                "sZeroRecords":   "No se encontraron resultados",
                "sEmptyTable":    "Ningún dato disponible en esta tabla",
                "sInfo":          "Registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty":     "Registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered":  "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix":   "",
                "sSearch":        "Buscar:",
                "sUrl":           "",
                "sInfoThousands":  ",",
                "sLoadingRecords":'Cargando... <div class="spinner spinner-primary mr-10"></div>',
                "oPaginate": {
                    "sFirst":'<i class="btn btn-icon btn-sm btn-light-primary mr-2 my-1 ki ki-bold-double-arrow-back icon-xs"></i>',
                    "sLast":'<i class="btn btn-icon btn-sm btn-light-primary mr-4 my-1 ki ki-bold-double-arrow-next icon-xs"></i>',
                    "sNext":'<i class="btn btn-icon btn-sm btn-light-primary ml-4 my-1 ki ki-bold-arrow-next icon-xs"></i>',
                    "sPrevious":'<i class="btn btn-icon btn-sm btn-light-primary mr-2 my-1 ki ki-bold-arrow-back icon-xs"></i>'
                }
            },
            
            columnDefs:[{
                "targets": aux,
                render: function ( data, type, row, meta ) {
                    return(`<div>${data}</div>`)
                }
            },
                {
                    'targets': [0],
                    'data': null,
                    'searchable': false,
                    'orderable': false,
                    render: function ( data, type, row, meta ) {
                        let aux = ''
                        {
                            data.map( (element) => {
<<<<<<< HEAD
                                aux = aux + /* `<input type="button" onClick = { console.log('hola')} value="Edit" class="btnEdit sfBtn sfPrimaryBtn sfLocale" />` */
                                `<button name=${element.action}  id = ${row.id} class="ml-2 btn btn-actions-table btn btn-xs btn-icon btn-text-${element.btnclass} btn-hover-${element.btnclass}"><i class=${element.iconclass}></i></button>`
=======
                                aux = aux + 
                                `<button name=${element.action}  id = ${row.id} class="btn btn-primary btn-actions-table">${element.text}</button>`
>>>>>>> 3d3033cbb8498b02a2edd42189031d98fb104138
                            })
                        }
                        return(
                            '<div>'+aux+'</div>'
                        )
                    } 
                    /* 'defaultContent': '<button type="button" class="btn btn-primary btn-edit">Edit</button>' */
                }
            ], 


            lengthMenu:	[[20, 30, 40, 50, -1], [20, 30, 40, 50, "Todos"]],
            pageLength: 20,

        });
        table.on('responsive-resize.dt', function(e, datatable, columns) {
            for (var i in columns) {
                var index = parseInt(i, 10) + 1;
                table.find('th:nth-child(' + index + ')').toggle(columns[i]);
            }
        });
        $(this.refs.main).on('click', '.btn-actions-table', function(e){
            e.preventDefault();
            var id = $(this).attr('id').toString()
            var name =$(this).attr('name').toString() 

            let aux = elements.find(function(element, index) { 
                if(element.id.toString() === id){
                    return element    
                }
<<<<<<< HEAD
            }); 
=======
            });
>>>>>>> 3d3033cbb8498b02a2edd42189031d98fb104138
            actions[name].function(aux)
            
            
        });
    }

    componentWillUnmount() {
        $('.data-table-wrapper')
            .find('table')
            .DataTable()
            .destroy(true);
    }
    shouldComponentUpdate(nextProps) {
        if(nextProps.data !== this.props.data)
        {
            reloadTableData(nextProps.data)
        }
    }
    render() {

        const { columns, data, title, subtitle, url } = this.props

        return (
            <>
                <div className="d-flex flex-column-fluid">        
                    <div className="container">
                        <div className="card card-custom">
                            <div className="card-header flex-wrap border-0 pt-6 pb-0">
                                <div className="card-title">
                                    <h2 className="card-label font-weight-bolder font-size-h2">
                                        {
                                            title ? title : ''
                                        }
                                        <span className="d-block text-muted pt-2 font-size-sm">
                                            {
                                                subtitle ? subtitle : ''
                                            }
                                        </span>
                                    </h2>
                                </div>
                                <div className="card-toolbar">
                                     <a href={url} className="btn btn-icon btn-light-success pulse pulse-success mr-2 font-weight-bold" title="Agregar">
                                        <i className="flaticon-add"></i>
                                        <span className="pulse-ring"></span>
                                    </a>
                                </div>
                            </div>
                            <div className="card-body">
                                <table ref="main" className="table table-separate table-head-custom table-checkable display responsive nowrap dt-responsive table-striped" id="kt_datatable2" />
                            </div>
                        </div>   
                    </div>
                </div> 
            </>
        )
    }
}
export default NewTable