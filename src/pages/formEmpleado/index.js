import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { FaEye } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import Checkbox from "@mui/material/Checkbox";
import "bootstrap/dist/css/bootstrap.min.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tablestudies from "../../components/tableStudies";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllDocuments } from "../../services/documentService";
/* import { filesEmployee, deleteFile } from "../../services/fileService"; */
import { filesEmployee, deleteFile } from "../../services/fileEmployeesRoutes";
import { updateBitacora } from "../../services/bitacoraService";
import { getAllCargos } from "../../services/cargoService";
import { getAllContratos } from "../../services/contratoService";
import {
  createEmpleado,
  findEmpleadoByCedula,
  findEmpleados,
  deleteEmpleado,
  sendMail2,
  updateEmpleado,
  updateEmployee,
  verifyTokenWhithId,
  updateAsCreated,
  updateAsReturn,
} from "../../services/empleadoService";
import { useParams } from "react-router-dom";
import { config } from "../../config";
import { MdAssignmentAdd } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const url = `${config.apiUrl2}/supportFiles/archivo-empleado/${carpeta}/${archivo}`;

  return (
    <div>
      <a className="ms-2" href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );
};

export default function FormEmpleados() {
  /* instancias de contexto */
  const { user } = useContext(AuthContext);

  //constante para guardar el valor del parametro
  const { rowid } = useParams();

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [document, setDocument] = useState(null);
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [cargo, setCargo] = useState(null);
  const [contratos, setContratos] = useState(null);
  const [exist, setExist] = useState(false);
  const [tipoContrato, setTipoContrato] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  /* variables de los estudios */
  const [infoStudy, setInfoStudy] = useState({
    nivelEstudio: "",
    currentStudy: "",
    typeStudy: "",
    establecimiento: "",
    semestre: "",
  });
  const [nivelEstudio, setNivelEstudio] = useState(null);

  /* inicializar los documentos adjuntos */
  const [docCedula, setDocCedula] = useState(0);
  const [docContrato, setDocContrato] = useState(0);
  const [docInfemp, setDocInfemp] = useState(0);
  const [docOtros, setDocOtros] = useState(0);
  const [docHV, setDocHV] = useState(0);
  const [docEscolaridad, setDocEscolaridad] = useState(0);
  const [docEps, setDocEps] = useState(0);
  const [docCajaCompensacion, setDocCajaCompensacion] = useState(0);
  const [docOtroSi, setDocOtroSi] = useState(0);
  const [docExaIngreso, setDocExaIngreso] = useState(0);
  const [docARL, setDocARL] = useState(0);

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
  const [empleados, setEmpleados] = useState();

  //variables del genero
  const [currentStudy, setCurrentStudy] = useState({
    si: false,
    no: false,
  });
  //logica del llenado de los checkbox
  const handleEstudia = (type) => {
    setCurrentStudy({
      si: type === "si" ? true : false,
      no: type === "no" ? true : false,
    });
    setInfoStudy({
      ...infoStudy,
      currentStudy: type,
    });
  };

  //lista donde se alojaran todos los productos que se agregen a la solicitud
  const [estudiosAgr, setEstudiosAgr] = useState({
    agregados: [],
  });

  const [search, setSearch] = useState({
    estado: "",
    id: "",
    cedula: "",
    primerApellido: "",
    segundoApellido: "",
    primerNombre: "",
    otrosNombres: "",
    fechaNacimiento: "",
    genero: "",
    celular: "",
    telefono: "",
    direccion: "",
    correoElectronico: "",
    observations: "",
    fechaInicioContrato: "",
    fechaFinContrato: "",
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
  useEffect(() => {
    let docs = [];
    let departs = [];
    let munis = [];
    getAllAgencies().then((data) => setAgencias(data));
    /* getAllDepartamentos().then((data) => (setDepartamentos(data), departs = data));
    getAllCiudades().then((data) => (setCiudades(data), munis = data)); */
    getAllCargos().then((data) => setCargos(data));
    findEmpleados().then(({ data }) => setEmpleados(data));
    getAllContratos().then((data) => setContratos(data));
    getAllDocuments().then((data) => {
      setDocumentos(data);
      docs = data;
      getAllCiudades().then((data) => {
        setCiudades(data);
        munis = data;
        getAllDepartamentos().then((data) => {
          setDepartamentos(data);
          departs = data;
          if (rowid) {
            findEmpleadoByCedula(rowid)
              .then((data) => {
                setActualizar("SI");
                setSearch({
                  ...search,
                  estado: data.estado,
                  id: data.id,
                  cedula: data.rowId,
                  primerApellido: data.primerApellido,
                  segundoApellido: data.segundoApellido,
                  primerNombre: data.primerNombre,
                  otrosNombres: data.otrosNombres,
                  celular: data.numeroCelular,
                  telefono: data.numeroTelefono,
                  correoElectronico: data.correo,
                  direccion: data.direccion,
                  genero: data.genero,
                  fechaNacimiento: data.fechaNacimiento,
                  fechaFinContrato: data.fechaFinal,
                  fechaInicioContrato: data.fechaInicio,
                  observations: data.observations,
                  returnReason: data.returnReason,
                  review: data.review,
                });
                //funcion para filtrar el tipo de documento por codigo para devolver el codigo
                const [tipo] = docs.filter(
                  (dato) => dato.codigo === data.tipoDocumento
                );
                setDocument(tipo?.codigo);

                //funcion para filtrar el departamento por codigo y devolver el codigo
                const [depa] = departs.filter(
                  (dato) => dato.codigo === data.departamento
                );
                setDepartamento(depa);

                //funcion para filtrar la ciudad por codigo y devolver el codigo
                const [city] = munis.filter(
                  (dato) => dato.codigo === data.ciudad
                );
                setCiudad(city?.codigo);

                //guardar la agencia, el cargo y tipo de contrato
                setAgencia(data.agencia);
                setCargo(data.cargo);
                setTipoContrato(data.tipoContrato);

                //setear documentos
                setDocCedula(data.docCedula);
                setDocContrato(data.docContrato);
                setDocInfemp(data.docInfemp);
                setDocOtros(data.docOtros);
                setDocHV(data.docHV);
                setDocEps(data.docEps);
                setDocCajaCompensacion(data.docCajaCompensacion);
                setDocOtroSi(data.docOtroSi);
                setDocExaIngreso(data.docExaIngreso);
                setDocARL(data.docARL);
                setDocEscolaridad(data.docEscolaridad);

                //setear los estudios agregados
                setEstudiosAgr({
                  agregados: data.estudios,
                });

                //funcion para determinar si se encontro
                setExist(true);
              })
              .catch(() => {
                verifyTokenWhithId(rowid).then(({ data }) => {
                  setActualizar("SI");
                  setSearch({
                    ...search,
                    estado: data.estado,
                    id: data.id,
                    cedula: data.rowId,
                    primerApellido: data.primerApellido,
                    segundoApellido: data.segundoApellido,
                    primerNombre: data.primerNombre,
                    otrosNombres: data.otrosNombres,
                    celular: data.numeroCelular,
                    telefono: data.numeroTelefono,
                    correoElectronico: data.correo,
                    direccion: data.direccion,
                    genero: data.genero,
                    fechaNacimiento: data.fechaNacimiento,
                    fechaFinContrato: data.fechaFinal,
                    fechaInicioContrato: data.fechaInicio,
                    observations: data.observations,
                    returnReason: data.returnReason,
                    review: data.review,
                  });
                  //funcion para filtrar el tipo de documento por codigo para devolver el codigo
                  const [tipo] = docs.filter(
                    (dato) => dato.codigo === data.tipoDocumento
                  );
                  setDocument(tipo?.codigo);

                  //funcion para filtrar el departamento por codigo y devolver el codigo
                  const [depa] = departs.filter(
                    (dato) => dato.codigo === data.departamento
                  );
                  setDepartamento(depa);

                  //funcion para filtrar la ciudad por codigo y devolver el codigo
                  const [city] = munis.filter(
                    (dato) => dato.codigo === data.ciudad
                  );
                  setCiudad(city?.codigo);

                  //guardar la agencia, el cargo y tipo de contrato
                  setAgencia(data.agencia);
                  setCargo(data.cargo);
                  setTipoContrato(data.tipoContrato);

                  //setear documentos
                  setDocCedula(data.docCedula);
                  setDocContrato(data.docContrato);
                  setDocInfemp(data.docInfemp);
                  setDocOtros(data.docOtros);
                  setDocHV(data.docHV);
                  setDocEps(data.docEps);
                  setDocCajaCompensacion(data.docCajaCompensacion);
                  setDocOtroSi(data.docOtroSi);
                  setDocExaIngreso(data.docExaIngreso);
                  setDocARL(data.docARL);
                  setDocEscolaridad(data.docEscolaridad);

                  //setear los estudios agregados
                  setEstudiosAgr({
                    agregados: data.estudios,
                  });

                  //funcion para determinar si se encontro
                  setExist(true);
                });
              });
          }
        });
      });
    });
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (
        search.cedula.length >= 5 &&
        search.cedula.length <= 10 /* && empleados.length > 0 */
      ) {
        const filtroEmpleados = empleados?.filter((item) => {
          if (item.rowId === search.cedula) {
            return item;
          }
        });
        if (filtroEmpleados?.length > 0) {
          Swal.fire({
            title: "¡ATENCIÓN!",
            text: `El numero de identificación "${search.cedula}"
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
                  celular: item.numeroCelular,
                  telefono: item.numeroTelefono,
                  correoElectronico: item.correo,
                  direccion: item.direccion,
                  genero: item.genero,
                  fechaNacimiento: item.fechaNacimiento,
                });
                //funcion para filtrar el tipo de documento por codigo para devolver la descripcion
                const [tipo] = documentos.filter(
                  (dato) => dato.codigo === item.tipoDocumento
                );
                setDocument(tipo.codigo);

                //funcion para filtrar el departamento por codigo y devolver la descripcion
                const [depa] = departamentos.filter(
                  (dato) => dato.codigo === item.departamento
                );
                setDepartamento(depa?.description);

                //funcion para filtrar la ciudad por codigo y devolver la descripcion
                const [city] = ciudades.filter(
                  (dato) => dato.codigo === item.ciudad
                );
                setCiudad(city?.description);

                //guardar la agencia y el cargo
                setAgencia(item.agencia);
                setCargo(item.cargo);

                //funcion para determinar si se encontro
                setExist(true);
              });
              setActualizar("SI");
              setRzNotEnty(true);
            } else if (isDenied) {
              setSearch({});
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
    if (
      search.cedula.length >= 5 &&
      search.cedula.length <= 10 /* && empleados.length > 0 */
    ) {
      const filtroEmpleados = empleados?.filter((item) => {
        if (item.rowId === search.cedula) {
          return item;
        }
      });
      if (filtroEmpleados?.length > 0) {
        Swal.fire({
          title: "¡ATENCIÓN!",
          text: `El numero de identificación "${search.cedula}"
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
                estado: item.estado,
                id: item.id,
                primerApellido: item.primerApellido,
                segundoApellido: item.segundoApellido,
                primerNombre: item.primerNombre,
                otrosNombres: item.otrosNombres,
                celular: item.numeroCelular,
                telefono: item.numeroTelefono,
                correoElectronico: item.correo,
                direccion: item.direccion,
                genero: item.genero,
                fechaNacimiento: item.fechaNacimiento,
                fechaFinContrato: item.fechaFinal,
                fechaInicioContrato: item.fechaInicio,
                observations: item.observations,
              });
              //funcion para filtrar el tipo de documento por codigo para devolver el codigo
              const [tipo] = documentos.filter(
                (dato) => dato.codigo === item.tipoDocumento
              );
              setDocument(tipo.codigo);

              //funcion para filtrar el departamento por codigo y devolver el codigo
              const [depa] = departamentos.filter(
                (dato) => dato.codigo === item.departamento
              );
              setDepartamento(depa);

              //funcion para filtrar la ciudad por codigo y devolver el codigo
              const [city] = ciudades.filter(
                (dato) => dato.codigo === item.ciudad
              );
              setCiudad(city?.codigo);

              //guardar la agencia, el cargo y tipo de contrato
              setAgencia(item.agencia);
              setCargo(item.cargo);
              setTipoContrato(item.tipoContrato);

              //setear documentos
              setDocCedula(item.docCedula);
              setDocContrato(item.docContrato);
              setDocInfemp(item.docInfemp);
              setDocOtros(item.docOtros);
              setDocHV(item.docHV);
              setDocEps(item.docEps);
              setDocCajaCompensacion(item.docCajaCompensacion);
              setDocOtroSi(item.docOtroSi);
              setDocExaIngreso(item.docExaIngreso);
              setDocARL(item.docARL);
              setDocEscolaridad(item.docEscolaridad);

              //setear los estudios agregados
              setEstudiosAgr({
                agregados: item.estudios,
              });

              //funcion para determinar si se encontro
              setExist(true);
            });
            setActualizar("SI");
            setRzNotEnty(true);
          } else if (isDenied) {
            setSearch({});
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

  //funcion para crear empleados
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está segur@?",
      text: `Se realizará el registro del empleado: "${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${
        search.otrosNombres !== "" ? search.otrosNombres.toUpperCase() : ""
      }", con número de identificación: ${search.cedula}.`,
      icon: "question",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#198754",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed }) => {
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
          estado: "Generado",
          rowId: search.cedula,
          numeroDocumento: search.cedula,
          tipoDocumento: document,
          primerApellido: search.primerApellido.toUpperCase(),
          segundoApellido: search.segundoApellido.toUpperCase(),
          primerNombre: search.primerNombre.toUpperCase(),
          otrosNombres:
            search.otrosNombres !== "" ? search.otrosNombres.toUpperCase() : "",
          fechaNacimiento: new Date(search.fechaNacimiento),
          genero: search.genero,
          numeroCelular: search.celular,
          numeroTelefono: search.telefono,
          correo: search.correoElectronico.toLowerCase(),
          direccion: search.direccion.toUpperCase(),
          departamento:
            departamento === "" ? "---" : departamento || departamento.codigo,
          ciudad: ciudad === "" ? "-----" : ciudad,
          agencia: agencia === "" ? "-----" : agencia,
          cargo: cargo,
          tipoContrato: tipoContrato,
          fechaInicioContrato: new Date(search.fechaInicioContrato),
          fechaFinContrato: new Date(search.fechaFinContrato),
          observations: search.observations,
          createdAt: new Date(),
          createdBy: user.id,
          docCedula: docCedula,
          docContrato: docContrato,
          docInfemp: docInfemp,
          docHV: docHV,
          docEps: docEps,
          docCajaCompensacion: docCajaCompensacion,
          docOtroSi: docOtroSi,
          docExaIngreso: docExaIngreso,
          docARL: docARL,
          docEscolaridad: docEscolaridad,
          docOtros: docOtros,
          fechaActualizacion: actualizar === "" ? null : new Date(),
          estudios: estudiosAgr.agregados,
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
              razonSocial: `${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}`,
              tipoFormulario: "empleados",
              rowId: search.cedula,
              codigo: data.id,
              type: "creacion",
            };
            sendMail2(mail)
              .then(() => {
                filesEmployee(formData)
                  .then(() => {
                    setLoading(false);
                    setFiles([]);
                    Swal.fire({
                      title: "¡Creación exitosa!",
                      text: `El empleado: "${data.primerApellido} ${data.segundoApellido} ${data.primerNombre} ${data.otrosNombres}" con Número 
                          de documento: "${data.rowId}", se ha registrado de manera exitosa`,
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
            }); /* .then(() => {
                window.location.reload();
              }); */
          });
      }
    });
  };

  //funcion para actualizar empleados
  const handleUpdate = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está segur@?",
      text: `Se realizará la actualización del empleado: "${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${
        search.otrosNombres !== "" ? search.otrosNombres.toUpperCase() : ""
      }", con número de identificación: ${search.cedula}.`,
      icon: "question",
      confirmButtonText: "Aceptar",
      confirmButtonColor: "#198754",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed }) => {
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
          /* rowId: search.cedula,
          numeroDocumento: search.cedula, */
          estado: "Actualizado",
          tipoDocumento: document,
          /* primerApellido: search.primerApellido.toUpperCase(),
          segundoApellido: search.segundoApellido.toUpperCase(),
          primerNombre: search.primerNombre.toUpperCase(),
          otrosNombres: search.otrosNombres !== "" ? search.otrosNombres.toUpperCase() : "", */
          fechaNacimiento: new Date(search.fechaNacimiento),
          genero: search.genero,
          numeroCelular: search.celular,
          numeroTelefono: search.telefono,
          correo: search.correoElectronico.toLowerCase(),
          direccion: search.direccion.toUpperCase(),
          departamento: departamento === "" ? "---" : departamento.codigo,
          ciudad: ciudad === "" ? "-----" : ciudad,
          agencia: agencia === "" ? "-----" : agencia,
          cargo: cargo,
          tipoContrato: tipoContrato,
          fechaInicioContrato:
            search.fechaInicioContrato !== null ||
            search.fechaInicioContrato !== ""
              ? new Date(search.fechaInicioContrato)
              : "",
          fechaFinContrato:
            search.fechaFinContrato !== null || search.fechaFinContrato !== ""
              ? new Date(search.fechaFinContrato)
              : "",
          observations: search.observations,
          docCedula: docCedula,
          docContrato: docContrato,
          docInfemp: docInfemp,
          docHV: docHV,
          docEps: docEps,
          docCajaCompensacion: docCajaCompensacion,
          docOtroSi: docOtroSi,
          docExaIngreso: docExaIngreso,
          docARL: docARL,
          docEscolaridad: docEscolaridad,
          docOtros: docOtros,
          fechaActualizacion: actualizar === "" ? null : new Date(),
          estudios: estudiosAgr.agregados,
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
        updateEmpleado(search.id, body)
          .then(({ data }) => {
            const info = {
              accion: "1",
            };
            updateBitacora(user.email, info);
            const mail = {
              agencia: agencia.description,
              razonSocial: `${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}`,
              tipoFormulario: "empleados",
              rowId: search.cedula,
              codigo: search.id,
              type: "actualizacion",
            };
            /* const formData = new FormData(); */
            formData.append(
              "razonSocial",
              `${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}`
            );
            formData.append("agencia", `${agencia.description}`);
            formData.append("tipoFormulario", `empleados`);
            sendMail2(mail)
              .then(() => {
                filesEmployee(formData)
                  .then(() => {
                    setLoading(false);
                    setFiles([]);
                    Swal.fire({
                      title: "¡Actualización exitosa!",
                      text: `El empleado: "${data.primerApellido} ${data.segundoApellido} ${data.primerNombre} ${data.otrosNombres}" con Número 
                          de documento: "${data.rowId}", se ha actualizado de manera exitosa`,
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
                    });
                  });
              })
              .catch((err) => {
                setLoading(false);
                deleteFile(folderName);
                Swal.fire({
                  title: "¡Ha ocurrido un error!",
                  text: `
            Ha ocurrido un error al momento de enviar el correo, intente de nuevo.
            Si el problema persiste por favor comuniquese con el área de sistemas.`,
                  icon: "error",
                  showConfirmButton: true,
                  confirmButtonColor: "#198754",
                  confirmButtonText: "Aceptar",
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
            }); /* .then(() => {
                window.location.reload();
              }); */
          });
      }
    });
  };

  const handleRevisado = (e) => {
    e.preventDefault();
    const body = {
      /* estado: 'Revisado', */
      review: 1,
    };
    updateEmployee(search.id, body)
      .then(({ data }) => {
        Swal.fire({
          title: "¡revisión exitosa!",
          text: `El empleado: "${data.primerApellido} ${data.segundoApellido} ${data.primerNombre} ${data.otrosNombres}" con Número 
          de documento: "${data.rowId}", se ha revisado de manera exitosa`,
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
        Swal.fire({
          title: "¡Ha ocurrido un error!",
          text: `
          Hubo un error al momento de guardar la informacion del empleado, intente de nuevo.
          Si el problema persiste por favor comuniquese con el área de sistemas.`,
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      });
  };

  const handleDevolver = (e) => {
    e.preventDefault();
    Swal.fire({
      input: "textarea",
      inputLabel: "Razón",
      inputPlaceholder: "Ingrese aquí la razón de devolución...",
      inputAttributes: {
        "aria-label": "Ingrese la nota acá.",
      },
      inputValidator: (value) => {
        if (!value) {
          return "¡En necesario escribir algo!";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Cancelar",
    }).then(({ isConfirmed, value: input }) => {
      if (isConfirmed && input) {
        setLoading(true);
        const body = {
          id: search.id,
          estado: "Devuelto",
          rowId: search.cedula,
          razonSocial: `${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}`,
          returnReason: input,
        };
        updateAsReturn(body)
          .then(({ data }) => {
            setLoading(false);
            Swal.fire({
              title: "¡Devolución exitosa!",
              text: `La solicitud de creación del empleado: "${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}" con Número 
              de documento: "${
                search.cedula
              }", se ha devuelto de manera exitosa.`,
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
            Swal.fire({
              title: "¡Ha ocurrido un error!",
              text: `
              Hubo un error al momento de guardar la informacion del empleado, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          });
      }
    });
  };

  const handleCreado = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Estás segur@?",
      text: "Se marca este empleado en estado creado en nuestro sistema",
      confirmButtonColor: "green",
      confirmButtonText: "Confirmo",
      showCancelButton: true,
      cancelButtonText: "Regresar",
      cancelButtonColor: "red",
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        setLoading(true);
        const body = {
          id: search.id,
          estado: "Creado",
          rowId: search.cedula,
          tipoDocumento: document,
          razonSocial: `${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}`,
        };
        updateAsCreated(body)
          .then(({ data }) => {
            setLoading(false);
            Swal.fire({
              title: "¡Excelente!",
              text: `El empleado: "${search.primerApellido.toUpperCase()} ${search.segundoApellido.toUpperCase()} ${search.primerNombre.toUpperCase()} ${search.otrosNombres.toUpperCase()}" con Número 
              de documento: "${
                search.cedula
              }", se ha marcado como creado en el sistema.`,
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
            Swal.fire({
              title: "¡Ha ocurrido un error!",
              text: `
              Hubo un error al momento de guardar la informacion del empleado, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
              icon: "error",
              confirmButtonText: "Aceptar",
            });
          });
      }
    });
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
    window.addEventListener("resize", handleResize);
    handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto

    // Elimina el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //funcion para si se ha subido o no un documento soporte del empleado
  const TextOfBinary = ({ valor }) => {
    const [labelColor, setLabelColor] = useState("");
    const [nuevoTexto, setNuevoTexto] = useState("");
    useEffect(() => {
      if (valor === 1) {
        setLabelColor("#008F39");
        setNuevoTexto("Cargado:");
      } else if (valor === 0) {
        setLabelColor("#CB3234");
        setNuevoTexto("No fue cargado");
      } else {
        setLabelColor(null);
        setNuevoTexto("");
      }
    }, [valor]);

    return (
      <label className="" style={{ color: labelColor, height: 18 }}>
        <strong className="">
          {nuevoTexto} {/* {mostrarImagen(valor)} */}{" "}
          {/* <img src={LogoPdf} style={{width:100}}></img> */}
        </strong>
      </label>
    );
  };

  const handleAddStudies = (e) => {
    e.preventDefault();
    if (editIndex === null) {
      if (currentStudy.si) {
        if (
          infoStudy.nivelEstudio === "" ||
          infoStudy.currentStudy === "" ||
          infoStudy.typeStudy === "" ||
          infoStudy.establecimiento === "" ||
          infoStudy.semestre === ""
        ) {
          return 0;
        }
        const list = [...estudiosAgr.agregados];
        const newStudy = {
          nivel: infoStudy.nivelEstudio,
          estado: "En Curso",
          titulo: infoStudy.typeStudy.toUpperCase(),
          establecimiento: infoStudy.establecimiento.toUpperCase(),
          semestre: infoStudy.semestre,
        };

        list.push(newStudy);
        setEstudiosAgr({
          agregados: list,
        });
        handleClearStudies();
      } else if (currentStudy.no) {
        if (
          infoStudy.nivelEstudio === "" ||
          infoStudy.currentStudy === "" ||
          infoStudy.typeStudy === "" ||
          infoStudy.establecimiento === ""
        ) {
          return 0;
        }
        const list = [...estudiosAgr.agregados];
        const newStudy = {
          nivel: infoStudy.nivelEstudio,
          estado: "Finalizado",
          titulo: infoStudy.typeStudy.toUpperCase(),
          establecimiento: infoStudy.establecimiento.toUpperCase(),
          semestre: infoStudy.semestre,
        };

        list.push(newStudy);
        setEstudiosAgr({
          agregados: list,
        });
        handleClearStudies();
      }
    } else {
      if (currentStudy.si) {
        if (
          infoStudy.nivelEstudio === "" ||
          infoStudy.currentStudy === "" ||
          infoStudy.typeStudy === "" ||
          infoStudy.establecimiento === "" ||
          infoStudy.semestre === ""
        ) {
          return 0;
        }
        const newStudy = {
          nivel: infoStudy.nivelEstudio,
          estado: "En Curso",
          titulo: infoStudy.typeStudy.toUpperCase(),
          establecimiento: infoStudy.establecimiento.toUpperCase(),
          semestre: infoStudy.semestre,
        };
        // Actualizar
        const newList = [...estudiosAgr.agregados];
        newList[editIndex] = newStudy;
        setEstudiosAgr({
          agregados: newList,
        });
        setEditIndex(null);
        handleClearStudies();
      } else if (currentStudy.no) {
        if (
          infoStudy.nivelEstudio === "" ||
          infoStudy.currentStudy === "" ||
          infoStudy.typeStudy === "" ||
          infoStudy.establecimiento === ""
        ) {
          return 0;
        }
        const newStudy = {
          nivel: infoStudy.nivelEstudio,
          estado: "Finalizado",
          titulo: infoStudy.typeStudy.toUpperCase(),
          establecimiento: infoStudy.establecimiento.toUpperCase(),
          semestre: "",
        };

        // Actualizar
        const newList = [...estudiosAgr.agregados];
        newList[editIndex] = newStudy;
        setEstudiosAgr({
          agregados: newList,
        });
        setEditIndex(null);
        handleClearStudies();
      }
    }
  };

  const handleClearStudies = () => {
    setInfoStudy({
      nivelEstudio: "",
      currentStudy: "",
      typeStudy: "",
      establecimiento: "",
      semestre: "",
    });
    setCurrentStudy({
      si: false,
      no: false,
    });
  };

  const handleChangeStudies = (e) => {
    const { id, value } = e.target;
    setInfoStudy({
      ...infoStudy,
      [id]: value,
    });
  };

  const handleClickCancel = (e) => {
    setInfoStudy({
      currentStudy: "",
      establecimiento: "",
      nivelEstudio: "",
      semestre: "",
      typeStudy: "",
    });
    setCurrentStudy({
      no: false,
      si: false,
    });
    setEditIndex(null);
  };

  const handleDisabledDate = () => {
    /* (search.fechaInicioContrato === '' && (tipoContrato !== 'FIJO' || tipoContrato !== 'APRENDIZAJE')) ? true : false */
    if (tipoContrato === "FIJO" || tipoContrato === "APRENDIZAJE") {
      if (search.fechaInicioContrato !== "") {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

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
                    {actualizar ? (
                      <strong>CONSULTA DE EMPLEADO</strong>
                    ) : (
                      <strong>FORMULARIO DE EMPLEADO</strong>
                    )}
                  </label>
                  {actualizar && search.estado === "Devuelto" && (
                    <label style={{ fontSize: 20 }}>
                      <strong className="text-danger">DEVUELTO</strong>
                    </label>
                  )}
                  {actualizar && search.review && (
                    <label style={{ fontSize: 20 }}>
                      <strong className="text-warning">REVISADO</strong>
                    </label>
                  )}
                  {actualizar && search.estado === "Creado" && (
                    <label style={{ fontSize: 20 }}>
                      <strong className="text-success">CREADO</strong>
                    </label>
                  )}
                </Fade>
                <hr className="my-1" />
                {/* {actualizar === "SI" && (
                  <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2">
                    <strong>CONSULTA</strong>
                  </label>
                )} */}
              </center>
            </div>
          </section>
        </center>
        <form
          className=""
          onSubmit={actualizar === "" ? handleSubmit : handleUpdate}
        >
          <div className="bg-light rounded shadow-sm p-2 mb-3">
            <div className="d-flex flex-column gap-1 w-100">
              <div style={{ fontSize: 13 }}>
                <label className="fw-bold" style={{ fontSize: 15 }}>
                  INFORMACIÓN DEL EMPLEADO
                </label>

                <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
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
                      {/* <span className="validity fw-bold"></span> */}
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">Tipo documento:</label>
                    <select
                      ref={selectDocumentoRef}
                      style={{ width: 245 }}
                      value={document}
                      className="form-select form-select-sm w-100"
                      onChange={(e) => setDocument(e.target.value)}
                      required
                    >
                      <option selected value="" disabled>
                        -- Seleccione el tipo de documento --
                      </option>
                      {documentos
                        .sort((a, b) => a.id - b.id)
                        .map((elem) => (
                          <option id={elem.id} value={elem.codigo}>
                            {elem.id + " - " + elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Nombres */}
                <div className="row row-cols-sm-4 mt-2">
                  <div className="d-flex flex-column align-items-start ">
                    <label className="me-1 w-25">1er.Apellido:</label>
                    <input
                      id="primerApellido"
                      type="text"
                      className="form-control form-control-sm "
                      min={0}
                      style={{ textTransform: "uppercase" }}
                      required
                      autoComplete="off"
                      placeholder="Campo obligatorio"
                      value={search.primerApellido}
                      onChange={handlerChangeSearch}
                      disabled={exist ? true : false}
                    />
                  </div>
                  <div className="d-flex flex-column ">
                    <label className="me-1 w-25">2do.Apellido:</label>
                    <input
                      id="segundoApellido"
                      type="text"
                      className="form-control form-control-sm "
                      min={0}
                      required
                      disabled={exist ? true : false}
                      style={{ textTransform: "uppercase" }}
                      placeholder="Campo obligatorio"
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
                      style={{ textTransform: "uppercase" }}
                      required
                      disabled={exist ? true : false}
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
                      disabled={exist ? true : false}
                      style={{ textTransform: "uppercase" }}
                      placeholder="(Campo Opcional)"
                      value={search.otrosNombres}
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* fecha de nacimiento y genero */}
                <div className="row row-cols-sm-2 mt-2 ">
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">Fecha de nacimiento:</label>
                    <input
                      value={
                        search.fechaNacimiento === ""
                          ? search.fechaNacimiento
                          : new Date(search.fechaNacimiento)
                              .toISOString()
                              .split("T")[0]
                      }
                      onChange={handlerChangeSearch}
                      id="fechaNacimiento"
                      type="date"
                      className="form-control form-control-sm "
                      pattern="[0-9]"
                      placeholder="Campo obligatorio"
                      autoComplete="off"
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label className="me-1">Género:</label>
                    <select
                      id="genero"
                      value={search.genero}
                      className="form-select form-select-sm w-100"
                      onChange={(e) => handlerChangeSearch(e)}
                      required
                    >
                      <option selected value="" disabled>
                        -- Seleccione el género --
                      </option>
                      <option id="MASCULINO" value="MASCULINO">
                        MASCULINO
                      </option>
                      <option id="FEMENINO" value="FEMENINO">
                        FEMENINO
                      </option>
                      <option id="OTRO" value="OTRO">
                        OTRO
                      </option>
                    </select>
                  </div>
                </div>

                {/* telefono y celular */}
                <div className="row row-cols-sm-2 mt-1 ">
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
                      onChange={(e) => setDepartamento(e.target.value)}
                      value={departamento.codigo}
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
                            value={elem.codigo}
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
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                    >
                      <option selected value="" disabled>
                        -- Seleccione la Ciudad --
                      </option>
                      {ciudades
                        .sort((a, b) => a.id - b.id)
                        .map((elem) =>
                          elem.id == departamento ||
                          elem.id == departamento.codigo ? (
                            <option id={elem.id} value={elem.codigo}>
                              {elem.description}
                            </option>
                          ) : null
                        )}
                    </select>
                  </div>
                </div>

                {/* agencia y cargo */}
                <div className="row row-cols-sm-2 mt-1 mb-1">
                  <div className="d-flex flex-column ">
                    <label className="">Agencia:</label>
                    <select
                      ref={selectBranchRef}
                      className="form-select form-select-sm w-100"
                      required
                      value={agencia}
                      onChange={(e) => setAgencia(e.target.value)}
                    >
                      <option selected value="" disabled>
                        -- Seleccione la agencia --
                      </option>
                      {agencias
                        .sort((a, b) => a.id - b.id)
                        .map((elem) => (
                          <option id={elem.id} value={elem.description}>
                            {elem.id + " - " + elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="d-flex flex-column">
                    <label className="">Cargo:</label>
                    <select
                      ref={selectCargoRef}
                      className="form-select form-select-sm w-100"
                      required
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                    >
                      <option selected value="" disabled>
                        -- Seleccione el cargo --
                      </option>
                      {cargos
                        ?.sort((a, b) =>
                          a.description.localeCompare(b.description)
                        )
                        ?.map((elem) => (
                          <option id={elem.id} value={elem.description}>
                            {elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Tipo de contrato, fecha inicio, fecha final, fecha final real */}
                <div className="row row-cols-sm-3 mt-2">
                  <div className="d-flex flex-column ">
                    <label className="">Tipo de Contrato:</label>
                    <select
                      ref={selectBranchRef}
                      className="form-select form-select-sm w-100"
                      required
                      value={tipoContrato}
                      onChange={(e) => setTipoContrato(e.target.value)}
                    >
                      <option selected value="" disabled>
                        -- Seleccione el tipo de contrato --
                      </option>
                      {contratos
                        ?.sort((a, b) => a.id - b.id)
                        ?.map((elem) => (
                          <option id={elem.id} value={elem.description}>
                            {elem.description}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* {JSON.stringify(tipoContrato)} */}
                  <div className="d-flex flex-column ">
                    <label className="me-1 w-100">Fecha inicio:</label>
                    <input
                      id="fechaInicioContrato"
                      type="date"
                      className="form-control form-control-sm "
                      /* max={new Date().toISOString().split("T")[0]} */
                      required
                      style={{ textTransform: "uppercase" }}
                      placeholder="Campo obligatorio"
                      value={
                        search.fechaInicioContrato === ""
                          ? search.fechaInicioContrato
                          : new Date(search.fechaInicioContrato)
                              .toISOString()
                              .split("T")[0]
                      }
                      /* value={search.fechaInicioContrato} */
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>

                  <div className="d-flex flex-column ">
                    <label className="me-1 w-100">Fecha final:</label>
                    <input
                      id="fechaFinContrato"
                      type="date"
                      className="form-control form-control-sm "
                      min={search.fechaInicioContrato}
                      required={handleDisabledDate()}
                      disabled={handleDisabledDate()}
                      style={{ textTransform: "uppercase" }}
                      placeholder="Campo obligatorio"
                      value={
                        actualizar &&
                        (search.fechaFinContrato !== null ||
                          search.fechaFinContrato !== "")
                          ? new Date(search.fechaFinContrato)
                              .toISOString()
                              .split("T")[0]
                          : actualizar &&
                            (search.fechaFinContrato === null ||
                              search.fechaFinContrato === "")
                          ? ""
                          : search.fechaFinContrato
                      }
                      /* value={search.fechaFinContrato} */
                      onChange={handlerChangeSearch}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* estudia actualmente, que estudia, establecimiento, semestre */}
              </div>

              <hr className="my-1 mt-2" />

              {/* Formación educativa */}
              <div style={{ fontSize: 13 }}>
                <label className="fw-bold" style={{ fontSize: 15 }}>
                  FORMACIÓN EDUCATIVA
                </label>
                <div className="row row-cols-sm-2 mt-2">
                  <div className="d-flex flex-column ">
                    <label className="me-1 w-100">Nivel del estudio:</label>
                    <select
                      ref={selectBranchRef}
                      className="form-select form-select-sm w-100"
                      id="nivelEstudio"
                      value={infoStudy.nivelEstudio}
                      onChange={(e) => handleChangeStudies(e)}
                    >
                      <option selected value="" disabled>
                        -- Seleccione el nivel de estudio --
                      </option>
                      <option id="BASICA SECUNDARIA" value="BASICA SECUNDARIA">
                        BASICA SECUNDARIA
                      </option>
                      <option id="ACADÉMICA TECNICA" value="ACADÉMICA TECNICA">
                        ACADÉMICA TECNICA
                      </option>
                      <option
                        id="TÉCNICO PROFESIONAL"
                        value="TÉCNICO PROFESIONAL"
                      >
                        TÉCNICO PROFESIONAL
                      </option>
                      <option id="TECNOLÓGICO" value="TECNOLÓGICO">
                        TECNOLÓGICO
                      </option>
                      <option
                        id="PROFESIONAL UNIVERSITARIO"
                        value="PROFESIONAL UNIVERSITARIO"
                      >
                        PROFESIONAL UNIVERSITARIO
                      </option>
                      <option id="ESPECIALIZACIÓN" value="ESPECIALIZACIÓN">
                        ESPECIALIZACIÓN
                      </option>
                      <option id="MAESTRÍA" value="MAESTRÍA">
                        MAESTRÍA
                      </option>
                      <option id="DOCTORADO" value="DOCTORADO">
                        DOCTORADO
                      </option>
                      <option id="POS DOCTORADO" value="POS DOCTORADO">
                        POS DOCTORADO
                      </option>
                    </select>
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <label>¿Estudia actualmente?</label>
                    <div className="modalidad-pago w-100 justify-content-center align-items-center d-flex gap-4">
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "1rem", // Cambia el tamaño del texto del label
                          },
                        }}
                        label="Si"
                        control={
                          <Checkbox
                            placeholder="si"
                            color="error"
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 21 }, // Cambia el tamaño del ícono del checkbox
                            }}
                            checked={currentStudy.si}
                            onChange={() => handleEstudia("si")}
                          />
                        }
                      />
                      <FormControlLabel
                        sx={{
                          "& .MuiFormControlLabel-label": {
                            fontSize: "1rem", // Cambia el tamaño del texto del label
                          },
                        }}
                        label="No"
                        control={
                          <Checkbox
                            placeholder="no"
                            color="error"
                            sx={{
                              "& .MuiSvgIcon-root": { fontSize: 21 }, // Cambia el tamaño del ícono del checkbox
                            }}
                            checked={currentStudy.no}
                            onChange={() => handleEstudia("no")}
                          />
                        }
                      />
                    </div>
                  </div>
                </div>
                {currentStudy.si ? (
                  <div className="row row-cols-sm-3 mt-1">
                    <div className="d-flex flex-column ">
                      <label className="me-1 w-100">Que estudia:</label>
                      <input
                        id="typeStudy"
                        type="text"
                        className="form-control form-control-sm "
                        min={0}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Campo obligatorio"
                        value={infoStudy.typeStudy}
                        onChange={(e) => handleChangeStudies(e)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column ">
                      <label className="me-1 w-100">Establecimiento:</label>
                      <input
                        id="establecimiento"
                        type="text"
                        className="form-control form-control-sm "
                        min={0}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Campo obligatorio"
                        value={infoStudy.establecimiento}
                        onChange={(e) => handleChangeStudies(e)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column">
                      <label className="me-1 ">Semestre:</label>
                      <input
                        id="semestre"
                        type="number"
                        className="form-control form-control-sm w-100"
                        min={0}
                        style={{
                          textTransform: "uppercase",
                          textDecoration: "none",
                        }}
                        value={infoStudy.semestre}
                        placeholder="Campo obligatorio"
                        onChange={(e) => handleChangeStudies(e)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row row-cols-sm-2 mt-1">
                    <div className="d-flex flex-column ">
                      <label className="me-1 w-100">Que estudió:</label>
                      <input
                        id="typeStudy"
                        type="text"
                        className="form-control form-control-sm "
                        min={0}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Campo obligatorio"
                        value={infoStudy.typeStudy}
                        onChange={(e) => handleChangeStudies(e)}
                        autoComplete="off"
                      />
                    </div>
                    <div className="d-flex flex-column ">
                      <label className="me-1 w-100">Establecimiento:</label>
                      <input
                        id="establecimiento"
                        type="text"
                        className="form-control form-control-sm "
                        min={0}
                        style={{ textTransform: "uppercase" }}
                        placeholder="Campo obligatorio"
                        value={infoStudy.establecimiento}
                        onChange={(e) => handleChangeStudies(e)}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                )}
                {/* {JSON.stringify(infoStudy)} */}
                {editIndex !== null ? (
                  <div className="link-files gap-3">
                    <Button
                      type="submit"
                      className="d-flex align-items-center justify-content-center btn btn-sm btn-primary w-100 mt-3"
                      onClick={(e) => handleAddStudies(e)}
                    >
                      ACTUALIZAR ESTUDIO
                      <VscGitPullRequestGoToChanges
                        className="ms-1"
                        style={{ width: 20, height: 20 }}
                      />
                    </Button>
                    <Button
                      type="submit"
                      className="d-flex align-items-center justify-content-center btn btn-sm btn-danger w-100 mt-3"
                      onClick={(e) => handleClickCancel(e)}
                    >
                      CANCELAR
                      <MdOutlineCancel
                        className="ms-1"
                        style={{ width: 20, height: 20 }}
                      />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    className="d-flex align-items-center justify-content-center btn btn-sm btn-primary w-100 mt-3"
                    onClick={(e) => handleAddStudies(e)}
                  >
                    AGREGAR ESTUDIO
                    <MdAssignmentAdd
                      className="ms-1"
                      style={{ width: 20, height: 20 }}
                    />
                  </Button>
                )}
              </div>
              <div /* className="d-flex" */ className="ancho-tabla">
                <Tablestudies
                  formData={infoStudy}
                  setFormData={setInfoStudy}
                  currentStudy={currentStudy}
                  setCurrentStudy={setCurrentStudy}
                  editIndex={editIndex}
                  setEditIndex={setEditIndex}
                  data={estudiosAgr.agregados}
                  list={estudiosAgr}
                  setList={setEstudiosAgr}
                />
              </div>
              <hr className="my-1" />
              <div className="w-100 mt-1" style={{ fontSize: 13 }}>
                <label className="fw-bold" style={{ fontSize: 15 }}>
                  DOCUMENTOS OBLIGATORIOS
                </label>

                {/* cedula y contrato */}
                <div className="row row-cols-sm-2 ">
                  <div className="">
                    <div className="w-100">
                      <label className="fw-bold mt-1 me-2">
                        COPIA CÉDULA:{" "}
                      </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docCedula}></TextOfBinary>
                          {docCedula === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`Cedula-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row rounded-2 w-100">
                      <input
                        id="Cedula"
                        type="file"
                        /* disabled={exist === true ? true : false} */
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
                    <div>
                      <label className="fw-bold mt-1 ">COPIA CONTRATO: </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docContrato}></TextOfBinary>
                          {docContrato === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`Contrato-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="d-flex flex-row rounded-2 w-100">
                      <input
                        id="Contrato"
                        type="file"
                        placeholder="Contrato"
                        className="form-control form-control-sm border border-5 rounded-3 w-100"
                        accept=".pdf"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
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

              {/* infolaft y hoja de vida */}
              <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
                <div className="">
                  <div>
                    <label className="fw-bold mt-1 ">INFOLAFT: </label>
                    {exist && (
                      <div className="link-files">
                        <TextOfBinary valor={docInfemp}></TextOfBinary>
                        {docInfemp === 1 && (
                          <CarpetaArchivoLink
                            carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                            archivo={`Infemp-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row rounded-2 w-100">
                    <input
                      id="Infemp"
                      type="file"
                      placeholder="Infemp"
                      className="form-control form-control-sm border border-5 rounded-3 w-100"
                      accept=".pdf"
                      style={{ backgroundColor: "#f3f3f3" }}
                      /* disabled={exist === true ? true : false} */
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
                    <div>
                      <label className="fw-bold me-2">HOJA DE VIDA: </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docHV}></TextOfBinary>
                          {docHV === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`HV-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row">
                      <input
                        id="docHV"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
                        onChange={(e) => (
                          handleFileChange("HV", e),
                          setDocHV(1),
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

              {/* eps y caja de compensacion */}
              <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
                <div className="">
                  <div>
                    <label className="fw-bold mt-1 ">AFILIACION EPS: </label>
                    {exist && (
                      <div className="link-files">
                        <TextOfBinary valor={docEps}></TextOfBinary>
                        {docEps === 1 && (
                          <CarpetaArchivoLink
                            carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                            archivo={`Eps-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row rounded-2 w-100">
                    <input
                      id="docEps"
                      type="file"
                      placeholder="docEps"
                      className="form-control form-control-sm border border-5 rounded-3 w-100"
                      accept=".pdf"
                      style={{ backgroundColor: "#f3f3f3" }}
                      /* disabled={exist === true ? true : false} */
                      onChange={(e) => (
                        handleFileChange("Eps", e),
                        setDocEps(1),
                        FileChange(e, 5)
                      )}
                    />
                    {selectedFiles[5] && (
                      <div
                        className="d-flex justify-content-start ps-1 pt-1"
                        style={{ width: 50 }}
                      >
                        <a
                          href={URL.createObjectURL(selectedFiles[5])}
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
                    <div>
                      <label className="fw-bold me-2">
                        CAJA DE COMPENSACION:{" "}
                      </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary
                            valor={docCajaCompensacion}
                          ></TextOfBinary>
                          {docCajaCompensacion === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`CajaCompensacion-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row">
                      <input
                        id="docCajaCompensacion"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
                        onChange={(e) => (
                          handleFileChange("CajaCompensacion", e),
                          setDocCajaCompensacion(1),
                          FileChange(e, 6)
                        )}
                        className="form-control form-control-sm border border-5 rounded-3"
                        accept=".pdf"
                      />
                      {selectedFiles[6] && (
                        <div
                          className="d-flex justify-content-start ps-2 pt-1"
                          style={{ width: 60 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[6])}
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

              {/* otrosi y examen ingreso */}
              <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
                <div className="">
                  <div>
                    <label className="fw-bold mt-1 ">OTRO SI: </label>
                    {exist && (
                      <div className="link-files">
                        <TextOfBinary valor={docOtroSi}></TextOfBinary>
                        {docOtroSi === 1 && (
                          <CarpetaArchivoLink
                            carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                            archivo={`OtroSi-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row rounded-2 w-100">
                    <input
                      id="docOtroSi"
                      type="file"
                      placeholder="docOtroSi"
                      className="form-control form-control-sm border border-5 rounded-3 w-100"
                      accept=".pdf"
                      style={{ backgroundColor: "#f3f3f3" }}
                      /* disabled={exist === true ? true : false} */
                      onChange={(e) => (
                        handleFileChange("OtroSi", e),
                        setDocOtroSi(1),
                        FileChange(e, 7)
                      )}
                    />
                    {selectedFiles[7] && (
                      <div
                        className="d-flex justify-content-start ps-1 pt-1"
                        style={{ width: 50 }}
                      >
                        <a
                          href={URL.createObjectURL(selectedFiles[7])}
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
                    <div>
                      <label className="fw-bold me-2">
                        EXAMEN DE INGRESO:{" "}
                      </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docExaIngreso}></TextOfBinary>
                          {docExaIngreso === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`ExamenIngreso-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row">
                      <input
                        id="docExaIngreso"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
                        onChange={(e) => (
                          handleFileChange("ExamenIngreso", e),
                          setDocExaIngreso(1),
                          FileChange(e, 8)
                        )}
                        className="form-control form-control-sm border border-5 rounded-3"
                        accept=".pdf"
                      />
                      {selectedFiles[8] && (
                        <div
                          className="d-flex justify-content-start ps-2 pt-1"
                          style={{ width: 60 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[8])}
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

              {/* escolaridad y ARL */}
              <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
                <div className="">
                  <div>
                    <label className="fw-bold mt-1 ">ESCOLARIDAD: </label>
                    {exist && (
                      <div className="link-files">
                        <TextOfBinary valor={docEscolaridad}></TextOfBinary>
                        {docEscolaridad === 1 && (
                          <CarpetaArchivoLink
                            carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                            archivo={`Escolaridad-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-row rounded-2 w-100">
                    <input
                      id="docEscolaridad"
                      type="file"
                      placeholder="docEscolaridad"
                      className="form-control form-control-sm border border-5 rounded-3 w-100"
                      accept=".pdf"
                      style={{ backgroundColor: "#f3f3f3" }}
                      /* disabled={exist === true ? true : false} */
                      onChange={(e) => (
                        handleFileChange("Escolaridad", e),
                        setDocEscolaridad(1),
                        FileChange(e, 9)
                      )}
                    />
                    {selectedFiles[9] && (
                      <div
                        className="d-flex justify-content-start ps-1 pt-1"
                        style={{ width: 50 }}
                      >
                        <a
                          href={URL.createObjectURL(selectedFiles[9])}
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
                    <div>
                      <label className="fw-bold me-2">AFILIACION ARL: </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docARL}></TextOfBinary>
                          {docARL === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`Arl-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row">
                      <input
                        id="docARL"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
                        onChange={(e) => (
                          handleFileChange("Arl", e),
                          setDocARL(1),
                          FileChange(e, 10)
                        )}
                        className="form-control form-control-sm border border-5 rounded-3"
                        accept=".pdf"
                      />
                      {selectedFiles[10] && (
                        <div
                          className="d-flex justify-content-start ps-2 pt-1"
                          style={{ width: 60 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[10])}
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

              {/* otros */}
              <div className="row row-cols-sm-2" style={{ fontSize: 13 }}>
                <div className="d-flex flex-row">
                  <div className="d-flex flex-column mt-1 w-100">
                    <div>
                      <label className="fw-bold me-2">OTROS: </label>
                      {exist && (
                        <div className="link-files">
                          <TextOfBinary valor={docOtros}></TextOfBinary>
                          {docOtros === 1 && (
                            <CarpetaArchivoLink
                              carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`}
                              archivo={`Otros-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="d-flex flex-row">
                      <input
                        id="DocOtros"
                        type="file"
                        style={{ backgroundColor: "#f3f3f3" }}
                        /* disabled={exist === true ? true : false} */
                        onChange={(e) => (
                          handleFileChange("Otros", e),
                          setDocOtros(1),
                          FileChange(e, 11)
                        )}
                        className="form-control form-control-sm border border-5 rounded-3"
                        accept=".pdf"
                      />
                      {selectedFiles[11] && (
                        <div
                          className="d-flex justify-content-start ps-2 pt-1"
                          style={{ width: 60 }}
                        >
                          <a
                            href={URL.createObjectURL(selectedFiles[11])}
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
            <label className="fw-bold" style={{ fontSize: 15 }}>
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
          {search.estado === "Devuelto" && (
            <div className="d-flex flex-column mb-3 w-100">
              <label className="fw-bold" style={{ fontSize: 15 }}>
                Razón de devolución
              </label>
              <textarea
                value={search.returnReason}
                id="returnReason"
                disabled
                className="form-control border border-3"
                style={{ minHeight: 70, maxHeight: 100, fontSize: 12 }}
              ></textarea>
            </div>
          )}
          <Modal show={loading} centered>
            <Modal.Body>
              <div className="d-flex align-items-center">
                <strong className="text-danger" role="status">
                  Cargando...
                </strong>
                <div className="spinner-grow text-danger" role="status"></div>
              </div>
            </Modal.Body>
          </Modal>
          {isMobile ? (
            <div className="d-flex flex-column mb-2 justify-content-center align-items-center gap-2">
              {/* <div className="d-flex flex-column gap-2"> */}
              {actualizar !== "" &&
                user.role === "admin" &&
                search.estado !== "Creado" && (
                  <Button
                    variant="danger"
                    className="d-flex w-100 justify-content-center fw-bold"
                    onClick={(e) => handleDevolver(e)}
                  >
                    DEVOLVER
                  </Button>
                )}
              <Button
                type="submit"
                className="fw-bold p-2 d-flex w-100 justify-content-center"
                onSubmit={actualizar === "" ? handleSubmit : handleUpdate}
              >
                {actualizar === "" ? "REGISTRAR" : "ACTUALIZAR"}
              </Button>
              {actualizar !== "" &&
                user.role === "admin" &&
                search.estado !== "Revisado" &&
                search.estado !== "Creado" && (
                  <Button
                    variant="warning"
                    className="d-flex w-100 justify-content-center fw-bold"
                    onClick={(e) => handleRevisado(e)}
                  >
                    REVISADO
                  </Button>
                )}
              {actualizar !== "" &&
                user.role === "admin" &&
                search.estado !== "Revisado" &&
                search.estado !== "Creado" && (
                  <Button
                    variant="success"
                    className="d-flex w-100 justify-content-center fw-bold"
                    onClick={(e) => handleCreado(e)}
                  >
                    CREADO
                  </Button>
                )}
              <Button
                variant="secondary"
                className="d-flex w-100 justify-content-center"
                onClick={refreshForm}
              >
                CANCELAR
              </Button>
              {/* </div> */}
            </div>
          ) : (
            <div className="d-flex flex-row mb-2 justify-content-end align-items-end">
              <Fade cascade direction="right">
                <div className="d-flex flex-row ">
                  {actualizar !== "" &&
                    user.role === "admin" &&
                    search.estado !== "Creado" && (
                      <Button
                        variant="danger"
                        className="me-3 fw-bold"
                        onClick={(e) => handleDevolver(e)}
                      >
                        DEVOLVER
                      </Button>
                    )}
                  <Button
                    type="submit"
                    className="fw-bold pt-3 pb-3"
                    onSubmit={actualizar === "" ? handleSubmit : handleUpdate}
                  >
                    {actualizar === "" ? "REGISTRAR" : "ACTUALIZAR"}
                  </Button>
                  {actualizar !== "" &&
                    user.role === "admin" &&
                    search.estado !== "Revisado" && (
                      <Button
                        variant="warning"
                        className="ms-3 fw-bold"
                        onClick={(e) => handleRevisado(e)}
                      >
                        REVISADO
                      </Button>
                    )}
                  {actualizar !== "" &&
                    user.role === "admin" &&
                    search.estado !== "Creado" && (
                      <Button
                        variant="success"
                        className="ms-3 fw-bold"
                        onClick={(e) => handleCreado(e)}
                      >
                        CREADO
                      </Button>
                    )}
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
