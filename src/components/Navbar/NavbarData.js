import { GoHomeFill } from 'react-icons/go'
import { MdOutlineMiscellaneousServices } from "react-icons/md"
import { RiContactsBook2Fill , RiContactsBookFill} from 'react-icons/ri'
import { RiContactsBook2Line , RiContactsBookLine} from 'react-icons/ri'
import { BsFillPeopleFill } from "react-icons/bs";
import { BsClipboardCheck } from "react-icons/bs";
import { BsClipboardCheckFill } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa6";
import { FaPeopleLine } from "react-icons/fa6";
import { GiArchiveRegister } from "react-icons/gi";
import { RiPassValidLine } from "react-icons/ri";
import { AiOutlineSelect } from "react-icons/ai";
import { FaCar } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";
import { VscPersonAdd } from "react-icons/vsc";
import { BsFileEarmarkPerson } from "react-icons/bs";

export const NavBarData = [
  {
    title:'Menu Principal',
    path:'/menu/principal/admin',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['admin']   
  },
  {
    title:'Menu Principal',
    path:'/menu/principal/Clientes',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['cartera','agencias']   
  },
  {
    title:'Menu Principal',
    path:'/menu/principal/Proveedores',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['asistente agencia','compras','comprasnv']   
  },
  {
    title:'Crear Cliente',
    path:'/inicio',
    icon:<AiOutlineSelect />,
    cName:'nav-text',
    access:['cartera']   
  },
  {
    title:'Crear Tercero',
    path:'/inicio',
    icon:<AiOutlineSelect />,
    cName:'nav-text',
    access:['agencias']   
  },
  {
    title:'Crear Tercero',
    path:'/inicio/admin',
    icon:<AiOutlineSelect/>,
    cName:'nav-text',
    access:['admin']   
  },
  {
    title:'Crear Proveedor',
    path:'/compras',
    icon:<AiOutlineSelect/>,
    cName:'nav-text',
    access:['compras','asistente agencia','comprasnv']   
  }
  ,
  {
    title:'Registrar empleado',
    path:'/registrar/empleado',
    icon:<VscPersonAdd />,
    cName:'nav-text',
    access:['admin','recursos humanos']   
  },
  {
    title:'Validación Existencia',
    path:'/validacion/admin',
    icon:<RiPassValidLine />,
    cName:'nav-text',
    access:['admin']
  },
  {
    title:'Validación Existencia',
    path:'/validar/tercero',
    icon:<RiPassValidLine />,
    cName:'nav-text',
    access:['cartera']
  },
  {
    title:'Validación Existencia',
    path:'/validar/proveedor',
    icon:<RiPassValidLine />,
    cName:'nav-text',
    access:['compras','asistente agencia','comprasnv']
  },
  {
    title:'Persona natural - contado',
    path:'/contado/persona/natural',
    icon:<RiContactsBook2Fill/>,
    cName:'nav-text',
    access:['admin','cartera','agencias']
  },{
    title:'Persona natural - Crédito',
    path:'/credito/persona/natural',
    icon:<RiContactsBook2Line/>,
    cName:'nav-text',
    access:['admin','agencias','cartera']
  },
  {title:'Persona Jurídica - contado',
    path:'/contado/persona/juridica',
    icon: <RiContactsBookFill/>,
    cName:'nav-text',
    access:['admin','agencias','cartera']
  },{
    title:'Persona Jurídica - Crédito',
    path:'/credito/persona/juridica',
    icon:<RiContactsBookLine/>,
    cName:'nav-text',
    access:['admin','cartera','agencias']
  },
  {
    title: "C.Comerciales ó Parqueaderos",
    path: "/tipo/parqueadero",
    icon: <FaCar />,
    cName: "nav-text",
    access: ['admin','compras','cartera','asistente agencia','comprasnv']
  },
  {
    title: "Proveedores varios (Agencias)",
    path: "/tipo/proveedor",
    icon: <FaPeopleLine />,
    cName: "nav-text",
    access: ['admin','compras','comprasnv','asistente agencia','agencias']
  },
  {
    title: "Prestador de servicios",
    path: "/prestador/servicios",
    icon: <MdOutlineMiscellaneousServices />,
    cName: "nav-text",
    access: ['admin','compras','comprasnv','asistente agencia']
  },
  {
    title: "Proveedor Mcia y Convenios",
    path: "/tipo/persona",
    icon: <FaHandshake />,
    cName: "nav-text",
    access: ['admin','compras','comprasnv','asistente agencia']
  },
  {
    title:'Generar Certificados',
    path:'/consultar/certificado',
    icon:<PiCertificateBold />,
    cName:'nav-text',
    access:['admin','comprasnv']
  },
  {
    title: "Clientes",
    path: "/terceros",
    icon: <BsClipboardCheck />,
    cName: "nav-text",
    access: ['admin']
  },{
    title:'Proveedores',
    path: '/Proveedores',
    /* icon: <PiFloppyDiskBackFill />, */
    icon: <BsClipboardCheckFill />,
    cName: "nav-text",
    access: ['admin']
  },
  {
    title:'Empleados',
    path: '/empleados',
    /* icon: <PiFloppyDiskBackFill />, */
    icon: <BsFileEarmarkPerson  />,
    cName: "nav-text",
    access: ['admin', 'recursos humanos']
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: <BsFillPeopleFill />,
    cName: "nav-text",
    access: ['admin']
  },
  {
    title:'Bitácora',
    path: '/bitacora',
    icon: <GiArchiveRegister />,
    cName: "nav-text",
    access: ['admin']
  }
  
];