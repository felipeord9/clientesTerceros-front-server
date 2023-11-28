import React, { useState, useContext } from "react"
import Logo from '../../assest/logo-gran-langostino.png'
import useUser from '../../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { FaHandshakeSimple } from "react-icons/fa6";
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import { Divider } from "@mui/material";
import { Fade } from "react-awesome-reveal";
import { IoBusiness } from "react-icons/io5";
import { LiaIndustrySolid } from "react-icons/lia";
import { RiArrowGoBackFill } from "react-icons/ri";
import Checkbox from '@mui/material/Checkbox';
import { BsFileEarmarkPersonFill } from "react-icons/bs";
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';

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
    const [checked, setChecked] = React.useState(true);

    const handleClickBack=(e)=>{
      e = e.target.value;
      if(user.role==='compras'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
      }
    }
    /* const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    }; */
    return(
        <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-3 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white',userSelect:'none'}}>
      <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
{/*       <label className='' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>Estimad@ {user.name}</strong></label>
  */}  
{/*   <div className="d-flex flex-row">  
 */}  <div className="w-100 " style={{backgroundColor:'red'}}>  
  </div>
  <div>
    <h4 style={{userSelect:'none'}}>Su elección anterior fue:</h4>
    </div> 
{/*   </div>
 */}    <h1> <strong className="text-danger">Proveedor Mcia y Convenios</strong></h1>
    <hr style={{width:600, color:'black'}}/></Fade>

    <Fade cascade>
    <h3 style={{userSelect:'none'}} className="pt-2">¿A qué <strong className="text-danger">tipo de persona</strong> se le llevará a cabo el proceso?</h3>
    </Fade>
    <div className="w-100 d-flex flex-row">
    <div className="d-flex flex-column" style={{ width:240}}>
      <div className="" style={{height:78}}>

      </div>
      <div className="w-100" style={{}}>
    <Button onClick={(e)=>handleClickBack(e)} variant="contained" className="d-flex justify-content-start pms-1"><RiArrowGoBackFill className="me-1" />back</Button>
      </div>
    </div>
    <div className='d-flex flex-row w-75'>
      {/* <h3>Tipo de pago: </h3> */}
      
      <div className="d-flex flex-column pt-2">
              
              {/* <Box sx={{ minWidth: 320, margin:1,color:'red' }}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">-- Formato que desea diligenciar -- </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tipo}
                  label="tipo"
                  style={{width:300}}
                  onChange={handleTipo}
                  variant="standard"
                  
                >
                <MenuItem value={10} onClick={(e)=>navigate('/proveedor/convenio/natural')} className="d-flex justify-content-center"><strong>Persona Natural</strong></MenuItem>
                <MenuItem value={20} onClick={(e)=>navigate('/credito/persona/natural')} className="d-flex justify-content-center" style={{color:'blue'}}><strong>Persona Jurídica</strong></MenuItem>
                </Select>
              </FormControl>
            </Box> */}
            <div className="d-flex flex-row">
              <h4><Checkbox
              /* checked={checked} */
              title="Persona Natural"
              
              onChange={(e)=>navigate('/proveedor/convenio/natural')}
              inputProps={{ 'aria-label': 'controlled' }}
              /><BsFileEarmarkPersonFill />Persona Natural</h4>
              </div>
              <div className="d-flex flex-row pt-2">
              <h4 className="text-danger">
              <Checkbox
              /* checked={checked} */
              title="Persona jurídica"
              onChange={(e)=>navigate('/proveedor/convenio/juridica')}
              inputProps={{ 'aria-label': 'controlled' }}
              ></Checkbox><IoBusiness />Persona jurídica</h4>
              </div>
            </div>
    </div>
    
    </div>
    </div>
    </div>
    </div>
    )
}