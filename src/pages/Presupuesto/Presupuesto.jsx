import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, PRESUPUESTO_COLUMNS, ADJUNTOS_PRESUPUESTOS_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setDateTable, setAdjuntosList, setTextTableCenter, setLabelTable } from '../../functions/setters'
import Layout from '../../components/layout/layout'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from '../../functions/alert'
import { renderToString } from 'react-dom/server'
import { ModalDelete, Modal } from '../../components/singles'
import TableForModals from '../../components/tables/TableForModals'
import $ from "jquery";
class Presupuesto extends Component {
    state = {
        formeditado: 0,
        modal: {
            form: false,
            delete: false,
            adjuntos: false,
        },
        presupuesto: '',
        title: 'Nuevo presupuesto',
        form: {
            proyecto: '',
            area: '',
            empresa: '',
            fecha: new Date(),
            tiempo_ejecucion: '',
            partida: '',
            subpartida: '',
        },
        options: {
            proyectos: [],
            empresas: [],
            areas: [],
            partidas: [],
            subpartidas: []
        },
        data: {
            adjuntos: []
        },
        adjuntos: [],
        estatus_ticket: [
            { bg: '#EFEBE9', color: '#8D6E63', text: 'CONCEPTOS', num: 1 },
            { bg: '#E3F4FC', color: '#009EF7', text: 'VOLUMETRÍAS', num: 2 },
            { bg: '#EDE7F6', color: '#BA68C8', text: 'COSTOS', num: 3 },
            { bg: '#FFF7DB', color: '#F1C40F', text: 'EN REVISIÓN', num: 4 },
            { bg: '#FFECD7', color: '#FF8B00', text: 'UTILIDAD', num: 5 },
            { bg: '#ECEFF1', color: '#78909C', text: 'EN ESPERA', num: 6 },
            { bg: '#E0F2F1', color: '#4DB6AC', text: 'ACEPTADO', num: 7 },
            { bg: '#FFEBEE', color: '#F64E60', text: 'RECHAZADO', num: 7 },
        ]
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!presupuesto)
            history.push('/')
        this.getOptionsAxios()
        let queryString = this.props.history.location.search
        if (queryString) {
            let params = new URLSearchParams(queryString)
            let id = parseInt(params.get("id"))
            if (id) {
                const { history } = this.props
                history.push({ pathname: '/presupuesto/presupuesto/update', state: { presupuesto: {id: id} } });
            }
        }
    }
    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ...this.state,
            options
        })
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { empresas, proyectos, areas, partidas } = response.data
                const { options } = this.state
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                this.setState({
                    ...this.state,
                    options
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    async deletePresupuestoAxios() {
        const { access_token } = this.props.authUser
        const { presupuesto } = this.state
        await axios.delete(URL_DEV + 'presupuestos/' + presupuesto.id, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { modal } = this.state
                modal.delete = false
                this.getPresupuestoAxios()
                this.setState({
                    ...this.state,
                    modal,
                    presupuesto: '',

                })
                doneAlert(response.data.message !== undefined ? response.data.message : 'El egreso fue eliminado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    openModalDelete = presupuesto => {
        const { modal } = this.state
        modal.delete = true
        this.setState({
            ...this.state,
            modal,
            presupuesto: presupuesto
        })
    }
    downloadPDF = presupuesto => {
        const { modal, data } = this.state
        data.adjuntos = presupuesto.pdfs
        modal.adjuntos = true
        this.setState({
            ...this.state,
            presupuesto: presupuesto,
            modal,
            adjuntos: this.setAdjuntosTable(presupuesto.pdfs),
            data
        })
    }
    handleClose = () => {
        const { modal, data } = this.state
        data.adjuntos = []
        modal.adjuntos = false
        this.setState({
            ...this.state,
            presupuesto: '',
            modal,
            adjuntos: [],
            data
        })
    }
    handleCloseDelete = () => {
        const { modal } = this.state
        modal.delete = false
        this.setState({
            ...this.state,
            modal,
            presupuesto: ''
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'fecha':
                    form[element] = new Date()
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    setAdjuntosTable = adjuntos => {
        let aux = []
        adjuntos.map((adjunto) => {
            aux.push({
                url: renderToString(
                    setAdjuntosList([{ name: adjunto.name, url: adjunto.url }])
                ),
                identificador: renderToString(setTextTable(adjunto.pivot.identificador)),
                id: adjunto.id
            })
            return false
        })
        return aux
    }
    async getPresupuestoAxios() {
        $('#kt_datatable2_presupuesto').DataTable().ajax.reload();
    }
    setPresupuestos = presupuestos => {
        let aux = []
        if (presupuestos)
            presupuestos.map((presupuesto) => {
                aux.push(
                    {
                        actions: this.setActions(presupuesto),
                        estatus: renderToString( presupuesto.estatus ? setLabelTable(presupuesto.estatus) : ''),
                        tipo_presupuesto:renderToString(this.label(presupuesto)),
                        empresa: renderToString(setTextTableCenter(presupuesto.empresa ? presupuesto.empresa.name : '')),
                        proyecto: renderToString(setTextTableCenter(presupuesto.proyecto ? presupuesto.proyecto.nombre : '')),
                        area: renderToString(setTextTableCenter(presupuesto.area ? presupuesto.area.nombre : '')),
                        fecha: renderToString(setDateTable(presupuesto.fecha)),
                        tiempo_ejecucion: renderToString(setTextTableCenter(presupuesto.tiempo_ejecucion)),
                        id: presupuesto.id,
                        objeto: presupuesto
                    }
                )
                return false
            })
        return aux
    }
    label(presupuesto){
        let tipo = presupuesto.hasTickets ? 'ticket' : 'presupuesto'
        let identificador = tipo === 'ticket' && (presupuesto.ticketIdentificador !== null || presupuesto.ticketIdentificador !== '')
        return(
            <div className='d-flex align-items-center justify-content-center white-space-nowrap'>
                <i style={{ color: `${tipo === 'ticket' ? "#9E9D24" : "#EF6C00"}` }} className={`las ${tipo === 'ticket' ? 'la-ticket-alt' : 'la-hard-hat'} icon-xl mr-2`}/>
                {setTextTable(tipo)}
                { identificador && <span className="font-size-11px">- {presupuesto.ticketIdentificador}</span> }
            </div>
        )
    }
    setActions = presupuesto => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' },
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' },
            },
            {
                text: 'Mostrar&nbsp;presupuesto',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'finish',
                tooltip: { id: 'finish', text: 'Ver presupuesto', type: 'error' },
            }
        )
        if (presupuesto.pdfs) {
            aux.push(
                {
                    text: 'Descargar&nbsp;presupuesto',
                    btnclass: 'info',
                    iconclass: 'flaticon2-download-1',
                    action: 'download',
                    tooltip: { id: 'download', text: 'Decargar presupuesto' },
                }
            )
        }
        return aux
    }
    changePageAdd = () => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/add'
        });
    }
    openModalEdit = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/update',
            state: { presupuesto: presupuesto }
        });
    }
    openUltimo = presupuesto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/presupuesto/finish',
            state: { presupuesto: presupuesto }
        });
    }
    render() {

        const { modal, data, adjuntos, estatus_ticket } = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <NewTableServerRender
                    columns={PRESUPUESTO_COLUMNS}
                    title='Presupuesto'
                    subtitle='Listado de presupuestos'
                    url='/presupuesto/presupuesto/add'
                    mostrar_boton={true}
                    abrir_modal={false}
                    mostrar_acciones={true}
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'finish': { function: this.openUltimo },
                        'delete': { function: this.openModalDelete },
                        'download': { function: this.downloadPDF }
                    }}
                    idTable='kt_datatable2_presupuesto'
                    accessToken={this.props.authUser.access_token}
                    setter={this.setPresupuestos}
                    urlRender = { `${URL_DEV}v2/presupuesto/presupuestos` }
                    cardTable='cardTable'
                    cardTableHeader='cardTableHeader'
                    cardBody='cardBody'>
                    {
                        <div className="col-md-12 px-0 mt-12 mb-8 d-flex align-items-center justify-content-center">
                            <div className="d-flex">
                                {
                                    estatus_ticket.slice(0, 6).map((estatus, key) => {
                                        return (
                                            <div className="d-flex mr-2" key={key}>
                                                <span className="label font-weight-bolder mr-2" style={{ backgroundColor: estatus.bg, color: estatus.color, height: '24px', width: '24px', fontSize: '0.9rem' }}>{estatus.num}</span>
                                                <div className="align-self-center font-weight-bolder">{estatus.text}</div>
                                                <div className='align-self-center ml-2'>
                                                    <i className="las la-arrow-right" style={{ color: estatus.color }}></i>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="d-flex flex-column">
                                {
                                    estatus_ticket.slice(6, 8).map((estatus, key) => {
                                        return (
                                            <div className="d-flex mr-2 mb-1" key={key}>
                                                <span className="label font-weight-bolder mr-2" style={{ backgroundColor: estatus.bg, color: estatus.color, height: '24px', width: '24px', fontSize: '0.9rem' }}>{estatus.num}</span>
                                                <div className="align-self-center font-weight-bolder">{estatus.text}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </NewTableServerRender>
                <ModalDelete
                    title={"¿Estás seguro que deseas eliminar el presupuesto?"}
                    show={modal.delete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); waitAlert(); this.deletePresupuestoAxios() }}
                />
                <Modal show={modal.adjuntos} handleClose={this.handleClose} title="Listado de presupuestos" >
                    <TableForModals
                        columns={ADJUNTOS_PRESUPUESTOS_COLUMNS}
                        data={adjuntos}
                        hideSelector={true}
                        mostrar_acciones={false}
                        dataID='adjuntos'
                        elements={data.adjuntos}
                    />
                </Modal>
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Presupuesto);