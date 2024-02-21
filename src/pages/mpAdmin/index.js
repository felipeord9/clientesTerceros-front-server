import React, { useState, useContext } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";
import MobileStepper from '@mui/material/MobileStepper';
import { FcNext } from "react-icons/fc";
import { Button } from "@mui/material";
import IconButton from '@mui/material/IconButton';

export default function MenuPrincipalAdmin(){
  const { user } = useContext(AuthContext);
  const navigate =useNavigate()

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
        height: 120,
        width:220,
        fontSize:21,
        border: hover ? 'solid #D92121': 'solid #B9B9B9',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
        /* filter: hover ? 'brightness(80%)' : 'brightness(100%)', */
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
      <div className='login-wrapper p-2 mb-5 mt-3 shadow-lg border-light rounded-4 border border-5 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row '>
    <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
    <div className="d-flex flex-row">
        <center>
        <div className="ms-4 mt-4 mb-3 me-0" style={{border:10,borderColor:'#D92121'}}>
        <div className=" mb-4">
          <a onClick={(e)=>handleClickInicio(e)}><BotonColorCambiante>Creación Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>handleClickBack(e)}><BotonColorCambiante>Consulta Tercero</BotonColorCambiante></a>
          <a onClick={(e)=>navigate('/sucursales')}><BotonColorCambiante>Creación sucursal</BotonColorCambiante></a>
        </div>
        <div className="d-flex flex-row mb-4" >
          <a onClick={(e)=>navigate('/solicitudes')}><BotonColorCambiante>Consultar solicitudes</BotonColorCambiante></a>
          <a onClick={(e)=>navigate('/consultar/certificado')}><BotonColorCambiante>Generar Certificados</BotonColorCambiante></a>
          {/* <div className="d-flex justify-content-center align-items-center me-3 mb-3" style={{height:120,width:223}}>
          <label className='text-danger' style={{color:'black' ,marginBottom:5, fontSize:70, userSelect:'none'}}><strong>Menú </strong></label>
          </div> */}
          <a onClick={(e)=>navigate('/bitacora')}><BotonColorCambiante>Bitácora</BotonColorCambiante></a>
        </div>
        <div >
          <a onClick={(e)=>navigate('/usuarios')}><BotonColorCambiante>Gestionar usuarios</BotonColorCambiante></a>
          <a onClick={(e)=>navigate('/terceros')}><BotonColorCambiante>Gestionar clientes</BotonColorCambiante></a>
          <a onClick={(e)=>navigate('/Proveedores')}><BotonColorCambiante>Gestionar proveedor</BotonColorCambiante></a>
        </div>
        {/* <div className="w-100 d-flex flex-row mt-2">
          <div className="w-100 justify-content-end text-align-center">
            <MobileStepper
            steps={2}
            className="w-100 justify-content-center text-align-center"
            position="static"
            />
          </div>
          <div className="w-25 justify-content-end">
            <IconButton aria-label="delete" size="small" className="w-25 justify-content-end">
              <FcNext />
            </IconButton>
          </div>
        </div> */}
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