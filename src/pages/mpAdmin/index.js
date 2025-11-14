import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import AuthContext from "../../context/authContext";
import MobileStepper from "@mui/material/MobileStepper";
import { FcNext } from "react-icons/fc";
import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import './styles.css'

export default function MenuPrincipalAdmin() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(null);

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

  const handleClickInicio = (e) => {
    e = e.target.value;
    if (user.role === "agencias" || user.role === "cartera") {
      return navigate("/inicio");
    } else if (user.role === "compras") {
      return navigate("/compras");
    } else {
      return navigate("/inicio/admin");
    }
  };

  const handleClickBack = (e) => {
    e = e.target.value;
    if (user.role === "agencias" || user.role === "cartera") {
      return navigate("/validar/tercero");
    } else if (user.role === "compras") {
      return navigate("/validar/Proveedor");
    } else {
      return navigate("/validacion/admin");
    }
  };

  const BotonColorCambiante = ({ children }) => {
    const [hover, setHover] = useState(false);
    const handleMouseEnter = () => {
      setHover(true);
    };
    const handleMouseLeave = () => {
      setHover(false);
    };
    const buttonStyle = {
      backgroundColor: hover ? "#D92121" : "whitesmoke", // Cambia los colores según tus necesidades
      color: hover ? "white" : "black",
      padding: "10px",
      cursor: "pointer",
      height: isMobile ? 60 : 120,
      width: isMobile ? '80vw' : 220,
      fontSize: isMobile ? 17 : 21,
      border: hover ? "solid #D92121" : "solid #B9B9B9",
      transform: hover ? "scale(1.1)" : "scale(1)",
      /* filter: hover ? 'brightness(80%)' : 'brightness(100%)', */
      transition: "all 0.3s ease",
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

  const [activeStep, setActiveStep] = React.useState(0);
  const theme = useTheme();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="fondo d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
      <div className='d-flex flex-column justify-content-center align-items-center h-100 gap-1' >
        <div
          className="login-wrapper p-2 mb-2 pb-1 mt-5 shadow-lg border-light rounded-4 border border-5 bg-gradient d-flexjustify-content-between "
          style={{ backgroundColor: "white" }}
        >
        {/* <div className='p-2 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
          <div className='d-flex flex-row '> */}
          {isMobile &&
            <div style={{height:'110px'}}></div>
          }
              <center>
                <div
                  className="ms-4 mt-4 mb-0 me-0"
                  style={{ border: 10, borderColor: "#D92121" }}
                >
                  <div className={`div-bottons ${isMobile ? 'mb-2' : 'mb-4'} ${isMobile && 'gap-2'}`}>
                    <a onClick={(e) => handleClickInicio(e)}>
                      <BotonColorCambiante>
                        Creación Tercero
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => handleClickBack(e)}>
                      <BotonColorCambiante>
                        Consulta Tercero
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => navigate("/sucursales")}>
                      <BotonColorCambiante>
                        Creación sucursal
                      </BotonColorCambiante>
                    </a>
                  </div>
                  <div className={`div-bottons ${isMobile ? 'mb-2' : 'mb-4'} ${isMobile && 'gap-2'}`}>
                    <a onClick={(e) => navigate("/solicitudes")}>
                      <BotonColorCambiante>
                        Consultar solicitudes
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => navigate("/consultar/certificado")}>
                      <BotonColorCambiante>
                        Generar Certificados
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => navigate("/bitacora")}>
                      <BotonColorCambiante>Bitácora</BotonColorCambiante>
                    </a>
                  </div>
                  <div className={`div-bottons ${isMobile ? 'mb-2' : 'mb-0'} ${isMobile && 'gap-2'}`}>
                    <a onClick={(e) => navigate("/usuarios")}>
                      <BotonColorCambiante>
                        Gestionar usuarios
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => navigate("/terceros")}>
                      <BotonColorCambiante>
                        Gestionar clientes
                      </BotonColorCambiante>
                    </a>
                    <a onClick={(e) => navigate("/Proveedores")}>
                      <BotonColorCambiante>
                        Gestionar proveedor
                      </BotonColorCambiante>
                    </a>
                  </div>
                  <div className="w-100 d-flex flex-row mt-2">
                    <div className="w-100 justify-content-end text-align-center">
                      <MobileStepper
                        steps={2}
                        className="w-100 justify-content-center text-align-center"
                        position="static"
                        nextButton={
                          <Button
                            className=""
                            size="small"
                            onClick={(e) => (
                              handleNext(e), navigate("/menu/principal/adminis")
                            )}
                          >
                            Next
                            {theme.direction === "rtl" ? (
                              <KeyboardArrowLeft />
                            ) : (
                              <KeyboardArrowRight />
                            )}
                          </Button>
                        }
                        backButton={
                          <Button
                            size="small"
                            onClick={(e) => handleBack(e)}
                            disabled
                          >
                            {theme.direction === "rtl" ? (
                              <KeyboardArrowRight />
                            ) : (
                              <KeyboardArrowLeft />
                            )}
                            Back
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              </center>
            {/* </div>
          </div> */}
        </div>
      </div>
    </div>
  );
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
