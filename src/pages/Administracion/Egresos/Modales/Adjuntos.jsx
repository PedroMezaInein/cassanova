import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


import { apiPutForm } from '../../../../functions/api'


import './../../../../styles/_adjuntosRequisicion.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
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
        display: 'flex',
        height: 500,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function Adjuntos(props) {
    const authUser = useSelector(state => state.authUser.access_token)
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [form, setForm] = useState({
        comunicado: ''
    })
    console.log('props', props)
    
    const [activeTab, setActiveTab] = useState('comunicado')
    const [validated, setValidated] = useState(false)

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    /* const handleTab = (e) => {
        console.log('tab', e)
        setActiveTab(e)
    }

    const hanldelChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: [...e.target.name, e.target.value]
        })
    } */

    const handleFile = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.files[0]
        })
    }

    const validate = () => {
        let error = false



        setValidated(error)
        return error
    }


    const handleSubmit = (e) => {
        e.preventDefault()

        if (true) {

            let data = new FormData();
            let aux = Object.keys(form)

            aux.forEach((element) => {
                switch (element) {
                    case 'adjuntos':
                        break;
                    default:
                        data.append(element, form[element])
                        break
                }
            })

            data.append(`files_name_requisicion[]`, 'comunicado')
            data.append(`files_requisicion[]`, form.comunicado)
            data.append('adjuntos[]', "comunicado")
            console.log('data', data)

            try {
                apiPutForm(`requisicion/${props.data.id}/archivos/s3`, data, authUser)
                    .then(res => {
                        console.log('res', res)
                        if (res.status === 200) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Adjunto guardado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
            } catch (error) {
                console.log('error', error)
            }
        } 
    }

    console.log('form', form)

    return (
        <>
            
            <div className={classes.root}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                >
                    <Tab label="Comunicado" {...a11yProps(0)} />
                    <Tab label="Solicitud" {...a11yProps(1)} />
                    <Tab label="Cotizaciones" {...a11yProps(2)} />
                    <Tab label="Orden de compra" {...a11yProps(3)} />
                    <Tab label="Comprobante de pago" {...a11yProps(4)} />
                    <Tab label="Factura" {...a11yProps(5)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <div>
                        <div>
                            <label>Comunicado</label>
                            <input type="file" className="form-control-file" name="comunicado" onChange={handleFile} />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <div>
                        <div>
                            <label>Solicitud</label>
                            <input type="file" className="form-control-file" name="solicitud" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <div>
                        <div>
                            <label>Cotizaciones</label>
                            <input type="file" className="form-control-file" name="cotizaciones" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <div>
                        <div>
                            <label>Orden de compra</label>
                            <input type="file" className="form-control-file" name="orden_compra" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <div>
                        <div>
                            <label>Comprobante de pago</label>
                            <input type="file" className="form-control-file" name="comprobante_pago" />
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={5}>
                    <div>
                        <div>
                            <label>Factura</label>
                            <input type="file" className="form-control-file" name="factura" />
                        </div>
                    </div>
                </TabPanel>
            </div>
        </>
    )
}