import { useEffect, useState, useContext, useRef, Suspense } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "@mui/material";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { config } from "../../config";
import { FaEye } from "react-icons/fa";
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { Navigate, useNavigate } from "react-router-dom";
import { getAllPrecios } from "../../services/precioService";
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService';
import { createCliente, deleteCliente, updateCliente } from "../../services/clienteService";
import { fileSend, deleteFile } from "../../services/fileService";
import { updateBitacora } from '../../services/bitacoraService';
import Logo_pdf from '../../assest/logo_pdf.jpg'
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaFileDownload } from "react-icons/fa";
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import  {  NumericFormat  }  from  'react-number-format' ;

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const url = `${config.apiUrl2}/uploadMultiple/obtener-archivo/${carpeta}/${archivo}`;

  return (
    <div>
      <a className="ms-2" href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );
};

export default function EditarPJC(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)
  const navigate =useNavigate()
  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [clasificacion,setClasificacion] = useState(null);
  const [document,setDocument]=useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [regimen,setRegimen]= useState(null);
  const [detalle,setDetalle]=useState(null);
  const [departamento,setDepartamento]= useState('');
  const [city,setCity]=useState(null);
  const [responsabilidad,setResponsabilidad ] = useState(null);
  const [depart, setDepart]=useState('');
  const [precio, setPrecio] = useState(null);

  /* inicializar para hacer la busqueda (es necesario inicializar en array vacio)*/
  const [clasificaciones, setClasificaciones]= useState([]);
  const [agencias, setAgencias] = useState([]);
  const [documentos,setDocumentos] = useState([]);
  const [ciudades,setCiudades] = useState([]);
  const [detalles,setDetalles]=useState([]);
  const [regimenes,setRegimenes] = useState([]);
  const [responsabilidades,setResponsabilidades]= useState([]);
  const [departamentos,setDepartamentos]=useState([]);
  const [precios, setPrecios] = useState([]);

  /* Inicializar los documentos adjuntos */
  const [docVinculacion,setDocVinculacion]=useState(0);
  const [docComprAntc,setDocComprAntc]=useState(0);
  const [docCtaInst,setDocCtaInst]=useState(0);
  const [docPagare,setDocPagare]=useState(0);
  const [docRut,setDocRut]=useState(0);
  const [docCcio,setDocCcio]=useState(0);
  const [docCrepL,setDocCrepL]=useState(0);
  const [docEf,setDocEf]=useState(0);
  const [docRefcom,setDocRefcom]=useState(0);
  const [docCvbo,setDocCvbo]=useState(0);
  const [docFirdoc,setDocFirdoc]=useState(0);
  const [docInfemp,setDocInfemp]=useState(0);
  const [docInfrl,setDocInfrl]=useState(0);
  const [docOtros,setDocOtros]=useState(0);
  const [docCerBan, setDocCerBan] = useState(0);
  const [docValAnt,setDocValAnt] = useState(0);

//------------------------------------------
  /* Variable de todos los pdf y el nombre de la carpeta*/
  /* const [files, setFiles] = useState([]); */
  /* second form */
  const [files, setFiles] = useState({
    input1: null,
    input2: null,
    input3: null,
    input4: null,
  });

  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    setFiles(prevFiles => ({ ...prevFiles, [fieldName]: selectedFile }));
  };

  /* Inicializar los input */
  const [search, setSearch] = useState({
    id:'',
    cedula:'',
    DV:'',
    tipoDocumento:'N',
    tipoPersona:'2',
    razonSocial:''.toUpperCase(),
    primerApellido:'',
    segundoApellido:'',
    primerNombre:'',
    otrosNombres:'',
    direccion:'',
    celular:'',
    telefono:'',
    correoNotificaciones:'',
    nombreSucursal:'',
    direccionSucursal:'',
    celularSucursal:'',
    telefonoSucursal:'',
    correoSucursal:'',
    correoFacturaElectronica:'',
    numeroDocRepLegal:'',
    nameRepLegal:'',
    apellidoRepLegal:'',
    observations:'',
    solicitante:'',
    tipoFormulario:'PJC',
    tipo:'N',
    valorEstimado:'',
    docRut:'',
    docInfemp:'',
    docInfrl:'',
    docOtros:'',
    clasificacion:'',
    agencia:'',
    departamento:'',
    ciudad:'',
    departamentoSucursal:'',
    ciudadSucursal:'',
    regimenFiscal:'',
    responsabilidadFiscal:'',
    detalleTributario:'',
    tipoDocRepLegal:'',
    precioSugerido:'',
  });
  const [compare,setCompare]=useState({
    cedula:'',
    razonSocial:'',
    primerApellido:'',
    segundoApellido:'',
    primerNombre:'',
    otrosNombres:'',
    docVinculacion:'',
    docRut:'',
    docInfemp:'',
    docInfrl:'',
    docOtros:'',
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
  const selectClasificacionRef =useRef();
  const selectDocumentoRef=useRef();
  const selectDepartamentoRef=useRef();
  const selectCiudadRef=useRef();
  const selectRegimenRef=useRef();
  const selectPrecioRef=useRef();
  const selectResponsabilidadRef=useRef();

  const limitDeliveryDateField = new Date()
  limitDeliveryDateField.setHours(2)

  useEffect(()=>{
    getAllDetalles().then((data)=>setDetalles(data));
    getAllResponsabilidad().then((data)=>setResponsabilidades(data));
    getAllRegimen().then((data)=>setRegimenes(data));
    getAllAgencies().then((data) => setAgencias(data));
    getAllClasificaciones().then((data) => setClasificaciones(data));
    getAllDocuments().then((data)=>setDocumentos(data));
    getAllDepartamentos().then((data) => setDepartamentos(data));
    getAllCiudades().then((data) => setCiudades(data));
    getAllPrecios().then((data)=>setPrecios(data));
},[]);

  const findById = (id, array, setItem) => {
    const item = array.find((elem) => elem.nit === id);
    if (item) {
      setItem(item);
    } else {
      setItem(null);
      /* setSucursal(null); */
      selectBranchRef.current.selectedIndex = 0;
    }
  };

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setSearch({
      ...search,
      [id]: value,
    });
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title:'¿Está segur@?',
      text:'Se Actualizará la información del Cliente',
      icon:'question',
      confirmButtonText:'Aceptar',
      confirmButtonColor:'#198754',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
    }) .then(({isConfirmed})=>{
      if(isConfirmed){
        setLoading(true);
        const formData = new FormData();

        for (const fieldName in files) {
          if (files[fieldName]) {
            formData.append(fieldName, files[fieldName]);
          }
        }
        const body={
          cedula:search.cedula,
          numeroDocumento: search.cedula,
          /* cedula:search.cedula+search.DV,
          numeroDocumento: search.cedula+search.DV, */
          tipoDocumento:search.tipoDocumento,
          tipoPersona:search.tipoPersona,
          razonSocial:search.razonSocial.toUpperCase(),
          primerApellido:search.primerApellido.toUpperCase(),
          segundoApellido:search.segundoApellido.toUpperCase(),
          primerNombre:search.primerNombre.toUpperCase(),
          otrosNombres:search.otrosNombres.toUpperCase(),
          departamento:search.departamento,
          ciudad: search.ciudad,
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono: search.telefono,
          correoNotificaciones: search.correoNotificaciones.toLowerCase(),
          nombreSucursal:search.nombreSucursal.toUpperCase(),
          direccionSucursal: search.direccionSucursal.toUpperCase(),
          departamentoSucursal: search.departamentoSucursal,
          ciudadSucursal: search.ciudadSucursal,
          celularSucursal: search.celularSucursal,
          telefonoSucursal: search.telefonoSucursal,
          correoSucursal: search.correoSucursal.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          regimenFiscal: search.regimenFiscal,
          responsabilidadFiscal: search.responsabilidadFiscal,
          detalleTributario: search.detalleTributario ,
          numeroDocRepLegal: search.numeroDocRepLegal,
          nameRepLegal: search.nameRepLegal.toUpperCase(),
          tipoDocRepLegal: search.tipoDocRepLegal,
          apellidoRepLegal: search.apellidoRepLegal.toUpperCase(),
          valorEstimado: search.valorEstimado,
          precioSugerido: search.precioSugerido,
          observations: search.observations,
          /* createdAt: new Date(),
          createdBy: user.name.toUpperCase(), */
          solicitante: search.solicitante.toUpperCase(),
          docVinculacion:compare.docVinculacion,
          docRut:compare.docRut,
          docInfemp:compare.docInfemp,
          docInfrl:compare.docInfrl,
          docOtros:compare.docOtros,
          clasificacion: search.clasificacion,
          agencia: search.agencia,
          tipoFormulario: search.tipoFormulario,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName= compare.cedula+'-'+ compare.razonSocial.toUpperCase();
        formData.append('originalFolderName',originalFolderName);

        const clientName = search.razonSocial.toUpperCase();
        formData.append('clientName',clientName)
        const originalClientName = compare.razonSocial.toUpperCase();
        formData.append('originalClientName',originalClientName)

        //ejecutamos nuestra funcion que creara el cliente
        updateCliente(search.id, body)
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
              text: `El Cliente "${search.razonSocial.toLocaleUpperCase()}" con Número 
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
          /* .catch((err)=>{
            setLoading(false);
            if(!data){
              deleteFile(folderName);
            }else{
              deleteCliente(data.id);
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
          }); */
      })
      .catch((err)=>{
        setLoading(false);
        
        Swal.fire({
          title: "¡Ha ocurrido un error!",
            text: `
              Hubo un error al momento de guardar la informacion del cliente, intente de nuevo.
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
        Hubo un error al momento de registrar el cliente, intente de nuevo.
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

/* validar correo de la sucursal*/
const [mensajeValidacion, setMensajeValidacion] = useState('');
const [colorSpan,setColorSpan]=useState('red')
const manejarCambioCorreo = (event) => {
  const nuevoValor = event.target.value;
  
  // Verificar si el nuevo valor cumple con la expresión regular
/*     if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(nuevoValor)) {
*/    if (nuevoValor.includes('@') && nuevoValor.split('@')[1].includes('.')) {   
 /* setCorreo(nuevoValor); */
    setMensajeValidacion('✓');
    setColorSpan('green') // Limpiar mensaje de validación si es válido
  } else {
    setMensajeValidacion('X');
    setColorSpan('red')
  }
}

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
const [selectedFiles, setSelectedFiles] = useState([]);

  const FileChange = (event, index) => {
    const newFiles = [...selectedFiles];
    const file = event.target.files[0];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };
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
  const handleClickBack=(e)=>{
    e = e.target.value
    if(user.role==='agencias' || user.role==='cartera'){
      return navigate('/validar/tercero')
    }else if(user.role==='compras'){
      return navigate('/validar/Proveedor')
    }else{
      return navigate('/validacion/admin')
    }
  }

  const [mostrarEnlace, setMostrarEnlace] = useState(false);
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
        setMostrarEnlace(true)
        /* setLogo({Logo_pdf}) */

      }else if(valor===0){
        setLabelColor('#CB3234')
        setNuevoTexto('No fue cargado')
        setMostrarEnlace(false)
        setLogo(null)
      }else{
        setLabelColor(null)
        setNuevoTexto('')
        setMostrarEnlace(false)
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

  const [nombreArchivo, setNombreArchivo] = useState([search.razonSocial]);

  const generarEnlace = (e) => {
    // Puedes cambiar la ruta según tu configuración
    /* setNombreArchivo(`Rut-${search.razonSocial}.pdf`) */
    /* const enlace = `${config.apiUrl2}/uploadMultiple/archivo/${nombreArchivo}`;
    window.open(enlace, '_blank'); */
    try{
      const nombreFolder = fetch(`${config.apiUrl2}/uploadMultiple/archivo/${nombreArchivo}`,{
        method:'post',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(search.cedula+'-'+ search.razonSocial ),
      })
      if (nombreFolder.ok) {
        console.log('Nombre enviado con éxito al servidor');
      } else {
        console.error('Error al enviar el nombre al servidor');
      }
    } catch (error){
      console.error('Error en la solicitud fetch:', error);
    }

    /* const folderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
    formData.append('folderName', folderName); */
  };

    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white'}}
    >
      {/* <span>${search.razonSocial}</span> */}
    <div className="w-100 d-flex flex-row" >
          <Button style={{height:35}} onClick={(e)=>window.history.back(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
          <div style={{width:30}}></div>
          <h1 className="mb-3"><strong>Actualizar Información Del Cliente</strong></h1>
          
        </div>
        {/* <span>{docRut}</span> */}
      <form className="" onSubmit={handleSubmit}>
        <div className=" rounded shadow-sm p-3 mb-3" style={{backgroundColor:'#C7C8CA'}}>
          <div className="d-flex flex-column gap-1">
            <div>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column me-4 w-100">
              <label className="fw-bold" style={{fontSize:18}}>CLASIFICACIÓN</label>
              <select
                id='clasificacion'
                /* ref={selectClasificacionRef} */
                value={search.clasificacion}
                className="form-select form-select-sm"
                /* onChange={(e)=>setClasificacion(JSON.parse(e.target.value))} */
                onChange={handlerChangeSearch}
                required
              >
                <option selected value="" disabled>
                  -- Seleccione la Clasificación --
                </option>
                {clasificaciones
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(                    
                    /* elem.id != 1 ? */
                    <option id={elem.id} value={elem.description}>
                      {elem.id + ' - ' + elem.description} 
                    </option>
                    /* :
                    null */
                  ))
                }
              </select>
              </div>
              <div className="d-flex flex-column w-100 ">
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
              </div>
              <div className="d-flex flex-row mt-3 mb-2  w-100">
              <label className="fw-bold me-1" style={{fontSize:18}}>SOLICITANTE:</label>
              <input
                  id="solicitante"
                  type="text"
                  style={{textTransform:"uppercase"}}
                  placeholder="Nombre Solicitante"
                  value={search.solicitante}
                  onChange={handlerChangeSearch}
                  className="form-control form-control-sm "
                 required
              />
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
                    min={10000}
                    max={999999999}
                    required
                    disabled
                    style={{backgroundColor:'grey'}}
                    pattern="[0-9]"
                    value={search.cedula}
                    onChange={handlerChangeSearch}
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold"></span>
                </div>
                {/* <div className="d-flex flex-row ms-2" >
                    <label>DV:</label>
                    <input 
                    id="DV"
                    type="number" 
                    placeholder="#"
                    min={0}
                    max={9}
                    required
                    value={search.DV}
                    onChange={handlerChangeSearch}
                    aria-pressed='none'
                    className="form-control form-control-sm ms-1" 
                    style={{width:30}}>
                    </input>
                    <span className="validity fw-bold"></span>
                </div> */}
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
              <div className="d-flex flex-row align-items-start mb-3 w-100">
                  <label className="me-1">Correo de notificación:</label>
                  <input
                    id="correoNotificaciones"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoNotificaciones}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    style={{textTransform:'lowercase',width:590}}
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
              
            </div>            
            <hr className="my-1" />
            <div>
              <label className="fw-bold" style={{fontSize:22}}>SUCURSAL</label>                  
              <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Nombre sucursal:</label>
                  <input
                    id="nombreSucursal"
                    type="text"
                    className="form-control form-control-sm"
                    min={0}
                    value={search.nombreSucursal}
                    onChange={handlerChangeSearch}
                    required
                    style={{textTransform:"uppercase",width:660}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
              </div>
              <div className="d-flex flex-row align-items-start w-100 mt-2">
                  <label className="me-1">Dirección sucursal:</label>
                  <input
                    id="direccionSucursal"
                    value={search.direccionSucursal}
                    onChange={handlerChangeSearch}
                    type="text"
                    className="form-control form-control-sm "
                    min={0}
                    required
                    style={{ textTransform:"uppercase",width:652}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
              </div>

              <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-row w-100">
                <label className="me-1">Departamento:</label>
                <select                    
                    /* onChange={(e)=>setDepartamento(JSON.parse(e.target.value))} */
                    /* ref={selectDepartamentoRef} */
                    id="departamentoSucursal"
                    value={search.departamentoSucursal}
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
                    id="ciudadSucursal"
                    value={search.ciudadSucursal}
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
                    elem.id == search.departamentoSucursal ?
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
              <div className="d-flex flex-row mt-2 mb-2">
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Celular:</label>
                  <input
                    id="celularSucursal"
                    value={search.celularSucursal}
                    onChange={handlerChangeSearch}
                    type="number"
                    className="form-control form-control-sm"
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
                    id="telefonoSucursal"
                    value={search.telefonoSucursal}
                    onChange={handlerChangeSearch}
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    pattern="[0-9]"
                    max={9999999999}
                    placeholder="(Campo Opcional)"
                  >
                  </input>
                </div>
              </div>
              <div className="d-flex flex-row align-items-start mb-3">
                  <label className="me-1">Correo sucursal:</label>
                  <input
                    id="correoSucursal"
                    type="email"
                    className="form-control form-control-sm"
                    min={0}
                    required
                    style={{width:638,textTransform:'lowercase'}}
                    value={search.correoSucursal}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambioCorreo(e))}
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <p  className="ps-3" style={{color:colorSpan}}><strong>{mensajeValidacion}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
              <hr className="my-1" />
              <label className="fw-bold mt-2" style={{fontSize:22}}>DATOS FACTURA ELECTRONICA</label>
              <div className="d-flex flex-row align-items-start mt-2 mb-2  ">
                  <label className="me-1 mb-3">Correo para la factura electrónica:</label>
                  <input
                    value={search.correoFacturaElectronica}
                    onChange={(e)=>(handlerChangeSearch(e),Cambio(e))}
                    id="correoFacturaElectronica"
                    type="email"
                    className="form-control form-control-sm"
                    min={0}
                    required
                    style={{width:510,textTransform:'lowercase'}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <p  className="ps-3" style={{color:color}}><strong>{mensaje}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
              <div className="d-flex flex-row mb-4">
                <div className="pe-3" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Régimen fiscal:</label>
                <select
                /* ref={selectRegimenRef} */
                className="form-select form-select-sm w-100"
                required
                id="regimenFiscal"
                    value={search.regimenFiscal}
                    onChange={handlerChangeSearch}
                /* onChange={(e)=>setRegimen(JSON.parse(e.target.value))} */
              >
                <option selected value='' disabled>
                  -- Seleccione el regimen --
                </option>
                {regimenes
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.id}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
                </div>
                <div className=" pe-3" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Responsabilidad fiscal:</label>
                <select
                /* ref={selectResponsabilidadRef} */
                className="form-select form-select-sm w-100"
                required
                id="responsabilidadFiscal"
                    value={search.responsabilidadFiscal}
                    onChange={handlerChangeSearch}
                /* onChange={(e)=>setResponsabilidad(JSON.parse(e.target.value))} */
              >
                <option selected value='' disabled>
                  -- Seleccione la responsabilidad --
                </option>
                {responsabilidades
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.id}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
                </div>
                <div className="" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Detalle tributario:</label>
                <select
                /* ref={selectBranchRef} */
                className="form-select form-select-sm w-100"
                required
                id="detalleTributario"
                    value={search.detalleTributario}
                    onChange={handlerChangeSearch}
                /* onChange={(e)=>setDetalle(JSON.parse(e.target.value))} */
              >
                <option selected value='' disabled>
                  -- Seleccione el detalle --
                </option>
                {detalles
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.id}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
                </div>
              </div>
              <hr className="my-1" />
              <div className="mt-3">
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
                  id="tipoDocRepLegal"
                  value={search.tipoDocRepLegal}
                  onChange={handlerChangeSearch}
                  
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
              <label className="fw-bold mb-1 mt-1" style={{fontSize:22}}>PROMEDIO DE COMPRA MENSUAL ESTIMADO</label>
              <div className="d-flex flex-row w-100 mt-2 mb-4">
              <div className="d-flex flex-row align-items-start w-100">
                  <label className="">Promedio Compra:</label>
                  <label className="ps-2">$</label>
                  {/* <input
                    id="valorEstimado"
                    style={{width:225}}
                    value={search.valorEstimado}
                    onChange={handlerChangeSearch}
                    type="number"
                    className="form-control form-control-sm "
                    min={0}
                    required
                    pattern="[0-9]"
                    placeholder="Campo obligatorio"
                  >
                  </input> */}
                  <NumericFormat
                    thousandSeparator=","
                    decimalSeparator="."
                    id="valorEstimado"
                    className="form-control form-control-sm "
                    allowNegative={false}
                    style={{width:225}}
                    decimalScale={0}
                    required
                    placeholder="Campo obligatorio"
                    value={search.valorEstimado}
                    onChange={(e)=>handlerChangeSearch(e)}
                  />
                </div>
                  <div className="w-100 d-flex flex-row">
                  <label className="me-1">Lista de Precios:</label>
                  <select
                    style={{width:245}}
                    /* ref={selectPrecioRef} */
                    id="precioSugerido"
                    value={search.precioSugerido}
                    onChange={handlerChangeSearch}
                    className="form-select form-select-sm m-100 me-3"
                    /* onChange={(e)=>setPrecio(JSON.parse(e.target.value))} */
                    required
                  >
                    <option selected value='' disabled>
                  -- Seleccione el tipo de precios sugerido --
                </option>
                {/* <option value={'Detal'}>Detal</option>
                <option value={'Food Service'}>Food service</option>                
                <option value={'Mayorista'}>Mayorista</option> */}

                  {precios
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={elem.description}>
                      {elem.description}
                    </option>
                  ))}
              </select>
                  </div>
              </div>
              <hr className="my-1" />
            </div> 
            <div className="w-100 mt-1">
              <label className="fw-bold" style={{fontSize:22}}>DOCUMENTOS OBLIGATORIOS</label>
              
              <div className="d-flex flex-row ">
                <div className="me-2 w-100">
                <div className="d-flex flex-column" /* style={{height:120}} */>
                  <div className="d-flex flex-row">
                  <label className="fw-bold mt-1 ">FORMATO DE VINCULACION: </label>
                  <a className="" style={{fontSize:18}} href={VinculacionCliente} download="FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf">
                   <FaFileDownload />Descargar
                   </a>
                  </div>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docVinculacion}></TextOfBinary>
                    {search.docVinculacion === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Vinculacion-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="docVinculacion"
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocRut(1))} */
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:335}}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    /* value={'1'} */
                    onChange={(e) => (handleFileChange('Vinculacion', e),setDocVinculacion(1),FileChange(e,1),changeSearch(e))}
                  />
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
                <div className="d-flex flex-column" /* style={{height:120}} */>
                  <label className="fw-bold mt-1 me-2">INFOLAFT: </label>
                  <div className="d-flex flex-column">
                  <TextOfBinary valor={search.docInfemp}></TextOfBinary>
                  {search.docInfemp === 1 &&(
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Infemp-${search.razonSocial}.pdf`} />
                    /* <a 
                        disabled ={!mostrarEnlace}
                        href={`${config.apiUrl2}/uploadMultiple/archivo/Infemp-${search.razonSocial}.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >Ver Infolaft</a> */
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfemp"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:335}}
                    /* onChange={(e)=>(handleFileChange(e, 1),setDocInfemp(1))} */
                    onChange={(e)=>(handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,2),changeSearch(e))}
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
              <div className="d-flex flex-row">

              <div className="me-2 w-100">
                <div className="d-flex flex-column" /* style={{height:120}} */>
                  <div className="d-flex flex-row">
                  <label className="fw-bold mt-1 ">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2024) </label>
                  </div>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docRut}></TextOfBinary>
                    {search.docRut === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Rut-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docRut"
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocRut(1))} */
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:335}}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    /* value={'1'} */
                    onChange={(e) => (handleFileChange('Rut', e),setDocRut(1),FileChange(e,3),changeSearch(e))}
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

              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">INFOLAFT REP. LEGAL: </label>
                  <div className="d-flex flex-column">
                  <TextOfBinary valor={search.docInfrl}></TextOfBinary>
                  {search.docInfrl === 1 &&(
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Infrl-${search.razonSocial}.pdf`} />

                    /* <a 
                    disabled ={!mostrarEnlace}
                    href={`${config.apiUrl2}/uploadMultiple/archivo/Infrl-${search.razonSocial}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >Ver Infolaft rep. legal</a> */
                  )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfrl"
                    type="file"
                    /* onChange={(e)=>(handleFileChange(e, 2),setDocInfrl(1))} */
                    onChange={(e)=>(handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,4),changeSearch(e))}
                    placeholder="RUT"
                    style={{backgroundColor:'#f3f3f3',width:335}}
                    className="form-control form-control-sm me-2 border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[4] && (
                    <div className="d-flex justify-content-start pt-1 " style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[4])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                  {/* <span>{compare.docRut}</span>
                  <span>{compare.docInfrl}</span>
                  <span>{compare.docInfemp}</span>
                  <span>{compare.docOtros}</span> */}
                </div> 
                </div>
              <div className="d-flex flex-column mt-2 w-100">
              <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                  <div className="d-flex flex-column">
                  <TextOfBinary valor={search.docOtros}></TextOfBinary>
                  {search.docOtros === 1 &&(
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Otros-${search.razonSocial}.pdf`} />

                    /* <a 
                    className="ms-3"
                    disabled ={!mostrarEnlace}
                    href={`${config.apiUrl2}/uploadMultiple/archivo/Otros-${search.razonSocial}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    >Ver Otros</a> */
                  )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-2" >
                  <div className="d-flex flex-row">
                  <input
                    id="docOtros"
                    style={{backgroundColor:'#f3f3f3',width:335}}
                    type="file"
                    /* onChange={(e)=>(handleFileChange(e, 3),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,5),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
            </div>
          </div>
          <hr className="my-1 mt-4" />
        <div className="d-flex flex-column mb-2 mt-2">
          <label className="fw-bold" style={{fontSize:22}}>OBSERVACIONES</label>
          <textarea
            id="observations"
            className="form-control border border-3"
            value={search.observations}
            onChange={handlerChangeSearch}
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
    </div>
  );
}
