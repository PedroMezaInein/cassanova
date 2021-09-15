import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader, setFormHeader } from '../../../../functions/routers'
import { Card, DropdownButton, Dropdown, Form, Row, Col } from 'react-bootstrap'
import { dayDMY, setNaviIcon } from '../../../../functions/setters'
import { Link } from 'react-router-dom';
import { questionAlert, waitAlert, printResponseErrorAlert, errorAlert, doneAlert, deleteAlert, validateAlert } from '../../../../functions/alert'
import { CalendarDay, InputGray, ReactSelectSearchGray, Button } from '../../../form-components'
import ItemSlider from '../../../../components/singles/ItemSlider'
class NotasObra extends Component {
    state = {
        activeNota: 'notas',
        formeditado: 0,
        notas: [],
        form: {
            proveedor: '',
            fecha: new Date(),
            tipo_nota: '',
            notas: '',
            adjuntos: {
                adjuntos: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                },
            },
        },
    }
    componentDidMount() {
        const { proyecto } = this.props
        this.getNotas(proyecto)
        let { activeNota } = this.state
        const { notas } = this.state
        if (notas.length > 0) {
            activeNota = 'notas'
        }
        this.setState({
            ...this.state,
            activeNota
        })
    }
    // componentDidUpdate = prev => {
    //     const { isActive, notas } = this.props
    //     const { isActive: prevActive } = prev
    //     let { activeNota } = this.state
    //     if(isActive && !prevActive){
    //         if (notas.length > 0) {
    //             activeNota = 'notas'
    //         }else{
    //             activeNota='new'
    //         }
    //         this.setState({ ...this.state, activeNota })
    //     }
    // }
    onClickNota = (type) => {
        this.setState({
            ...this.state,
            activeNota: type
        })
    }

    /* -------------------------------------------------------------------------- */
    /*                                   GET NOTAS                                */
    /* -------------------------------------------------------------------------- */
    getNotas = async (proyecto) => {
        waitAlert()
        const { at } = this.props
        await axios.get(`${URL_DEV}v1/proyectos/nota-bitacora?proyecto=${proyecto.id}`, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                Swal.close()
                const { proyecto } = response.data
                let { notas } = this.state
                notas = proyecto.notas
                this.setState({
                    ...this.state,
                    notas
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                             ANCHOR DELETE NOTA                             */
    /* -------------------------------------------------------------------------- */
    openModalDeleteNota = nota => {
        deleteAlert(`¿DESEAS ELIMINAR LA NOTA ${this.cerosNota(nota.numero_nota)}?`, '', () => this.deleteNotaAxios(nota))
    }
    async deleteNotaAxios(nota) {
        const { proyecto, at } = this.props
        await axios.delete(`${URL_DEV}v1/proyectos/nota-bitacora/${nota.id}?proyecto=${proyecto.id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { proyecto } = response.data
                let { activeNota } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'La nota fue eliminada con éxito.')
                this.getNotas(proyecto)
                if (proyecto.notas.length > 0) {
                    activeNota = 'notas'
                } else {
                    activeNota = 'new'
                }
                this.setState({
                    ...this.state,
                    activeNota
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    cerosNota(num) {
        if (num < 10) {
            return ('00' + num.toString());
        } else if (num < 100) {
            return ('0' + num.toString());
        } else {
            return (num);
        }
    }
    /* -------------------------------------------------------------------------- */
    /*                           ANCHOR GENERAR NOTA                              */
    /* -------------------------------------------------------------------------- */
    generarBitacora = async (e) => {
        e.preventDefault();
        questionAlert('¿ESTÁS SEGURO?', 'GENERARÁS EL PDF CON LAS NOTAS DE OBRA GUARDADAS', () => this.generarBitacoraAxios())
    }
    generarBitacoraAxios = async () => {
        waitAlert()
        const { at } = this.props
        const { proyecto } = this.props
        await axios.get(`${URL_DEV}v1/proyectos/nota-bitacora/pdf?proyecto=${proyecto.id}`, { headers: setSingleHeader(at) }).then(
            (response) => {
                const { proyecto } = response.data
                doneAlert('PDF GENERADO CON ÉXITO')
                window.open(proyecto.bitacora, '_blank').focus();
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    /* -------------------------------------------------------------------------- */
    /*                               ANCHOR ONSUMBIT                              */
    /* -------------------------------------------------------------------------- */
    onSubmitNotaBitacora = async (e) => {
        e.preventDefault();
        waitAlert();
        const { at, proyecto } = this.props
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fecha':
                    data.append(element, (new Date(form[element])).toDateString())
                    break
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element]);
                    break
            }
        })
        form.adjuntos.adjuntos.files.forEach((file) => {
            data.append(`files[]`, file.file)
        })
        data.append('proyecto', proyecto.id)
        await axios.post(`${URL_DEV}v1/proyectos/nota-bitacora`, data, { headers: setFormHeader(at) }).then(
            (response) => {
                Swal.close()

                doneAlert(response.data.message !== undefined ? response.data.message : 'La bitácora registrada con éxito.')
                this.setState({
                    ...this.state,
                    form: this.clearForm()
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
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
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            value: '',
                            placeholder: 'Adjunto',
                            files: []
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    transformarOptions (options) {
        options = options ? options : []
        options.map((value) => {
            value.label = value.name
            return ''
        });
        return options
    }
    
    updateSelect = (value, name) => {
        if (value === null) {
            value = []
        }
        this.onChange({ target: { value: value, name: name } }, true)
    }
    render() {
        const { activeNota, notas, form, formeditado } = this.state
        const { proyecto, options } = this.props
        console.log(form, 'form')
        return (
            <>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center">
                        <div className="font-weight-bold font-size-h4 text-dark">Notas de obra</div>
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos-light-primary' >
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickNota('new') }}>
                                    {setNaviIcon('las la-plus icon-lg', 'AGREGAR NUEVA NOTA')}
                                </Dropdown.Item>
                                <Dropdown.Item className="text-hover-info dropdown-info" tag={Link} onClick={this.generarBitacora} >
                                    {setNaviIcon('las la-file-pdf icon-lg', 'GENERAR BITÁCORA (PDF)')}
                                </Dropdown.Item>
                                {
                                    proyecto.bitacora ?
                                        <Dropdown.Item className="text-hover-info dropdown-info" href={proyecto.bitacora} tag={Link} target='_blank' rel="noopener noreferrer">
                                            {setNaviIcon('las la-search icon-lg', 'VER BITÁCORA DE OBRA')}
                                        </Dropdown.Item>
                                        : <></>
                                }
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            activeNota === 'notas' ?
                                notas.length > 0 &&
                                <div className="table-responsive rounded-top">
                                    <table className="table table-notas table-vertical-center w-100">
                                        <thead className="font-size-h6 bg-light">
                                            <tr>
                                                <th style={{ width: '5%' }} >#</th>
                                                <th className="text-align-last-left">Proveedor y tipo</th>
                                                <th style={{ width: '10%' }}>Fecha</th>
                                                <th style={{ minWidth: '300px' }}>Nota</th>
                                                <th style={{ width: '10%' }}>Adjunto</th>
                                                <th style={{ width: '5%' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                notas.map((nota, index) => {
                                                    return (
                                                        <tr key={index} className="text-dark-75 font-weight-light text-justify">
                                                            <td>
                                                                <div className={`symbol symbol-45 symbol-light-${index % 2 ? 'success2' : 'primary2'}`}>
                                                                    <span className="symbol-label font-size-sm">{nota.numero_nota.toString().padStart(4, 0)}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="font-weight-bold mb-1 font-size-lg text-dark">{nota.proveedor ? nota.proveedor.razon_social : '-'}</span>
                                                                <span className="text-muted font-weight-bold d-block">{nota.tipo_nota}</span>
                                                            </td>
                                                            <td>
                                                                <div className="w-max-content mx-auto">
                                                                    {dayDMY(nota.fecha)}
                                                                </div>
                                                            </td>
                                                            <td className={`text-${nota.notas === null ? 'center' : 'justify'}`}> {nota.notas === null ? 'Sin notas' : nota.notas} </td>
                                                            <td className="text-center  font-weight-bold">
                                                                <div className="w-max-content mx-auto">
                                                                    {
                                                                        nota.adjuntos.length > 0 ?
                                                                            nota.adjuntos.map((adjunto, key) => {
                                                                                return (
                                                                                    <u>
                                                                                        <a key={key} target='_blank' rel="noreferrer" href={adjunto.url} className="text-dark text-hover-success mb-1 d-block">
                                                                                            Adjunto {key + 1}
                                                                                        </a>
                                                                                    </u>
                                                                                )
                                                                            })
                                                                            : <>Sin adjuntos</>
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td className="pr-0 text-center">
                                                                <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger' onClick={(e) => { e.preventDefault(); this.openModalDeleteNota(nota) }} >
                                                                    <i className='flaticon2-rubbish-bin' />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                : activeNota === 'new' ?
                                    <>
                                        <Form
                                            onSubmit={
                                                (e) => {
                                                    e.preventDefault();
                                                    validateAlert(this.onSubmit, e, 'wizard-3-content')
                                                }
                                            }>
                                            <Row className="mx-0 no-gutters justify-content-center">
                                                <div className="col-md-6 col-xxl-4 text-center align-self-center">
                                                    <div className="d-flex justify-content-center" style={{ height: '1px' }}>
                                                        <label className="text-center font-weight-bolder text-dark-60">Fecha</label>
                                                    </div>
                                                    <CalendarDay date={form.fecha} onChange={this.onChange} name='fecha' requirevalidation={1} />
                                                </div>
                                                <div className="col-md-6 col-xxl-8 align-self-center row mx-0 mt-5 mt-md-0">
                                                    <div className="col-md-12 col-xxl-6 px-0 px-md-4">
                                                        <ReactSelectSearchGray
                                                            placeholder='Selecciona el proveedor'
                                                            defaultvalue={form.proveedor}
                                                            iconclass='las la-building icon-xl'
                                                            options={this.transformarOptions(options.proveedores)}
                                                            onChange={(value) => { this.updateSelect(value, 'proveedor') }}
                                                            requirevalidation={1}
                                                            messageinc="Selecciona el proveedor."
                                                            customdiv="form-group"
                                                        />
                                                    </div>
                                                    <div className="col-md-12 col-xxl-6 px-0 px-md-4">
                                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={1} requirevalidation={1}
                                                            withformgroup={1} formeditado={formeditado} placeholder="TIPO DE NOTA" name="tipo_nota"
                                                            value={form.tipo_nota} onChange={this.onChange} messageinc="Incorrecto. Ingresa el tipo de nota."
                                                            iconclass="far fa-sticky-note" />
                                                    </div>
                                                    <div className="col-md-12 px-0 px-md-4">
                                                        <InputGray withtaglabel={1} withtextlabel={1} withplaceholder={1} withicon={0} withformgroup={0}
                                                            requirevalidation={0} formeditado={formeditado} rows="3" as="textarea" placeholder="NOTAS"
                                                            name="notas" value={form.notas} onChange={this.onChange} style={{ paddingLeft: "10px" }}
                                                            messageinc="Incorrecto. Ingresa la nota." />
                                                    </div>
                                                </div>
                                                <div className="separator separator-dashed my-8 col-md-12"></div>
                                                <Col md="8" className="text-center">
                                                    <label className="text-center font-weight-bolder text-dark-60">ADJUNTAR ARCHIVO</label>
                                                    <ItemSlider items={form.adjuntos.adjuntos.files} item='adjuntos' handleChange={this.handleChange} accept='image/*' />
                                                </Col>
                                            </Row>
                                            <div className="card-footer py-3 pr-1">
                                                <div className="row mx-0">
                                                    <div className="col-lg-12 text-right pr-0 pb-0">
                                                        <Button icon='' text='ENVIAR' className="btn btn-primary mr-2" onClick={(e) => { e.preventDefault(); this.onSubmit(e) }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </>
                                    : <></>
                        }
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default NotasObra