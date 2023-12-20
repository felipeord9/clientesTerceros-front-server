import React, { useState, useContext } from "react"
import Logo from '../../assest/logo-gran-langostino.png'
import useUser from '../../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FaHandshakeSimple } from "react-icons/fa6";
import { FaHandshake } from "react-icons/fa6";
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import { Divider } from "@mui/material";
import { FaPeopleLine } from "react-icons/fa6";
import { MdOutlineMiscellaneousServices } from "react-icons/md"
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";

export default function Inicio2(){
    const { user, setUser } = useContext(AuthContext);
    const [pago,setPago]=useState();
    const [persona,setPersona]=useState();
    const [tipo,setTipo]=useState();
    const navigate = useNavigate();
  const handleTipo=(e)=>{
    setTipo(e.target.value);
  }
    const handlePago=(e)=>{
        setPago(e.target.value);
    }
    const handlePersona=(e)=>{
        setPersona(e.target.value);
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        if(persona==='Natural'&& pago==='Contado'){
            Navigate('/contado/persona/natural');
        }
    }
    return(
        <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
      <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>¡Bienvenid@!</strong></label>
      </Fade>
    <hr style={{width:450, color:'black'}}/>
    <Fade cascade>
    <center>
    <h3 style={{userSelect:'none'}}>Elíge el tipo de formato que deseas diligenciar</h3>
    </center>
    </Fade>
    <div className='d-flex flex-row '>
      {/* <h3>Tipo de pago: </h3> */}
      
      <div className="d-flex flex-row">
              
              <Box sx={{ minWidth: 320, margin:1,color:'red' }}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">-- Formato que desea diligenciar -- </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tipo}
                  label="tipo"
                  onChange={handleTipo}
                  variant="standard"
                  
                >
                <MenuItem value={30} onClick={(e)=>navigate('/tipo/proveedor')} className="" style={{color:'red'}}><strong><FaPeopleLine className="me-1" />Proveedores varios (Agencias)</strong></MenuItem>
                <MenuItem value={20} onClick={(e)=>navigate('/prestador/servicios')} className="" style={{color:'blue'}}><strong><MdOutlineMiscellaneousServices className="me-1"/>Prestador de servicios</strong></MenuItem>
                <MenuItem value={10} onClick={(e)=>navigate('/tipo/persona')} className=""><strong><FaHandshake className="me-1"/>Proveedor Mcia y Convenios</strong></MenuItem>
                </Select>
              </FormControl>
            </Box>
            </div>
    </div>
    </div>
    </div>
    </div>
    )
}