import { useEffect, useState, useContext, useRef, Suspense } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { Button } from "@mui/material";
import AuthContext from "../../context/authContext";
import "./styles.css";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
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
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import Compromiso from '../../pdfs/COMPROMISO ANTICORRUPCION.pdf';
import { FaFileDownload } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
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

export default function EditarPJCR(){
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
    input5: null,
    input6: null,
    input7: null,
    input8: null,
    input9: null,
    input10: null,
    input11: null,
    input12: null,
    input13: null,
  });
  /*   const [folderName, setFolderName] = useState('');
 */
  /* Variable para agregar los pdf */
  /* const handleFileChange = (event, index) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  }; */
  //------------------------------------------
  /* second form */
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
  });
  const [compare,setCompare]=useState({
    cedula:'',
    razonSocial:'',
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
    docCtaInst:'',
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
        /* const formData = new FormData();
        files.forEach((file, index) => {
          if (file) {
            formData.append(`pdfFile${index}`, file);
          }
        }) */
        /* second form */
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
          docComprAntc:compare.docComprAntc,
          docCtaInst:compare.docCtaInst,
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
        deleteFile(folderName);
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
      <label className="" style={{color:labelColor, height:18}}><strong className="">{nuevoTexto} {/* <img src={LogoPdf} style={{width:100}}></img> */}</strong></label>
    )
  }
  const mostrarImagen=(valor)=>{
    if(valor===1){
      return <img src={Logo_pdf} style={{width:100}}></img>
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
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white'}}
    >
    <div className="w-100 d-flex flex-row" >
          <Button style={{height:35}} onClick={(e)=>window.history.back(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
          <div style={{width:30}}></div>
          <h1 className="mb-3"><strong>Actualizar Información Del Cliente</strong></h1>
          
        </div>
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
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1 w-75" /* style={{width:280}} */>FORMATO DE VINCULACIÓN: </label>
                  <a className="" style={{fontSize:18,width:100}} href={VinculacionCliente} download="FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className="d-flex flex-column" >
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docVinculacion}></TextOfBinary>
                    {search.docVinculacion === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Vinculacion-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocVinculacion(1))} */
                    onChange={(e)=>(handleFileChange('Vinculacion',e),setDocVinculacion(1),FileChange(e,1),changeSearch(e))}
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
                  <label className="fw-bold mt-1 w-75">COMPROMISO ANTICORRUPCIÓN: </label>
                  <a className="" style={{fontSize:18 , width:100}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className="d-flex flex-column" >
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docComprAntc}></TextOfBinary>
                    {search.docComprAntc === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`ComprAntc-${search.razonSocial}.pdf`} />
                    )}
                  </div> 
                  </div>  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docComprAntc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 1),setDocComprAntc(1))} */
                    onChange={(e)=>(handleFileChange('ComprAntc',e),setDocComprAntc(1),FileChange(e,2),changeSearch(e))}
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
              <div className="d-flex flex-column mt-2 w-100 me-2">
              <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">CARTA DE INSTRUCCIONES: </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docCtalnst}></TextOfBinary>
                    {search.docCtalnst === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`CtaInst-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCtaInst"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 2),setDocCtaInst(1))} */
                    onChange={(e)=>(handleFileChange('CtaInst',e),setDocCtaInst(1),FileChange(e,3),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                   <label className="fw-bold mt-1 me-2">PAGARE: </label>
                   <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docPagare}></TextOfBinary>
                    {search.docPagare === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Pagare-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                   
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docPagare"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 3),setDocPagare(1))} */
                    onChange={(e)=>(handleFileChange('Pagare',e),setDocPagare(1),FileChange(e,4),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
              <div className="d-flex flex-column" >
                  <div className="d-flex flex-row">
                   <label className="fw-bold mt-1 me-2">RUT: </label>
                   <label className="ms-2 mt-1 ">(AÑO 2023) </label>
                   </div> 
                   <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docRut}></TextOfBinary>
                    {search.docRut === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Rut-${search.razonSocial}.pdf`} />
                    )}
                    </div>
                  </div>                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docRut"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 4),setDocRut(1))} */
                    onChange={(e)=>(handleFileChange('Rut',e),setDocRut(1),FileChange(e,5),changeSearch(e))}
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
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                   <label className="fw-bold mt-1 me-2">CERTIFICADO CAMARA DE COMERCIO: </label>
                   <label className="ms-2 mt-1 ">(Con una vigencia no mayor a 30 días) </label>
                    <TextOfBinary valor={search.docCcio}></TextOfBinary>
                   {search.docCcio === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Ccio-${search.razonSocial}.pdf`} />
                    )}
                  </div>                 
                   <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCcio"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 5),setDocCcio(1))} */
                    onChange={(e)=>(handleFileChange('Ccio',e),setDocCcio(1),FileChange(e,6),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[6] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[6])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">CÉDULA REPRESENTANTE LEGAL: </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docCrepL}></TextOfBinary>
                    {search.docCrepL === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`CrepL-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCrepL"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,6),setDocCrepL(1))} */
                    onChange={(e)=>(handleFileChange('CrepL',e),setDocCrepL(1),FileChange(e,7),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[7] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[7])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                    <label className="fw-bold mt-1 me-2">ESTADOS FINANCI. O CERTIFI. DE CONTADOR: </label>
                    <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docEf}></TextOfBinary>
                    {search.docEf === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Ef-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docEf"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 7),setDocEf(1))} */
                    onChange={(e)=>(handleFileChange('Ef',e),setDocEf(1),FileChange(e,8),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[8] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[8])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2"><div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">CARTA VISTO BUENO ADMINIS. DE LA AGENCIA: </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docCvbo}></TextOfBinary>
                    {search.docCvbo === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Cvbo-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCvbo"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 8),setDocCvbo(1))} */
                    onChange={(e)=>(handleFileChange('Cvbo',e),setDocCvbo(1),FileChange(e,9),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[9] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[9])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                   <label className="fw-bold mt-1 me-2">REFERENCIAS COMERCIALES: </label>
                   <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docRefcom}></TextOfBinary>
                    {search.docRefcom === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Refcom-${search.razonSocial}.pdf`} />
                    )}
                    {search.docRefcom2 === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Refcom2-${search.razonSocial}.pdf`}/>
                  )}
                  {search.docRefcom3 === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Refcom3-${search.razonSocial}.pdf`}/>
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row mb-2">
                  <div className="d-flex flex-row">
                  <IconButton className="me-1" style={{backgroundColor:'#2979FF',color:'white',width:40,height:40}} /* className="rounded-5 d-flex justify-content-center align-items-center me-1" */ onClick={addFileInput}><NoteAddIcon />{/* <img src={Mas} style={{width:18}} /> */}</IconButton>
                  <input
                    id="docRefcom"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:282}}
                    /* onChange={(e)=>(handleFileChange(e, 9),setDocRefcom(1))} */
                    onChange={(e)=>(handleFileChange('Refcom',e),setDocRefcom(1),FileChange(e,10),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[10] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[10])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
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
                       /* id="docRefcom2" */
                       type="file"
                       style={{backgroundColor:'#f3f3f3',width:282}}
                       /* onChange={(e)=>(handleFileChange(e,9),setDocRefcom(1))} */
                       onChange={(e)=>(handleFileChange(`Refcom${input.id+1}`,e),FileChange(e,11+index),actualizarFiles(input.id,e),changeSearch(e))}
                       className="form-control form-control-sm border border-5 rounded-3 d-flex flex-column mb-2"
                       accept=".pdf"                  
                     />
                     {/* <span>`Refcom ${input.id+1}`</span>
                     <span>${compare.docRefcom2}</span>
                     
                     <span>${compare.docRefcom3}</span> */}
                     </div>
                     {selectedFiles[11+index] && (
                     <div className=" pt-1 ps-2" style={{width:50}} >
                     <a href={URL.createObjectURL(selectedFiles[11+index])} target="_blank" rel="noopener noreferrer">
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
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2"><div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">INFOLAFT EMPRESA: </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docInfemp}></TextOfBinary>
                    {search.docInfemp === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Infemp-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfemp"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 10),setDocInfemp(1))} */
                    onChange={(e)=>(handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,15),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[15] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[15])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">INFOLAFT REP. LEGAL: </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docInfrl}></TextOfBinary>
                    {search.docInfrl === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Infrl-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfrl"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 11),setDocInfrl(1))} */
                    onChange={(e)=>(handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,16),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[16] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[16])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2"><div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">FICHA RELACIÓN DOCUMENTOS : </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docFirdoc}></TextOfBinary>
                    {search.docFirdoc === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Firdoc-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docFirdoc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 10),setDocInfemp(1))} */
                    onChange={(e)=>(handleFileChange('Firdoc',e),setDocFirdoc(1),FileChange(e,17),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[17] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[17])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">CERTIFICACION BANCARIA : </label>
                  <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docCerBan}></TextOfBinary>
                    {search.docCerBan === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Certban-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCerBan"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 11),setDocInfrl(1))} */
                    onChange={(e)=>(handleFileChange('Certban',e),setDocCerBan(1),FileChange(e,18),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[18] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[18])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100">
              <div className="d-flex flex-column" >
                   <label className="fw-bold mt-1">OTROS: </label>
                   <div className="d-flex flex-column">
                    <TextOfBinary valor={search.docOtros}></TextOfBinary>
                    {search.docOtros === 1 &&(
                      <CarpetaArchivoLink carpeta={`${search.cedula}-${search.razonSocial}`} archivo={`Otros-${search.razonSocial}.pdf`} />
                    )}
                  </div>
                  </div>                  
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:736}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,19),changeSearch(e))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[19] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[19])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
                {/* <span>{compare.docVinculacion}</span>
                <span>{compare.docComprAntc}</span>
                <span>{compare.docCtaInst}</span>
                <span>{compare.docPagare}</span>
                <span>{compare.docRut}</span>
                <span>{compare.docCcio}</span>
                <span>{compare.docCrepL}</span>
                <span>{compare.docEf}</span>
                <span>{compare.docCvbo}</span>
                <span>{compare.docRefcom}</span>
                <span>{compare.docInfemp}</span>
                <span>{compare.docInfrl}</span>
                <span>{compare.docOtros}</span> */}
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