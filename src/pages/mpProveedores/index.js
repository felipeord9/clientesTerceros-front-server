import React, { useState, useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";

export default function MenuPrincipalProveedores(){
  const { user } = useContext(AuthContext);
  const navigate =useNavigate()
    const handleClickInicio=(e)=>{
      e = e.target.value
      if(user.role==='cartera'){
        return navigate('/inicio')
      }else if(user.role==='compras' || user.role==='asistente agencia' || user.role==='comprasnv'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
      }
    }

    const handleClickBack=(e)=>{
      e = e.target.value
      if(user.role==='cartera'){
        return navigate('/validar/tercero')
      }else if(user.role==='compras' || user.role==='asistente agencia' || user.role==='comprasnv'){
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
        height:170,
        width:260,
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
    <div style={{height:70}}></div>
      <div className='login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row '>
    <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong> Menú Principal </strong></label>
        <hr style={{width:700, color:'black'}}/>
        <h4>A continuación, elige la acción que deseas realizar</h4>
        </center>
        <center>
        <div className="m-3">
        <div className=" mb-3">
          <a onClick={(e)=>handleClickInicio(e)}><BotonColorCambiante>Creación Proveedor</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Proveedor</BotonColorCambiante></a>
          {user.role==='comprasnv' && (
            <a onClick={(e)=>navigate('/consultar/certificado')}><BotonColorCambiante>Certificados</BotonColorCambiante></a>
          )}
          {user.role==='asistente agencia' && (
            <a onClick={(e)=>navigate('/solicitudes')}><BotonColorCambiante>Consultar Solicitudes</BotonColorCambiante></a>
          )}
       </div>
        </div>
        </center>
      </div>
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