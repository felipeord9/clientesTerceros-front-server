import React, { useState, useEffect } from "react";
import Logo from "../../assest/logo-gran-langostino.png";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Fade } from "react-awesome-reveal";
import { findEmpleadoByCedula } from "../../services/empleadoService";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import { IoMdPersonAdd } from "react-icons/io";
import "./styles.css";

export default function ValidarEmpleado() {
  const [isMobile, setIsMobile] = useState(null);
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    cedula: "",
  });

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

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    findEmpleadoByCedula(search.cedula)
      .then(() => {
        Swal.fire({
          icon: "warning",
          title: "!El empleado SI se encuentra registrado¡",
          text: "¿Desea visualizar la información?",
          showConfirmButton: true,
          confirmButtonColor: "green",
          confirmButtonText: "Sí",
          cancelButtonColor: "red",
          cancelButtonText: "No",
          showCancelButton: true,
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            navigate(`/registrar/empleado/${search.cedula}`);
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "warning",
          title: "!El empleado NO esta en nuestra base de datos¡",
          text: "¿Desea registrarlo?",
          showConfirmButton: true,
          confirmButtonColor: "green",
          cancelButtonColor: "red",
          confirmButtonText: "Sí",
          cancelButtonText: "No",
          showCancelButton: true,
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            navigate("/registrar/empleado");
          }
        });
      });
  };

  return (
    <div
      className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto "
      style={{ userSelect: "none" }}
    >
      <div className="rounder-4 pt-4">
        <div
          className="login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between "
          style={{ backgroundColor: "white" }}
        >
          <div className="d-flex flex-row">
            <Fade cascade damping={0.1} direction="down" triggerOnce="true">
              <div className="d-flex flex-row">
                <div className="text-val-emp me-5 justify-content-center align-items-center flex-column">
                  <div className="w-100">
                    <Button
                      style={{ height: 35 }}
                      onClick={(e) => navigate("/registrar/empleado")}
                      variant="contained"
                      className="text-val-emp"
                    >
                      <IoMdPersonAdd className="me-1" />
                      Ir a registro
                    </Button>
                  </div>
                  <img
                    /* onClick={handleClickImagen} */
                    className="text-val-emp"
                    src={Logo}
                    style={{
                      width: 450,
                      height: 200 /* , cursor: "pointer" */,
                    }}
                  />
                </div>

                <div>
                  <center>
                    <label
                      className="text-danger"
                      style={{
                        color: "black",
                        marginBottom: 5,
                        fontSize: isMobile ? 30 : 55,
                        userSelect: "none",
                      }}
                    >
                      <strong>¿Ya existe el empleado?</strong>
                    </label>
                    <hr
                      className="text-val-emp"
                      style={{ width: 550, color: "black" }}
                    />
                  </center>
                  <div className="div-bottons justify-content-center aling-items-center">
                    <h2
                      style={{ fontSize: isMobile ? 16 : 22 }}
                      className="me-3 mt-3"
                    >
                      Validación de empleado por cédula:{" "}
                    </h2>
                    <div className="d-flex flex-row justify-content-center">
                      <TextField
                        min={10000000}
                        max={9999999999}
                        value={search.cedula}
                        className=""
                        pattern="[0-9]"
                        onChange={handlerChangeSearch}
                        id="cedula"
                        type="number"
                        style={{ fontSize: 20 }}
                        label="Número de documento"
                        variant="standard"
                      ></TextField>
                    </div>
                  </div>
                  <center>
                    <div className="mt-3 mb-3">
                      <button
                        onClick={(e) => handleSearch(e)}
                        className=" mt-1"
                      >
                        Buscar empleado
                      </button>
                    </div>
                  </center>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
}
