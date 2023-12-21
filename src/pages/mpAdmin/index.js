import React, { useState, useContext, useEffect } from "react"
import Logo from '../../assest/logo-gran-langostino.png'
import useUser from '../../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import { Fade } from "react-awesome-reveal";
import { validarCliente } from "../../services/clienteService"; 
import { validarProveedor } from "../../services/proveedorService";
import Swal from "sweetalert2";
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';
/* import { Button } from "react-bootstrap"; */
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdPersonAdd } from "react-icons/io";

export default function MenuPrincipalAdmin(){
  const { user, setUser } = useContext(AuthContext);
  const navigate =useNavigate()
    const [cedula,setCedula] = useState('');
    const [search,setSearch]=useState({
      cedula:'',
    })
    const handlerChangeSearch = (e) => {
      const { id, value } = e.target;
      setSearch({
        ...search,
        [id]: value,
      });
    };

    const handleClickInicio=(e)=>{
      e = e.target.value
      if(user.role==='agencias' || user.role==='cartera'){
        return navigate('/inicio')
      }else if(user.role==='compras'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
      }
    }

    const handleClickBack=(e)=>{
      e = e.target.value
      if(user.role==='agencias' || user.role==='cartera'){
        return navigate('/validar/tercero')
      }else if(user.role==='compras'){
        return navigate('/validar/Proveedor')
      }else{
        return navigate('/validacion/admin')
      }
    }

    const TextOfBinary =({valor})=>{
      const [labelColor, setLabelColor] = useState('');
      const [nuevoTexto,setNuevoTexto] = useState('');
      /* const valorBinario = valor */
      /* const nuevoTexto = valor ? 'Fue cargado':'No fue cargado'; */
      useEffect(()=>{
        if(valor=== 1){
          setLabelColor('#008F39')
          setNuevoTexto('Cargado')
        }else if(valor===0){
          setLabelColor('#CB3234')
          setNuevoTexto('No fue cargado')
        }else{
          setLabelColor(null)
          setNuevoTexto('')
        }
      },[valor]);
      return (
        <label className="" style={{color:labelColor, height:18}}><strong>{nuevoTexto}</strong></label>
      )
    }

    const BotonColorCambiante = ({ children }) => {
      const [hover, setHover] = useState(false);
    
      const handleMouseEnter = () => {
        setHover(true);
      };
    
      const handleMouseLeave = () => {
        setHover(false);
      };
    
      const buttonStyle = {
        backgroundColor: hover ? '#D92121' : 'whitesmoke', // Cambia los colores según tus necesidades
        color: hover ? 'white':'black',
        padding: '10px',
        cursor: 'pointer',
        height:120,width:220,
        fontSize:21,
        border: hover ? 'solid #D92121': 'solid #B9B9B9',
      };
    
      return (
        <button
          className="rounded-2  me-3"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </button>
      );
    };
    
    return(
      <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
      <div className='rounder-4'>
    <div style={{height:70}}></div>
      <div className='login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-5 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row '>
    <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
    <div className="d-flex flex-row">
        <center>        
        </center>
        <center>
        <div className="m-3" style={{border:10,borderColor:'#D92121'}}>
        <div className=" mb-3">
          <a onClick={(e)=>handleClickInicio(e)}><BotonColorCambiante>Creación Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Creación sucursal</BotonColorCambiante></a>
        </div>
        <div className="d-flex flex-row " >
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta solicitudes</BotonColorCambiante></a>
          <div className="d-flex justify-content-center align-items-center me-3 mb-3" style={{height:120,width:223}}>
          <label className='text-danger' style={{color:'black' ,marginBottom:5, fontSize:70, userSelect:'none'}}><strong>Menú </strong></label>
          {/* <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong> </strong></label */}
          </div>
          <a onClick={(e)=>navigate('/bitacora')}><BotonColorCambiante>Bitácora</BotonColorCambiante></a>
        </div>
        <div className="">
        <a onClick={(e)=>navigate('/usuarios')}> <BotonColorCambiante>Gestionar usuarios</BotonColorCambiante></a>
        <a onClick={(e)=>navigate('/terceros')}>  <BotonColorCambiante>Eliminar cliente</BotonColorCambiante></a>
        <a onClick={(e)=>navigate('/Proveedores')}><BotonColorCambiante>Eliminar proveedor</BotonColorCambiante></a>
        </div>
        </div>
        </center>
      </div>
      {/* <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:65, userSelect:'none'}}><strong>Menú principal</strong></label>
        <hr style={{width:750, color:'black'}}/>
        <h4>A continuación, elige la acción que deseas realizar</h4>
        </center>
        <center>
        <div className="m-3">
        <div className=" mb-3">
        <a onClick={(e)=>handleClickInicio(e)}><BotonColorCambiante>Creación Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Creación sucursal</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta solicitudes</BotonColorCambiante></a>
        </div>
        <div className="">
        <a onClick={(e)=>navigate('/bitacora')}><BotonColorCambiante>Bitácora</BotonColorCambiante></a>
        <a onClick={(e)=>navigate('/usuarios')}> <BotonColorCambiante>Gestionar usuarios</BotonColorCambiante></a>
        <a onClick={(e)=>navigate('/terceros')}>  <BotonColorCambiante>Eliminar cliente</BotonColorCambiante></a>
        <a onClick={(e)=>navigate('/Proveedores')}><BotonColorCambiante>Eliminar proveedor</BotonColorCambiante></a>

        </div>
        </div>
        </center>
      </div> */}
      </Fade>
      
    </div>
    </div>
    </div>
    </div>
    

    )
}

/* <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <div className="d-flex flex-row">
      <div className="me-5 d-flex justify-content-center align-items-center">
        <img src={Logo} style={{width:450,height:200}} />
      </div>
      
      <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>¡Bienvenid@!</strong></label>
        <hr style={{width:400, color:'black'}}/>
        </center>
        <div className="d-flex flex-row">
        <h4 className="me-5 mt-3">Validación de Tercero: </h4>
        <div className="d-flex flex-row">
        
        <TextField min={10000000}
                    max={9999999999}
                    value={search.cedula}
                    pattern="[0-9]"
                    onChange={handlerChangeSearch} id="cedula" type="number" style={{fontSize:20}} label="Número de documento" variant="standard"></TextField>
        
        </div>
        </div>
        <center>
        <div className="mt-2">
          <button onClick={(e)=>handleSearch(e)} className="ms-3 mt-1">Buscar Cliente</button>
          <button  style={{backgroundColor:'blue'}} onClick={(e)=>searchProveedor(e)} className="ms-3 mt-1">Buscar Proveedor</button>
        </div>
        </center>
      </div>
      </div>
      </Fade> */