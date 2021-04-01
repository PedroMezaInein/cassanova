import { 
    faProjectDiagram, 
    faUsers, faUsersCog, faTasks, faBuilding,
    faFileInvoiceDollar, faThList, faChartLine,
    faFolder, faShoppingBasket, faToolbox, faFolderOpen, faFilePrescription, faReceipt ,faFilePdf, faCoins, faHandHoldingUsd, faTruckLoading,
    faArchive, faFileSignature, faLongArrowAltRight, faSearchDollar, faFunnelDollar, faLongArrowAltLeft, faPassport, 
    faPiggyBank, faExchangeAlt, faBalanceScale, faWallet, 
    faUserTie, faSitemap, faHospitalAlt, faUserFriends, faUserShield, faCalendarCheck, faHandsHelping, 
    faMailBulk, faSearch, faComments, faAddressCard,
    faGavel,
    faAtlas, faCubes
} from '@fortawesome/free-solid-svg-icons'

export const COLORES_GRAFICAS_MESES = [ '#AB47BC', '#5C6BC0', '#42A5F5', '#26C6DA', 
    '#26A69A', '#66BB6A', '#D4E157', '#FFEE58', '#FFA726', '#FF7043', '#8D6E63', '#78909C' ]

export const COLORES_GRAFICAS = [
    '#007BFF',
    '#6610F2',
    '#E83E8C',
    '#DC3545',
    '#FD7E14',
    '#FFC107',
    '#6F42C1',
    '#28A745'
]

export const COLORES_CALENDARIO_PROYECTOS = [
    '#9e6e36',
    '#9e6e36',
    '#10c7a6',
    '#5b7533',
    '#b0b1ca',
    '#beac49',
    '#ac5684',
    '#34c1e7',
    '#308fa8',
    '#6dc14f',
    '#21b3af',
    '#c7608a',
    '#f05c34',
    '#27d60',
    '#6462cc',
    '#39a5f1',
    '#cf60a5',
    '#a16792',
    '#9bac45',
    '#a2a5da',
    '#94c7ac',
    '#e28ac7',
    '#68c979',
    '#e88f6b',
    '#65b1a0',
    '#64c6ce',
    '#10b27a',
    '#14a4e3',
    '#128897',
    '#90c793',
    '#5da48e',
    '#9eb6a1',
    '#37899b',
    '#b696b0',
    '#d05b7f',
    '#8690c6',
    '#7ca0cd'
]

export const COLORES_GRAFICAS_2 = [
    '#002D41',
    '#15B1D7',
    '#03749C',
    '#023D67',
    '#FDD600',
    '#D44206',
    '#F97304',
    '#720F03',
    '#E08132',
    '#E9AE0B',
    '#BEB286',
    '#306266',
    '#F79ECC',
    '#AD96E4',
    '#6D045A'
]

export const COLORES_GRAFICAS_INEIN = [
    '#1BC5BF',
    '#2E61CE',
    '#FF8523',
    '#FFB423',
    '#9C1EC0',
    '#DF1E97',
    '#B7F622',
    '#F44436',
    '#B47747',
    '#388E3E',
]
export const COLORES_GRAFICAS_IM = [
    '#28517B',
    '#A61F2F',
    '#8D8133',
    '#037D7D',
    '#5B287F',
    '#78AD2F',
    '#A02B5E',
    '#d06004',
    '#497A6F',
    '#BDBA33',
]

export const INEIN_RED = '#D8005A'
export const IM_AZUL = '#7096c1'
export const IM_DORADO = '#bdab71'

// DEV
/* export const URL_DEV = 'http://127.0.0.1:8000/api/';
export const URL_ASSETS = 'http://127.0.0.1:8000'; */

/* export const PROD_LINK = 'https://demo.proyectosadmin.com/api/' */
export const PROD_LINK = 'https://proyectosadmin.xyz/api/'
export const DEV_LINK = 'http://localhost:8000/api/'
// export const DEV_LINK = 'https://api-app1.test/api/'
/* export const DEV_LINK = 'https://demo.proyectosadmin.com/api/' */
/* export const DEV_LINK = 'https://proyectosadmin.xyz/api/' */

export const URL_DEV = process.env.NODE_ENV === 'production' ? PROD_LINK : DEV_LINK
/* export const URL_ASSETS = process.env.NODE_ENV === 'production' ? 'https://demo.proyectosadmin.com' : 'http://127.0.0.1:8000' */
export const URL_ASSETS = process.env.NODE_ENV === 'production' ? 'https://proyectosadmin.xyz' : 'http://127.0.0.1:8000'

// PROD / DEV
/* export const URL_DEV = 'https://demo.proyectosadmin.com/api/';
export const URL_ASSETS = 'https://demo.proyectosadmin.com'; */

export const CP_URL = 'https://api-sepomex.hckdrk.mx/query/info_cp/'
//Icons

export const ICONS_MODULES = { 
    'faProjectDiagram': faProjectDiagram, 
    'faUsers' : faUsers, 'faUsersCog' : faUsersCog, 'faTasks' : faTasks, 'faBuilding' : faBuilding,
    'faFileInvoiceDollar': faFileInvoiceDollar, 'faThList':faThList, 'faChartLine':faChartLine,
    'faFolder':faFolder, 'faShoppingBasket':faShoppingBasket, 'faToolbox':faToolbox, 'faFolderOpen':faFolderOpen, 'faFilePrescription':faFilePrescription, 
        'faReceipt':faReceipt, 'faFilePdf':faFilePdf, 'faCoins':faCoins, 'faHandHoldingUsd':faHandHoldingUsd, 'faTruckLoading': faTruckLoading,
    'faArchive':faArchive, 'faFileSignature':faFileSignature, 'faLongArrowAltRight':faLongArrowAltRight, 'faSearchDollar':faSearchDollar, 
        'faFunnelDollar':faFunnelDollar, 'faLongArrowAltLeft':faLongArrowAltLeft, 'faPassport':faPassport, 
    'faPiggyBank': faPiggyBank, 'faExchangeAlt':faExchangeAlt, 'faBalanceScale':faBalanceScale, 'faWallet':faWallet, 
    'faUserTie':faUserTie, 'faSitemap':faSitemap, 'faHospitalAlt':faHospitalAlt, 'faUserFriends':faUserFriends, 'faUserShield':faUserShield, 
        'faCalendarCheck':faCalendarCheck, 'faHandsHelping':faHandsHelping, 
    'faMailBulk':faMailBulk, 'faSearch':faSearch, 'faComments':faComments, 'faAddressCard':faAddressCard,
    'faGavel':faGavel,
    'faAtlas':faAtlas, 'faCubes':faCubes
}
//Paleta de colores
// export const COLORS = ["#20ACE9", "#EE4C9E", "#62D270", "#E63850", "#A962E2", "#E4C127", "#1D69E1", "#8C5E4D", "#737373"];
export const COLORS = ["#E53935", "#CB4335", "#AB47BC", "#7D3C98", "#C15994", "#2471A3", "#2E86C1","#42A5F5", "#4DD0E1", "#17A589", "#229954", "#28B463", "#9CCC65", "#FFC42C", "#D4AC0D", "#FF7043", "#D68910", "#CA6F1E", "#9F6A57", "#707B7C"];

//Expresiones Regulares

    //export const RFC = '^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))([A-Z\d]{3})?$'  (Expresión original)
    export const RFC = '[A-Z,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?'
    export const DATE ='(^(((0[1-9]|1[0-9]|2[0-8])[\/](0[1-9]|1[012]))|((29|30|31)[\/](0[13578]|1[02]))|((29|30)[\/](0[4,6,9]|11)))[\/](19|[2-9][0-9])\d\d$)|(^29[\/]02[\/](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)'
    export const TEL = '^[0-9]{10}$'
    export const EMAIL = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'
    // export const EMAIL='/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i'
    export const NSS = '^(\d{2})(\d{2})(\d{2})\d{5}$'
    export const CURP = '/^[a-z]{4}\d{6}[HM][a-z]{5}\d{2}$/i'
    // export const ABONO = '/^[12-40]$/'
//Form

export const EMPTY_EMPLEADO = {
    tipo_empleado: '',
    empresa:'',
    puesto:'',
    fecha_inicio: '',
    estatus: '',
    rfc: '',
    nss: '',
    curp: '',
    banco: '',
    cuenta: '',
    clabe: '',
    nombre_emergencia: '',
    telefono_emergencia: '',
}

export const EMPTY_CONTACTO = {
    comentario: '',
    fechaContacto: '',
    success: 'Contactado',
    tipoContacto: '',
    newTipoContacto: ''
}

export const EMPTY_CLIENTE = {
    empresa: '',
    nombre:'',
    puesto: '',
    cp: '',
    estado: '',
    municipio: '',
    colonia: '',
    calle: '',
    perfil: '',
    rfc: ''
}

export const EMPTY_PROSPECTO = {
    descripcion: '',
    vendedor: '',
    preferencia: '',
    motivo: '',
    cliente: '',
    tipoProyecto: '',
    estatusContratacion: '',
    estatusProspecto: '',
    newEstatusProspecto: '',
    newTipoProyecto: '',
    newEstatusContratacion: ''
}

//Colors
export const DARK_BLUE = "#325693"
export const DARK_BLUE_20 = "#32569320"
export const DARK_BLUE_40 = "#32569340"
export const DARK_BLUE_60 = "#32569360"
export const DARK_BLUE_80 = "#32569380"
export const DARK_BLUE_90 = "#32569390"

export const BLUE = "#7096c1"
export const BLUE_20 = "#7096c120"
export const BLUE_40 = "#7096c140"
export const BLUE_60 = "#7096c160"
export const BLUE_80 = "#7096c180"

export const L_BLUE = "#c7d0df"
export const L_BLUE_20 = "#c7d0df20"
export const L_BLUE_40 = "#c7d0df40"
export const L_BLUE_60 = "#c7d0df60"
export const L_BLUE_80 = "#c7d0df80"

export const BONE = "#ecedef"
export const BONE_20 = "#ecedef20"
export const BONE_40 = "#ecedef40"
export const BONE_60 = "#ecedef60"
export const BONE_80 = "#ecedef80"

export const GOLD = '#b4a26d'
export const GOLD_20 = '#b4a26d20'
export const GOLD_40 = '#b4a26d40'
export const GOLD_60 = '#b4a26d60'
export const GOLD_80 = '#b4a26d80'

// Table
export const TABLE_SIZE = 20

// Columns table
// Leads
export const LEADS_COLUMNS = [                
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Convertido',
        accessor: 'convertido',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Contacto',
        accessor: 'contacto',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Servicios',
        accessor: 'servicios',
    },
    {
        Header: 'Origen',
        accessor: 'origen',
    },
    {
        Header: 'Tipo de lead',
        accessor: 'tipo_lead',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    }
]

export const REPORTE_MERCA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'EMPRESA', accessor: 'empresa' },
    { Header: 'FECHA', accessor: 'fecha' },
    { Header: 'REPORTE', accessor: 'reporte' },
]

export const PROSPECTOS_COLUMNS = [                
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Estatus', //Estatus del prospecto
        accessor: 'estatusProspecto',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Proyecto', //Estaba: Tipo de proyecto
        accessor: 'tipoProyecto',
    },
    {
        Header: 'Vendedor',
        accessor: 'vendedor',
    },
    {
        Header: 'Lead',
        accessor: 'lead',
    },
    {
        Header: 'Descripción del Prospecto',
        accessor: 'descripcion',
    },
    {
        Header: 'Preferencia de contacto',
        accessor: 'preferencia',
    },    
    {
        Header: 'Motivo contratación o cancelación',
        accessor: 'motivo',
    },
    {
        Header: 'Fecha de conversión',
        accessor: 'fechaConversion',
    },
]

export const CONTACTO_COLUMNS = [
    {
        Header: 'Usuario',
        accessor: 'usuario',
    },
    {
        Header: 'Medio Contacto',
        accessor: 'medio',
    },
    {
        Header: 'Estado',
        accessor: 'estado',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const CLIENTES_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto',
    },
    {
        Header: 'Dirección',
        accessor: 'direccion',
    },
    {
        Header: 'Perfil',
        accessor: 'perfil',
    },
    
    {
        Header: 'Puesto',
        accessor: 'puesto',
    },
    {
        Header: 'RFC',
        accessor: 'rfc'
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const CUENTAS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Empresa principal',
        accessor: 'principal'
    },
    {
        Header: 'Banco',
        accessor: 'banco',
    },
    {
        Header: 'Número de cuenta',
        accessor: 'numero',
    },
    {
        Header: 'Balance',
        accessor: 'balance',
    },
    {
        Header: 'Estatus',
        accessor: 'estatus',
    },
    {
        Header: 'Tipo',
        accessor: 'tipo',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },    
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
]

export const EDOS_CUENTAS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Estado de cuenta',
        accessor: 'estado',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const ADJ_CONTRATOS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Contratos',
        accessor: 'adjunto',
    },
]

export const EDOS_CUENTAS_COLUMNS_2 = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta',
    },
    {
        Header: 'Estado de cuenta',
        accessor: 'estado',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const TRASPASOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },
    {
        Header: 'Origen',
        accessor: 'origen',
    },
    {
        Header: 'Destino',
        accessor: 'destino',
    },
    {
        Header: 'Monto',
        accessor: 'monto',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Usuario',
        accessor: 'usuario',
    },

    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
]

export const INGRESOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-A',
        accessor: 'subarea'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    },
    {
        Header: 'Impuesto',
        accessor: 'impuesto'
    },
    {
        Header: 'Pago',
        accessor: 'tipoPago'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
    {
        Header: 'Estatus',
        accessor: 'estatusCompra'
    }/* ,
    {
        Header: 'Adjuntos',
        accessor: 'adjuntos',
    } */
]

export const EGRESOS_COLUMNS = [
    
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },    
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },    
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-Área',
        accessor: 'subarea'
    },
    {
        Header: 'Monto',
        accessor: 'monto'
    },
    {
        Header: 'Comisión',
        accessor: 'comision'
    },    
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    },
    {
        Header: 'Pago', //Cambié de Tipo de pago a Pago
        accessor: 'tipoPago'
    },    
    {
        Header: 'Impuesto',
        accessor: 'impuesto'
    },
    {
        Header: 'Estatus',
        accessor: 'estatusCompra'
    }, 
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
]

export const FACTURAS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Folio',
        accessor: 'folio',
    },
    {
        Header: 'Estatus',
        accessor: 'estatus',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Serie',
        accessor: 'serie'
    },
    {
        Header: 'Emisor',
        accessor: 'emisor'
    },
    {
        Header: 'Receptor',
        accessor: 'receptor'
    },
    {
        Header: 'Subtotal',
        accessor: 'subtotal'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Monto acumulado',
        accessor: 'acumulado'
    },
    {
        Header: 'Monto restante',
        accessor: 'restante'
    },
    {
        Header: 'Adjuntos',
        accessor: 'adjuntos',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },   
    {
        Header: 'Número de certificado',
        accessor: 'noCertificado'
    },    
    {
        Header: 'Uso CFDI',
        accessor: 'usoCFDI'
    }
]

export const FACTURAS_COLUMNS_2 = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Folio',
        accessor: 'folio',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Serie',
        accessor: 'serie'
    },
    {
        Header: 'Emisor',
        accessor: 'emisor'
    },
    {
        Header: 'Receptor',
        accessor: 'receptor'
    },
    {
        Header: 'Subtotal',
        accessor: 'subtotal'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Adjuntos',
        accessor: 'adjuntos',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
    {
        Header: 'Uso CFDI',
        accessor: 'usoCFDI'
    },
    {
        Header: 'Folio Fiscal',
        accessor: 'noCertificado'
    },
]

export const PROVEEDORES_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre'
    },
    {
        Header: 'Razón Social',
        accessor: 'razonSocial'
    },
    {
        Header: 'Contacto',
        accessor: 'contacto'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-área',
        accessor: 'subarea'
    },
    {
        Header: 'Total de compras',
        accessor: 'total'
    },/* 
    {
        Header: 'Fecha',
        accessor: 'fecha',
    }, */
    {
        Header: 'RFC',
        accessor: 'rfc'
    },
]

export const PROVEEDORES_MERCA_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    /* {
        Header: 'Nombre',
        accessor: 'nombre'
    }, */
    {
        Header: 'Razón Social',
        accessor: 'razonSocial'
    },
    {
        Header: 'RFC',
        accessor: 'rfc'
    },
    /* {
        Header: 'Contacto',
        accessor: 'contacto'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    }, */
    {
        Header: 'Área',
        accessor: 'subarea'
    },
]

export const AREAS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub áreas',
        accessor: 'subareas'
    }
]

export const PARTIDAS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Clave',
        accessor: 'clave'
    },
    {
        Header: 'Partida',
        accessor: 'partida'
    },
    {
        Header: 'Sub partidas',
        accessor: 'subpartidas'
    }
]

export const PARTIDAS_DISEÑO_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Partida',
        accessor: 'partida'
    },
    {
        Header: 'Tipo',
        accessor: 'tipo'
    }
]

export const UNIDADES_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Unidad',
        accessor: 'unidad'
    }
]
export const ROLES_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Rol',
        accessor: 'rol'
    },
    {
        Header: 'Color',
        accessor: 'color'
    }
]

export const ORIGENES_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions'
    },
    {
        Header: 'Origen',
        accessor: 'origen'
    }
]

export const RED_SOCIAL_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions'
    },
    {
        Header: 'Red Social',
        accessor: 'redSocial'
    }
]

export const BANCOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Banco',
        accessor: 'banco'
    }
]

export const TIPOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Tipo',
        accessor: 'tipo'
    }
]

export const PROYECTOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Estatus',
        accessor: 'status',
        customRender: true
    },
    {
        Header: 'Nombre',
        accessor: 'nombre'
    },
    {
        Header: 'T.Proyecto',
        accessor: 'tipo_proyecto'
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
        Header: 'Dirección',
        accessor: 'direccion'
    },
    {
        Header: 'Contacto',
        accessor: 'contacto'
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    /*{
        Header: 'Porcentaje',
        accessor: 'porcentaje'
    },*/
    {
        Header: 'F.Inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'F.Fin',
        accessor: 'fechaFin'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
    {
        Header: 'Fases',
        accessor: 'fases'
    }/* ,
    {
        Header: 'Adjuntos',
        accessor: 'adjuntos'
    } */
]

export const VENTAS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-A',
        accessor: 'subarea'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    },
    {
        Header: 'Impuesto',
        accessor: 'impuesto'
    },
    {
        Header: 'Pago',
        accessor: 'tipoPago'
    },
    {
        Header: 'Estatus',
        accessor: 'estatusCompra'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
    /* {
        Header: 'Adjuntos',
        accessor: 'adjuntos',
    } */
]

export const COMPRAS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'ID',
        accessor: 'identificador'
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },    
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-A',
        accessor: 'subarea'
    },
    {
        Header: 'Monto',
        accessor: 'monto'
    },
    {
        Header: 'Comisión',
        accessor: 'comision'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Cuenta',
        accessor: 'cuenta'
    },
    {
        Header: 'Impuesto',
        accessor: 'impuesto'
    },
    {
        Header: 'Pago',
        accessor: 'tipoPago'
    },    
    {
        Header: 'Estatus',
        accessor: 'estatusCompra'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
]

export const SOLICITUD_COMPRA_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Monto',
        accessor: 'monto'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },
    {
        Header: 'Pago', //Cambié de Tipo de pago a Pago
        accessor: 'tipoPago'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },    
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub-Área',
        accessor: 'subarea'
    },
    {
        Header: 'Adjunto',
        accessor: 'adjunto'
    }
]
export const SOLICITUD_EGRESO_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Monto',
        accessor: 'monto'
    },
    {
        Header: 'Factura',
        accessor: 'factura'
    },
    {
        Header: 'Pago', //Cambié de Tipo de pago a Pago
        accessor: 'tipoPago'
    },   
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Sub-Área',
        accessor: 'subarea'
    },
    {
        Header: 'Adjunto',
        accessor: 'adjunto'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    }
]

export const PAGOS_COLUMNS = [
    { Header: 'Opciones', accessor: 'actions'},
    { Header: 'ID', accessor: 'identificador'},
    { Header: 'Fecha', accessor: 'fecha'},
    { Header: 'Proveedor', accessor: 'proveedor'},
    { Header: 'Factura', accessor: 'factura'},
    { Header: 'Subárea', accessor: 'subarea'},
    { Header: 'Monto', accessor: 'monto'},
    { Header: 'Comisión', accessor: 'comision'},
    { Header: 'Total', accessor: 'total'},
    { Header: 'Cuenta', accessor: 'cuenta'},
    { Header: 'Pago', accessor: 'pago'},
    { Header: 'Impuesto', accessor: 'impuesto'},
    { Header: 'Estatus', accessor: 'estatus'},
]

export const SOLICITUD_VENTA_COLUMNS = [
    { Header: 'OPCIONES', accessor: 'actions' },
    { Header: 'Proyecto', accessor: 'proyecto' },
    { Header: 'Empresa', accessor: 'empresa' },
    { Header: 'Monto', accessor: 'monto' },
    { Header: 'Factura', accessor: 'factura' },
    { Header: 'Pago', accessor: 'tipoPago' },
    { Header: 'Área', accessor: 'area' },
    { Header: 'Sub-Área', accessor: 'subarea' },
    { Header: 'Adjunto', accessor: 'adjunto' },
    { Header: 'Fecha', accessor: 'fecha' },
    { Header: 'Descripción', accessor: 'descripcion' }
]

export const CONCEPTOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Partida',
        accessor: 'partida'
    },
    {
        Header: 'Subpartida',
        accessor: 'subpartida'
    },
    {
        Header: 'Clave',
        accessor: 'clave'
    },
    {
        Header: 'Unidad',
        accessor: 'unidad'
    },
    {
        Header: 'Costo',
        accessor: 'costo'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
        class: 'desc-big',
        customRender: true
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    }
]

export const HERRAMIENTAS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Modelo',
        accessor: 'modelo',
    },
    {
        Header: 'Serie',
        accessor: 'serie',
    },
    {
        Header: 'Fecha de compra',
        accessor: 'fecha',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    }
]

export const DOCUMENTOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Documento',
        accessor:'documento'
    }
]

export const IMSS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Adjunto',
        accessor:'adjunto'
    }
]

export const PRESTAMOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empleado',
        accessor: 'empleado',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
    {
        Header: 'Monto',
        accessor: 'monto',
    },
    {
        Header: 'Acumulado',
        accessor: 'acumulado',
    },
    {
        Header: 'Restante',
        accessor: 'restante',
    }
]

export const UBICACIONES_HERRAMIENTAS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Usuario',
        accessor: 'user',
    },
    {
        Header: 'Ubicación',
        accessor: 'ubicacion',
    },
    {
        Header: 'Comentario',
        accessor: 'comentario',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    }
]

export const RENDIMIENTOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Materiales',
        accessor: 'materiales'
    },
    {
        Header: 'Unidad',
        accessor: 'unidad'
    },
    {
        Header: 'Costo',
        accessor: 'costo'
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Rendimiento',
        accessor: 'rendimiento'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
]

export const REMISION_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha'
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Sub - Área',
        accessor: 'subarea'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    },
    {
        Header: 'Adjunto',
        accessor: 'adjunto'
    }
]

export const EMPRESA_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
        searchable: false,
        orderable: false
    },
    {
        Header: 'Logo',
        accessor: 'logo',
        searchable: false,
        orderable: false
    },
    {
        Header: 'Nombre',
        accessor: 'name',
    },
    {
        Header: 'Razón social',
        accessor: 'razonSocial',
    },
    {
        Header: 'RFC',
        accessor: 'rfc',
    },
]

export const CONTRATOS_CLIENTES_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre'
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Fecha de inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'Fecha de fin',
        accessor: 'fechaFin'
    },
    {
        Header: 'Monto con IVA',
        accessor: 'monto'
    },
    {
        Header: 'Monto Pagado',
        accessor: 'acumulado'
    },
    {
        Header: 'Pendiente por pagar',
        accessor: 'pendiente'
    },
    {
        Header: 'Tipo de contrato',
        accessor: 'contrato'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    }
]

export const CONTRATOS_PROVEEDORES_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre'
    },
    {
        Header: 'Proveedor',
        accessor: 'proveedor'
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Fecha de inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'Fecha de fin',
        accessor: 'fechaFin'
    },
    {
        Header: 'Monto con IVA',
        accessor: 'monto'
    },
    {
        Header: 'Monto Pagado',
        accessor: 'acumulado'
    },
    {
        Header: 'Pendiente por pagar',
        accessor: 'pendiente'
    },
    {
        Header: 'Tipo de contrato',
        accessor: 'contrato'
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion'
    }
]

export const UTILIDADES_COLUMNS = [
    {
        Header: 'Proyecto',
        accessor: 'proyecto',
    },
    {
        Header: 'Ventas',
        accessor: 'ventas'
    },
    {
        Header: 'Compras',
        accessor: 'compras'
    },
    {
        Header: 'Utilidad',
        accessor: 'utilidad'
    },
    {
        Header: 'Margen',
        accessor: 'margen'
    }
]

export const FLUJOS_COLUMNS = [
    {
        Header: 'Cuenta',
        accessor: 'cuenta',
    },
    {
        Header: 'Ingresos',
        accessor: 'ingresos'
    },
    {
        Header: 'Egresos',
        accessor: 'egresos'
    },
    {
        Header: 'Ventas',
        accessor: 'ventas'
    },
    {
        Header: 'Compras',
        accessor: 'compras'
    },
    {
        Header: 'Traspasos',
        accessor: 'traspasos'
    },
    {
        Header: 'Total',
        accessor: 'total'
    }
]

export const NOMINA_OBRA_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Nómina de Obra',
        accessor: 'periodo',
    },
    {
        Header: 'Fecha inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'Fecha fin',
        accessor: 'fechaFin'
    },
    {
        Header: 'Total Pago de Nómina',
        accessor: 'totalPagoNomina'
    },
    {
        Header: 'Restante Nómina',
        accessor: 'restanteNomina'
    },
    {
        Header: 'Extras',
        accessor: 'extras'
    },
    {
        Header: 'Gran Total',
        accessor: 'granTotal'
    }
]

export const NOMINA_OBRA_SINGLE_COLUMNS = [
    {
        Header: 'ID del empleado',
        accessor: 'idEmpleado',
    },
    {
        Header: 'Empleado',
        accessor: 'empleado'
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Salario x hr',
        accessor: 'salario_hr'
    },
    {
        Header: 'Horas trabajadas',
        accessor: 'hr_trabajadas'
    },
    {
        Header: 'Salario x hr extra',
        accessor: 'salario_hr_extras'
    },
    {
        Header: 'Horas trabajadas extras',
        accessor: 'hr_extras'
    },
    {
        Header: 'Nómina IMSS',
        accessor: 'nominaIMSS',
        total: 'totalNominaImss'
    },
    {
        Header: 'Extras',
        accessor: 'extras',
        total: 'totalRestanteNomina'
    },
    {
        Header: 'Viáticos',
        accessor: 'viaticos',
        total: 'totalExtras'
    },
    {
        Header: 'Total',
        accessor: 'total',
        total: 'total'
    }
]

export const ADJUNTOS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Adjunto',
        accessor: 'url'
    },
    {
        Header: 'Tipo',
        accessor: 'tipo'
    }
]

export const ADJUNTOS_PRESUPUESTOS_COLUMNS = [
    {
        Header: 'Adjunto',
        accessor: 'url'
    },
    {
        Header: 'Identificador',
        accessor: 'identificador'
    }
]

export const NOMINA_ADMIN_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Periodo de Nómina',
        accessor: 'periodo',
    },
    {
        Header: 'Fecha inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'Fecha fin',
        accessor: 'fechaFin'
    },
    {
        Header: 'Total Nómina IMSS',
        accessor: 'totalNominaIMSS'
    },
    {
        Header: 'Restante Nómina',
        accessor: 'restanteNomina'
    },
    {
        Header: 'Extras',
        accessor: 'extras'
    },
    {
        Header: 'Gran Total',
        accessor: 'granTotal'
    }
]

export const NOMINA_ADMIN_SINGLE_COLUMNS = [
    {
        Header: 'ID del empleado',
        accessor: 'idEmpleado',
    },
    {
        Header: 'Empleado',
        accessor: 'empleado'
    },
    {
        Header: 'Nómina IMSS',
        accessor: 'nominaIMSS',
        total: 'totalNominaImss'
    },
    {
        Header: 'Extras',
        accessor: 'extras',
        total: 'totalRestanteNomina'
    },
    {
        Header: 'Viáticos',
        accessor: 'viaticos',
        total: 'totalExtras'
    },
    {
        Header: 'Total',
        accessor: 'total',
        total: 'total'
    }
]

export const EMPLEADOS_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Puesto',
        accessor: 'puesto'
    },
    {
        Header: 'RFC',
        accessor: 'rfc'
    },
    {
        Header: 'NSS',
        accessor: 'nss'
    },
    {
        Header: 'CURP',
        accessor: 'curp'
    },
    {
        Header: 'Estatus',
        accessor: 'estatus'
    },
    {
        Header: 'F.Inicio',
        accessor: 'fechaInicio'
    },
    {
        Header: 'Cuenta de Depósito',
        accessor: 'cuenta'
    },
    {
        Header: 'Contacto de Emergencia',
        accessor: 'nombre_emergencia'
    },
    {
        Header: 'Días de Vacaciones Tomadas',
        accessor: 'vacaciones_tomadas'
    }
]

export const EMPLEADOS_COLUMNS_OBRA = [
    {
        Header: 'Opciones',
        accessor: 'actions_obra',
    },
    {
        Header: 'Nombre',
        accessor: 'nombre_obra',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa_obra'
    },
    {
        Header: 'Puesto',
        accessor: 'puesto_obra'
    },
    {
        Header: 'RFC',
        accessor: 'rfc_obra'
    },
    {
        Header: 'NSS',
        accessor: 'nss_obra'
    },
    {
        Header: 'CURP',
        accessor: 'curp_obra'
    },
    {
        Header: 'Estatus',
        accessor: 'estatus_obra'
    },
    {
        Header: 'Fecha de Inicio',
        accessor: 'fechaInicio_obra'
    },
    {
        Header: 'Tipo de Empleado',
        accessor: 'tipo_empleado_obra'
    },
    {
        Header: 'Cuenta de Depósito',
        accessor: 'cuenta_obra'
    },
    {
        Header: 'Contacto de Emergencia',
        accessor: 'nombre_emergencia_obra'
    },
    {
        Header: 'Días de Vacaciones Tomadas',
        accessor: 'vacaciones_tomadas_obra'
    }
]

export const PRESUPUESTO_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto'
    },
    {
        Header: 'Área',
        accessor: 'area'
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Tiempo de ejecución',
        accessor: 'tiempo_ejecucion'
    },
    
]

export const USUARIOS = [                
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'name',
    },
    {
        Header: 'Correo',
        accessor: 'email',
    },
    {
        Header: 'Departamento',
        accessor: 'departamento',
    }
]

export const CLIENTES = [                
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Nombre',
        accessor: 'name',
    },
    {
        Header: 'Correo',
        accessor: 'email',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyecto',
    }
]

export const PRECIO_M2_DISEÑOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'M2',
        accessor: 'm2',
    },
    {
        Header: 'Esquema 1',
        accessor: 'esquema1',
    },
    {
        Header: 'Esquema 2',
        accessor: 'esquema2',
    },
    {
        Header: 'Esquema 3',
        accessor: 'esquema3',
    }
]

export const PRESUPUESTO_DISEÑO_COLUMNS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha'
    },
    {
        Header: 'M2',
        accessor: 'm2',
    },
    {
        Header: 'Esquema',
        accessor: 'esquema',
    },
    {
        Header: 'Total',
        accessor: 'total',
    },
    {
        Header: '# Cotización',
        accessor: 'cotizacion',
        orderable: false
    }
]

export const TICKETS_ESTATUS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Estatus',
        accessor: 'estatus',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Partida',
        accessor: 'partida'
    },
    {
        Header: 'Tipo de trabajo',
        accessor: 'tipo_trabajo',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
    {
        Header: 'Motivo de cancelación',
        accessor: 'motivo',
    }
]

export const PROYECTOS_TICKETS = [
    {
        Header: 'Opciones',
        accessor: 'actions',
    },
    {
        Header: 'Estatus',
        accessor: 'estatus',
    },
    {
        Header: 'Proyecto',
        accessor: 'proyectos',
    },
    {
        Header: 'Cliente',
        accessor: 'cliente'
    },
    {
        Header: 'Tipo de trabajo',
        accessor: 'tipo_trabajo',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha',
    },
    {
        Header: 'Descripción',
        accessor: 'descripcion',
    },
    {
        Header: 'Motivo de cancelación',
        accessor: 'motivo',
    }
]
export const ADJUNTOS_EMPRESA_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    },
    {
        Header: 'Tipo de adjunto',
        accessor: 'tipo_adjunto',
    },
    {
        Header: 'Adjunto',
        accessor: 'adjunto',
    }
]
export const DETAILS_CUENTAS = [
    {
        Header: 'Traspaso ID',
        accessor: 'idTraspaso',
    },
    {
        Header: 'Fecha',
        accessor: 'fecha'
    },
    {
        Header: 'Monto',
        accessor: 'monto'
    }
]

export const SERVICIOS_COLUMNS = [
    {
        Header: 'OPCIONES',
        accessor: 'actions',
    },
    {
        Header: 'Servicio',
        accessor: 'servicio',
    },
    {
        Header: 'Empresa',
        accessor: 'empresa'
    }
]