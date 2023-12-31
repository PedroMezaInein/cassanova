import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import Swal from 'sweetalert2'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import InputLabel from '@material-ui/core/InputLabel';

import { apiOptions, apiPostForm } from '../../../../functions/api'

import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { es } from 'date-fns/locale'
import Grid from '@material-ui/core/Grid';

import Style from './../Departamento/TablaPresupuesto.module.css'

import { waitAlert2 } from '../../../../functions/alert'

export default function TablaPresupuestoObra(props) {
    const { reload, handleClose } = props
    const areas = useSelector(state => state.opciones.areas)
    const departamento = useSelector(state => state.authUser.departamento.departamentos[0])
    const nombreUsuario = useSelector(state => state.authUser.user)
    const auth = useSelector(state => state.authUser.access_token)
    const proyectos = useSelector(state => state.opciones.proyectos)
    const [form, setForm] = useState([])
    const [general, setGeneral] = useState({
        departamento: departamento.nombre,
        departamento_id: departamento.id,
        gerente: nombreUsuario.name,
        gerente_id: nombreUsuario.id,
        colaboradores: 0,
        colaboradores_id: '',
        granTotal: '',
        fecha_inicio: '',
        fecha_fin: '',
        nombre: '',
        id_proyecto: '',
        total: 0,
    })

    const [formDataTabla, setFormDataTabla] = useState([])


    useEffect(() => {
        getNominas()
    }, [])

    useEffect(() => {
        if (areas.length >= 13) {
            createData()
        }

        
    }, [areas])

    const createData = () => {
        let aux = []
        areas.map((area, index) => {
            aux.push([])
        })
        setForm(aux)
    }

    const handleMoney = (value) => {
        setGeneral({
            ...general,
            total: value
        })
    }

    const getNominas = () => {
        waitAlert2()
        try {
            apiOptions(`presupuestosdep?departamento_id=${general.departamento_id}`, auth)
                .then(res => {
                    let suma = 0
                    for (let i = 0; i < res.data.empleados.length; i++) {
                        suma += res.data.empleados[i].nomina_imss + res.data.empleados[i].nomina_extras
                    }
                    suma = suma * 2
                    setGeneral({
                        ...general,
                        nomina: suma,
                        colaboradores: res.data.empleados.length
                    })
                    Swal.close()
                })

        } catch (error) {
            Swal.close()
            console.log(error)
        }
    }

    const sendPresupuesto = () => {
        try {
            let aux = {
                data: formDataTabla,
                fecha_inicio: general.fecha_inicio,
                fecha_fin: general.fecha_fin,
                total: general.total,
                id_departamento: general.departamento_id,
                colaboradores: general.colaboradores,
                nombre: general.nombre,
                tipo: "crear",
                tab: "obra",
                id_proyecto: general.id_proyecto,
            }
            apiPostForm(`presupuestosdep?departamento_id=${general.departamento_id}`, aux, auth)
                .then(res => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Presupuesto creado con éxito',
                        timer: 2000
                    }).then(() => {
                        if (reload) {
                            reload.reload()
                        }
                        handleClose()
                    })

                })
        } catch (error) {
            console.log(error)
        }
    }

    const handleChangeFecha = (date, tipo) => {
        setGeneral({
            ...general,
            [tipo]: new Date(date)
        })
    };

    const handleChangeNombre = (e) => {
        setGeneral({
            ...general,
            nombre: e.target.value
        })
    }

    const handleChangeProyecto = (e) => {
        setGeneral({
            ...general,
            id_proyecto: e.target.value
        })
    }

    return (
        <>
            <div style={{ backgroundColor: 'white', padding: '2rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ textAlign: 'center' }}>Infraestructura e Interiores, S.A. de C.V.</h1>
                    <h2 style={{ textAlign: 'center' }}>Presupuesto de Obra</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    <div>
                        <InputLabel >Departamento</InputLabel>
                        <TextField
                            type="text"
                            value={general.departamento}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >Colaboradores</InputLabel>
                        <TextField
                            type="text"
                            value={general.colaboradores}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >Gerente</InputLabel>
                        <TextField
                            type="text"
                            value={general.gerente}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled
                        />
                    </div>
                    <div>
                        <InputLabel >presupuesto total</InputLabel>
                        <CurrencyTextField

                            variant="standard"
                            value={general.total}
                            currencySymbol="$"
                            outputFormat="number"
                            onChange={(e, value) => handleMoney(value)}
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '5rem' }}>
                    <div>
                        <InputLabel >Fecha</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_inicio !== '' ? general.fecha_inicio : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_inicio')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Fecha Fin</InputLabel>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={es}>
                            <Grid container >
                                <KeyboardDatePicker

                                    format="dd/MM/yyyy"
                                    name="fecha_pago"
                                    value={general.fecha_fin !== '' ? general.fecha_fin : null}
                                    placeholder="dd/mm/yyyy"
                                    onChange={e => handleChangeFecha(e, 'fecha_fin')}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </div>

                    <div>
                        <InputLabel >Nombre del presupuesto</InputLabel>
                        <TextField
                            type="text"
                            defaultValue={general.nombre}
                            onChange={handleChangeNombre}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </div>

                    {
                        proyectos.length > 0 &&
                        <div>
                                <InputLabel >Proyecto</InputLabel>
                                <Select onChange={(e) => handleChangeProyecto(e)} value={general.proyecto}>
                                <MenuItem value="" hidden>Selecciona proyecto</MenuItem>
                                    {
                                        proyectos.map((proyecto, index) => (
                                            <MenuItem key={index} value={proyecto.id}>{proyecto.nombre}</MenuItem>
                                        ))
                                    }

                            </Select>
                        </div>
                    }

                </div>

                <div className="row justify-content-end">
                    <div className="col-md-4">
                        <button className={Style.sendButton} onClick={() => sendPresupuesto()} variant="contained" color="primary">Crear</button>
                    </div>
                </div>

            </div>
        </>
    )
}