import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Fade } from "react-awesome-reveal";

export default function InicioAdmin(){
    const [tipo,setTipo]=useState();
    const navigate = useNavigate();
    const handleTipo=(e)=>{
      setTipo(e.target.value);
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
    <h3 style={{userSelect:'none'}}>Elíge el tipo de formato que deseas diligenciar</h3>
    </Fade>
    <div className='d-flex flex-row '>
      {/* <h3>Tipo de pago: </h3> */}
      
      <div className="d-flex flex-row">
              
              <Box sx={{ minWidth: 320, margin:1,color:'red'}}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">-- Formato que desea diligenciar -- </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tipo}
                  label="tipo"
                  style={{overflow:'auto'}}
                  onChange={handleTipo}
                  variant="standard"
                  
                >
                <div className="d-flex flex-column rounded-2 " style={{overflow:'auto',height:200}}>
                <div className="d-flex flex-row">
                <div style={{width:70}}></div>
                <h4 className="h-100 ps-2 pe-2 rounded-2" style={{backgroundColor:'#D92121', color:'white'}}>Tipos de Clientes</h4>
                </div>                
                <MenuItem value={10} onClick={(e)=>navigate('/contado/persona/natural')}>persona <strong className="ps-2 pe-1 text-accept"> NATURAL</strong> - pago a<strong className="ps-2">CONTADO</strong></MenuItem>
                <MenuItem value={20} onClick={(e)=>navigate('/credito/persona/natural')}>persona <strong className="ps-2 pe-1"> NATURAL</strong> - pago a<strong className="ps-2 text-danger">CRÉDITO</strong></MenuItem>
                {/* <center>
                <hr style={{width:300, color:'black'}}/></center> */}
                <MenuItem value={30} onClick={(e)=>navigate('/contado/persona/juridica')}>persona <strong className="ps-2 pe-1" style={{color:'blue'}}> JURÍDICA</strong> - pago a<strong className="ps-2 ">CONTADO</strong></MenuItem>
                <MenuItem value={40} onClick={(e)=>navigate('/credito/persona/juridica')}>persona <strong className="ps-2 pe-1" style={{color:'blue'}}> JURÍDICA</strong> - pago a<strong className="ps-2 text-danger">CRÉDITO</strong></MenuItem>
                <MenuItem value={80} onClick={(e)=>navigate('/Parqueaderos')}><strong className=" ">C.Comerciales Ó Parqueaderos</strong></MenuItem>
                <center>
                <hr style={{width:300, color:'black'}}/></center>
                <div className="d-flex flex-row">
                <div style={{width:50}}></div>
                <h4 className="h-100 ps-2 pe-2 rounded-2" style={{backgroundColor:'#D92121', color:'white'}}>Tipos de Proveedores</h4>
                <div></div>
                </div>
                <MenuItem value={50} onClick={(e)=>navigate('/tipo/persona')} className=""><strong>Proveedor Mcia y Convenios</strong></MenuItem>
                <MenuItem value={60} onClick={(e)=>navigate('/prestador/servicios')} className="" style={{color:'blue'}}><strong>Prestador de servicios</strong></MenuItem>
                <MenuItem value={70} onClick={(e)=>navigate('/tipo/proveedor')} className="" style={{color:'red'}}><strong>Proveedores varios (Agencias)</strong></MenuItem>
                </div>
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