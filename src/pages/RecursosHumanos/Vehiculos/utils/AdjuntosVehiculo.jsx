import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'
import S3 from 'react-aws-s3';
import axios from 'axios'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { apiGet, apiPutForm, apiPostForm } from '../../../../functions/api'
import { URL_DEV } from '../../../../constants'
import { setSingleHeader } from '../../../../functions/routers'

import CarruselAdjuntos from './CarruselAdjuntos'
import './../../../../styles/_adjuntosVehiculos.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        width: '500',
        height: '750',
    },
}));

export default function Adjuntos(props) {

    const { vehiculo } = props
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        Tenencia: [], 
        Foto_placas: [],
        Seguro: [],
        Tarjeta_circulacion: [],
        Verificacion: [],
        Factura: [],
        Multas: [],
        file: [],
    })
    const [activeTab, setActiveTab] = useState('Tenencia')
    const [adjuntos, setAdjuntos] = useState(false)
    useEffect(() => {
        Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        }) 
        getAdjuntos()
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setForm({
            ...form,
            file: []
        })
    };

    const getAdjuntos = () => {
        try {
            apiGet(`vehiculos/adjuntos/${vehiculo.id}`, authUser)
                .then(res => {
                    let adjunAux = res.data.vehiculos.adjuntos
                    Swal.close()
                    let aux = {
                        Tenencia: [],
                        Foto_placas: [],
                        Seguro: [],
                        Tarjeta_circulacion: [],
                        Verificacion: [],
                        Factura: [],
                        Multas: [],

                    }
                    adjunAux.forEach((element) => {
                        switch (element.pivot.tipo) {
                            case 'Tenencia':
                                aux.Tenencia = [...aux.Tenencia, element]
                                break;
                            case 'Foto_placas':
                                aux.Foto_placas = [...aux.Foto_placas, element]
                                break;
                            case 'Seguro':
                                aux.Seguro = [...aux.Seguro, element]
                                break;
                            case 'Tarjeta_circulacion':
                                aux.Tarjeta_circulacion = [...aux.Tarjeta_circulacion, element]
                                break;
                            case 'Verificacion':
                                aux.Verificacion = [...aux.Verificacion, element]
                                break;
                            case 'Factura':
                                aux.Factura = [...aux.Factura, element]
                                break;
                            case 'Multas':
                                aux.Multas = [...aux.Multas, element]
                                break;
                            default:
                                break;
                            
                        }
                    });
                    setAdjuntos(aux)
                })

        } catch (error) {
            Swal.close()
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salio mal!',
            })
        }
    }

    const handleTab = (e) => {
        setActiveTab(e)
    }

    const handleFile = (e) => {
        setForm({
            ...form,
            file: [...e.target.files]
        })
    }

    const validate = () => {
        if (activeTab && form.file.length > 0) {
            return true
        } else {
            return false
        }
    }

    const resetForm = () => {
        setForm({
            ...form,
            file: []
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        if (validate()) {
            Swal.fire({
                title: 'Subiendo archivo...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })
            let data = new FormData()

            data.append('files_name_vehiculos[]', form.file[0].name)
            data.append(`files_vehiculos[]`, form.file[0])
            data.append('asjuntos[]', "vehiculos")
            data.append('tipo', activeTab)


            try {
                apiPostForm(`vehiculos/${vehiculo.id}/archivos/s3`, data,  authUser)
                    .then(res => {
                        Swal.close()
                        getAdjuntos()
                        Swal.fire({
                            icon: 'success',
                            title: 'Archivo subido correctamente',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        resetForm()
                    })
                    .catch(err => {
                        Swal.close()
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Algo salio mal!',
                        })
                    })
            } catch (error) {
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salio mal!',
                })
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Debe seleccionar un archivo',
                showConfirmButton: false,
                timer: 1500
            })
        }
    }

   

    const uploadButtons = () => {
        return (
            <div>
                <div className='upload_buttons'>
                    <div className="file">

                        <label htmlFor="file">Seleccionar archivo(s)</label>
                        <input type="file" id="file" name="file" onChange={handleFile} />
                        <div>
                            {form.file.length > 0 ?
                                form.file.length < 3 ?
                                    <div className="selected_file">
                                        {
                                            form.file.map((file, index) => {
                                                return <div><span className="delete_file" onClick={e => resetForm()}>X</span><span key={index}>{file.name}</span></div>
                                            })
                                        }
                                    </div>
                                    :
                                    <div className="selected_file">
                                        <span>{`${form.file.length} archivos seleccionados`}</span>
                                    </div>
                                : <span className="not_file">No hay archivo seleccionado</span>}
                        </div>

                    </div>
                    <div >
                        <button className="btn-subir" onClick={handleSubmit} >Subir</button>
                    </div>
                </div>
            </div>
        )
    }

    const viewAdjuntos = (tab) => {
        return (
            <>
                {
                    adjuntos && adjuntos[tab] && adjuntos[tab].length > 0 ?
                        <CarruselAdjuntos data={adjuntos[tab]} id={vehiculo.id} getAdjuntos={getAdjuntos} />
                        :
                        <div className="not_adjuntos">
                            <span>No hay archivos adjuntos</span>
                        </div>
                }
            </>
        )
    }

    return (
        <>
            <div className={classes.root}>
                <Tabs
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                >
                    <Tab label="Tenencia " {...a11yProps(0)} name="tenencia" onClick={() => handleTab('Tenencia')} />
                    <Tab label="Foto de placas" {...a11yProps(1)} name="placas" onClick={() => handleTab('Foto_placas')} />
                    <Tab label="Seguro" {...a11yProps(2)} name="seguro" onClick={() => handleTab('Seguro')} />
                    <Tab label="Tarjeta de circulación" {...a11yProps(3)} name="tarjeta" onClick={() => handleTab('Tarjeta_circulacion')} />
                    <Tab label="Verificación" {...a11yProps(4)} name="verificacion" onClick={() => handleTab('Verificacion')} />
                    <Tab label="Factura" {...a11yProps(5)} name="factura" onClick={() => handleTab('Factura')} />
                    <Tab label="Multas" {...a11yProps(6)} name="multas" onClick={() => handleTab('Multas')} />
                </Tabs>

                <TabPanel value={value} index={0}>
                    <div>
                        {uploadButtons('Tenencia')}
                        {viewAdjuntos('Tenencia')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        {uploadButtons('Foto_placas')}
                        {viewAdjuntos('Foto_placas')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>
                        {uploadButtons('Seguro')}
                        {viewAdjuntos('Seguro')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        {uploadButtons('Tarjeta_circulacion')}
                        {viewAdjuntos('Tarjeta_circulacion')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <div>
                        {uploadButtons('Verificacion')}
                        {viewAdjuntos('Verificacion')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <div>
                        {uploadButtons('Factura')}
                        {viewAdjuntos('Factura')}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={6}>
                    <div>
                        {uploadButtons('Multas')}
                        {viewAdjuntos('Multas')}
                    </div>
                </TabPanel>
            </div>
        </>
    )
}