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
import { FaFileDownload } from "react-icons/fa";
import VinculacionProveedor from '../../pdfs/FORMATO  VINCULACION DE PROVEEDORES.pdf'
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import Compromiso from '../../pdfs/COMPROMISO ANTICORRUPCION.pdf';
import { updateBitacora } from '../../services/bitacoraService';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { MdNoteAdd } from "react-icons/md";

export default function ConvenioJuridico(){
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
    input4: null,
    input5: null,
    input6: null,
    input7: null,
    input8: null,
    input9: null,
    input10: null,
    input11: null,

    input12: null,
    input13: null,
    input14: null,
    input15: null,
  });
  const [compare,setCompare]=useState({
    docRefcom2:'0',
    docRefcom3:'0',
  })
  const changeSearch = (e)=>{
    const file = e.target.files[0]; 
    const {id,value} = e.target;
    /* value = 1; */
    console.log(value);
    if(file){
      setCompare({
        ...compare,
        [id]:1,
      });
    }else{
      setCompare({
        ...compare,
        [id]:0,
      })
    }
  }

  const [fileInputs, setFileInputs] = useState([]);

  const addFileInput = () => {
    /* setFileInputs([...fileInputs, {}]); */
    if (fileInputs.length < 2) {
      const newInput = { id: fileInputs.length + 1, file: null };
      setFileInputs([...fileInputs, newInput]);
    } else {
      alert('Se permiten como máximo 3 referencias comerciales.');
    }
  };

  /* remover el ultimo input de referencia comercial */
  const [visible,setVisible]=useState(false);
  const removeFileInput =()=> {
    if (fileInputs.length > 0) {
      /* setVisible=true */
      const updatedInputs = [...fileInputs];
      updatedInputs.pop();
      setFileInputs(updatedInputs);
    } /* setVisible=false; */
    /* const updatedInputs = fileInputs.filter((input) => input.id !== id);
    setFileInputs(updatedInputs); */
  };
  const actualizarFiles =(id,event)=>{
    const updatedInputs = fileInputs.map((input) =>
      input.id === id ? { ...input, file: event.target.files[0] } : input
    );
    setFileInputs(updatedInputs);
  }
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
    tipoPersona:'2',
    tipoDocumento:'N',
    razonSocial:'',
    primerApellido:'',
    segundoApellido:'',
    primerNombre:'',
    otrosNombres:'',
    direccion:'',
    celular:'',
    telefono:'',
    correoElectronico:'',
    correoFacturaElectronica:'',
    tipoDocRepLegal:'',
    numeroDocRepLegal:'',
    nameRepLegal:'',
    apellidoRepLegal:'',
    observations:'',
    solicitante:'',
    tipoFormulario:'PMJ'
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
          tipoDocumento: search.tipoDocumento,
          tipoPersona: search.tipoPersona,
          razonSocial: search.razonSocial.toUpperCase() ,
          primerApellido:search.primerApellido,
          segundoApellido:search.segundoApellido,
          primerNombre:search.primerNombre,
          otrosNombres:search.otrosNombres,
          departamento: departamento.codigo,
          ciudad: ciudad.codigo,
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono:search.telefono,
          correoElectronico: search.correoElectronico.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          actividadEconomica: actividad.id,         
          tipoDocRepLegal: document.codigo,
          numeroDocRepLegal: search.numeroDocRepLegal,
          nameRepLegal:search.nameRepLegal.toUpperCase(),
          apellidoRepLegal:search.apellidoRepLegal.toUpperCase(),
          observations:search.observations,
          createdAt: new Date(),
          createdBy: user.name.toUpperCase(),
          solicitante:search.solicitante.toUpperCase(),
          docVinculacion:docVinculacion,
          docComprAntc:docComprAntc,
          docRut:docRut,
          docCcio:docCcio,
          docCrepL:docCrepL,
          docEf:docEf,
          docRefcom:docRefcom,
          docRefcom2:compare.docRefcom2,
          docRefcom3:compare.docRefcom3,
          docInfemp:docInfemp,
          docInfrl:docInfrl,
          docValAnt:docValAnt,
          docCerBan:docCerBan,
          docOtros:docOtros,
          agencia: agencia.id,
          tipoFormulario:search.tipoFormulario,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+search.razonSocial.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+search.razonSocial.toUpperCase();
        formData.append('originalFolderName', originalFolderName);
        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = search.razonSocial.toUpperCase();
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
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white',userSelect:'none',width:870}}
    >
    <center>
      <section className="d-flex flex-row justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <center>
          <Fade cascade='true'>
          <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2" style={{fontSize:100}}><strong>PROVEEDOR MCIA Y CONVENIOS - persona JURÍDICA</strong></label>
          </Fade>
          </center>
          <hr className="my-1" />
        </div>
      </section>
    </center>
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
            <div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column me-4 " style={{width:450}}>
              <label className="fw-bold" style={{fontSize:18}}>AGENCIA</label>
              <select
                ref={selectBranchRef}
                className="form-select form-select-sm w-100"
                required
                
                onChange={(e)=>setAgencia(JSON.parse(e.target.value))}
              >
                <option selected value='' disabled>
                  -- Seleccione la Agencia --
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
              <div className="d-flex flex-column mb-2  w-100">
              <label className="fw-bold me-1" style={{fontSize:18}}>SOLICITANTE:</label>
              <input
                  id="solicitante"
                  type="text"
                  placeholder="Nombre Solicitante"
                  value={search.solicitante}
                  onChange={handlerChangeSearch}
                  className="form-control form-control-sm"
                  style={{textTransform:"uppercase"}}
                  required
              />
              </div>        
              </div>
            </div>
            <hr className="my-1" />
            <div>
              <label className="fw-bold mb-1" style={{fontSize:22}}>OFICINA PRINCIPAL</label>
              <div className="d-flex flex-row">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Razón Social:</label>
                  <input
                    id="razonSocial"
                    type="text"
                    style={{textTransform:"uppercase",width:280}}
                    className="form-control form-control-sm me-3"
                    value={search.razonSocial}
                    onChange={handlerChangeSearch}
                    min={0}
                    required
                    placeholder="Campo obligatorio"
                  />
                </div> 
                <div className="d-flex flex-row w-100"> 
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">NIT:</label>
                  <input
                    id="cedula"
                    type="number"
                    className="form-control form-control-sm"
                    min={10000000}
                    max={999999999}
                    required
                    pattern="[0-9]"
                    value={search.cedula}
                    onChange={handlerChangeSearch}
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold"></span>
                </div>
                </div> 
              </div>
              <div className="d-flex flex-row mt-2">
                <label className="me-1">Dirección oficina principal:</label>
                <input
                  placeholder="campo obligatorio"
                  type="text"
                  id="direccion"
                  style={{textTransform:"uppercase",width:596}}
                  value={search.direccion}
                  onChange={handlerChangeSearch}
                  className="form-control form-control-sm"
                  min={0}
                  required
                >
                </input>
              </div>
              <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-row w-100">
                <label className="me-1">Departamento:</label>
                <select                    
                    onChange={(e)=>setDepartamento(JSON.parse(e.target.value))}
                    ref={selectDepartamentoRef}
                    className="form-select form-select-sm m-100 me-3"
                    required   
                 >
                   <option selected value='' disabled>
                    -- Seleccione el Departamento --
                  </option>
                      {departamentos
                      .sort((a,b)=>a.id - b.id)
                      .map((elem)=>(
                        <option key={elem.id} id={elem.id} value={JSON.stringify(elem)}>
                          {elem.description} 
                        </option>
                      ))
                    }
                    </select>
                </div>
                <div className="d-flex flex-row w-100">
                <label className="me-1">Ciudad:</label>
                <select
                    ref={selectCiudadRef}
                    className="form-select form-select-sm w-100"
                    required
                    disabled={departamento ? false : true}
                    onChange={(e)=>setCiudad(JSON.parse(e.target.value))} 
                  >
                    
                  <option selected value='' disabled>
                    -- Seleccione la Ciudad --
                  </option>  
                  {ciudades
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    elem.id === departamento.id ?
                    <option id={elem.id} value={JSON.stringify(elem)}>
                    {elem.description}
                    </option>
                    : 
                    null
                  ))
                }
                  </select>
                </div>
              </div>
              <div className="d-flex flex-row mt-2 mb-2">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Celular:</label>
                  <input
                    id="celular"
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    max={9999999999}
                    pattern="[0-9]"
                    value={search.celular}
                    onChange={handlerChangeSearch}
                    required
                    placeholder="Campo obligatorio"
                  />
                  <span className="validity fw-bold me-3"></span>
                </div>
                <div>
                </div>
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Teléfono:</label>
                  <input
                    id="telefono"
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    pattern="[0-9]"
                    max={9999999999}
                    value={search.telefono}
                    onChange={handlerChangeSearch}
                    placeholder="(Campo Opcional)"
                  >
                  </input>
                </div>
              </div>
              <div className="d-flex flex-row align-items-start  w-100">
                  <label className="me-1">Correo electrónico:</label>
                  <input
                    id="correoElectronico"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoElectronico}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    style={{textTransform:'lowercase',width:625}}
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
              <div className="d-flex flex-column mb-4 w-100">
                <label className="me-1">Actividad Económica:</label>
                <select                    
                    onChange={(e)=>setActividad(JSON.parse(e.target.value))}
                    ref={selectActividadRef}
                    style={{width:770}}
                    className="form-select form-select-sm m-100 me-3"
                    required   
                 >
                   <option selected value='' disabled>
                    -- Seleccione el Departamento --
                  </option>
                      {actividades
                      .sort((a,b)=>a.id - b.id)
                      .map((elem)=>(
                        <option key={elem.id} id={elem.id} value={JSON.stringify(elem)}>
                          {elem.id + '-' + elem.description} 
                        </option>
                      ))
                    }
                    </select>
                </div>
              <hr className="my-1" />  
            </div>   
            <label className="fw-bold mt-1" style={{fontSize:20}}>DATOS FACTURA ELECTRÓNICA</label>
            <div className="d-flex flex-row align-items-start mt-2 ">
                  <label className="me-1 mb-3"><strong>Correo para la factura electrónica:</strong></label>
                  <input
                    value={search.correoFacturaElectronica}
                    onChange={(e)=>(handlerChangeSearch(e),Cambio(e))}
                    id="correoFacturaElectronica"
                    type="email"
                    className="form-control form-control-sm"
                    min={0}
                    required
                    style={{width:498,textTransform:'lowercase'}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <p  className="ps-3" style={{color:color}}><strong>{mensaje}</strong></p>
                  {/* <span className="validity fw-bold"></span> */}
              </div>
              <hr className="my-1" />
            <div className="mt-1">
              <label className="fw-bold mb-1" style={{fontSize:22}}>DATOS REPRESENTANTE LEGAL</label>
              <div className="d-flex flex-row">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Nombres:</label>
                  <input
                    id="nameRepLegal"
                    type="text"
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm me-3"
                    value={search.nameRepLegal}
                    onChange={handlerChangeSearch}              
                    min={0}
                    required
                    placeholder="Campo obligatorio"
                  />
                </div>   
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Apellidos:</label>
                  <input
                    id="apellidoRepLegal"
                    type="text"
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm"
                    min={0}
                    required
                    value={search.apellidoRepLegal}
                    onChange={handlerChangeSearch} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
                </div>
              </div>
              <div className="d-flex flex-row mt-2 mb-4">
              <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Tipo documento:</label>
                  <select
                  style={{width:252}}
                    ref={selectDocumentoRef}
                    className="form-select form-select-sm m-100 me-3"
                    onChange={(e)=>setDocument(JSON.parse(e.target.value))}
                    required
                  >
                    <option selected value='' disabled>
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
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Identificacion:</label>
                  <input
                    id="numeroDocRepLegal"
                    value={search.numeroDocRepLegal}
                    onChange={handlerChangeSearch}
                    type="number"
                    className="form-control form-control-sm"
                    min={10000000}
                    required
                    pattern="[0-9]"
                    max={9999999999} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold"></span>
                </div>
              </div>
              </div>    
              <hr className="my-1" />      
            <div className="w-100 mt-1">
              <label className="fw-bold" style={{fontSize:20}}>DOCUMENTOS OBLIGATORIOS</label>
              <div className="d-flex flex-row ">
                <div className="me-2 w-100">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:290}}>FORMATO DE VINCULACIÓN PROVEE: </label>
                  <a className="" style={{fontSize:18}} href={VinculacionProveedor} download="VINCULACION DE PROVEEDORES.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocVinculacion(1))} */
                    onChange={(e)=>(handleFileChange('Vinculacion',e),setDocVinculacion(1),FileChange(e,1))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[1] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[1])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                <div className="ms-2 w-100">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:290}}>COMPROMISO ANTICORRUPCIÓN: </label>
                  <a className="" style={{fontSize:18}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocComprAntc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e)=>(handleFileChange(e, 1),setDocComprAntc(1))} */
                    onChange={(e)=>(handleFileChange('ComprAntc',e),setDocComprAntc(1),FileChange(e,2))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[2] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
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
                <div className="pe-2 w-50">
                  <label className="fw-bold mt-1 ">CERTIFICADO CAMARA Y COMERCIO: </label>
                  <label className="ms-2 mt-1 ">(con una vigencia no mayor a 30 días.) </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="RUT"
                    type="file"
                    placeholder="RUT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Ccio', e),setDocCcio(1),FileChange(e,3))}
                  />
                  {selectedFiles[3] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[3])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  
                  </div>
                </div>
                <div className="ps-2 w-50">
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="INFOLAFT"
                    type="file"
                    placeholder="INFOLAFT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Rut',e),setDocRut(1),FileChange(e,4))}
                  />
                  {selectedFiles[4] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[4])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row ">
                <div className="pe-2 w-50">
                  <label className="fw-bold mt-1 ">CERTIFICACION BANCARIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="RUT"
                    type="file"
                    placeholder="RUT"
                    className="form-control form-control-sm  border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Certban', e),setDocCerBan(1),FileChange(e,5))}
                  />
                  {selectedFiles[5] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[5])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                <div className="ps-2 w-50" >
                  <label className="fw-bold mt-1 me-2">REFERENCIAS COMERCIALES: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row pb-2">
                  <IconButton  style={{backgroundColor:'#2979FF',color:'white',width:40,height:40}} className="rounded-5 d-flex justify-content-center align-items-center me-1 " onClick={addFileInput}><MdNoteAdd />{/* <img src={Mas} style={{width:18}} /> */}</IconButton>        
                  <input
                    id="DocRefcom"
                    type="file"
                    placeholder="DocRefcom"
                    className="form-control form-control-sm  border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:290}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Refcom',e),setDocRefcom(1),FileChange(e,6))}
                  />
                  {selectedFiles[6] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[6])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  <div className="d-flex">
                  <div >
                  <IconButton onFocusVisible={visible} onClick={removeFileInput} className="me-1" style={{backgroundColor:'red', color:'white',height:40,width:41}} aria-label="delete"><DeleteIcon /></IconButton>
                  </div>
                  <div className="d-flex flex-column">
                  {fileInputs.map((input, index) => (
                  <div key={index} className="d-flex flex-row">
                    <div key={input.id} className="d-flex flex-row">
                    <input
                      id={`docRefcom${input.id+1}`}
                      type="file"
                      style={{backgroundColor:'#f3f3f3',width:290}}
                      
                      onChange={(e)=>(handleFileChange(`Refcom${input.id+1}`,e),FileChange(e,7+index),actualizarFiles(input.id,e),changeSearch(e))}
                      className="form-control form-control-sm border border-5 rounded-3 d-flex flex-column mb-2"
                      accept=".pdf"                  
                    />
                    </div>
                    {selectedFiles[7+index] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[7+index])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                    </div>
                  ))}
                  </div>
                  </div> 
                  </div>
                </div>
            </div>
            <div className="d-flex flex-row ">
                <div className="pe-2 w-50" >
                  <label className="fw-bold mt-1 ">ESTADOS FINAN. O CERTIFI. DE CONTADOR: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="RUT"
                    type="file"
                    placeholder="RUT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Ef', e),setDocEf(1),FileChange(e,10))}
                  />
                  {selectedFiles[10] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[10])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                <div className="ps-2 w-50">
                  <label className="fw-bold mt-1 ">CÉDULA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="INFOLAFT"
                    type="file"
                    placeholder="INFOLAFT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('CrepL',e),setDocCrepL(1),FileChange(e,11))}
                  />
                  {selectedFiles[11] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[11])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
            </div>
              <div className="d-flex flex-row ">
                <div className="pe-2 w-50">
                  <label className="fw-bold mt-1 ">INFOLAFT EMPRESA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="RUT"
                    type="file"
                    placeholder="RUT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Infemp', e),setDocInfemp(1),FileChange(e,12))}
                  />
                  {selectedFiles[12] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[12])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                <div className="ps-2 w-50">
                  <label className="fw-bold mt-1 me-2">INFOLAFT REP. LEGAL: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="INFOLAFT"
                    type="file"
                    placeholder="INFOLAFT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,13))}
                  />
                  {selectedFiles[13] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[13])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div>
                
            </div>
            <div className="d-flex flex-column mt-1 " >
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                  <div className="d-flex flex-row">
                  <input
                    id="DocOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:720}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,14))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[14] && (
                    <div className="d-flex justify-content-start ps-4" style={{width:70}}>
                    <a href={URL.createObjectURL(selectedFiles[14])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                  </div>
                </div>
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