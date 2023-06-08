import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

// MATERIAL UI
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardTimePicker,KeyboardDatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';

import AdjuntosObra from './AdjuntosObra'
import './../../../../../styles/_nuevaNotaObra.scss'
import Style from '././../../../../../components/forms/administracion/NuevaRequisicion.module.css'

import { apiPostForm } from '../../../../../functions/api';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        maxWidth: 400,
    },
    // selectEmpty: {
    //     marginTop: theme.spacing(2),
    // },
}));

export default function NuevaNota(props) { 
    const { proyecto, reload, opciones, handleClose } = props
    const auth = useSelector(state => state.authUser);
    // const classes = useStyles();

    const [form, setForm] = useState({ 
        fecha:'',
        proveedor:'',
        tipo_nota: '',
        nota: '',
        adjunto: ''
    });

    const [errores, setErrores] = useState({})
    // const [adjuntos, setAdjuntos] = useState([])

    const validateForm = () => {
        let validar = true
        let error = {}
        if(form.fecha === ''){
            error.fecha = "Seleccione una fecha"
            validar = false
        }
        if(form.tipo_nota === ''){
            error.tipo_nota = "Indique el tipo de nota"
            validar = false
        }
        if(form.proveedor === ''){
            error.proveedor = "Seleccione un proveedor"
            validar = false
        }
        if(form.nota === ''){
            error.nota = "Escriba una nota"
            validar = false
        }
        
        setErrores(error)
        return validar
    }

    const handleChangeFecha = (date, tipo) => {
        setForm({
            ...form,
            [tipo]: new Date(date)
        })
    };

    const handleChange = (e) => {
        setForm({ 
            ...form, 
            [e.target.name]: e.target.value })
    };
    function formatDate(date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return year + '/' + month + '/' + day;
      }


    const handleFile = (e) => {
        debugger
        console.log(e)
        setForm({
            ...form,
            adjunto: e.target.files[0]
        })
    }

    console.log(form.adjunto)

    const handleSend = () => {
        
        // if (validateForm()) {
        if (true) {
            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            })

            try {
                let dataForm = new FormData()

                let newForm = {
                    proveedor: form.proveedor,
                    notas: form.nota,
                    tipo_nota: form.tipo_nota,
                    fecha:  formatDate(form.fecha),
                    adjunto: form.adjunto,
                }
                console.log(form.adjunto)


                let aux = Object.keys(newForm)

                aux.forEach((element) => {
                    switch (element) {
                        case 'adjuntos':
                            break;
                        default:
                            dataForm.append(element, newForm[element])
                            break
                    }
                })

                dataForm.append(`files_name_notaObra[]`, 'notaObra')
                dataForm.append(`files_notaObra[]`, form.adjunto)
                dataForm.append('adjuntos[]', "notaObra")

                console.log(form)


                apiPostForm(`v2/proyectos/nota-bitacora/${proyecto.id}`, dataForm, auth.access_token)
                .then(
                    (response) => {
                        Swal.close()

                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Solicitud de Compra creada correctamente',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            if (reload) {
                                reload.reload()
                            }
                            handleClose()
                        })
                    },
                    (error) => {
                        Swal.close()
                        Swal.fire({
                            title: 'Solicitud de Compra',
                            text: 'Error al crear la Solicitud de Compra',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        })
                    }
                ).catch((error) => {
                    Swal.close()
                    Swal.fire({
                        title: 'Solicitud de Compra',
                        text: 'Error al crear la Solicitud de Compra',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    })
                })    
            } catch (error) {
                Swal.close()
                Swal.fire({
                    title: 'Solicitud de Compra',
                    text: 'Error al crear la Solicitud de Compra',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                })
            }
            
        } else {
            Swal.fire({
                title: 'Faltan campos por llenar',
                text: 'Favor de llenar todos los campos',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false

            })
        } 
    }

    return (
        // <div className={classes.formControl}>
        <div>

            <div className='row'>
                <div className='col-xl-6'>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justifyContent="space-around">
                            <KeyboardDatePicker
                            // margin="normal"
                            id="date-picker-dialog"
                            label="fecha"
                            format="dd/MM/yyyy"
                            // value={selectedDate}
                            value={form.fecha !=='' ? form.fecha : null}
                            onChange={e=>handleChangeFecha(e, 'fecha')}
                            // onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            /> 
                        </Grid>
                    </MuiPickersUtilsProvider>
                </div>
            
                <div className='col-xl-6'>
                    {/* {opciones.proveedores.length > 0 ? */}
                        <>  
                            <InputLabel>proveedor</InputLabel>
                            <Select
                                name="proveedor"
                                value={form.proveedor}
                                onChange={handleChange}
                                // error={errores.proveedor ? true : false}
                            >
                                {
                                    opciones.proveedores.map((item, index) => {
                                        return <MenuItem value={item.value} key={index}>{item.name}</MenuItem>
                                    })
                                }   
                            </Select>
                        </> 
                    {/* } */}
                </div>
            </div>

            <div className='row'>
                <div className='col-xl-6'>
                    <TextField
                        className="text"
                        id="standard-multiline-static"
                        label="tipo de nota"
                        value={form.tipo_nota}
                        name='tipo_nota'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        // error={errores.destino ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>

                <div className='col-xl-6'>
                    <TextField
                        className="text"
                        id="standard-multiline-static"
                        label="nota"
                        value={form.nota}
                        name='nota'
                        onChange={handleChange}
                        multiline
                        rows={2}
                        // error={errores.destino ? true : false}
                        // defaultValue="Default Value"
                    />
                </div>
            </div>

            <div className='row'>
                <div style={{ marginLeft: '0rem' }} className={`col-xl-8 ${Style.file}`}>
                    <label htmlFor="file">Seleccionar archivo</label>
                    <input type="file" id='file' name="file" onChange={handleFile} />
                    <div>
                        {form.adjunto.name ? <div className='file-name'>{form.adjunto.name}</div> : null}
                    </div>
                </div>
            
                <div className='col-xl-4'>
                    <button className={Style.sendButton} onClick={handleSend}>Crear</button>
                </div>
            </div>

        </div>
        
    )
}
