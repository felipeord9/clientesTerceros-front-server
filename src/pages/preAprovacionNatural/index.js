import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { FaEye } from "react-icons/fa";
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { createProveedor, deleteProveedor } from '../../services/proveedorService';
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllActividad} from '../../services/actividadService';
import { getAllAgencies } from "../../services/agencyService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import { updateBitacora } from '../../services/bitacoraService';

export default function VariosNatural(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [document,setDocument] = useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [departamento,setDepartamento]= useState('');
  const [actividad, setActividad] = useState(null);

  /* inicializar los documentos adjuntos */
  const [docVinculacion,setDocVinculacion]=useState(0);
  const [docComprAntc,setDocComprAntc]=useState(0);
  const [docRut,setDocRut]=useState(0);
  const [docCcio,setDocCcio]=useState(0);
  const [docCrepL,setDocCrepL]=useState(0);
  const [docEf,setDocEf]=useState(0);
  const [docRefcom,setDocRefcom]=useState(0);
  const [docInfemp,setDocInfemp]=useState(0);
  const [docInfrl,setDocInfrl]=useState(0);
  const [docOtros,setDocOtros]=useState(0);
  const [docCerBan, setDocCerBan] = useState(0);
  const [docValAnt,setDocValAnt] = useState(0);

  //------------------------------------------
  /* Variable de todos los pdf y el nombre de la carpeta*/
  /* const [files, setFiles] = useState([]); */
  const [files, setFiles] = useState({
    input1: null,
    input2: null,
    input3: null,
  });
/*   const [folderName, setFolderName] = useState('');
 */
  /* Variable para agregar los pdf */
  /* const handleFileChange = (event, index) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  }; */

  /* Second form */
  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    setFiles(prevFiles => ({ ...prevFiles, [fieldName]: selectedFile }));
  };
  //------------------------------------------

  /* inicializar para hacer la busqueda (es necesario inicializar en array vacio)*/
  const [agencias, setAgencias] = useState([]);
  const [documentos,setDocumentos] = useState([]);
  const [ciudades,setCiudades] = useState([]);
  const [departamentos,setDepartamentos]=useState([]);
  const [actividades, setActividades] = useState([]);

  const [search, setSearch] = useState({
    cedula:'',
    tipoPersona:'1',
    primerApellido:''.toUpperCase(),
    segundoApellido:''.toUpperCase(),
    primerNombre:'',
    otrosNombres:'',
    direccion:'',
    celular:'',
    telefono:'',
    correoElectronico:'',
    correoFacturaElectronica:'',
    observations:'',
    solicitante:'',
    tipoFormulario:'PVN'
  });
  const [loading, setLoading] = useState(false);
  const [invoiceType, setInvoiceType] = useState(false);
  
  /* rama seleccionada de cada variable */
  const selectBranchRef = useRef();
  const selectDocumentoRef=useRef();
  const selectDepartamentoRef=useRef();
  const selectCiudadRef=useRef();
  const selectActividadRef=useRef();

  const limitDeliveryDateField = new Date()
  limitDeliveryDateField.setHours(2)

  /* asignacion de valores a las variables */
  useEffect(()=>{
      getAllAgencies().then((data) => setAgencias(data));
      getAllDocuments().then((data)=>setDocumentos(data));
      getAllDepartamentos().then((data) => setDepartamentos(data));
      getAllCiudades().then((data) => setCiudades(data));
      getAllActividad().then((data)=>setActividades(data));
  },[]);

  const findById = (id, array, setItem) => {
    const item = array.find((elem) => elem.departament_id === id);
    if (item) {
      setItem(item);
    } else {
      setItem(null);
      setCiudad(null);
      selectCiudadRef.current.selectedIndex = 0;
    }
  };

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const idParser = (id) => {
    let numeroComoTexto = id.toString();
    while (numeroComoTexto.length < 8) {
      numeroComoTexto = "0" + numeroComoTexto;
    }
    return numeroComoTexto;
  };

  const getFiles = (e) => {
    const file = e.target.files[0];
    if (file) {
      const nameFile = file.name.split(".");
      const ext = nameFile[nameFile.length - 1];
      const newFile = new File([file], `Archivo-Adjunto.${ext}`, {
        type: file.type,
      });
      /* setFiles(newFile); */
    }
  };

  const changeType = (e) => {
    setSearch({
      ...search,
      idDepartment: "",
    });
    setInvoiceType(!invoiceType);
    /* setClient(null); */
    setCiudad(null);
    selectCiudadRef.current.selectedIndex = 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está segur@?",
        text: "Se realizará el registro del Proveedor",
        icon:'question',
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#198754",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }) .then(({isConfirmed})=>{
      if(isConfirmed){
        setLoading(true);
        const formData = new FormData();

        for (const fieldName in files) {
          if (files[fieldName]) {
            formData.append(fieldName, files[fieldName]);
          }
        }
        //agregamos los pdf a un formdata dependiendo del index que les dimos
        /* const formData = new FormData();
        files.forEach((file, index) => {
          if (file) {
            formData.append(`pdfFile${index}`, file);
          }
        }); */
        //creamos el cuerpo de nuestra instancia
        const body={
          cedula: search.cedula,
          numeroDocumento: search.cedula,
          tipoDocumento: document.codigo,
          tipoPersona: search.tipoPersona,
          razonSocial: search.primerApellido.toUpperCase() +' '+ search.segundoApellido.toUpperCase() +' '+ search.primerNombre.toUpperCase() +' '+ search.otrosNombres.toUpperCase(),
          primerApellido:search.primerApellido.toUpperCase(),
          segundoApellido:search.segundoApellido.toUpperCase(),
          primerNombre:search.primerNombre.toUpperCase(),
          otrosNombres:search.otrosNombres.toUpperCase(),
          departamento: departamento.codigo,
          ciudad: ciudad.codigo,
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono:search.telefono,
          correoElectronico: search.correoElectronico.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          actividadEconomica: actividad.id,         
          tipoDocRepLegal: document.codigo,
          numeroDocRepLegal: search.cedula,
          nameRepLegal:search.primerNombre.toUpperCase(),
          apellidoRepLegal:search.primerApellido.toUpperCase(),
          observations:search.observations,
          createdAt: new Date(),
          createdBy: user.rowId.toUpperCase(),
          solicitante:search.solicitante.toUpperCase(),
          docVinculacion:docVinculacion,
          docComprAntc:docComprAntc,
          docRut:docRut,
          docCcio:docCcio,
          docCrepL:docCrepL,
          docEf:docEf,
          docRefcom:docRefcom,
          docInfemp:docInfemp,
          docInfrl:docInfrl,
          docValAnt:docValAnt,
          docCerBan:docCerBan,
          docOtros:docOtros,
          agencia: agencia.id,
          tipoFormulario:search.tipoFormulario,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();
        formData.append('originalFolderName',originalFolderName);
        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        createProveedor(body)
        .then(({data}) => {
          const info={
            accion:'1',
          }
          updateBitacora(user.email,info)
          fileSend(formData)
          .then(()=>{
            setLoading(false)
            setFiles([])
            Swal.fire({
              title: 'Creación exitosa!',
              text: `El Proveedor "${data.razonSocial}" con Número 
              de documento "${data.cedula}" se ha registrado de manera exitosa`,
              icon: 'success',
              position:'center',
              showConfirmButton: true,
              confirmButtonColor:'#198754',
              confirmButtonText:'Aceptar',
            })
            .then(()=>{
              window.location.reload();
            })
          }) 
          .catch((err)=>{
            setLoading(false);
            if(!data){
              deleteFile(folderName);
            }else{
              deleteProveedor(data.id);
            }
            Swal.fire({
              title: "¡Ha ocurrido un error!",
              text: `
              Ha ocurrido un error al momento de guardar los pdf, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
              icon: "error",
              showConfirmButton: true,
              confirmButtonColor:'#198754',
              confirmButtonText:'Aceptar',       
            })
            .then(()=>{
              window.location.reload();
            })
          });
      })
      .catch((err)=>{
        setLoading(false);
        deleteFile(folderName);
        Swal.fire({
          title: "¡Ha ocurrido un error!",
            text: `
              Hubo un error al momento de guardar la informacion del proveedor, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
            icon: "error",
            confirmButtonText: "Aceptar",
        })
        .then(()=>{
          window.location.reload();
        })
      });
    };
  })
  .catch((err)=>{
    setLoading(false);
    Swal.fire({
      title: "¡Ha ocurrido un error!",
        text: `
          Hubo un error al momento de registrar el proveedor, intente de nuevo.
          Si el problema persiste por favor comuniquese con el área de sistemas.`,
       icon: "error",
       confirmButtonText: "Aceptar"});
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
const [Validacion, setValidacion] = useState('');
const [Span,setSpan]=useState('red')
const manejarCambio = (event) => {
  const nuevoValor = event.target.value;
  if (nuevoValor.includes('@') && nuevoValor.split('@')[1].includes('.')) {   
    setValidacion('✓');
    setSpan('green') // Limpiar mensaje de validación si es válido
  } else {
    setValidacion('X');
    setSpan('red')
  }
}
/* validar correo de la factura Electronica*/
const [mensaje, setMensaje] = useState('');
const [color,setColor]=useState('red')
const Cambio = (event) => {
  const nuevoValor = event.target.value;
  if (nuevoValor.includes('@') && nuevoValor.split('@')[1].includes('.')) {   
    setMensaje('✓');
    setColor('green') // Limpiar mensaje de validación si es válido
  } else {
    setMensaje('X');
    setColor('red')
  }
}

const [vality,setVality]=useState('');
const [colorVality,setColorVality]=useState('red');
  const handleInputChange = (event) => {
    // Obtén el valor actual del input
    let value = event.target.value;

    // Remueve cualquier carácter que no sea un número
    value = value.replace(/[^0-9]/g, '');
    if (value.replace(/[^0-9]/g, '')){
      setVality('✓');
      setColorVality('green')
    }else if(value.includes('e') || value.includes('E') || value.includes(',')){
      setVality('X');
      setColorVality('red')
    }
    else{
      setVality('X');
      setColorVality('red')
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
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto " style={{userSelect:'none'}}>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white',userSelect:'none'}}
    >
    <center>
      <section className="d-flex flex-row justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <center>
          <Fade cascade='true'>
          <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2" style={{fontSize:100}}><strong>PRE - APROBACIÓN DE CREDITOS</strong></label>
          </Fade>
          </center>
          <hr className="my-1" />
        </div>
      </section>
    </center>
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
            <center>
            <div className="d-flex flex-column">
              <label>Se realiza un estudio del cliente, <strong>{}</strong> Con NIT: <strong>{}</strong>,</label>
              <label>en donde nos arroja la siguiente información financiera</label>
              <label>del cliente para la aprobación de credito</label>
            </div>
            </center>
            <hr className="my-1" />
            <div>
              <label className="fw-bold" style={{fontSize:20}}>INFORME DETALLADO DE CREDITO</label>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column align-items-start w-50 pe-3">
                  <label className="">Última renovación cámara y comercio:</label>
                  <input
                    id="primerApellido"
                    type="date"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    required
                    placeholder="Campo obligatorio"
                    value={search.primerApellido}
                    onChange={handlerChangeSearch}
                  />
                </div>   
                <div className="d-flex flex-column w-25 pe-3">
                <label className="me-1 w-25">C.cio:</label>
                  <input
                    id="segundoApellido"
                    type="text"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    placeholder="(Campo Opcional)"
                    value={search.segundoApellido}
                    onChange={handlerChangeSearch}
                  />
                </div>
                
                <div className="d-flex flex-column w-25 pe-3">
                <label className="me-1 w-25">RUT:</label>
                  <input
                    id="primerNombre"
                    type="text"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    required
                    placeholder="Campo obligatorio"
                    value={search.primerNombre}
                    onChange={handlerChangeSearch}
                  />
                </div>
                <div className="d-flex flex-column w-25">
                <label className="me-1 ">INFOLAFT:</label>
                  <input
                    id="otrosNombres"
                    type="text"
                    className="form-control form-control-sm w-100"                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    placeholder="(Campo Opcional)"
                    value={search.otrosNombres}
                    onChange={handlerChangeSearch}
                  />
                </div>
              </div>
            <div className="d-flex flex-row mt-2 mb-2">
            <div className="d-flex flex-column align-items-start w-50 pe-3">
                  <label className="">Capital de trabajo:</label>
                  <input
                    id="primerApellido"
                    type="number"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    required
                    placeholder="Campo obligatorio"
                    value={search.primerApellido}
                    onChange={handlerChangeSearch}
                  />
                </div>   
                <div className="d-flex flex-column w-50 pe-3">
                <label className="">Razon Endeudamineto:</label>
                  <input
                    id="segundoApellido"
                    type="text"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    placeholder="(Campo Opcional)"
                    value={search.segundoApellido}
                    onChange={handlerChangeSearch}
                  />
                </div>
                
                <div className="d-flex flex-column w-50 pe-3">
                <label className="">Indice Solvencia:</label>
                  <input
                    id="primerNombre"
                    type="text"
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    required
                    placeholder="Campo obligatorio"
                    value={search.primerNombre}
                    onChange={handlerChangeSearch}
                  />
                </div>
            </div>
            </div>   
              <hr className="my-1" />         
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-bold" style={{fontSize:18}}>OBSERVACIONES</label>
          <textarea
            value={search.observations}
            onChange={handlerChangeSearch}
            id="observations"
            className="form-control border border-3"
            style={{ minHeight: 70, maxHeight: 100, fontSize: 12 }}
          ></textarea>
        </div>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
            <div className="w-100 mt-1">
              <div className="d-flex flex-row ">
              <div className="pe-2 w-50">
                  <label className="fw-bold mt-1 me-2">Vbo Administrador Agencia: </label>
                  <div className=" rounded-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="Rut"
                    type="file"
                    placeholder="Rut"
                    className="form-control form-control-sm  border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Rut',e),setDocRut(1),FileChange(e,1))}
                  />
                  {selectedFiles[1] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[1])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                <div className=" w-50">
                  <label className="fw-bold mt-1 ">Vbo Director Comercial: </label>
                  <div className=" rounded-2" >
                    <div className="d-flex flex-row">
                  <input
                    id="Infemp"
                    type="file"
                    placeholder="Infemp"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Infemp', e),setDocInfemp(1),FileChange(e,2))}
                  />
                  {selectedFiles[2] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[2])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
              </div>
            </div>
              <div className="d-flex flex-row ">
                
              <div className="d-flex flex-column mt-1 " >
                  <label className="fw-bold mt-1 me-2">Vbo. Director Financiero: </label>
                  <div className="d-flex flex-row">
                  <input
                    id="DocOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:730}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,5))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[5] && (
                    <div className="d-flex justify-content-start ps-2 pt-1" style={{width:60}}>
                    <a href={URL.createObjectURL(selectedFiles[5])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                  </div>
                </div>
            </div>
          </div>
        <Modal show={loading} centered>
          <Modal.Body>
            <div className="d-flex align-items-center">
              <strong className="text-danger" role="status">
                Cargando...
              </strong>
              <div
                className="spinner-grow text-danger ms-auto"
                role="status"
              ></div>
            </div>
          </Modal.Body>
        </Modal>
        <end>
        <div className="d-flex flex-row mb-2">
          <div className="w-75">
          </div>
          <Fade cascade direction="right">
          <div className="d-flex flex-row">
          <button
            type="submit"
            className="fw-bold w-100 ms-2 me-3"
            onSubmit={handleSubmit}
          >
            REGISTRAR
          </button>
          <Button variant="secondary" className="w-100 ms-2" onClick={refreshForm}>CANCELAR</Button>
          </div>
          </Fade>
          <div className="" style={{width:50}}>
          </div>
        </div>
        </end>
      </form>
    </div>
    </div>
    
  );
}