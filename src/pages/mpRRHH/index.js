import React, { useState, useContext , useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";
import ModalCargos from "../../components/modalCargos";
import ModalContrato from "../../components/modalContrato";
import { Button } from "@mui/material";
import './styles.css'

export default function MenuPrincipalRRHH(){
  const { user } = useContext(AuthContext);

  const [showModalCargo, setShowModalCargo] = useState(false);
  const [showModalContrato, setShowModalContrato] = useState(false);
  const [isMobile, setIsMobile] = useState(null);

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

    useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 900px)");
      setIsMobile(mediaQuery.matches);
      mediaQuery.addEventListener("change", () =>
        setIsMobile(mediaQuery.matches)
      );
      return () =>
        mediaQuery.removeEventListener("change", () =>
          setIsMobile(mediaQuery.matches)
        );
    }, []);

    const handleClickBack=(e)=>{
      e = e.target.value
      /*if(user.role==='cartera'){
        return navigate('/validar/tercero')
      }else if(user.role==='compras' || user.role==='asistente agencia' || user.role==='comprasnv'){
        return navigate('/validar/Proveedor')
      }else{
        return*/ navigate('/validacion/admin')
      /*}*/
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
        height: isMobile ? 90 : 170,
        width: isMobile ? '80vw' : 260,
        fontSize: isMobile ? 17 : 21,
        border: hover ? 'solid #D92121': 'solid #B9B9B9',
        transform: hover ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease',
      };
    
      return (
        <button
          className="rounded-2"
          style={buttonStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </button>
      );
    };

    const [inactivo, setInactivo] = useState(true);
    const cambiarEstadoBoton = () => {
      setInactivo(!inactivo);
    };
    
    return(
      <div className="fondo d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
      <div className='d-flex flex-column justify-content-center align-items-center h-100 gap-1' >
        <ModalCargos
          showModal={showModalCargo}
          setShowModal={setShowModalCargo}
        />
        <ModalContrato
          showModal={showModalContrato}
          setShowModal={setShowModalContrato}
        />
        <div className='p-2 mt-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
          <div className='d-flex flex-row '>
          <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
            <div>
              <center>
              <label className='text-danger text-mp justify-content-center text-align-center' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong> Menú Principal </strong></label>
              <hr className="text-mp" style={{width:700, color:'black'}}/>
              <h4 className="text-mp justify-content-center text-align-center">A continuación, elige la acción que deseas realizar</h4>
              </center>
              <div className="m-2 justify-content-center align-items-center d-flex flex-column gap-4 mb-3" >
                <div className=" div-bottons mt-2 gap-4">
                  <a onClick={(e)=>navigate('/registrar/empleado')}><BotonColorCambiante>Creación Empleado</BotonColorCambiante></a>
                  <a onClick={(e)=>navigate('/empleados')}><BotonColorCambiante>Consulta Empleado</BotonColorCambiante></a>
                </div>
                <div className=" div-bottons gap-4">
                  <a onClick={(e)=>setShowModalCargo(!showModalCargo)}><BotonColorCambiante activo={cambiarEstadoBoton}>Gestión Cargo</BotonColorCambiante></a>
                  <a onClick={(e)=>setShowModalContrato(!showModalContrato)}><BotonColorCambiante activo={cambiarEstadoBoton}>Gestión contratos</BotonColorCambiante></a>  
                  {/* <a><Button className="rounded-2" variant="contained" disabled style={{height: isMobile ? 90 : 170,width: isMobile ? '80vw' : 260,}}>Gestión contratos</Button></a> */}             
                </div>
              </div>
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
