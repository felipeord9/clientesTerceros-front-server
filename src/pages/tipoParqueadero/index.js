import React, { useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import { IoBusiness } from "react-icons/io5";
import { BsFileEarmarkPersonFill } from "react-icons/bs";
import Checkbox from '@mui/material/Checkbox';
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';
import { RiArrowGoBackFill } from "react-icons/ri";

export default function TipoParqueadero(){
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
      }else if(user.role === 'agencias'){
        return navigate('/inicio')
      }
    }
    return(
      <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-3 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white', userSelect:'none'}}>
      <Fade cascade damping={0.1} direction="down" triggerOnce='true'>     
    <h4 style={{userSelect:'none'}}>Su elección anterior fue:</h4><h1> <strong className="text-danger">Centros Comerciales Ó Parqueaderos</strong></h1>
    <hr style={{width:650, color:'black'}}/></Fade>

    <Fade cascade>
    <h3 style={{userSelect:'none'}} className="pt-2">¿A qué <strong className="text-danger">tipo de persona</strong> se le llevará a cabo el proceso?</h3>
    </Fade>
    <div className="w-100 d-flex flex-row">
    <div className="d-flex flex-column" style={{ width:220}}>
      <div className="" style={{height:78}}>

      </div>
      <div className="w-100" style={{}}>
    <Button onClick={(e)=>handleClickBack(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
      </div>
    </div>
    <div className='d-flex flex-row '>
      <div className="d-flex flex-column pt-2">
            <div className="d-flex flex-row">
              <h4><Checkbox
              onChange={(e)=>navigate('/centros/comerciales')}
              inputProps={{ 'aria-label': 'controlled' }}
              /><BsFileEarmarkPersonFill />Persona Natural</h4>
              </div>
              <div className="d-flex flex-row pt-2">
              <h4 className="text-danger"><Checkbox
              onChange={(e)=>navigate('/Parqueaderos')}
              inputProps={{ 'aria-label': 'controlled' }}
              /><IoBusiness />Persona juridica</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    )
}