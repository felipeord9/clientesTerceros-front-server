import * as LiaIcons from "react-icons/lia"
import { GoHomeFill } from 'react-icons/go'
import { GoPeople } from 'react-icons/go'
import { MdOutlineMiscellaneousServices } from "react-icons/md"
import { RiContactsBook2Fill , RiContactsBookFill} from 'react-icons/ri'
import { RiContactsBook2Line , RiContactsBookLine} from 'react-icons/ri'
import { BsFillPeopleFill } from "react-icons/bs";
import { BsClipboardCheck } from "react-icons/bs";
import { PiFloppyDiskBackFill } from "react-icons/pi";
import { BsClipboardCheckFill } from "react-icons/bs";
import { FaHandshake } from "react-icons/fa6";
import { FaPeopleLine } from "react-icons/fa6";
import { GiArchiveRegister } from "react-icons/gi";
import { TbCircleLetterJ } from 'react-icons/tb' /*letra j*/

export const NavBarData = [
  {
    title:'Inicio',
    path:'/inicio',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['cartera','agencias']   
  },
  {
    title:'Inicio',
    path:'/inicio/admin',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['admin']   
  },
  {
    title:'Inicio',
    path:'/compras',
    icon:<GoHomeFill/>,
    cName:'nav-text',
    access:['compras']   
  }
  ,
  {title:'Persona natural - contado',
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
    title: "Proveedor Mcia y Convenios",
    path: "tipo/persona",
    icon: <FaHandshake />,
    cName: "nav-text",
    access: ['admin','compras']
  },
  {
    title: "Prestador de servicios",
    path: "/prestador/servicios",
    icon: <MdOutlineMiscellaneousServices />,
    cName: "nav-text",
    access: ['admin','compras']
  },
  {
    title: "Proveedores varios (Agencias)",
    path: "/tipo/proveedor",
    icon: <FaPeopleLine />,
    cName: "nav-text",
    access: ['admin','compras']
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: <BsFillPeopleFill />,
    cName: "nav-text",
    access: ['admin']
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
    icon: <PiFloppyDiskBackFill />,
    cName: "nav-text",
    access: ['admin']
  },{
    title:'Bitácora',
    path: '/bitacora',
    icon: <GiArchiveRegister />,
    cName: "nav-text",
    access: ['admin']
  }
  
];