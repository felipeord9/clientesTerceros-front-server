import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { FaEye } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllDocuments } from "../../services/documentService";
import { filesEmployee, deleteFile } from "../../services/fileService";
import { updateBitacora } from "../../services/bitacoraService";
import { getAllCargos } from "../../services/cargoService";
import { createEmpleado, findEmpleadoByCedula, findEmpleados , deleteEmpleado , sendMail } from "../../services/empleadoService";
import { useNavigate } from "react-router-dom";

export default function FormEmpleados() {
  /* instancias de contexto */
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [document, setDocument] = useState(null);
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState(null);

  /* inicializar los documentos adjuntos */
  const [docCedula, setDocCedula] = useState(0);
  const [docContrato, setDocContrato] = useState(0);
  const [docInfemp, setDocInfemp] = useState(0);
  const [docOtros, setDocOtros] = useState(0);

  //------------------------------------------
  /* Variable de todos los pdf y el nombre de la carpeta*/
  /* const [files, setFiles] = useState([]); */
  const [files, setFiles] = useState({
    input1: null,
    input2: null,
    input3: null,
    input4: null,
  });

  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFiles((prevFiles) => ({ ...prevFiles, [fieldName]: selectedFile }));
    } else {
      Swal.fire({
        icon: "warning",
        title: "¡ATENCION!",
        text: "El aplicativo solo acepta archivo con extensión .pdf",
        showConfirmButton: true,
        confirmButtonColor: "#198754",
        confirmButtonText: "Entendido",
      });
    }
  };
  //------------------------------------------

  /* inicializar para hacer la busqueda (es necesario inicializar en array vacio)*/
  const [agencias, setAgencias] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [cargos, setCargos] = useState([]);

  const [search, setSearch] = useState({
    cedula: "",
    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    otrosNombres: "",
    celular: "",
    telefono: "",
    direccion: "",
    correoElectronico: "",
    observations: "",    
  });
  const [loading, setLoading] = useState(false);

  /* rama seleccionada de cada variable */
  const selectBranchRef = useRef();
  const selectDocumentoRef = useRef();
  const selectDepartamentoRef = useRef();
  const selectCiudadRef = useRef();
  const selectCargoRef = useState();

  const limitDeliveryDateField = new Date();
  limitDeliveryDateField.setHours(2);

  /* asignacion de valores a las variables */
  useEffect( ()  => {
     getAllAgencies().then((data) => setAgencias(data));
     getAllDocuments().then((data) => setDocumentos(data));
     getAllDepartamentos().then((data) => setDepartamentos(data));
     getAllCiudades().then((data) => setCiudades(data));
     getAllCargos().then((data) => setCargos(data));
  }, []);

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const [actualizar, setActualizar] = useState("");
  const [rzNotEnty, setRzNotEnty] = useState(false);
  const [empleados, setEmpleados] = useState();
  useEffect(() => {
    
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (search.cedula.length >= 5 && search.cedula.length <= 10 /* && empleados.length > 0 */) {
        const filtroEmpleados = empleados?.filter((item) => {
          if (item.cedula === search.cedula) {
            return item;
          }
        });
        if (filtroEmpleados?.length > 0 ) {
          Swal.fire({
            title: "¡ATENCIÓN!",
            text: `El numero de identificación ${search.cedula}
            se encuentra registrado en nuestra base de datos como empleado. 
            ¿Qué acción desea realizar?`,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonColor: "#D92121",
            confirmButtonText: "Consultar",
            cancelButtonText: "Regresar",
            /* showDenyButton:true,
            denyButtonColor:'blue',
            denyButtonText:'Actualizar' */
          }).then(({ isConfirmed, isDenied }) => {
            if (isConfirmed) {
              filtroEmpleados.map((item) => {
                setSearch({
                  ...search,
                  primerApellido: item.primerApellido,
                  segundoApellido: item.segundoApellido,
                  primerNombre: item.primerNombre,
                  otrosNombres: item.otrosNombres,
                });
              });
              setActualizar("SI");
              setRzNotEnty(true);
            } else if (isDenied) {
              setSearch({})
              
            }
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title:
            "Recuerda que el número de identificación debe contener entre 5 y 10 caracteres",
          confirmButtonColor: "#D92121",
          confirmButtonText: "OK",
        });
      }
    }
  };

  //funcion para que cuando se cambie de input se ejecute
  const handleInputBlur = () => {
    if (search.cedula.length >= 5 && search.cedula.length <= 10 /* && empleados.length > 0 */) {
      const filtroEmpleados = empleados?.filter((item) => {
        if (item.cedula === search.cedula) {
          return item;
        }
      });
      if (filtroEmpleados?.length > 0 ) {
        Swal.fire({
          title: "¡ATENCIÓN!",
          text: `El numero de identificación ${search.cedula}
          se encuentra registrado en nuestra base de datos como empleado.
          ¿Qué acción desea realizar?`,
          showCancelButton: true,
          confirmButtonColor: "#D92121",
          confirmButtonText: "Consultar",
          showConfirmButton: true,
          cancelButtonText: "Regresar",
          /* showDenyButton:true,
          denyButtonColor:'blue',
          denyButtonText:'Actualizar' */
        }).then(({ isConfirmed, isDenied }) => {
          //si es confirmado es porque le dio a consultar
          if (isConfirmed) {
            filtroEmpleados.map((item) => {
              setSearch({
                ...search,
                primerApellido: item.primerApellido,
                segundoApellido: item.segundoApellido,
                primerNombre: item.primerNombre,
                otrosNombres: item.otrosNombres,
              });
            });
            setActualizar("SI");
            setRzNotEnty(true);
          } else if (isDenied) {
            setSearch({})
          }
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title:
          "Recuerda que el número de identificación debe contener entre 5 y 10 caracteres",
        confirmButtonColor: "#D92121",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está segur@?",
      text: "Se realizará el registro del empleado",
      icon: "question",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#198754",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    })
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          setLoading(true);
          const formData = new FormData();

          for (const fieldName in files) {
            if (files[fieldName]) {
              formData.append(fieldName, files[fieldName]);
            }
          }
          //creamos el cuerpo de nuestra instancia
          const body = {
            rowId: search.cedula,
            numeroDocumento: search.cedula,
            tipoDocumento: actualizar === "" ? document.codigo : document,
            primerApellido: search.primerApellido.toUpperCase(),
            segundoApellido: search.segundoApellido.toUpperCase(),
            primerNombre: search.primerNombre.toUpperCase(),
            otrosNombres: search.otrosNombres !== '' ? search.otrosNombres.toUpperCase() : '',
            numeroCelular: search.celular,
            numeroTelefono: search.telefono,
            correo: search.correoElectronico.toLowerCase(),
            direccion: search.direccion.toUpperCase(),
            departamento: departamento === "" ? "---" : departamento.codigo,
            ciudad: ciudad === "" ? "-----" : ciudad.codigo,
            agencia: agencia === '' ? '-----' : agencia.description,
            cargo: cargo.description,
            observations: search.observations,
            createdAt: new Date(),
            createdBy: user.id,
            docCedula: docCedula,
            docContrato: docContrato,
            docInfemp: docInfemp,
            docOtros: docOtros,
            fechaActualizacion: actualizar === "" ? null : new Date(),
          };
          //creamos una constante la cual llevará el nombre de nuestra carpeta
          const folderName =
            search.cedula +
            "-" +
            search.primerApellido.toUpperCase() +
            "-" +
            search.segundoApellido.toUpperCase() +
            "-" +
            search.primerNombre.toUpperCase() +
            "-" +
            search.otrosNombres.toUpperCase(); //agregamos la carpeta donde alojaremos los archivos
          formData.append("folderName", folderName); // Agregar el nombre de la carpeta al FormData
          const originalFolderName =
            search.cedula +
            "-" +
            search.primerApellido.toUpperCase() +
            "-" +
            search.segundoApellido.toUpperCase() +
            "-" +
            search.primerNombre.toUpperCase() +
            "-" +
            search.otrosNombres.toUpperCase();
          formData.append("originalFolderName", originalFolderName);
          //creamos una constante con el nombre del cliente para darselo a todos los documentos
          const employeeName =
            search.primerApellido.toUpperCase() +
            " " +
            search.segundoApellido.toUpperCase() +
            " " +
            search.primerNombre.toUpperCase() +
            " " +
            search.otrosNombres.toUpperCase();
          formData.append("employeeName", employeeName);
          //ejecutamos nuestra funcion que creara el cliente
          createEmpleado(body)
            .then(({ data }) => {
              const info = {
                accion: "1",
              };
              updateBitacora(user.email, info);
              const mail = {
                agencia: agencia.description,
                razonSocial:
                  search.primerApellido.toUpperCase() +
                  " " +
                  search.segundoApellido.toUpperCase() +
                  " " +
                  search.primerNombre.toUpperCase() +
                  " " +
                  search.otrosNombres.toUpperCase(),
                tipoFormulario: 'empleados',
              };
              sendMail(mail)
                .then(() => {
                  filesEmployee(formData)
                    .then(() => {
                      setLoading(false);
                      setFiles([]);
                      Swal.fire({
                        title: "Creación exitosa!",
                        text: `El empleado "${data.primerApellido} ${data.segundoApellido} ${data.primerNombre} ${data.otrosNombres}" con Número 
                          de documento "${data.rowId}" se ha registrado de manera exitosa`,
                        /* icon: "success", */
                        position: "center",
                        showConfirmButton: true,
                        confirmButtonColor: "#198754",
                        confirmButtonText: "Aceptar",
                      }).then(() => {
                        window.location.reload();
                      });
                    })
                     .catch((err) => {
                      setLoading(false);
                      if (!data) {
                        deleteFile(folderName);
                      } else {
                        deleteEmpleado(data.id);
                      }
                      Swal.fire({
                        title: "¡Ha ocurrido un error!",
                        text: `
              Ha ocurrido un error al momento de guardar los pdf, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
                        icon: "error",
                        showConfirmButton: true,
                        confirmButtonColor: "#198754",
                        confirmButtonText: "Aceptar",
                      }).then(() => {
                        window.location.reload();
                      });
                    });
                })
                .catch((err) => {
                  setLoading(false);
                  deleteFile(folderName);
                  Swal.fire({
                    title: "¡Ha ocurrido un error!",
                    text: `
            Ha ocurrido un error al momento de enviar el correo a cartera, intente de nuevo.
            Si el problema persiste por favor comuniquese con el área de sistemas.`,
                    icon: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#198754",
                    confirmButtonText: "Aceptar",
                  }).then(() => {
                    window.location.reload();
                  });
                });
            })
            .catch((err) => {
              setLoading(false);
              deleteFile(folderName);
              Swal.fire({
                title: "¡Ha ocurrido un error!",
                text: `
              Hubo un error al momento de guardar la informacion del empleado, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
                icon: "error",
                confirmButtonText: "Aceptar",
              }).then(() => {
                window.location.reload();
              });
            });
        }
      })
  };

  const refreshForm = () => {
    Swal.fire({
      title: "¿Está segur@?",
      text: "Se descartará toda la información que haya registrado",
      icon: "warning",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#D92121",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) window.location.reload();
    });
  };

  /* validar correo Notificaciones*/
  const [Validacion, setValidacion] = useState("");
  const [Span, setSpan] = useState("red");
  const manejarCambio = (event) => {
    const nuevoValor = event.target.value;
    if (nuevoValor.includes("@") && nuevoValor.split("@")[1].includes(".")) {
      setValidacion("✓");
      setSpan("green"); // Limpiar mensaje de validación si es válido
    } else {
      setValidacion("X");
      setSpan("red");
    }
  };

  const [vality, setVality] = useState("");
  const [colorVality, setColorVality] = useState("red");
  const handleInputChange = (event) => {
    // Obtén el valor actual del input
    let value = event.target.value;

    // Remueve cualquier carácter que no sea un número
    value = value.replace(/[^0-9]/g, "");
    if (value.replace(/[^0-9]/g, "")) {
      setVality("✓");
      setColorVality("green");
    } else if (
      value.includes("e") ||
      value.includes("E") ||
      value.includes(",")
    ) {
      setVality("X");
      setColorVality("red");
    } else {
      setVality("X");
      setColorVality("red");
    }
  };
  /* dar vista previa a los pdf */
  const [selectedFiles, setSelectedFiles] = useState([]);

  const FileChange = (event, index) => {
    const newFiles = [...selectedFiles];
    const file = event.target.files[0];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900); // Establecer a true si la ventana es menor o igual a 768px
    };

    // Llama a handleResize al cargar y al cambiar el tamaño de la ventana
    window.addEventListener('resize', handleResize);
    handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto

    // Elimina el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className=" wrapper d-flex justify-content-center w-100 m-auto "
      style={{ userSelect: "none" }}
    >
      <div
        className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto"
        style={{ backgroundColor: "white", userSelect: "none" }}
      >
        <center>
          <section className="d-flex flex-row justify-content-between align-items-center mb-2">
            <div className="d-flex flex-column">
              <center>
                <Fade cascade="true">
                  <label
                    className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2"
                    style={{ fontSize: 90 }}
                  >
                    <strong>FORMULARIO DE EMPLEADOS</strong>
                  </label>
                </Fade>
                <hr className="my-1" />
                {actualizar === "SI" && (
                  <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2">
                    <strong>ACTUALIZACIÓN</strong>
                  </label>
                )}
              </center>
            </div>
          </section>
        </center>
        <form className="" onSubmit={handleSubmit}>
          <div className="bg-light rounded shadow-sm p-2 mb-3">
            <div className="d-flex flex-column gap-1">
              <div>
                <label className="fw-bold" style={{ fontSize: 17 }}>
                  INFORMACIÓN DEL EMPLEADO
                </label>

                <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column align-items-start">
                    <label for="cedula" className="me-1">
                      No.Identificación:
                    </label>
                    <div className="d-flex flex-row w-100">
                      <input
                        id="cedula"
                        type="number"
                        className="form-control form-control-sm w-100"
                        min={10000}
                        name="cedula"
                        pattern="[0-9]"
                        autoComplete="off"
                        value={search.cedula}
                        onChange={(e) => (
                          handlerChangeSearch(e), handleInputChange(e)
                        )}
                        required
                        max={9999999999}
                        minLength={0}
                        maxLength={10}
                        onKeyPress={actualizar === "" ? handleKeyPress : null}
                        onBlur={actualizar === "" ? handleInputBlur : null}
                        disabled={actualizar === "" ? false : true}
                        size={10}
                        placeholder="Campo obligatorio"
                      ></input>
                      <span className="validity fw-bold"></span>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">Tipo documento:</label>
                    <select
                      ref={selectDocumentoRef}
                      style={{ width: 245 }}
                      className="form-select form-select-sm w-100"
                      onChange={(e) => setDocument(JSON.parse(e.target.value))}
                      required
                      disabled={actualizar === "" ? false : true}
                    >
                      <option selected value="" disabled>
                        -- Seleccione el tipo de documento --
                      </option>
                      {documentos
                        .sort((a, b) => a.id - b.id)
                        .map((elem) => (
                          <option id={elem.id} value={JSON.stringify(elem)}>
                            {elem.id + " - " + elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="row row-cols-sm-4 mt-2">
                  <div className="d-flex flex-column align-items-start ">
                    <label className="me-1 w-25">1er.Apellido:</label>
                    <input
                      id="primerApellido"
                      type="text"
                      disabled={rzNotEnty ? true : false}
                      className="form-control form-control-sm "
                      min={0}
                      style={{ textTransform: "uppercase" }}
                      required
                      autoComplete="off"
                      placeholder="Campo obligatorio"
                      value={search.primerApellido}
                      onChange={handlerChangeSearch}
                    />
                  </div>
                  <div className="d-flex flex-column ">
                    <label className="me-1 w-25">2do.Apellido:</label>
                    <input
                      id="segundoApellido"
                      type="text"
                      className="form-control form-control-sm "
                      min={0}
                      disabled={rzNotEnty ? true : false}
                      style={{ textTransform: "uppercase" }}
                      placeholder="(Campo Opcional)"
                      value={search.segundoApellido}
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>

                  <div className="d-flex flex-column ">
                    <label className="me-1 w-25">1er.Nombre:</label>
                    <input
                      id="primerNombre"
                      type="text"
                      className="form-control form-control-sm "
                      min={0}
                      disabled={rzNotEnty ? true : false}
                      style={{ textTransform: "uppercase" }}
                      required
                      placeholder="Campo obligatorio"
                      value={search.primerNombre}
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <label className="me-1 ">Otros nombres:</label>
                    <input
                      id="otrosNombres"
                      type="text"
                      className="form-control form-control-sm w-100"
                      min={0}
                      disabled={rzNotEnty ? true : false}
                      style={{ textTransform: "uppercase" }}
                      placeholder="(Campo Opcional)"
                      value={search.otrosNombres}
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* telefono y celular */}
                <div className="row row-cols-sm-2 mt-2 ">
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">No.Celular:</label>
                    <input
                      value={search.celular}
                      onChange={handlerChangeSearch}
                      id="celular"
                      type="number"
                      className="form-control form-control-sm "
                      min={1000000}
                      pattern="[0-9]"
                      placeholder="Campo obligatorio"
                      max={9999999999}
                      autoComplete="off"
                      /* placeholder="Campo obligatorio" */
                    />
                    {/* <span className="validity fw-bold me-3"></span> */}
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">Teléfono:</label>
                    <input
                      value={search.telefono}
                      onChange={handlerChangeSearch}
                      id="telefono"
                      type="number"
                      pattern="[0-9]"
                      placeholder="(Campo Opcional)"
                      className="form-control form-control-sm mb-2"
                      min={1000000}
                      autoComplete="off"
                      max={9999999999}

                      /* placeholder="(Campo Opcional)" */
                    ></input>
                    {/* <span className="validity fw-bold "></span> */}
                  </div>
                </div>

                {/* correo y direccion  */}
                <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column ">
                    <label className="me-1">Correo electrónico:</label>
                    <div className="d-flex flex-row">
                      <input
                        id="correoElectronico"
                        type="email"
                        autoComplete="off"
                        className="form-control form-control-sm "
                        min={0}
                        value={search.correoElectronico}
                        onChange={(e) => (
                          handlerChangeSearch(e), manejarCambio(e)
                        )}
                        required
                        style={{ textTransform: "lowercase" }}
                        placeholder="Campo obligatorio"
                      ></input>
                      <label className="ps-3 d-flex" style={{ color: Span }}>
                        <strong>{Validacion}</strong>
                      </label>
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <label className="me-1">Dirección:</label>
                    <input
                      value={search.direccion}
                      onChange={handlerChangeSearch}
                      placeholder="campo obligatorio"
                      type="text"
                      autoComplete="off"
                      required
                      id="direccion"
                      style={{ textTransform: "uppercase" }}
                      className="form-control form-control-sm"
                      min={0}
                    ></input>
                  </div>
                </div>
                {/* departamento y ciudad */}
                <div className="row row-cols-sm-2 mt-2">
                  <div className="d-flex flex-column">
                    <label className="me-1">Departamento:</label>
                    <select
                      onChange={(e) =>
                        setDepartamento(JSON.parse(e.target.value))
                      }
                      required
                      ref={selectDepartamentoRef}
                      className="form-select form-select-sm m-100 me-3"
                    >
                      <option selected value="" disabled>
                        -- Seleccione el Departamento --
                      </option>
                      {departamentos
                        .sort((a, b) => a.id - b.id)
                        .map((elem) => (
                          <option
                            key={elem.id}
                            id={elem.id}
                            value={JSON.stringify(elem)}
                          >
                            {elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="d-flex flex-column">
                    <label className="me-1">Ciudad:</label>
                    <select
                      ref={selectCiudadRef}
                      className="form-select form-select-sm w-100"
                      disabled={departamento ? false : true}
                      required
                      onChange={(e) => setCiudad(JSON.parse(e.target.value))}
                    >
                      <option selected value="" disabled>
                        -- Seleccione la Ciudad --
                      </option>
                      {ciudades
                        .sort((a, b) => a.id - b.id)
                        .map((elem) =>
                          elem.id == departamento.id ? (
                            <option id={elem.id} value={JSON.stringify(elem)}>
                              {elem.description}
                            </option>
                          ) : null
                        )}
                    </select>
                  </div>
                </div>

                {/* agencia y cargo */}
                <div className="row row-cols-sm-2">
                  <div className="d-flex flex-column ">
                    <label className="" style={{ fontSize: 16 }}>
                      Agencia:
                    </label>
                    <select
                      ref={selectBranchRef}
                      className="form-select form-select-sm w-100"
                      required
                      onChange={(e) => setAgencia(JSON.parse(e.target.value))}
                    >
                      <option selected value="" disabled>
                        -- Seleccione la agencia --
                      </option>
                      {agencias
                        .sort((a, b) => a.id - b.id)
                        .map((elem) => (
                          <option id={elem.id} value={JSON.stringify(elem)}>
                            {elem.id + " - " + elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="d-flex flex-column">
                    <label className="" style={{ fontSize: 16 }}>
                      Cargo:
                    </label>
                    <select
                      ref={selectCargoRef}
                      className="form-select form-select-sm w-100"
                      required
                      onChange={(e) => setCargo(JSON.parse(e.target.value))}
                    >
                      <option selected value="" disabled>
                        -- Seleccione el cargo --
                      </option>
                      {cargos
                        ?.sort((a, b) => a.id - b.id)
                        ?.map((elem) => (
                          <option id={elem.id} value={JSON.stringify(elem)}>
                            {elem.codigo + " - " + elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* {JSON.stringify(cargos)} */}
              <hr className="my-1" />
              <div className="w-100 mt-1">
                <label className="fw-bold" style={{ fontSize: 17 }}>
                  DOCUMENTOS OBLIGATORIOS
                </label>
                <div className="row row-cols-sm-2 ">
                  <div className="">
                    <label className="fw-bold mt-1 me-2">COPIA CÉDULA: </label>
                    <div className="d-flex flex-row rounded-2 w-100">
                      <input
                        id="Cedula"
                        type="file"
                        placeholder="Cedula"
                        className="form-control form-control-sm  border border-5 rounded-3"
                        accept=".pdf"
                        style={{ backgroundColor: "#f3f3f3" }}
                        onChange={(e) => (
                          handleFileChange("Cedula", e),
                          setDocCedula(1),
                          FileChange(e, 1)
                        )}
                      />
                      {selectedFiles[1] && (
                        <div
                          className="d-flex justify-content-start ps-1 pt-1"
                          style={{ width: 50 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[1])}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaEye />
                            Ver
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <label className="fw-bold mt-1 ">COPIA CONTRATO: </label>
                    <div className="d-flex flex-row rounded-2 w-100">
                      <input
                        id="Contrato"
                        type="file"
                        placeholder="Contrato"
                        className="form-control form-control-sm border border-5 rounded-3 w-100"
                        accept=".pdf"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* second form */
                        onChange={(e) => (
                          handleFileChange("Contrato", e),
                          setDocContrato(1),
                          FileChange(e, 2)
                        )}
                      />
                      {selectedFiles[2] && (
                        <div
                          className="d-flex justify-content-start ps-1 pt-1"
                          style={{ width: 50 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[2])}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaEye />
                            Ver
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row row-cols-sm-2">
                <div className="">
                  <label className="fw-bold mt-1 ">INFOLAFT: </label>
                  <div className="d-flex flex-row rounded-2 w-100">
                    <input
                      id="Infemp"
                      type="file"
                      placeholder="Infemp"
                      className="form-control form-control-sm border border-5 rounded-3 w-100"
                      accept=".pdf"
                      style={{ backgroundColor: "#f3f3f3" }}
                      onChange={(e) => (
                        handleFileChange("Infemp", e),
                        setDocInfemp(1),
                        FileChange(e, 3)
                      )}
                    />
                    {selectedFiles[3] && (
                      <div
                        className="d-flex justify-content-start ps-1 pt-1"
                        style={{ width: 50 }}
                      >
                        <a
                          href={URL.createObjectURL(selectedFiles[3])}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaEye />
                          Ver
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column mt-1 w-100">
                    <label className="fw-bold mt-1 me-2">OTROS: </label>
                    <div className="d-flex flex-row">
                      <input
                        id="DocOtros"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        onChange={(e) => (
                          handleFileChange("Otros", e),
                          setDocOtros(1),
                          FileChange(e, 4)
                        )}
                        className="form-control form-control-sm border border-5 rounded-3"
                        accept=".pdf"
                      />
                      {selectedFiles[4] && (
                        <div
                          className="d-flex justify-content-start ps-2 pt-1"
                          style={{ width: 60 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[4])}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaEye />
                            Ver
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column mb-3 w-100">
            <label className="fw-bold" style={{ fontSize: 18 }}>
              OBSERVACIONES
            </label>
            <textarea
              value={search.observations}
              onChange={handlerChangeSearch}
              id="observations"
              className="form-control border border-3"
              style={{ minHeight: 70, maxHeight: 100, fontSize: 12 }}
            ></textarea>
          </div>
          <Modal show={loading} centered>
            <Modal.Body>
              <div className="d-flex align-items-center">
                <strong className="text-danger" role="status">
                  Cargando...
                </strong>
                <div
                  className="spinner-grow text-danger"
                  role="status"
                ></div>
              </div>
            </Modal.Body>
          </Modal>
          {isMobile ? 
            (
            <div className="d-flex flex-row mb-2 justify-content-center align-items-center">
                <div className="d-flex flex-row gap-2">
                  <button
                    type="submit"
                    className="fw-bold p-2"
                    onSubmit={handleSubmit}
                  >
                    {actualizar === "" ? "REGISTRAR" : "ACTUALIZAR"}
                  </button>
                  <Button
                    variant="secondary"
                    className=""
                    onClick={refreshForm}
                  >
                    CANCELAR
                  </Button>
                </div>
            </div>
            )
            :
            (
              <div className="d-flex flex-row mb-2 justify-content-end align-items-end">
              <Fade cascade direction="right">
                <div className="d-flex flex-row ">
                  <button
                    type="submit"
                    className="fw-bold "
                    onSubmit={handleSubmit}
                  >
                    {actualizar === "" ? "REGISTRAR" : "ACTUALIZAR"}
                  </button>
                  <Button
                    variant="secondary"
                    className="ms-3"
                    onClick={refreshForm}
                  >
                    CANCELAR
                  </Button>
                </div>
              </Fade>
            </div>
          )} 
        </form>
      </div>
    </div>
  );
}
