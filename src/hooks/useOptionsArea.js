import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiGet } from '../functions/api'
import { SaveOptionsAreas } from '../redux/actions/actions'

const useOptionsArea = () => {
    const [opciones, setOpciones] = useState(false)
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const user = useSelector(state => state.authUser)
    useEffect(() => {
        apiGet('areas', user.access_token)
            .then((response) => {
                setOpciones(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        if (opciones) {
            proccessData()
        }
    }, [opciones])

    const proccessData = () => {
        let e = opciones
        console.log(e)
        let aux = []
        for(let key in e.area){
            for(let area in e.area[key]){
                let auxPartidas = []
                    for(let idpartida in e.area[key][area]){
                        for(let partida in e.area[key][area][idpartida]){
                            // Imprime el nombre de cada partida
                            console.log(e.area[key][area][idpartida][partida])
                            let auxSubpartida = []
                            e.area[key][area][idpartida][partida].forEach(elemento =>{
                                auxSubpartida.push({
                                    id: elemento.id,
                                    nombre: elemento.nombre,
                                })
                            })
                            auxPartidas.push({
                                id:idpartida,
                                nombre:partida,
                                subpartidas:auxSubpartida
                            })
                        }
                    }
                let areas = {
                    nombreArea: area,
                    id_area: key,
                    partidas:auxPartidas,
                }
                aux.push(areas)
            }
        }
        console.log(aux)
        dispatch(SaveOptionsAreas(aux))
    }
    
}

export default useOptionsArea;
