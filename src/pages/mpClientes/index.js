import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";

export default function MenuPrincipalClientes(){
  const { user, setUser } = useContext(AuthContext);
  const navigate =useNavigate()
    const handleClickInicio=(e)=>{
      e = e.target.value
      if(user.role==='cartera'){
        return navigate('/inicio')
      }else if(user.role==='compras' || user.role==='agencias'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
      }
    }

    const handleClickBack=(e)=>{
      e = e.target.value
      if(user.role==='cartera'){
        return navigate('/validar/tercero')
      }else if(user.role==='compras' || user.role==='comprasnv' || user.role==='asistente agencia'){
        return navigate('/validar/Proveedor')
      }else{
        return navigate('/validacion/admin')
      }
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
        height:user.role==='agencias' ? 170:150,
        width:user.role==='agencias' ? 260:240,
        fontSize:21,
        border: hover ? 'solid #D92121': 'solid #B9B9B9',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease',
      };
    
      return (
        <button
          className="rounded-2  me-4"
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
    <div style={{height:75}}></div>
      <div className='login-wrapper pt-2 mb-2 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row'>
    <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>Menú Principal </strong></label>
        <hr className="m-0 mb-2" style={{width:700, color:'black'}}/>
        <h4>A continuación, elige la acción que deseas realizar</h4>
        </center>
        <center>
        {user.role==='cartera' && (
        <div className="m-2">
        <div className=" mb-3">
          <a onClick={(e)=>handleClickInicio(e)}><BotonColorCambiante>Creación Cliente</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Cliente</BotonColorCambiante></a>
        </div>
        <div className=" mb-3">
          <a onClick={(e)=>navigate('/sucursales')}><BotonColorCambiante>Creación sucursal</BotonColorCambiante></a>
          <a onClick={(e)=>navigate('/solicitudes')}><BotonColorCambiante>Consultar Solicitudes</BotonColorCambiante></a>
        </div>
        </div>
        )}
        {user.role==='agencias' && (
          <div className="m-4">
          <div className=" mb-3">
            <a onClick={(e)=>navigate('/inicio')}><BotonColorCambiante>Creación Tercero</BotonColorCambiante></a>
            <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Tercero</BotonColorCambiante></a>
            <a onClick={(e)=>navigate('/sucursales')}><BotonColorCambiante>Creación sucursal</BotonColorCambiante></a>
          </div>
          </div>
        )}
        </center>
      </div>
      </Fade>
    </div>
    </div>
    </div>
    </div>
    )
}