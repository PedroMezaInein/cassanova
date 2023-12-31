import React, {useState} from 'react'
import { useSelector } from 'react-redux'

import Swal from 'sweetalert2'

import TextField from '@material-ui/core/TextField';

import { apiPostForm } from '../../../functions/api'

import './AreaStyle/_agregarGasto.scss'

export default function ModalAgregar (props) {

    const {handleClose, reload, tipo} = props
    const user = useSelector(state=> state.authUser)
    const [form, setForm] = useState ({
        area:'',
        partida: '',
        createPartida: '',
        createArea: '',
        subPartida: '',
        arraySubPartidas: [],
        tipo: tipo,
        // i_select: '',
        // i_selectArea: '',
    })

    const [errores, setErrores] = useState({})

    //de aqui son nuevas funciones handlechange

    const handleChangeCreateArea=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                createArea:'',
                // i_selectArea: '',
                createPartida: null,
                subPartida: null,
                arraySubPartidas: [],
                area: e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })   
        }
    }

    const handleChange=(e)=>{
    setForm({
        ...form,
        [e.target.name]:e.target.value,
        })

    }

    const handleEnterSub=(e)=>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                arraySubPartidas: [...form.arraySubPartidas, {nombre:form.subPartida}],
                subPartida:''
            })
        }
    }

    const handleDeleteSub= (e) =>{
        const indiceSub = form.arraySubPartidas.findIndex(sub => sub.nombre === e)
        const newSub = [...form.arraySubPartidas]
        newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
        setForm({
            ...form,
            arraySubPartidas: newSub
        })
    }

    const handleChangePrueba = (e) =>{
        if(e.key==='Enter' ){
            setForm({
                ...form,
                createPartida:'',
                i_select: '',
                subPartida: null,
                arraySubPartidas: [],
                partida: e.target.value
            })
        } else {
            setForm({
                ...form,
                [e.target.name]:e.target.value,
            })   
        }
    }

    const handleDeletePartida = ()=>{
        setForm({
            ...form,
            partida:''
        })
    }

    const handleDeleteArea = ()=>{
        setForm({
            ...form,
            area:''
        })
    }

    const validateForm = () => {
        let validar = true
        let error = {}

        if(form.area === ''){
            error.area = 'Crea un área'
            validar = false
        }
        if(form.partida === '' || form.partida === null){
            error.partida = 'Crea una partida'
            validar = false
        }
        if(form.arraySubPartidas.length === 0){
            error.subareas = 'Crea una o varias sub partidas'
            validar = false
        }
        setErrores (error)
        return validar
    }

    const submit = () =>{
        // if(Object.keys(validateForm()).length ===0){
        if(validateForm()){

            Swal.fire({
                title: 'Cargando...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading()
                }
            }) 

            let newForm = {
                area: form.area,
                partida: form.partida,
                subarea: '',
                // subareasEditable: [],
                subareas: form.arraySubPartidas.map((item, index) => {
                    return item.nombre
                }),
                tipo: form.tipo
            }
 
            apiPostForm('areas', newForm, user.access_token)
            .then((data)=>{
                Swal.close()
                Swal.fire({
                    icon: 'success',
                    title: 'Nueva gasto',
                    text: 'Se ha creado correctamente',
                    timer: 5000,
                    timerProgressBar: true,
                })
                handleClose()
                if(reload){
                    reload.reload()
                } 
                
            })
            .catch((error)=>{  
                Swal.close()
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error',
                })
            })
        }
        else{
            Swal.fire({
                title: 'Error',
                text: 'Favor de llenar todos los campos',
                icon: 'error',
                showConfirmButton: false,
                timer: 2000,
            })
        }
    }

    return (

        <div>

            <div className='titulo_gasto'>Crea un área nueva para depués poder crear una partida</div>

            <div className='gasto_area'>

                {/* AREA */}

                {/* CREAR AREA */}
                <div>
                
                    <div>
                        <TextField 
                            label="área"
                            // style={{ margin: 8 }}
                            placeholder="Enter para crear área"
                            onChange={handleChangeCreateArea}
                            onKeyPress={handleChangeCreateArea}
                            // margin="normal"
                            name='createArea'
                            value={form.createArea}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            error={errores.area ? true : false}
                        /> 
                    </div>
                
                    <div className='etiqueta_gasto'>
                        {
                            form.area !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeleteArea(e)}}>X</span>{form.area}
                                    </span>
                                </div>
                            : null
                        }
                    </div> 

                </div>

                {/* PARTIDAS */}
                
                <div>
                    { form.area !== '' ? 
                        <div>
                            <TextField 
                                label="partida"
                                // style={{ margin: 8 }}
                                placeholder="Enter para crear partida"
                                onChange={handleChangePrueba}
                                onKeyPress={handleChangePrueba}
                                // margin="normal"
                                name='createPartida'
                                value={form.createPartida}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                error={errores.partida ? true : false}
                            /> 
                        </div> 
                    :
                    null
                    }
                     
                    <div className='etiqueta_gasto'>

                        {
                            form.partida !== '' ?
                                <div>
                                    <span className='nombre_partida'>
                                        <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}
                                    </span>
                                </div>
                            : null
                        }

                    </div>  
                </div>
                {/* {errores && errores.partida && form.partida === '' &&<span className='error_departamento'>{errores.partida}</span>} */}

                {/* {errores && errores.partida && form.area !== '' && form.area !== null && (form.partida === '' || form.partida === null) &&<span>{errores.partida}</span>} */}

            </div>

            <div className='gasto_subpartida'>
                { form.partida && form.partida !== ''?
                    <>
                        {/* <TextField 
                            label="Sub partida"
                            style={{ margin: 8 }}
                            placeholder="Nueva sub partida"
                            onChange={handleChange}
                            onKeyPress={handleEnterSub}
                            margin="normal"
                            name='subPartida'
                            type='text'
                            defaultValue={form.subPartida}
                            InputLabelProps={{
                            shrink: true,
                            }}
                        />  */}
                        <label className={errores.subareas ? 'error' : ''}>Subpartida</label>
                        <input 
                            className=''
                            name='subPartida' 
                            type='text' 
                            placeholder="Enter para crear subpartida"
                            value={form.subPartida ? form.subPartida : ''} 
                            onKeyPress={handleEnterSub}  
                            onChange={handleChange}
                            // error={errores.subareas ? true : false}
                            >
                        </input>
                    </>
                    : null
                } 

                <div className='subpartidas'>
                    {
                        form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
                            <>
                                {form.arraySubPartidas.map(subpartida=>{
                                    return <>
                                        <span className='sub_partida'>
                                            <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>
                                            <span className=''>{subpartida.nombre}</span>
                                        </span>
                                    </>
                                })}
                            </>
                        :null
                    }
                </div>
            </div>

            {/* {errores && errores.subPartida && form.subPartida === '' &&<span className='error_departamento'>{errores.subPartida}</span>} */}
            
            {/* {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>} */}

            {/* ENVIAR */}
            <div className='boton'>
                <button onClick={submit}>
                    Agregar
                </button> 
            </div>
        </div>
        
    )
}

// export default function ModalAgregar (props) {
//     const {handleClose, reload} = props
//     const user = useSelector(state=> state.authUser)
//     const departamentos = useSelector(state => state.opciones.areas)

//     const [form, setForm] = useState ({
//         area:'',
//         partida: '',
//         createPartida: '',
//         createArea: '',
//         subPartida: '',
//         arraySubPartidas: [],
//         i_select: '',
//         i_selectArea: '',
//     })

//     console.log(form)

//     const [errores, setErrores] = useState()

//     const handleChangeArea = (event) => {
//         setForm({
//             ...form,
//             [event.target.name]: event.target.value,
//             i_selectArea: '',
//             partida: '',
//             subPartida: null,
//             arraySubPartidas: []
//         })
//     }
    
//      //de aqui son nuevas funciones handlechange

//     const handleChangeCreateArea=(e)=>{
//         if(e.key==='Enter' ){
//             setForm({
//                 ...form,
//                 createArea:'',
//                 i_selectArea: '',
//                 createPartida: null,
//                 subPartida: null,
//                 arraySubPartidas: [],
//                 area: e.target.value
//             })
//         } else {
//             setForm({
//                 ...form,
//                 [e.target.name]:e.target.value,
//             })   
//         }
//     }

//     const handleChangePartida=(e)=>{
//         setForm({
//             ...form,
//             partida:e.target.value,
//             createPartida:'',
//             i_select:'',
//             subPartida: null,
//             arraySubPartidas: []
//         })
//     }

//     const handleChange=(e)=>{
//     setForm({
//         ...form,
//         [e.target.name]:e.target.value,
//         })

//     }

//     const handleEnterSub=(e)=>{
//         if(e.key==='Enter' ){
//             setForm({
//                 ...form,
//                 arraySubPartidas: [...form.arraySubPartidas, {nombre:form.subPartida}],
//                 subPartida:''
//             })
//         }
//     }

//     const handleDeleteSub= (e) =>{
//         const indiceSub = form.arraySubPartidas.findIndex(sub => sub.nombre === e)
//         const newSub = [...form.arraySubPartidas]
//         newSub.splice(indiceSub,1) // elimino la subpartida indicando el indice en donde se encontraba
//         setForm({
//             ...form,
//             arraySubPartidas: newSub
//         })
//     }

//     const handleChangePrueba = (e) =>{
//         if(e.key==='Enter' ){
//             setForm({
//                 ...form,
//                 createPartida:'',
//                 i_select: '',
//                 subPartida: null,
//                 arraySubPartidas: [],
//                 partida: e.target.value
//             })
//         } else {
//             setForm({
//                 ...form,
//                 [e.target.name]:e.target.value,
//             })   
//         }
//     }

//     const handleDeletePartida = ()=>{
//         setForm({
//             ...form,
//             partida:''
//         })
//     }

//     const validateForm = () => {
//         let validar = true
//         let error = {}
//         if(form.area === ''){
//             error.area = 'Selecciona un área'
//             validar = false
//         }
//         if(form.partida === '' || form.partida === null){
//             error.partida = 'Agrega una partida'
//             validar = false
//         }
//         if(form.subPartida === '' || form.subPartida === null){
//             error.subPartida = 'Agrega una sub partida'
//             validar = false
//         }
//         setErrores (error)
//         return validar
//     }

//     const submit = () =>{
//         if(Object.keys(validateForm()).length ===0){
//         //if(validateForm()){

//             Swal.fire({
//                 title: 'Cargando...',
//                 allowOutsideClick: false,
//                 onBeforeOpen: () => {
//                     Swal.showLoading()
//                 }
//             }) 

//             let newForm = {
//                 nombre: departamentos.find(item => item.id_area == form.area).nombreArea,
//                 id_departamento: form.area,
//                 createArea: form.createArea ? form.createArea :form.area,
//                 partida: form.partida.nombre? form.partida.nombre : form.partida,
//                 id_partida: form.partida.id ? form.partida.id : '',
//                 createPartida: form.createPartida,
//                 subarea: '',
//                 subareasEditable: [],
//                 subareas: form.arraySubPartidas.map((item, index) => {
//                     return item.nombre
//                 }),
//                 tipo: 'egresos'
//             }
 
//             apiPostForm('areas', newForm, user.access_token)
//             .then((data)=>{
//                 Swal.close()
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Nueva Requisicion',
//                     text: 'Se ha creado correctamente',
//                     timer: 5000,
//                     timerProgressBar: true,
//                 })
//                 // handleClose()
//                 // if(reload){
//                 //     reload.reload()
//                 // }
               
//             })
//             .catch((error)=>{  
//                 Swal.close()
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Oops...',
//                     text: 'Ha ocurrido un error',
//                 })
//             })
//         }// 
//         else{
//             Swal.fire({
//                 title: 'Error',
//                 text: 'Favor de llenar todos los campos',
//                 icon: 'error',
//                 showConfirmButton: false,
//                 timer: 2000,
//             })
//         }
//     }

//     return (

//         <div>
//             <div className='area'>

//                 {/* AREA */}
//                 <div>
//                     {departamentos.length > 0 ?
//                         <>
//                             <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
//                             <Select
//                                 // value={form.area}
//                                 value={form.i_selectArea}
//                                 name="area"
//                                 onChange={handleChangeArea}
//                             >
//                                 {departamentos.map((item, index) => (
//                                     <MenuItem key={index} value={item.id_area}>{item.nombreArea}</MenuItem>
//                                 ))}

//                             </Select>
//                         </>
//                         : null
//                     }
//                 </div>

//                 {/* CREAR AREA */}
//                 <div>
//                     {departamentos.length > 0 ?

//                         <>
//                             <div>
//                                 <TextField 
//                                     label="Crea un área"
//                                     // style={{ margin: 8 }}
//                                     placeholder="Enter para crear área"
//                                     onChange={handleChangeCreateArea}
//                                     onKeyPress={handleChangeCreateArea}
//                                     // margin="normal"
//                                     name='createArea'
//                                     value={form.createArea}
//                                     InputLabelProps={{
//                                     shrink: true,
//                                     }}
//                                 /> 
//                             </div>
//                         </>
//                         :
//                         null
//                     }   
//                     {/* <div className='etiqueta_partida'>

//                         {
//                             form.partida !== '' && form.partida.nombre ?
//                             <>
//                                 <div>
//                                     <span className='nombre_partida'>
//                                         <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida.nombre}
//                                     </span>
//                                 </div>
//                             </> 
//                             : form.partida !== '' ?
//                                 <div>
//                                     <span className='nombre_partida'>
//                                         <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}
//                                     </span>
//                                 </div>
//                             : null
//                         }

//                     </div>   */}
//                 </div>

//                 {/* PARTIDAS */}
//                 <div>
//                     {departamentos.length > 0 && form.area !== '' && departamentos.find(item => item.id_area == form.area)?
//                         <>
//                             <div className='subtitulo'>Selecciona o crea una nueva partida </div>
//                             <div className='partidas'>
//                                 <div>
//                                     <InputLabel id="demo-simple-select-label">Partida</InputLabel>
//                                     <Select
//                                         value={form.i_select}
//                                         name="partida"
//                                         onChange={handleChangePartida}
//                                     >
//                                     {departamentos.find(item => item.id_area == form.area).partidas.map((item, index) => (
//                                         <MenuItem key={index} value={item}>{item.nombre}</MenuItem>
//                                     ))}

//                                     </Select>
//                                 </div>
//                             </div>
//                         </>
//                         :
//                         null
//                     }     
//                 </div>

//                 <div>
//                     {departamentos.length > 0 && form.area !== ''?

//                         <>
//                             <div>
//                                 <TextField 
//                                     label="Crea una partida"
//                                     // style={{ margin: 8 }}
//                                     placeholder="Enter para crear partida"
//                                     onChange={handleChangePrueba}
//                                     onKeyPress={handleChangePrueba}
//                                     // margin="normal"
//                                     name='createPartida'
//                                     value={form.createPartida}
//                                     InputLabelProps={{
//                                     shrink: true,
//                                     }}
//                                 /> 
//                             </div>
//                         </>
//                         :
//                         null
//                     }   
//                     <div className='etiqueta_partida'>
//                         {
//                             form.partida !== '' && form.partida.nombre ?
//                             <>
//                                 <div>
//                                     <span className='nombre_partida'>
//                                         <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida.nombre}
//                                     </span>
//                                 </div>
//                             </> 
//                             : form.partida !== '' ?
//                                 <div>
//                                     <span className='nombre_partida'>
//                                         <span onClick={e=>{handleDeletePartida(e)}}>X</span>{form.partida}
//                                     </span>
//                                 </div>
//                                 : null
                        
//                         }
//                     </div>  
//                 </div>
//             </div>

//             <div className='subpartida'>
//                 {departamentos.length > 0 && form.partida && form.partida !== ''?
//                     <>
//                         {/* <TextField 
//                             label="Sub partida"
//                             style={{ margin: 8 }}
//                             placeholder="Nueva sub partida"
//                             onChange={handleChange}
//                             onKeyPress={handleEnterSub}
//                             margin="normal"
//                             name='subPartida'
//                             type='text'
//                             defaultValue={form.subPartida}
//                             InputLabelProps={{
//                             shrink: true,
//                             }}
//                         />  */}
//                         <label>Subpartida</label>
//                         <input name='subPartida' type='text' value={form.subPartida ? form.subPartida : ''} onKeyPress={handleEnterSub}  onChange={handleChange}></input>
//                     </>
//                     : null
//                 } 
//             </div>

//             <div className='subpartidas'>
//                 {
//                     form.arraySubPartidas.length > 0 && form.partida && form.partida !== '' ?
//                         <>
//                             {form.arraySubPartidas.map(subpartida=>{
//                                 return <>
//                                     <span className='sub_partida'>
//                                         <span className='sub_eliminar' onClick={(e)=>handleDeleteSub(subpartida.nombre)}>X</span>
//                                         <span>{subpartida.nombre}</span>
//                                     </span>
//                                 </>
                             
//                             })}
//                         </>
//                     :null
//                 }
//             </div>
            
//             {errores && errores.subPartida && form.partida !== '' && form.partida !== null && (form.subPartida === '' || form.subPartida === null) &&<span>{errores.subPartida}</span>}

//             {/* ENVIAR */}
//             <div className='boton'>
//                 <button onClick={submit}>
//                     Agregar
//                 </button> 
//             </div>
//         </div>
        
//     )
// }