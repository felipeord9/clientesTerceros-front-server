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
import ModalAgencia from "../../components/modalAgencia";
import ModalClasificacion from "../../components/modalClasificacion";
import ModalPrecios from "../../components/modalPrecios";
import ModalDepartamento from "../../components/modalDepartamento";
import ModalContrato from "../../components/modalContrato";
import ModalCargos from "../../components/modalCargos";
import "./styles.css";

export default function MenuPrincipalAdmin2() {
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

  const [inactivo, setInactivo] = useState(true);

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
      width: isMobile ? "80vw" : 220,
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

  const cambiarEstadoBoton = () => {
    setInactivo(!inactivo);
  };
  const [showModalAgency, setShowModalAgency] = useState(false);
  const [showModalClasificacion, setShowModalClasificacion] = useState(false);
  const [showModalPrecios, setShowModalPrecios] = useState(false);
  const [showModalDepartamento, setShowModalDepartamento] = useState(false);
  const [showModalCargo, setShowModalCargo] = useState(false);
  const [showModalContrato, setShowModalContrato] = useState(false);

  return (
    <div
      className="fondo d-flex justify-content-center align-items-center vh-100 w-100 m-auto "
      style={{ userSelect: "none" }}
    >
      <div className="d-flex flex-column justify-content-center align-items-center h-100 gap-1">
        <div
          className="login-wrapper p-2 mb-2 pb-1 mt-5 shadow-lg border-light rounded-4 border border-5 bg-gradient d-flexjustify-content-between "
          style={{ backgroundColor: "white" }}
        >
          <ModalAgencia
            showModal={showModalAgency}
            setShowModal={setShowModalAgency}
          />
          <ModalClasificacion
            showModal={showModalClasificacion}
            setShowModal={setShowModalClasificacion}
          />
          <ModalPrecios
            showModal={showModalPrecios}
            setShowModal={setShowModalPrecios}
          />
          <ModalDepartamento
            showModal={showModalDepartamento}
            setShowModal={setShowModalDepartamento}
          />
          <ModalCargos
            showModal={showModalCargo}
            setShowModal={setShowModalCargo}
          />
          <ModalContrato
            showModal={showModalContrato}
            setShowModal={setShowModalContrato}
          />
          {isMobile && <div style={{ height: "110px" }}></div>}
          <center>
            <div
              className="ms-4 mt-4 mb-0 me-0"
              style={{ border: 10, borderColor: "#D92121" }}
            >
              <div
                className={`div-bottons ${isMobile ? "mb-2" : "mb-4"} ${
                  isMobile && "gap-2"
                }`}
              >
                <a onClick={(e) => setShowModalAgency(!showModalAgency)}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión Agencia
                  </BotonColorCambiante>
                </a>
                <a
                  onClick={(e) =>
                    setShowModalClasificacion(!showModalClasificacion)
                  }
                >
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión Clasificación
                  </BotonColorCambiante>
                </a>
                <a onClick={(e) => setShowModalPrecios(!showModalPrecios)}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión Lista Precios
                  </BotonColorCambiante>
                </a>
              </div>
              <div
                className={`div-bottons ${isMobile ? "mb-2" : "mb-4"} ${
                  isMobile && "gap-2"
                }`}
              >
                <a
                  onClick={(e) =>
                    setShowModalDepartamento(!showModalDepartamento)
                  }
                >
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión Paises
                  </BotonColorCambiante>
                </a>
                <a onClick={(e) => navigate("/registrar/empleado")}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Crear Empleado
                  </BotonColorCambiante>
                </a>
                <a onClick={(e) => navigate("/empleados")}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestionar Empleados
                  </BotonColorCambiante>
                </a>
              </div>
              <div
                className={`div-bottons ${isMobile ? "mb-2" : "mb-0"} ${
                  isMobile && "gap-2"
                }`}
              >
                <a onClick={(e) => navigate("/validar/empleado")}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Consultar Empleado
                  </BotonColorCambiante>
                </a>
                <a onClick={(e) => setShowModalCargo(!showModalCargo)}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión Cargo
                  </BotonColorCambiante>
                </a>
                <a onClick={(e) => setShowModalContrato(!showModalContrato)}>
                  <BotonColorCambiante activo={cambiarEstadoBoton}>
                    Gestión contratos
                  </BotonColorCambiante>
                </a>
              </div>
              <div className="w-100 d-flex flex-row mt-2">
                <div className="w-100 justify-content-end text-align-center">
                  <MobileStepper
                    steps={2}
                    position="static"
                    activeStep={1}
                    className="w-100 justify-content-center text-align-center"
                    nextButton={
                      <Button className="" size="small" disabled>
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
                        onClick={(e) => navigate("/menu/principal/admin")}
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
        </div>
      </div>
    </div>
  );
}
