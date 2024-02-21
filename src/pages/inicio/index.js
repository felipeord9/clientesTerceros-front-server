import React, { useState , useContext } from "react"
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";

export default function Inicio2(){
    const { user, setUser } = useContext(AuthContext);
    const [tipo,setTipo]=useState();
    const navigate = useNavigate();
    const handleTipo=(e)=>{
      setTipo(e.target.value);
    }
    return(
        <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
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
                <MenuItem value={10} onClick={(e)=>navigate('/contado/persona/natural')}>persona <strong className="ps-2 pe-1 text-accept"> NATURAL</strong> - pago a<strong className="ps-2">CONTADO</strong></MenuItem>
                <MenuItem value={20} onClick={(e)=>navigate('/credito/persona/natural')}>persona <strong className="ps-2 pe-1"> NATURAL</strong> - pago a<strong className="ps-2 text-danger">CRÉDITO</strong></MenuItem>
                <center>
                <hr style={{width:300, color:'black'}}/></center>
                <MenuItem value={30} onClick={(e)=>navigate('/contado/persona/juridica')}>persona <strong className="ps-2 pe-1" style={{color:'blue'}}> JURÍDICA</strong> - pago a<strong className="ps-2 ">CONTADO</strong></MenuItem>
                <MenuItem value={40} onClick={(e)=>navigate('/credito/persona/juridica')}>persona <strong className="ps-2 pe-1" style={{color:'blue'}}> JURÍDICA</strong> - pago a<strong className="ps-2 text-danger">CRÉDITO</strong></MenuItem>
                <center>
                <hr style={{width:300, color:'black'}}/></center>
                {user.role=='cartera' && (
                  <MenuItem value={50} onClick={(e)=>navigate('/Parqueaderos')}><strong className="">C.COMERCIALES Ó PARQUEADEROS</strong></MenuItem>
                )}
                {user.role==='agencias' && (
                  <MenuItem value={30} onClick={(e)=>navigate('/tipo/proveedor')} ><strong>Proveedores varios (Agencias)</strong></MenuItem>
                )}
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