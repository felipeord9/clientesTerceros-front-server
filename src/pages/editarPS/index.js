import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button } from "@mui/material";
import {  Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { Navigate , useNavigate } from "react-router-dom";
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { FaEye } from "react-icons/fa";
import { createProveedor, deleteProveedor, updateProveedor } from '../../services/proveedorService';
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllActividad} from '../../services/actividadService';
import { getAllAgencies } from "../../services/agencyService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import VinculacionProveedor from '../../pdfs/FORMATO  VINCULACION DE PROVEEDORES.pdf'
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import Compromiso from '../../pdfs/COMPROMISO ANTICORRUPCION.pdf';
import { FaFileDownload } from "react-icons/fa";
import { updateBitacora } from '../../services/bitacoraService';
import { RiArrowGoBackFill } from "react-icons/ri";
import Logo_pdf from '../../assest/logo_pdf.jpg'
import { config } from "../../config";

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const [vacio,setVacio] = useState(false);

  const url = `${config.apiUrl2}/uploadMultiple/obtener-archivo/${carpeta}/${archivo}`;
  if(!url){
    setVacio(true)
  }
  return (
    <div>
      <a disabled={vacio} className="ms-2" href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );

};

export default function EditPS(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)
  const navigate =useNavigate()
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
  });

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
    id:'',
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
    tipoFormulario:'PMN',
    docVinculacion:'',
    docComprAntc:'',
    docRut:'',
    docCcio:'',
    docCrepL:'',
    docEf:'',
    docRefcom:'',
    docInfemp:'',
    docInfrl:'',
    docValAnt:'',
    docCerBan:'',
    docOtros:'',
    agencia:'',
    departamento:'',
    ciudad:'',
    tipoDocumento:'',
    actividadEconomica:'',
  });
  const [compare,setCompare]=useState({
    cedula:'',
    primerApellido:'',
    segundoApellido:'',
    primerNombre:'',
    otrosNombres:'',
    docRut:'',
    docInfemp:'',
    docInfrl:'',
    docOtros:'',
    docVinculacion:'',
    docComprAntc:'',
    docCtalnst:'',
    docPagare:'',
    docCcio:'',
    docCrepL:'',
    docEf:'',
    docRefcom:'',
    docRefcom2:'',
    docRefcom3:'',
    docCvbo:'',
    docFirdoc:'',
    docCerBan:'',
    docValAnt:'',
  })
  useEffect(()=>{
    const datosTercero = localStorage.getItem('data');
    if(datosTercero){
      setSearch(JSON.parse(datosTercero));
      setCompare(JSON.parse(datosTercero))
    }
  },[]);
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

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
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
        text: "Se actualizará la información del Proveedor",
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
        //creamos el cuerpo de nuestra instancia
        const body={
          cedula: search.cedula,
          numeroDocumento: search.cedula,
          tipoDocumento: search.tipoDocumento,
          tipoPersona: search.tipoPersona,
          razonSocial: search.primerApellido.toUpperCase() +' '+ search.segundoApellido.toUpperCase() +' '+ search.primerNombre.toUpperCase() +' '+ search.otrosNombres.toUpperCase(),
          primerApellido:search.primerApellido.toUpperCase(),
          segundoApellido:search.segundoApellido.toUpperCase(),
          primerNombre:search.primerNombre.toUpperCase(),
          otrosNombres:search.otrosNombres.toUpperCase(),
          departamento: search.departamento,
          ciudad: search.ciudad,
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono:search.telefono,
          correoElectronico: search.correoElectronico.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          actividadEconomica: search.actividadEconomica,         
          tipoDocRepLegal: search.tipoDocumento,
          numeroDocRepLegal: search.cedula,
          nameRepLegal:search.primerNombre.toUpperCase(),
          apellidoRepLegal:search.primerApellido.toUpperCase(),
          observations:search.observations,
          /* createdAt: new Date(),
          createdBy: user.name.toUpperCase(), */
          solicitante:search.solicitante.toUpperCase(),
          docVinculacion:compare.docVinculacion,
          docComprAntc:compare.docComprAntc,
          docCtalnst:compare.docCtalnst,
          docPagare:compare.docPagare,
          docRut:compare.docRut,
          docCcio:compare.docCcio,
          docCrepL:compare.docCrepL,
          docEf:compare.docEf,
          docRefcom:compare.docRefcom,
          docRefcom2:compare.docRefcom2,
          docRefcom3:compare.docRefcom3,
          docCvbo:compare.docCvbo,
          docFirdoc:compare.docFirdoc,
          docInfrl:compare.docInfrl,
          docInfemp:compare.docInfemp,
          docValAnt:compare.docValAnt,
          docCerBan:compare.docCerBan,
          docOtros:compare.docOtros,
          agencia: search.agencia,
          tipoFormulario:search.tipoFormulario,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName= compare.cedula+'-'+compare.primerApellido.toUpperCase()+'-'+ compare.segundoApellido.toUpperCase()+'-'+ compare.primerNombre.toUpperCase()+'-'+ compare.otrosNombres.toUpperCase();
        formData.append('originalFolderName',originalFolderName);
        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase();
        formData.append('clientName',clientName)
        const originalClientName = compare.primerApellido.toUpperCase()+' '+ compare.segundoApellido.toUpperCase()+' '+ compare.primerNombre.toUpperCase()+' '+ compare.otrosNombres.toUpperCase();
        formData.append('originalClientName',originalClientName)
        //ejecutamos nuestra funcion que creara el cliente
        updateProveedor(search.id,body)
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
              title: 'Actualización exitosa!',
              text: `El Proveedor "${body.razonSocial}" con Número 
              de documento "${search.cedula}" se ha actualizado de manera satisfactoria`,
              icon: 'success',
              position:'center',
              showConfirmButton: true,
              confirmButtonColor:'#198754',
              confirmButtonText:'Aceptar',
            })
            .then(()=>{
              handleValidacion(e);
              /* window.location.reload(); */
            })
          }) 
          .catch((err)=>{
            setLoading(false);
            
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
        
        Swal.fire({
          title: "¡Ha ocurrido un error!",
            text: `
              Hubo un error al momento de guardar la información del proveedor, intente de nuevo.
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
          Hubo un error al momento de Actualizar el proveedor, intente de nuevo.
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
  const TextOfBinary =({valor})=>{
    const [labelColor, setLabelColor] = useState('');
    const [nuevoTexto,setNuevoTexto] = useState('');
    const [LogoPdf,setLogo]=useState('');
    /* const valorBinario = valor */
    /* const nuevoTexto = valor ? 'Fue cargado':'No fue cargado'; */
    useEffect(()=>{
      if(valor=== 1){
        setLabelColor('#008F39')
        setNuevoTexto('Cargado')
        /* setLogo({Logo_pdf}) */

      }else if(valor===0){
        setLabelColor('#CB3234')
        setNuevoTexto('No fue cargado')
        setLogo(null)
      }else{
        setLabelColor(null)
        setNuevoTexto('')
      }
    },[valor]);
    
    return (
      <label className="" style={{color:labelColor, height:18}}><strong className="">{nuevoTexto} {/* {mostrarImagen(valor)} */} {/* <img src={LogoPdf} style={{width:100}}></img> */}</strong></label>
    )
  }
  const mostrarImagen=(valor)=>{
    if(valor===1){
      return <img src={Logo_pdf} style={{width:100}}></img>
    }
  }
  const handleValidacion=(e)=>{
    e = e.target.value
    if(user.role==='admin'){
      return navigate('/validacion/admin');
    }else if(user.role==='agencias' && user.role==='cartera'){
      return navigate('/validar/tercero');
    }else{
      return navigate('/validar/Proveedor');
    }
  }
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
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto " style={{userSelect:'none'}}>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white',userSelect:'none'}}
    >
    <div className="w-100 d-flex flex-row" >
          <Button style={{height:35}} onClick={(e)=>window.history.back(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
          <div style={{width:10}}></div>
          <h1 className="mb-3"><strong>Actualizar Información Del Proveedor</strong></h1>
          
        </div>
      <form className="" onSubmit={handleSubmit}>
        <div className=" rounded shadow-sm p-3 mb-3" style={{backgroundColor:'#C7C8CA'}}>
          <div className="d-flex flex-column gap-1">
            <div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column me-4 " style={{width:450}}>
              <label className="fw-bold" style={{fontSize:18}}>AGENCIA</label>
              <select
                /* ref={selectBranchRef} */
                className="form-select form-select-sm w-100"
                required
                value={search.agencia}
                onChange={handlerChangeSearch}
                id="agencia"
/*                 onChange={(e)=>setAgencia(JSON.parse(e.target.value))}
 */              >
                <option selected value='' disabled>
                  -- Seleccione la Agencia --
                </option>
                {agencias
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.id}>
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
              <label className="fw-bold" style={{fontSize:20}}>PROVEEDOR</label>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column align-items-start w-25 pe-3">
                  <label className="me-1 w-25">1er.Apellido:</label>
                  <input
                    id="primerApellido"
                    type="text"
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
                <label className="me-1 w-25">2do.Apellido:</label>
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
                <label className="me-1 w-25">1er.Nombre:</label>
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
                <label className="me-1 ">Otros nombres:</label>
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

              <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Tipo documento:</label>
                  <select
                    /* ref={selectDocumentoRef} */
                    id="tipoDocumento"
                    value={search.tipoDocumento}
                    onChange={handlerChangeSearch}
                    style={{width:240,backgroundColor:'grey'}}
                    disabled
                    className="form-select form-select-sm m-100 me-3"
                    /* onChange={(e)=>setDocument(JSON.parse(e.target.value))} */
                    required
                  >
                    <option selected value='' disabled>
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
                <div>
                </div>
                <div className="d-flex flex-row align-items-start w-100">
                  <label for='cedula' className="me-1">No.Identificación:</label>
                  <input
                    id="cedula"
                    type="number" 
                    className="form-control form-control-sm w-100"
                    min={10000}
                    name="cedula"
                    pattern="[0-9]"
                    disabled
                    style={{backgroundColor:'grey'}}
                    value={search.cedula}
                    onChange={(e)=>(handlerChangeSearch(e),handleInputChange(e))}
                    required
                    max={9999999999}
                    minLength={0}
                    maxLength={10}
                    size={10}
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold"></span>
{/*                   <p className="ps-3" style={{color:colorVality}}><strong>{vality}</strong></p>
 */}                </div>
              </div>
              <div className="d-flex flex-row mt-2 w-100">
                <label className="me-1">Dirección:</label>
                <input
                  value={search.direccion}
                  onChange={handlerChangeSearch}
                  placeholder="campo obligatorio"
                  type="text"
                  id="direccion"
                  style={{textTransform:"uppercase"}}
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
                    /* onChange={(e)=>setDepartamento(JSON.parse(e.target.value))} */
                    /* ref={selectDepartamentoRef} */
                    id="departamento"
                    value={search.departamento}
                    onChange={handlerChangeSearch}
                    className="form-select form-select-sm m-100 me-3"
                    required   
                 >
                   <option selected value='' disabled>
                    -- Seleccione el Departamento --
                  </option>
                      {departamentos
                      .sort((a,b)=>a.id - b.id)
                      .map((elem)=>(
                        <option key={elem.id} id={elem.id} value={elem.codigo}>
                          {elem.description} 
                        </option>
                      ))
                    }
                    </select>
                </div>
                <div className="d-flex flex-row w-100">
                <label className="me-1">Ciudad:</label>
                <select
                    /* ref={selectCiudadRef} */
                    id="ciudad"
                    value={search.ciudad}
                    onChange={handlerChangeSearch}
                    className="form-select form-select-sm w-100"
                    required
                    /* disabled={departamento ? false : true} */
                    /* onChange={(e)=>setCiudad(JSON.parse(e.target.value))} */ 
                  >
                    
                  <option selected value='' disabled>
                    -- Seleccione la Ciudad --
                  </option>  
                  {ciudades
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    elem.id == search.departamento ?
                    <option id={elem.id} value={elem.codigo}>
                    {elem.description}
                    </option>
                    : 
                    null
                  ))
                }
                  </select>
                </div>
              </div>
              <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Celular:</label>
                  <input
                    value={search.celular}
                    onChange={handlerChangeSearch}
                    id="celular"
                    type="number"
                    className="form-control form-control-sm "
                    min={1000000}
                    pattern="[0-9]"
                    max={9999999999}
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
                    value={search.telefono}
                    onChange={handlerChangeSearch}
                    id="telefono"
                    type="number"
                    pattern="[0-9]"
                    className="form-control form-control-sm mb-2"
                    min={1000000}
                    max={9999999999}
                    
                    placeholder="(Campo Opcional)"
                  >
                  </input>
                  {/* <span className="validity fw-bold "></span> */}
                </div>
              </div>
              <div className="d-flex flex-row align-items-start ">
                  <label className="me-1 mb-3">Correo electrónico:</label>
                  <input
                    id="correoElectronico"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoElectronico}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    style={{width:620, textTransform:'lowercase'}}
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
                <div className="d-flex flex-column mb-3 w-100">
                <label className="me-1">Actividad Económica:</label>
                <select                    
                    /* onChange={(e)=>setActividad(JSON.parse(e.target.value))}
                    ref={selectActividadRef} */
                    style={{width:760}}
                    id="actividadEconomica"
                    value={search.actividadEconomica}
                    onChange={handlerChangeSearch}
                    className="form-select form-select-sm "
                    required   
                 >
                   <option selected value='' disabled>
                    -- Seleccione el Departamento --
                  </option>
                      {actividades
                      .sort((a,b)=>a.id - b.id)
                      .map((elem)=>(
                        <option key={elem.id} id={elem.id} value={elem.id}>
                          {elem.id + '-' + elem.description} 
                        </option>
                      ))
                    }
                    </select>
                    {/* <span>{search.actividadEconomica}</span> */}
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

            <div className="w-100 mt-1">
              <label className="fw-bold" style={{fontSize:20}}>DOCUMENTOS OBLIGATORIOS</label>
              <div className="d-flex flex-row ">
                <div className="me-2 w-100">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:275}}>FORMATO VINCULACIÓN PROVEE: </label>
                  <a className="" style={{fontSize:18}} href={VinculacionProveedor} download="VINCULACION DE PROVEEDORES.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className="d-flex flex-column" >
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docVinculacion}></TextOfBinary>
                    {search.docVinculacion === 1 &&(
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`} archivo={`Vinculacion-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}/>
                    )}
                  </div>                    
                  </div> 
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocVinculacion(1))} */
                    onChange={(e)=>(handleFileChange('Vinculacion',e),setDocVinculacion(1),FileChange(e,1),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[1] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:60}}>
                    <a href={URL.createObjectURL(selectedFiles[1])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                  {/* <span>{compare.docVinculacion}</span> */}
                </div>
                <div className="w-100 ps-1">
                <div className="d-flex flex-column mb-3" >
                  <label className="fw-bold mt-1 me-2 ">INFOLAFT: </label>
                    <TextOfBinary valor={search.docInfemp}></TextOfBinary>
                    {search.docInfemp === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`} archivo={`Infemp-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}/>
                  )}
                  </div> 
                  <div className=" rounded-2" >
                  <div className="d-flex flex row">
                    <div className="" style={{width:340}}>
                  <input
                    id="docInfemp"
                    type="file"
                    placeholder="Infemp"
                    className="form-control form-control-sm w-100 border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3'}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,3),changeSearch(e))}
                  /></div>
                  {selectedFiles[3] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:60}}>
                    <a href={URL.createObjectURL(selectedFiles[3])} target="_blank" rel="noopener noreferrer">
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
                <div className=" w-50">
                <div className="d-flex flex-column mb-1" >
                  <div className="d-flex flex-row">
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
                  </div>
                    <TextOfBinary valor={search.docRut}></TextOfBinary>
                    {search.docRut === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`} archivo={`Rut-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}/>
                  )}
                  </div>  
                  <div className=" rounded-2 " >
                  <div className="d-flex flex-row">
                  <input
                    id="docRut"
                    type="file"
                    placeholder="docRut"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Rut',e),setDocRut(1),FileChange(e,4),changeSearch(e))}
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

                <div className="ps-2 w-50">
                <div className="d-flex flex-column mb-1" >
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                    <TextOfBinary valor={search.docOtros}></TextOfBinary>
                    {search.docOtros === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`} archivo={`Otros-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}/>
                  )}
                  </div> 
                  <div className=" rounded-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="docOtros"
                    type="file"
                    placeholder="docOtros"
                    className="form-control form-control-sm w-100 border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3'}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,11),changeSearch(e))}
                  />
                  {selectedFiles[11] && (
                    <div className="d-flex justify-content-start ps-2" style={{width:70}}>
                    <a href={URL.createObjectURL(selectedFiles[11])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                  </div>
                  </div>
                </div>

              </div> 
          </div>
          <hr className="my-1 mt-4" />

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
            ACTUALIZAR
          </button>
          <Button variant="contained" className="w-100 ms-2" onClick={refreshForm}>CANCELAR</Button>
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