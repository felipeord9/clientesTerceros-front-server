import React, { useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { IoBusiness } from "react-icons/io5";
import { RiArrowGoBackFill } from "react-icons/ri";
import Checkbox from '@mui/material/Checkbox';
import { BsFileEarmarkPersonFill } from "react-icons/bs";
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';

export default function Inicio2(){
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClickBack=(e)=>{
      e = e.target.value;
      if(user.role==='compras' || user.role==='comprasnv'){
        return navigate('/compras')
      }else if(user.role==='asistente agencia' ){
        return navigate('/compras')
      }else if(user.role==='admin'){
        return navigate('/inicio/admin')
      }
    }

    return(
        <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-3 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white',userSelect:'none'}}>
      <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
  <div className="w-100 " style={{backgroundColor:'red'}}>  
  </div>
  <div>
    <h4 style={{userSelect:'none'}}>Su elección anterior fue:</h4>
    </div> 
    <h1> <strong className="text-danger">Proveedor Mcia y Convenios</strong></h1>
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
      <div className="d-flex flex-column pt-2">
            <div className="d-flex flex-row">
              <h4><Checkbox
              title="Persona Natural"
              onChange={(e)=>navigate('/proveedor/convenio/natural')}
              inputProps={{ 'aria-label': 'controlled' }}
              /><BsFileEarmarkPersonFill />Persona Natural</h4>
              </div>
              <div className="d-flex flex-row pt-2">
              <h4 className="text-danger">
              <Checkbox
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