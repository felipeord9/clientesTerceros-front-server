import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validarProveedorId } from "../../services/proveedorService";
import AuthContext from "../../context/authContext";
import { RiArrowGoBackFill } from "react-icons/ri";
import Button from "@mui/material/Button";
import Logo_pdf from "../../assest/logo_pdf.jpg";
import { CiEdit } from "react-icons/ci";
import { config } from "../../config";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllTipoFormularios } from "../../services/tipoFormularioService";
import "./styles.css";

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const url = `${config.apiUrl2}/uploadMultiple/obtener-archivo/${carpeta}/${archivo}`;
  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );
};

export default function MostrarPMJ() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [search] = useState({
    cedula: "",
  });
  const [agencias, setAgencias] = useState([]);
  const [formularios, setFormularios] = useState([]);
  const { id } = useParams();

  const [info, setInfo] = useState({
    cedula: "",
    razonSocial: "",
    ciudad: "",
    direccion: "",
    celular: "",
    correoNotificaciones: "",
    observations: "",
    createdAt: "",
    userName: "",
    agencia: "",
    tipoFormulario: "",
    solicitante: "",
    docVinculacion: "",
    docComprAntc: "",
    docCtalnst: "",
    docPagare: "",
    docRut: "",
    docCcio: "",
    docCrepL: "",
    docEf: "",
    docRefcom: "",
    docRefcom2: "",
    docRefcom3: "",
    docCvbo: "",
    docFirdoc: "",
    docInfemp: "",
    docInfrl: "",
    docCerBan: "",
    docValAnt: "",
    docOtros: "",
  });
  useEffect(() => {
    const datosTercero = localStorage.getItem("data");
    if (id) {
      validarProveedorId(id).then(({ data }) => {
        localStorage.setItem("data", JSON.stringify(data));
        setData(data);
        setInfo(data);
      });
    } else {
      setData(JSON.parse(datosTercero));
      setInfo(JSON.parse(datosTercero));
    }
  }, []);
  const ChangeInput = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    getAllCiudades().then((data) => setCiudades(data));
    getAllAgencies().then((data) => setAgencias(data));
    getAllTipoFormularios().then((data) => setFormularios(data));
  }, []);
  const [data, setData] = useState(null);

  const handleClickBack = (e) => {
    e = e.target.value;
    if (user.role === "agencias" || user.role === "cartera") {
      return navigate("/validar/tercero");
    } else if (user.role === "compras") {
      return navigate("/validar/Proveedor");
    } else {
      return navigate("/validacion/admin");
    }
    /* return navigate('/validacion/admin') */
  };

  const TextOfBinary = ({ valor }) => {
    const [labelColor, setLabelColor] = useState("");
    const [nuevoTexto, setNuevoTexto] = useState("");
    const [LogoPdf, setLogo] = useState("");
    /* const valorBinario = valor */
    /* const nuevoTexto = valor ? 'Fue cargado':'No fue cargado'; */
    useEffect(() => {
      if (valor === 1) {
        setLabelColor("#008F39");
        setNuevoTexto("Cargado");
        setLogo({ Logo_pdf });
      } else if (valor === 0) {
        setLabelColor("#CB3234");
        setNuevoTexto("No fue cargado");
        setLogo(null);
      } else {
        setLabelColor(null);
        setNuevoTexto("");
      }
    }, [valor]);
    return (
      <label className="mb-2" style={{ color: labelColor, height: 18 }}>
        <strong className="">
          {nuevoTexto} {/* {mostrarImagen(valor)} */}{" "}
          {/* <img src={LogoPdf} style={{width:100}}></img> */}
        </strong>
      </label>
    );
  };

  //logica para saber si es celular
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900); // Establecer a true si la ventana es menor o igual a 768px
    };

    // Llama a handleResize al cargar y al cambiar el tamaño de la ventana
    window.addEventListener("resize", handleResize);
    handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto

    // Elimina el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className=" wrapper d-flex justify-content-center w-100 h-auto m-auto"
      style={{ userSelect: "none" }}
    >
      <div
        className=" login-wrapper shadow rounded-4 border border-3 p-3 pt-4 mt-5 pb-3 mb-5 overflow-auto"
        style={{ backgroundColor: "white", width: 1000 }}
      >
        <div
          className={`w-100 mb-2 div-botons ${
            isMobile ? "" : "justify-content-between"
          }`}
        >
          <Button
            style={{ height: 35 }}
            onClick={(e) => handleClickBack(e)}
            variant="contained"
            className="d-flex justify-content-start"
          >
            <RiArrowGoBackFill className="me-1" />
            back
          </Button>
          {isMobile ? (
            <h3>
              <strong>Información Del Proveedor</strong>
            </h3>
          ) : (
            <h1 className="d-flex justify-content-center text-align-center">
              <strong>Información Del Proveedor</strong>
            </h1>
          )}
          <button
            className={`${isMobile ? "p-1" : "p-3"}`}
            onClick={(e) => navigate("/editar/info/PMJ")}
            style={{
              height: isMobile ? 35 : 55,
              width: isMobile ? "100%" : 150,
            }}
          >
            <CiEdit />
            Actualizar
          </button>
        </div>
        <div
          className="w-100 rounded-4 p-2"
          style={{ backgroundColor: "#C7C8CA" }}
        >
          <div className="row row-cols-sm-4 mt-2 mb-3">
            <div className="d-flex flex-column align-items-start">
              <label className="me-1">
                <strong>Número de Identifiación:</strong>
              </label>
              {data ? (
                <input
                  id="cedula"
                  className="form-control form-control-sm"
                  disabled
                  value={data.cedula}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Razon Social:</label>
              {data ? (
                <input
                  id="razonSocial"
                  className="form-control form-control-sm"
                  disabled
                  value={data.razonSocial}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Agencia:</label>
              <select
                id="agencia"
                value={info.agencia}
                className="form-control form-control-sm w-100"
                required
                onChange={ChangeInput}
                disabled
              >
                {agencias
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.id}>
                      {elem.description}
                    </option>
                  ))}
              </select>
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Solicitante:</label>
              {data ? (
                <input
                  id="solicitante"
                  className="form-control form-control-sm"
                  disabled
                  value={data.solicitante}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
          </div>
          <div className="row row-cols-sm-4 mt-2 mb-3">
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Dirección:</label>
              {data ? (
                <input
                  id="direccion"
                  className="form-control form-control-sm"
                  disabled
                  value={data.direccion}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Ciudad:</label>
              <select
                id="ciudad"
                value={info.ciudad}
                className="form-control form-control-sm w-100"
                required
                onChange={ChangeInput}
                disabled
              >
                {ciudades
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.codigo}>
                      {elem.description}
                    </option>
                  ))}
              </select>
              {/* {data ? (
                      <input
                      id="ciudad"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.ciudad}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )} */}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Teléfono Celular:</label>
              {data ? (
                <input
                  id="celular"
                  className="form-control form-control-sm"
                  disabled
                  value={data.celular}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Correo Electrónico:</label>
              {data ? (
                <input
                  id="correoElectronico"
                  className="form-control form-control-sm"
                  disabled
                  value={data.correoElectronico}
                ></input>
              ) : (
                <p>no hay nada</p>
              )}
            </div>
          </div>
          <div className="d-flex flex-column mb-3 mt-3">
            <label className="fw-bold" style={{ fontSize: 18 }}>
              OBSERVACIONES
            </label>
            {data ? (
              <textarea
                disabled
                id="observations"
                value={data.observations}
                className="form-control form-control-sm border border-3"
                style={{ minHeight: 70, maxHeight: 100, fontSize: 13 }}
              ></textarea>
            ) : (
              <p>no hay nada</p>
            )}
          </div>
          <div className="row row-cols-sm-4 mt-2 mb-2">
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Vinculacion:</label>
              {/* <input
                  id="docVinculacion"     
                  value={info.docVinculacion}              
                  className="form-control form-control-sm"                   
                  disabled
                  /> */}
              {data ? (
                <TextOfBinary valor={data.docVinculacion}>
                  {info.docVinculacion}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docVinculacion === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Vinculacion-${info.razonSocial}.pdf`}
                />
              )}
              {/* <img className="pt-1" src={Logo_pdf} style={{width:100}}></img> */}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_ComprAntc:</label>
              {/* <input
                  id="docComprAntc"     
                  value={info.docComprAntc}              
                  className="form-control form-control-sm"                   
                  disabled
                  >
                  </input> */}
              {data ? (
                <TextOfBinary valor={data.docComprAntc}>
                  {info.docComprAntc}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docComprAntc === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`ComprAntc-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Refcom:</label>
              {data ? (
                <TextOfBinary valor={data.docRefcom}>
                  {info.docRefcom}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docRefcom === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Refcom-${info.razonSocial}.pdf`}
                />
              )}
              {info.docRefcom2 === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Refcom2-${info.razonSocial}.pdf`}
                />
              )}
              {info.docRefcom3 === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Refcom3-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Infemp:</label>
              {data ? (
                <TextOfBinary valor={data.docInfemp}>
                  {info.docInfemp}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docInfemp === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Infemp-${info.razonSocial}.pdf`}
                />
              )}
            </div>
          </div>

          <div className="row row-cols-sm-4 mt-2 mb-2">
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Rut:</label>
              {data ? (
                <TextOfBinary valor={data.docRut}></TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docRut === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Rut-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Ccio:</label>
              {data ? (
                <TextOfBinary valor={data.docCcio}>{info.docCcio}</TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docCcio === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Ccio-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_CrepL:</label>
              {data ? (
                <TextOfBinary valor={data.docCrepL}>
                  {info.docCrepL}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docCrepL === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`CrepL-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Ef:</label>
              {data ? (
                <TextOfBinary valor={data.docEf}>{info.docEf}</TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docEf === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Ef-${info.razonSocial}.pdf`}
                />
              )}
            </div>
          </div>
          <div className="row row-cols-sm-4 mt-2 mb-2">
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Infrl:</label>
              {data ? (
                <TextOfBinary valor={data.docInfrl}>
                  {info.docInfrl}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docInfrl === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Infrl-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_CerBan:</label>
              {data ? (
                <TextOfBinary valor={data.docCerBan}>
                  {info.docCerBan}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docCerBan === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Certban-${info.razonSocial}.pdf`}
                />
              )}
            </div>
            <div className="d-flex flex-column align-items-start">
              <label className="me-1 fw-bold">Doc_Otros:</label>
              {data ? (
                <TextOfBinary valor={data.docOtros}>
                  {info.docOtros}
                </TextOfBinary>
              ) : (
                <p>no hay nada</p>
              )}
              {info.docOtros === 1 && (
                <CarpetaArchivoLink
                  carpeta={`${info.cedula}-${info.razonSocial}`}
                  archivo={`Otros-${info.razonSocial}.pdf`}
                />
              )}
            </div>
          </div>
          <center>
            <div className="row row-cols-sm-3 mt-4 mb-2">
              <div className="d-flex flex-column align-items-start">
                <label className="me-1 fw-bold">Fecha Creación:</label>
                {data ? (
                  <input
                    id="createdAt"
                    className="form-control form-control-sm"
                    disabled
                    value={`${new Date(
                      data.createdAt
                    ).toLocaleDateString()} - ${new Date(
                      data.createdAt
                    ).toLocaleTimeString()}`}
                  ></input>
                ) : (
                  <p>no hay nada</p>
                )}
              </div>
              <div className="d-flex flex-column align-items-start">
                <label className="me-1 fw-bold">Usuario Creador:</label>
                {data ? (
                  <input
                    id="userName"
                    className="form-control form-control-sm"
                    disabled
                    value={data.userName}
                  ></input>
                ) : (
                  <p>no hay nada</p>
                )}
              </div>
              <div className="d-flex flex-column align-items-start">
                <label className="me-1 fw-bold">Tipo formato:</label>
                <select
                  id="tipoFormulario"
                  value={info.tipoFormulario}
                  className={`form-control form-control-sm`}
                  required
                  onChange={ChangeInput}
                  disabled
                >
                  {formularios
                    .sort((a, b) => a.id - b.id)
                    .map((elem) => (
                      <option id={elem.id} value={elem.id}>
                        {elem.description}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
}
