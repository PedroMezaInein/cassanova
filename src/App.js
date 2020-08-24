import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './pages/Loading';
import { connect } from 'react-redux';
import axios from 'axios';
import { URL_DEV } from './constants';
import { logout, login } from './redux/reducers/auth_user'
import swal from 'sweetalert' 

const Loader = x => Loadable({
    loading: Loading,
    loader: x
})

const Login = Loader(() => import('./pages/Login') )

const Home = Loader(() => import('./pages/Home') )

const Tareas = Loader(() => import('./pages/Usuarios/Tareas') )
const Empresas = Loader(() => import('./pages/Usuarios/Empresas/Empresas') )
const EmpresasForm = Loader(() => import('./pages/Usuarios/Empresas/EmpresasForm') )

const Usuarios = Loader(() => import('./pages/Usuarios/Usuarios/Usuarios') )
const UsuariosForm = Loader(() => import('./pages/Usuarios/Usuarios/UsuariosForm') )

const Normas = Loader(() => import('./pages/Normas') )

const Leads = Loader(() => import('./pages/Leads/Leads') )

const Prospectos = Loader(() => import('./pages/Leads/Prospectos/Prospectos') )
const ProspectosForm = Loader(() => import('./pages/Leads/Prospectos/ProspectosForm') )

const Clientes = Loader(() => import('./pages/Leads/Clientes') )

const MiProyecto = Loader(() => import('./pages/MiProyecto') )

const Cuentas = Loader(() => import('./pages/Bancos/Cuenta') )
const EstadosCuenta = Loader(() => import('./pages/Bancos/EstadosCuenta') )
const Traspasos = Loader(() => import('./pages/Bancos/Traspasos') )

const Conceptos = Loader(() => import('./pages/Presupuesto/Conceptos/Conceptos') )
const ConceptosForm = Loader(() => import('./pages/Presupuesto/Conceptos/ConceptosForm') )

const Rendimiento = Loader(() => import('./pages/Presupuesto/Rendimiento') )
const Presupuesto = Loader(() => import('./pages/Presupuesto/Presupuesto') )
const AddPresupuestoForm = Loader(() => import('./pages/Presupuesto/AddPresupuestoForm') )
const ActualizarPresupuesto = Loader(() => import('./pages/Presupuesto/ActualizarPresupuesto') )
const UltimoPresupuesto = Loader(() => import('./pages/Presupuesto/UltimoPresupuesto') )
const PresupuestoDiseño = Loader(() => import('./pages/Presupuesto/PresupuestoDiseño/PresupuestoDiseño') )
const PresupuestoDiseñoForm = Loader(() => import('./pages/Presupuesto/PresupuestoDiseño/PresupuestoDiseñoForm') )

const Ingresos = Loader(() => import('./pages/Administracion/Ingresos/Ingresos') )
const IngresosForm = Loader(() => import('./pages/Administracion/Ingresos/IngresosForm') )

const Egresos = Loader(() => import('./pages/Administracion/Egresos/Egresos') )
const EgresosForm = Loader(() => import('./pages/Administracion/Egresos/EgresosForm') )

const Facturacion = Loader(() => import('./pages/Administracion/Facturacion') )
const Contratos = Loader(() => import('./pages/Administracion/Contratos') )
const Flujos = Loader(() => import('./pages/Administracion/Flujos') )

const Proveedores = Loader(() => import('./pages/Administracion/Proveedor/Proveedor') )
const ProveedoresForm = Loader(() => import('./pages/Administracion/Proveedor/ProveedorForm') )

const Proyectos = Loader(() => import('./pages/Proyectos/Proyectos') )
const Ventas = Loader(() => import('./pages/Proyectos/Ventas') )
const Compras = Loader(() => import('./pages/Proyectos/Compras') )
const Utilidad = Loader(() => import('./pages/Proyectos/Utilidad') )

const SolicitudCompra = Loader(() => import('./pages/Proyectos/SolicitudCompra/SolicitudCompra') )
const SolicitudCompraForm = Loader(() => import('./pages/Proyectos/SolicitudCompra/SolicitudCompraForm') )

const SolicitudVenta = Loader(() => import('./pages/Proyectos/SolicitudVenta') )

const Remision = Loader(() => import('./pages/Proyectos/Remision/Remision') )
const RemisionForm = Loader(() => import('./pages/Proyectos/Remision/RemisionForm') )

const Areas = Loader( () => import('./pages/Catalogos/Areas') )
const Partidas = Loader( () => import('./pages/Catalogos/Partidas') )
const Unidades = Loader( () => import('./pages/Catalogos/Unidades') )
const TiposContratos = Loader( () => import('./pages/Catalogos/TiposContratos') )
const Bancos = Loader( () => import('./pages/Catalogos/Bancos') )
const PrecioDiseño = Loader( () => import('./pages/Catalogos/PrecioDiseño/PrecioDiseño') )
const PrecioDiseñoForm = Loader( () => import('./pages/Catalogos/PrecioDiseño/PrecioDiseñoForm') )
const PartidasDiseño = Loader( () => import('./pages/Catalogos/PartidasDiseño/PartidasDiseño') )
const PartidasDiseñoForm = Loader( () => import('./pages/Catalogos/PartidasDiseño/PartidasDiseñoForm') )

const Contabilidad = Loader( () => import('./pages/Reportes/Contabilidad') )
const AccountSettings = Loader(() => import('./pages/Perfil/AccountSettings') )

const NominaObra = Loader(() => import('./pages/RecursosHumanos/NominaObra/NominaObra') )
const NominaObraForm = Loader(() => import('./pages/RecursosHumanos/NominaObra/NominaObraForm') )
const NominaObraSingle = Loader(() => import('./pages/RecursosHumanos/NominaObraSingle') )

const NominaAdmin = Loader(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdmin') )
const NominaAdminForm = Loader(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdminForm') )
const NominaAdminSingle = Loader(() => import('./pages/RecursosHumanos/NominaAdmin/NominaAdminSingle') )
const Empleados = Loader(() => import('./pages/RecursosHumanos/Empleados') )



class App extends Component{
    async componentDidMount(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'user', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { data } = response
                login(data)
            },
            (error) => {
                if(error.response.status === 401){
                    this.logoutUser()    
                }
                else{
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                        icon: 'error',
                        
                    })
                }
                console.log(error.response, 'response')
                /* this.logoutUser() */
            }
        ).catch((error) => {
            /* this.logoutUser() */
            swal({
                title: '¡Ups 😕!',
                text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.' ,
                icon: 'error',
                
            })
        })
    }

    shouldComponentUpdate(nextProps){
        const { history } = this.props
        if(nextProps.authUser.access_token === ''){
            history.push('/login')
        }
        return false
    }

    async logoutUser(){
        const { logout, authUser : {access_token: access_token}, history } = this.props
        
        await axios.get(URL_DEV + 'user/logout', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                logout();
                history.push('/login')
            },
            (error) => {
                if(error.response.status === 401){
                    logout();
                    history.push('/login')
                }
            }
        ).catch((error) => {
            /* logout();
            history.push('/login') */
        })
    }
    render(){
        
        return(
            <>
                
                <Route path = "/login" exact component = { Login } />

                <Route path = "/" exact component= { Home } />

                <Route path = "/mi-proyecto" exact component = { MiProyecto } />

                <Route path = "/usuarios/usuarios" exact component = { Usuarios } />
                <Route path = "/usuarios/usuarios/:action" exact component ={ UsuariosForm } />
                <Route path = "/usuarios/tareas" exact component = { Tareas } />
                <Route path = "/usuarios/empresas" exact component ={ Empresas } />
                <Route path = "/usuarios/empresas/:action" exact component ={ EmpresasForm } />

                <Route path = "/presupuesto/conceptos" exact component ={ Conceptos } />
                <Route path = "/presupuesto/conceptos/:action" exact component ={ ConceptosForm } />

                <Route path = "/presupuesto/rendimiento" exact component ={ Rendimiento } />
                <Route path = "/presupuesto/presupuesto" exact component ={ Presupuesto } />
                <Route path = "/presupuesto/presupuesto/add" exact component ={ AddPresupuestoForm } />
                <Route path = "/presupuesto/presupuesto/update" exact component ={ ActualizarPresupuesto } />  
                <Route path = "/presupuesto/presupuesto/finish" exact component ={ UltimoPresupuesto } />

                <Route path = "/presupuesto/presupuesto-diseño" exact component ={ PresupuestoDiseño } />  
                <Route path = "/presupuesto/presupuesto-diseño/:action" exact component ={ PresupuestoDiseñoForm } />            

                <Route path = "/proyectos/proyectos" exact component ={ Proyectos } />
                <Route path = "/proyectos/ventas" exact component ={ Ventas } />
                <Route path = "/proyectos/compras" exact component ={ Compras } />
                <Route path = "/proyectos/utilidad" exact component ={ Utilidad } />
                
                <Route path = "/proyectos/remision" exact component ={ Remision } />
                <Route path = "/proyectos/remision/:action" exact component ={ RemisionForm } />

                <Route path = "/proyectos/solicitud-compra" exact component ={ SolicitudCompra } />
                <Route path = "/proyectos/solicitud-compra/:action" exact component ={ SolicitudCompraForm } />
                
                <Route path = "/proyectos/solicitud-venta" exact component ={ SolicitudVenta } />

                <Route path = "/administracion/egresos" exact component ={ Egresos } />
                <Route path = "/administracion/egresos/:action" exact component ={ EgresosForm } />

                <Route path = "/administracion/ingresos" exact component ={ Ingresos } />
                <Route path = "/administracion/ingresos/:action" exact component ={ IngresosForm } />
                
                <Route path = "/administracion/facturacion" exact component ={ Facturacion } />
                <Route path = "/administracion/contratos" exact component ={ Contratos } />
                <Route path = "/administracion/flujos" exact component ={ Flujos } />

                <Route path = "/administracion/proveedores" exact component ={ Proveedores } />
                <Route path = "/administracion/proveedores/:action" exact component ={ ProveedoresForm } />

                <Route path = "/bancos/cuentas" exact component ={ Cuentas } />
                <Route path = "/bancos/estados-cuenta" exact component ={ EstadosCuenta } />
                <Route path = "/bancos/traspasos" exact component ={ Traspasos } />
                
                <Route path = "/leads/leads" exact component ={ Leads } />

                <Route path = "/leads/prospectos" exact component = { Prospectos } />
                <Route path = "/leads/prospectos/:action" exact component = { ProspectosForm } />

                <Route path = "/leads/clientes" exact component = { Clientes } />

                <Route path = "/normas" exact component ={ Normas } />

                <Route path = "/catalogos/areas" exact component ={ Areas } />
                <Route path = "/catalogos/partidas" exact component ={ Partidas } />
                <Route path = "/catalogos/unidades" exact component ={ Unidades } />
                <Route path = "/catalogos/tipos-contratos" exact component ={ TiposContratos } />
                <Route path = "/catalogos/bancos" exact component ={ Bancos } />
                <Route path = "/catalogos/precio-diseno" exact component ={ PrecioDiseño } />
                <Route path = "/catalogos/precio-diseno/:action" exact component ={ PrecioDiseñoForm } />
                <Route path = "/catalogos/partidas-diseño" exact component ={ PartidasDiseño } />
                <Route path = "/catalogos/partidas-diseño/:action" exact component ={ PartidasDiseñoForm } />

                <Route path = "/reportes/contabilidad" exact component ={ Contabilidad } />
                <Route path = "/mi-perfil" exact component ={ AccountSettings } />

                <Route path = "/rh/nomina-obras" exact component ={ NominaObra } />  
                <Route path = "/rh/nomina-obras/:action" exact component ={ NominaObraForm } />
                <Route path = "/rh/nomina-obras/single/:id" exact component ={ NominaObraSingle } />

                <Route path = "/rh/nomina-admin" exact component ={ NominaAdmin } />
                <Route path = "/rh/nomina-admin/:action" exact component ={ NominaAdminForm } />
                <Route path = "/rh/nomina-admin/single/:id" exact component ={ NominaAdminSingle } />
                <Route path = "/rh/empleados" exact component ={ Empleados } />

            </>
        )
    }
}
const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout()),
    login: payload => dispatch(login(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);