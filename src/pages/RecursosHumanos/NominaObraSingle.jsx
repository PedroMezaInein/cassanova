import React, { Component } from 'react' 
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout' 
import NewTable from '../../components/tables/NewTable';
import { NOMINA_OBRA_SINGLE_COLUMNS } from '../../constants';
import { renderToString } from 'react-dom/server';
import { setMoneyTable, setMoneyTableForNominas, setTextTableCenter} from '../../functions/setters'

class NominaObraSingle extends Component {
    state = {  
        nomina: '',
        nominaData: [],
        totales: [],
        data:{
            nominaData: []
        }
        
    }

    componentDidMount() { 
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match : { params: { id } } } = this.props
        const { history } = this.props
        const nominaobra = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/single/' + id
        });
        
        if (!nominaobra)
            history.push('/')

        const { state } = this.props.location
        const { data } = this.state
        if(state) {
            if(state.nomina) {
                data.nominaData = state.nomina
                this.setState({
                    nomina: state.nomina,
                    nominaData: this.setNominasAdministrativas(state.nomina.nominas_obras),
                    totales: this.setTotales(state.nomina),
                    data
                })
            }
        }
    }

    setNominasAdministrativas = nominas => {
        let aux = []
        nominas.map( (nomina) => {
            aux.push(
                {
                    idEmpleado: renderToString(setTextTableCenter(nomina.empleado ? nomina.empleado.id : '')),
                    empleado: renderToString(setTextTableCenter(nomina.empleado ? nomina.empleado.nombre : '')),
                    proyecto: renderToString(setTextTableCenter(nomina.proyecto ? nomina.proyecto.nombre : '')),
                    salario_hr: renderToString(setMoneyTable(nomina.salario_hr ? nomina.salario_hr : 0.0)),
                    hr_trabajadas: renderToString(setMoneyTable(nomina.hr_trabajadas ? nomina.hr_trabajadas : 0.0)),
                    salario_hr_extras: renderToString(setMoneyTable(nomina.salario_hr_extras ? nomina.salario_hr_extras : 0.0)),
                    hr_extras: renderToString(setMoneyTable(nomina.hr_extras ? nomina.hr_extras: 0.0)),
                    nominaIMSS: renderToString(setMoneyTable(nomina.nomina_imss ? nomina.nomina_imss : 0.0)),
                    extras: renderToString(setMoneyTable(nomina.restante_nomina ? nomina.restante_nomina : 0.0)),
                    viaticos: renderToString(setMoneyTable(nomina.extras ? nomina.extras : 0.0)),
                    total: renderToString(setMoneyTable(nomina.extras + nomina.restante_nomina + nomina.nomina_imss)),
                    id: nomina.id
                }
            )
            return false
        })
        return aux
    }

    setTotales = nomina => {
        return {
                totalNominaImss: renderToString(setMoneyTableForNominas(nomina.totalNominaImss)),
                totalRestanteNomina: renderToString(setMoneyTableForNominas(nomina.totalRestanteNomina)),
                totalExtras: renderToString(setMoneyTableForNominas(nomina.totalExtras)),
                total: renderToString(setMoneyTableForNominas(nomina.totalExtras + nomina.totalRestanteNomina + nomina.totalNominaImss)),
            }
    }

    
    setSubtitle = nomina => {
        let aux = ''
        if(nomina.empresa)
            aux = aux + nomina.empresa.name + ' '
        aux = aux + nomina.periodo + ' '
        let fecha_inicio = new Date(nomina.fecha_inicio)
        let fecha_fin = new Date(nomina.fecha_fin)
        let months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        let days = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', 
            '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        fecha_inicio = days[fecha_inicio.getDate()]  + "/" + months[fecha_inicio.getMonth()] + "/" + fecha_inicio.getFullYear()
        fecha_fin = days[fecha_fin.getDate()]  + "/" + months[fecha_fin.getMonth()] + "/" + fecha_fin.getFullYear()
        aux = aux + fecha_inicio + ' ' + fecha_fin
        return aux
    }
    
    render() {
        const { nomina, nominaData, data, totales } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                {
                    nomina ? 
                        <NewTable 
                            columns = { NOMINA_OBRA_SINGLE_COLUMNS } 
                            data = { nominaData }
                            title = { nomina.periodo } 
                            subtitle = { this.setSubtitle(nomina) }
                            mostrar_boton = {false}
                            abrir_modal = {false}
                            mostrar_acciones = {false}
                            elements = { data.nominaData }
                            totales = { totales }
                            cardTable='cardTable'
                            cardTableHeader='cardTableHeader'
                            cardBody='cardBody'
                            />
                            
                    : ''
                }
            </Layout>
        )
    }

}
const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(NominaObraSingle);