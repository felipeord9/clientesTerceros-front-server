import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { getAllPrecios } from "../../services/precioService";
import { createCliente, deleteCliente } from "../../services/clienteService";
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { Navigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import VinculacionProveedor from '../../pdfs/FORMATO  VINCULACION DE PROVEEDORES.pdf'
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import Compromiso from '../../pdfs/COMPROMISO ANTICORRUPCION.pdf';
import { FaFileDownload } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { updateBitacora } from '../../services/bitacoraService';

export default function CreditoPersonaNatural(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [regimen,setRegimen]= useState(null);
  const [detalle,setDetalle]=useState(null);
  const [clasificacion,setClasificacion] = useState(null);
  const [document,setDocument]=useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [responsabilidad,setResponsabilidad ] = useState(null);
  const [departamento,setDepartamento]= useState('');
  const [precio, setPrecio] = useState(null);

  /* inicializar para hacer la busqueda (es necesario inicializar en array vacio)*/
  const [clasificaciones, setClasificaciones]= useState([]);
  const [agencias, setAgencias] = useState([]);
  const [documentos,setDocumentos] = useState([]);
  const [detalles,setDetalles]=useState([]);
  const [regimenes,setRegimenes] = useState([]);
  const [ciudades,setCiudades] = useState([]);
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
  });
/*   const [folderName, setFolderName] = useState('');
 */
  /* Variable para agregar los pdf */
  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    setFiles(prevFiles => ({ ...prevFiles, [fieldName]: selectedFile }));
  };
  /* const handleFileChange = (event, index) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  }; */
  //------------------------------------------

  const [search, setSearch] = useState({
    cedula:'',
    tipoPersona:'1',
    primerApellido:'',
    segundoApellido:'',
    primerNombre:'',
    otrosNombres:'',
    direccion:'',
    celular:'',
    telefono:'',
    correoNotificaciones:'',
    correoFacturaElectronica:'',
    observations:'',
    solicitante:'',
    tipoFormulario:'PNCR',
    valorEstimado:'',
  });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está segur@?",
        text: "Se realizará el registro del cliente",
        icon: "question",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#198754",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
    }) .then(({isConfirmed})=>{
      if(isConfirmed){
        setLoading(true);
        //agregamos los pdf a un formdata dependiendo del index que les dimos
        /* const formData = new FormData();
        files.forEach((file, index) => {
          if (file) {
            formData.append(`pdfFile${index}`, file);
          }
        }); */
        const formData = new FormData();

        for (const fieldName in files) {
          if (files[fieldName]) {
            formData.append(fieldName, files[fieldName]);
          }
        }
        //creamos el cuerpo de nuestra instancia
        const body={
          clasificacion: clasificacion.description,
          agencia: agencia.id,
          tipoDocumento: document.codigo,
          departamento: departamento.codigo,
          ciudad: ciudad.codigo,
          createdAt: new Date(),
          createdBy: user.name.toUpperCase(),
          regimenFiscal: regimen.id,
          responsabilidadFiscal: responsabilidad.id,
          detalleTributario: detalle.id,
          tipoDocRepLegal: document.codigo,
          departamentoSucursal:departamento.codigo,
          ciudadSucursal:ciudad.codigo,
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
          precioSugerido: precio.description,
          observations:search.observations,
          solicitante:search.solicitante.toUpperCase(),
          tipoFormulario:search.tipoFormulario,
          docVinculacion:docVinculacion,
          docComprAntc:docComprAntc,
          docCtalnst:docCtaInst,
          docPagare:docPagare,
          docRut:docRut,
          docCcio:docCcio,
          docCrepL:docCrepL,
          docEf:docEf,
          docRefcom:docRefcom,
          docCvbo:docCvbo,
          docFirdoc:docFirdoc,
          docInfemp:docInfemp,
          docInfrl:docInfrl,
          docValAnt:docValAnt,
          docCerBan:docCerBan,
          docOtros:docOtros,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        createCliente(body)
        .then(({data}) => {
          fileSend(formData)
          const info={
            accion:'1',
          }
          updateBitacora(user.email,info)
          .then(()=>{
            setLoading(false)
            setFiles([])
            Swal.fire({
              title: 'Creación exitosa!',
              text: `El Cliente "${data.razonSocial}" con Número 
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
          });
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
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white'}}
    >
    <center>
      <section className="d-flex flex-row justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <center>
          <Fade cascade='true'>
          <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger pb-2" style={{fontSize:150}}><strong>persona NATURAL - pago a CRÉDITO</strong></label>
          </Fade>
          </center>
        <hr className="my-1" />
        </div>
      </section>
    </center>
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
            <div>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column me-4 w-100">
              <label className="fw-bold" style={{fontSize:18}}>CLASIFICACIÓN</label>
              <select
                ref={selectClasificacionRef}
                className="form-select form-select-sm"
                onChange={(e)=>setClasificacion(JSON.parse(e.target.value))}
                required
              >
                <option selected value="" disabled>
                  -- Seleccione la Clasificación --
                </option>
                {clasificaciones
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(                    
                    <option id={elem.id} value={JSON.stringify(elem)}>
                      {elem.id + ' - ' + elem.description} 
                    </option>
                  ))
                }
              </select>
              </div>
              <div className="d-flex flex-column w-100 ">
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
                 
              />
              </div>        
            </div>
            <hr className="my-1" />
            <div className="mb-3">
              <label className="fw-bold mb-1" style={{fontSize:20}}>CLIENTE</label>
              <div className="d-flex flex-row">
                <div className="d-flex flex-column align-items-start w-25 pe-3">
                  <label className="me-1 w-25">1er.Apellido:</label>
                  <input
                    id="primerApellido"
                    type="text"
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm "                     
                    min={0}
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
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm "                     
                    min={0}
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
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm "                     
                    min={0}
                    required
                    placeholder="Campo obligatorio"
                    value={search.primerNombre}
                    onChange={handlerChangeSearch}
                  />
                </div>
                <div className="d-flex flex-column w-25">
                <label className="me-1 ">OtrosNombres:</label>
                  <input
                    id="otrosNombres"
                    type="text"
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm w-100"                     
                    min={0}
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
                  style={{width:250}}
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
                <div>
                </div>
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Identificación:</label>
                  <input
                    id="cedula"
                    type="number"
                    className="form-control form-control-sm w-100"
                    min={10000000}
                    max={9999999999}
                    value={search.cedula}
                    pattern="[0-9]"
                    onChange={handlerChangeSearch}
                    required
                    placeholder="Campo obligatorio"
                    maxLength={10}
                  >
                  </input>
                  <span className="validity fw-bold"></span>
                </div>
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
                  value={search.celular}
                  onChange={handlerChangeSearch}
                    id="celular"
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    max={9999999999}
                    pattern="[0-9]"
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
                    className="form-control form-control-sm"
                    min={1000000}
                    max={9999999999}
                    pattern="[0-9]"
                    placeholder="(Campo Opcional)"
                  >
                  </input>
                </div>
              </div>
              <div className="d-flex flex-row align-items-start">
                  <label className="me-1">Correo notificaciones:</label>
                  <input
                    id="correoNotificaciones"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoNotificaciones}
                    style={{width:600,textTransform:'lowercase'}}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
{/*                    <span className="validity fw-bold"></span>
 */}              </div>
            
            </div> 
            <hr className="my-1" />
              <label className="fw-bold mt-1" style={{fontSize:20}}>DATOS FACTURA ELECTRONICA</label>
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
                    style={{width:513, textTransform:'lowercase'}} 
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
                ref={selectRegimenRef}
                className="form-select form-select-sm w-100"
                required
                onChange={(e)=>setRegimen(JSON.parse(e.target.value))}
              >
                <option selected value='' disabled>
                  -- Seleccione el regimen --
                </option>
                {regimenes
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={JSON.stringify(elem)}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
                </div>
                <div className=" pe-3" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Responsabilidad fiscal:</label>
                <select
                ref={selectBranchRef}
                className="form-select form-select-sm w-100"
                required
                onChange={(e)=>setResponsabilidad(JSON.parse(e.target.value))}
              >
                <option selected value='' disabled>
                  -- Seleccione la responsabilidad --
                </option>
                {responsabilidades
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={JSON.stringify(elem)}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
                </div>
                <div className="" style={{width:255}}>
                <label className="fw-bold" style={{fontSize:18}}>Detalle tributario:</label>
                <select
                ref={selectBranchRef}
                className="form-select form-select-sm w-100"
                required
                onChange={(e)=>setDetalle(JSON.parse(e.target.value))}
              >
                <option selected value='' disabled>
                  -- Seleccione el detalle --
                </option>
                {detalles
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={JSON.stringify(elem)}>
                      {elem.id + " - " + elem.description}
                    </option>
                  ))}
              </select>
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
                  <label className="me-1">Precio sugerido:</label>
                  <select
                    style={{width:255}}
                    ref={selectPrecioRef}
                    className="form-select form-select-sm m-100 me-3"
                    onChange={(e)=>setPrecio(JSON.parse(e.target.value))}
                    required
                  >
                    <option selected value='' disabled>
                  -- Seleccione el tipo de precios sugerido --
                </option>
                  {precios
                  .sort((a, b) => a.id - b.id)
                  .map((elem) => (
                    <option id={elem.id} value={JSON.stringify(elem)}>
                      {elem.description}
                    </option>
                  ))}
              </select>
                  </div>
              </div>
              <hr className="my-1" />
            <div className="w-100 mt-1">
               
              <label className="fw-bold" style={{fontSize:24}}>DOCUMENTOS OBLIGATORIOS</label>
              
              <div className="d-flex flex-row ">
                <div className="me-2 w-100">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:280}}>FORMATO DE VINCULACIÓN: </label>
                  <a className="" style={{fontSize:18}} href={VinculacionCliente} download="FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:330}}
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
                  <label className="fw-bold mt-1 " style={{width:280}}>COMPROMISO ANTICORRUPCIÓN: </label>
                  <a className="" style={{fontSize:18}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf">
                  <FaFileDownload />{/* <IoMdDownload /> */}Descargar
                  </a>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocComprAntc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
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
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">CARTA DE INSTRUCCIONES: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCtaInst"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,2),setDocCtaInst(1))} */
                    onChange={(e)=>(handleFileChange('CtaInst',e),setDocCtaInst(1),FileChange(e,3))}
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
                  <label className="fw-bold mt-1 me-2">PAGARE: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocPagare"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,3),setDocPagare(1))} */
                    onChange={(e)=>(handleFileChange('Pagare',e),setDocPagare(1),FileChange(e,4))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  
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
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocRut"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,4),setDocRut(1))} */
                    onChange={(e)=>(handleFileChange('Rut',e),setDocRut(1),FileChange(e,5))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                 
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
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                  <label className="fw-bold mt-1 me-2">CERTIFICADO CAMARA DE COMERCIO: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCcio"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,5),setDocCcio(1))} */
                    onChange={(e)=>(handleFileChange('Ccio',e),setDocCcio(1),FileChange(e,6))}
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
                  <label className="fw-bold mt-1 me-2">CÉDULA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCrepL"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,6),setDocCrepL(1))} */
                    onChange={(e)=>(handleFileChange('CrepL',e),setDocCrepL(1),FileChange(e,7))}
                    placeholder="RUT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  
                    />
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
                  <label className="fw-bold mt-1 me-2">ESTADOS FINANCI. O CERTIFI. DE CONTADOR: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocEf"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,7),setDocEf(1))} */
                    onChange={(e)=>(handleFileChange('Ef',e),setDocEf(1),FileChange(e,8))}
                    placeholder="RUT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                 
                    />
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
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">CERTIFICACIÓN BANCARIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCerBan"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,8),setDocCerBan(1))} */
                    onChange={(e)=>(handleFileChange('Certban',e),setDocCerBan(1),FileChange(e,9))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  
                    />
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
                  <label className="fw-bold mt-1 me-2">REFERENCIAS COMERCIALES: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocRefcom"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,9),setDocRefcom(1))} */
                    onChange={(e)=>(handleFileChange('Refcom',e),setDocRefcom(1),FileChange(e,10))}
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
                </div> 
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">CARTA VISTO BUENO ADMINIS. DE LA AGENCIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCvbo"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,10),setDocCvbo(1))} */
                    onChange={(e)=>(handleFileChange('Cvbo',e),setDocCvbo(1),FileChange(e,11))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                  <label className="fw-bold mt-1 me-2">VALIDACIÓN DE ANTECEDENTES: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocValAnt"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,11),setDocValAnt(1))} */
                    onChange={(e)=>(handleFileChange('ValAnt',e),setDocValAnt(1),FileChange(e,12))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">FICHA RELACIÓN DOCUMENTOS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocFirdoc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,12),setDocFirdoc(1))} */
                    onChange={(e)=>(handleFileChange('Firdoc',e),setDocFirdoc(1),FileChange(e,13))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
                <div className="d-flex flex-column mt-2 w-100 ">
                  <label className="fw-bold mt-1">OTROS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,13),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,14))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  
                    />
                    {selectedFiles[14] && (
                    <div className=" pt-1 ps-2" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[14])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                </div> 
              </div>
              
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-bold" style={{fontSize:20}}>OBSERVACIONES</label>
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
    </div>
  );
}