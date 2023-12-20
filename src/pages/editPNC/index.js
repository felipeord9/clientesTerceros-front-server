import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { FaEye } from "react-icons/fa";
import Button from '@mui/material/Button';
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { createCliente, deleteCliente, updateCliente } from '../../services/clienteService';
import { Navigate , useNavigate } from "react-router-dom";
import { getAllPrecios } from "../../services/precioService";
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import { updateBitacora } from '../../services/bitacoraService';
import { RiArrowGoBackFill } from "react-icons/ri";
import Logo_pdf from '../../assest/logo_pdf.jpg'
import { config } from "../../config";

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
export default function EditPNC(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)
  const navigate =useNavigate()
  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [regimen,setRegimen]= useState(null);
  const [detalle,setDetalle]=useState(null);
  const [clasificacion,setClasificacion] = useState(null);
  const [document,setDocument] = useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [responsabilidad,setResponsabilidad ] = useState(null);
  const [departamento,setDepartamento]= useState('');
  const [precio, setPrecio] = useState(null);

  /* inicializar los documentos adjuntos */
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
  const [clasificaciones, setClasificaciones]= useState([]);
  const [agencias, setAgencias] = useState([]);
  const [documentos,setDocumentos] = useState([]);
  const [ciudades,setCiudades] = useState([]);
  const [detalles,setDetalles]=useState([]);
  const [regimenes,setRegimenes] = useState([]);
  const [responsabilidades,setResponsabilidades]= useState([]);
  const [departamentos,setDepartamentos]=useState([]);
  const [precios, setPrecios] = useState([]);
  

  const [data,setData]=useState(null);
  const [search, setSearch] = useState({
    id:'',
    cedula:'',
    tipoPersona:'1',
    primerApellido:''.toUpperCase(),
    segundoApellido:''.toUpperCase(),
    primerNombre:'',
    otrosNombres:'',
    direccion:'',
    tipoDocumento:'',
    departamento:'',
    ciudad:'',
    regimenFiscal:'',
    responsabilidadFiscal:'',
    detalleTributario:'',
    celular:'',
    telefono:'',
    correoNotificaciones:'',
    correoFacturaElectronica:'',
    observations:'',
    solicitante:'',
    tipoFormulario:'PNC',
    valorEstimado:'',
    clasificacion:'',
    agencia:'',
    precioSugerido:'',
    docRut:'',
    docInfemp:'',
    docInfrl:'',
    docOtros:'',
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
  const selectClasificacionRef =useRef();
  const selectDocumentoRef=useRef();
  const selectDepartamentoRef=useRef();
  const selectCiudadRef=useRef();
  const selectRegimenRef=useRef();
  const selectPrecioRef = useRef();
  const selectResponsabilidadRef=useRef();

  const limitDeliveryDateField = new Date()
  limitDeliveryDateField.setHours(2)

  /* asignacion de valores a las variables */
  useEffect(()=>{
      getAllPrecios().then((data)=>setPrecios(data));
      getAllDetalles().then((data)=>setDetalles(data));
      getAllResponsabilidad().then((data)=>setResponsabilidades(data));
      getAllRegimen().then((data)=>setRegimenes(data));
      getAllAgencies().then((data) => setAgencias(data));
      getAllClasificaciones().then((data) => setClasificaciones(data));
      getAllDocuments().then((data)=>setDocumentos(data));
      getAllDepartamentos().then((data) => setDepartamentos(data));
      getAllCiudades().then((data) => setCiudades(data));
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
      title: "¿Está segur@?",
      text:'Se Actualizará la información del Cliente',
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
          clasificacion: search.clasificacion,
          agencia: search.agencia,
          tipoDocumento: search.tipoDocumento,
          departamento: search.departamento,
          ciudad: search.ciudad,
          /* createdAt: new Date(),
          createdBy: user.name.toUpperCase(), */
          regimenFiscal: search.regimenFiscal,
          responsabilidadFiscal: search.responsabilidadFiscal,
          detalleTributario: search.detalleTributario,
          tipoDocRepLegal: search.tipoDocumento,
          departamentoSucursal:search.departamento,
          ciudadSucursal:search.ciudad,
          cedula: search.cedula,
          numeroDocumento: search.cedula,
          tipoPersona: search.tipoPersona,
          razonSocial: search.primerApellido.toUpperCase() +' '+ search.segundoApellido.toUpperCase() +' '+ search.primerNombre.toUpperCase() +' '+ search.otrosNombres.toUpperCase(),
          primerApellido:search.primerApellido.toUpperCase(),
          segundoApellido:search.segundoApellido.toUpperCase(),
          primerNombre:search.primerNombre.toUpperCase(),
          otrosNombres:search.otrosNombres.toUpperCase(),
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono:search.telefono,
          correoNotificaciones: search.correoNotificaciones.toLowerCase(),
          nombreSucursal:search.primerNombre.toUpperCase(),
          direccionSucursal:search.direccion.toUpperCase(),
          celularSucursal: search.celular,
          telefonoSucursal:search.telefono,
          correoSucursal:search.correoNotificaciones.toLowerCase(),
          correoFacturaElectronica:search.correoFacturaElectronica.toLowerCase(),
          numeroDocRepLegal: search.cedula,
          nameRepLegal:search.primerNombre.toUpperCase(),
          apellidoRepLegal:search.primerApellido.toUpperCase(),
          valorEstimado: search.valorEstimado,
          precioSugerido: search.precioSugerido,
          observations:search.observations,
          solicitante:search.solicitante.toUpperCase(),
          tipoFormulario:search.tipoFormulario,
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
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
/*         const folderName = search.cedula;
 */        const folderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData

        /* mandar el nombre orginal de carpeta */
        const originalFolderName= compare.cedula+'-'+compare.primerApellido.toUpperCase()+'-'+ compare.segundoApellido.toUpperCase()+'-'+ compare.primerNombre.toUpperCase()+'-'+ compare.otrosNombres.toUpperCase();
        formData.append('originalFolderName',originalFolderName);

        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = body.razonSocial;
        /* const clientName = search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase(); */
        formData.append('clientName',clientName)

        /* nombre del cliente original */
        const originalClientName = compare.primerApellido.toUpperCase()+' '+ compare.segundoApellido.toUpperCase()+' '+ compare.primerNombre.toUpperCase()+' '+ compare.otrosNombres.toUpperCase();
        formData.append('originalClientName',originalClientName)
        //ejecutamos nuestra funcion que creara el cliente
        updateCliente(search.id,body)
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
              text: `El Cliente "${body.razonSocial}" con Número 
              de documento "${body.cedula}" se ha actualizado de manera correcta`,
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
          Hubo un error al momento de actualizar el cliente, intente de nuevo.
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

      }else if(valor===0 ){
        setLabelColor('#CB3234')
        setNuevoTexto('No fue cargado')
        setLogo(null)
      }else{
        setLabelColor('#CB3234')
        setNuevoTexto('')
        setLogo(null)
        /* setLabelColor(null)
        setNuevoTexto('') */
      }
    },[valor]);
    
    return (
      <label className="" style={{color:labelColor, height:18}}><strong className="">{nuevoTexto} {/* {mostrarImagen(valor)} */} {/* <img src={LogoPdf} style={{width:100}}></img> */}</strong></label>
    )
  }
  const mostrarImagen=(valor)=>{
    if(valor=== 1){
      return <img src={Logo_pdf} style={{width:100}}></img>
    }else{
      return null;
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
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto " style={{userSelect:'none'}}>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white',userSelect:'none'}}
    >
      
    <div className="w-100 d-flex flex-row" >
          <Button style={{height:35}} onClick={(e)=>window.history.back(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
          <div style={{width:30}}></div>
          <h1 className="mb-3"><strong>Actualizar Información Del Cliente</strong></h1>
          
        </div>
        
        {/* <span>{compare.otrosNombres}</span>
        <span>{search.otrosNombres}</span> */}
      <form className="" onSubmit={handleSubmit} >
        <div className=" rounded-3 shadow-sm p-3 mb-3" style={{backgroundColor:'#C7C8CA'}}>
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
                  placeholder="Nombre Solicitante"
                  value={search.solicitante}
                  onChange={handlerChangeSearch}
                  className="form-control form-control-sm"
                  style={{textTransform:"uppercase"}}
                  required
              />
              </div>        
            </div>
            <hr className="my-1" />
            <div>
              <label className="fw-bold" style={{fontSize:20}}>CLIENTE</label>
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
                    value={(search.primerApellido.toUpperCase())}
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
                    className="form-select form-select-sm m-100 me-3"
                    /* onChange={(e)=>setDocument(JSON.parse(e.target.value))} */
                    required
                    disabled

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
                    min={10000000}
                    name="cedula"
                    pattern="[0-9]"
                    value={search.cedula}
                    onChange={(e)=>(handlerChangeSearch(e),handleInputChange(e))}
                    required
                    disabled
                    style={{backgroundColor:'grey'}}
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
                  <label className="me-1 mb-3">Correo notificaciones:</label>
                  <input
                    id="correoNotificaciones"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoNotificaciones}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    style={{width:585, textTransform:'lowercase'}}
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
{/*                   <span className="validity fw-bold"></span>
 */}              </div>
              <hr className="my-1" />
              <label className="fw-bold mt-1" style={{fontSize:20}}>DATOS FACTURA ELECTRÓNICA</label>
              <div className="d-flex flex-row align-items-start mt-2 ">
                  <label className="me-1 mb-3">Correo para la factura electrónica:</label>
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
              <div className="d-flex flex-row mb-3">
                <div className="pe-3" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Regimen fiscal:</label>
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
            </div>            
            <hr className="my-1" />
            <label className="fw-bold mb-1 mt-1" style={{fontSize:22}}>PROMEDIO DE COMPRA MENSUAL ESTIMADO</label>
            <div className="d-flex flex-row w-100 mt-2 mb-4">
              <div className="d-flex flex-row align-items-start w-100">
                  <label className="">Promedio Compra:</label>
                  <label className="ps-2">$</label>
                  <input
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
                  </input>
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
            <div className="w-100 mt-1">
              <label className="fw-bold" style={{fontSize:20}}>DOCUMENTOS OBLIGATORIOS</label>
              <div className="d-flex flex-row ">
                <div className="pe-2 w-50">
                  <div className="d-flex flex-column" >
                  <div className="d-flex flex-row">
                  
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
                  </div>   
                  <div className="d-flex flex-column">               
                  <TextOfBinary valor={search.docRut}></TextOfBinary>
                  {search.docRut === 1 && (
                    <CarpetaArchivoLink carpeta={`${search.cedula}-${search.primerApellido}-${search.segundoApellido}-${search.primerNombre}-${search.otrosNombres}`} archivo={`Rut-${search.primerApellido} ${search.segundoApellido} ${search.primerNombre} ${search.otrosNombres}.pdf`}/>
                  )}
                  </div>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docRut"
                    type="file"
                    placeholder="docRut"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:338}}
                    /* onChange={(e) => (handleFileChange(e, 0),setDocRut(1))} */
                    /* second form */
                    onChange={(e) => (handleFileChange('Rut', e),/* setSearch({docRut:1}) */setDocRut(1),FileChange(e,1),changeSearch(e))}
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
                <div className="ps-2 w-50" >
                  <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">INFOLAFT: </label>
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
                    placeholder="docInfrl"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    /* value={search.docInfrl} */
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,2),changeSearch(e))}
                  />
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
              <div className="ps-2 w-50" >
                  <div className="d-flex flex-column" >
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
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
                    placeholder="docOtros"
                    /* value={search.docOtros} */
                    style={{backgroundColor:'#f3f3f3',width:720}}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    /* onChange={(e) => (handleFileChange(e, 2),setDocOtros(1))} */
                    onChange={(e) => (handleFileChange('Otros',e),setDocOtros(1),FileChange(e,3),changeSearch(e))}
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
            </div>
            
          </div>
        <div className="d-flex flex-column mb-3 mt-3">
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