import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { MdNoteAdd } from "react-icons/md";
import { getAllPrecios } from "../../services/precioService";
import { Fade } from "react-awesome-reveal";
import { createCliente, deleteCliente } from "../../services/clienteService";
import { fileSend, deleteFile } from "../../services/fileService";
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService';
import { FaFileDownload } from "react-icons/fa";
import VinculacionProveedor from '../../pdfs/FORMATO  VINCULACION DE PROVEEDORES.pdf'
import VinculacionCliente from '../../pdfs/FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import Compromiso from '../../pdfs/COMPROMISO ANTICORRUPCION.pdf';
import { FaEye } from "react-icons/fa";
import { updateBitacora } from '../../services/bitacoraService';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { createSucursal, deleteSucursalByName } from "../../services/sucursalService";
import ComproAntiCorrup from '../../pdfs/SALF-05 COMPROMISO ANTICORRUPCION.pdf';
import NewVinCliente from '../../pdfs/SALF-02 FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';

export default function CreditoPersonaJuridica(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [clasificacion,setClasificacion] = useState(null);
  const [document,setDocument]=useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [departamento,setDepartamento]= useState('');
  const [city,setCity]=useState(null);
  const [depart, setDepart]=useState('');
  const [regimen,setRegimen]= useState(null);
  const [detalle,setDetalle]=useState(null);
  const [responsabilidad,setResponsabilidad ] = useState(null);
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

  /* Inicializar las documentos adjuntos (0 = no adjnuto, 1 = adjunto ) */
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
 /*  const [files, setFiles] = useState([]); */
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
    input16: null,
    input17: null,
    input18: null,
    input19: null,
    input20: null,
  });
/*   const [folderName, setFolderName] = useState('');
 */
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
  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    setFiles(prevFiles => ({ ...prevFiles, [fieldName]: selectedFile }));
  };
  /* Variable para agregar los pdf */
  /* const handleFileChange = (event, index) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files[0];
    setFiles(newFiles);
  }; */
  //------------------------------------------

  const [search, setSearch] = useState({
    cedula:'',
    DV:'',
    tipoDocumento:'N',
    tipoPersona:'2',
    razonSocial:'',
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
    tipoFormulario:'PJCR',
    tipo:'N',
    valorEstimado:'',
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
    console.log(value);
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
/*       setFiles(newFile);
 */    }
  };
  const [info,setInfo]=useState({
    accion:'1',
  })
  const handleExit=async(e)=>{
    e.preventDefault();
    const body={
      accion:info.accion,
    }
    updateBitacora(user.email,body);
  }
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
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        setLoading(true);
        const formData = new FormData();

        for (const fieldName in files) {
          if (files[fieldName]) {
            formData.append(fieldName, files[fieldName]);
          }
        }
        /* const formData = new FormData();
        files.forEach((file, index) => {
          if (file) {
            formData.append(`pdfFile${index}`, file);
          }
        }) */
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
          departamento:departamento.codigo,
          ciudad: ciudad.codigo,
          direccion: search.direccion.toUpperCase(),
          celular: search.celular,
          telefono: search.telefono,
          correoNotificaciones: search.correoNotificaciones.toLowerCase(),
          nombreSucursal:search.nombreSucursal.toUpperCase(),
          direccionSucursal: search.direccionSucursal.toUpperCase(),
          departamentoSucursal: depart.codigo,
          ciudadSucursal: city.codigo,
          celularSucursal: search.celularSucursal,
          telefonoSucursal: search.telefonoSucursal,
          correoSucursal: search.correoSucursal.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          regimenFiscal: regimen.id,
          responsabilidadFiscal: responsabilidad.id,
          detalleTributario: detalle.id,
          numeroDocRepLegal: search.numeroDocRepLegal,
          nameRepLegal: search.nameRepLegal.toUpperCase(),
          tipoDocRepLegal: document.codigo,
          apellidoRepLegal: search.apellidoRepLegal.toUpperCase(),
          valorEstimado: search.valorEstimado,
          precioSugerido: precio.description,
          observations: search.observations,
          createdAt: new Date(),
          createdBy: user.name.toUpperCase(),
          solicitante: search.solicitante.toUpperCase(),
          docVinculacion:docVinculacion,
          docComprAntc:docComprAntc,
          docCtalnst:docCtaInst,
          docPagare:docPagare,
          docRut:docRut,
          docCcio:docCcio,
          docCrepL:docCrepL,
          docEf:docEf,
          docRefcom:docRefcom,
          docRefcom2:compare.docRefcom2,
          docRefcom3:compare.docRefcom3,
          docCvbo:docCvbo,
          docFirdoc:docFirdoc,
          docInfemp:docInfemp,
          docInfrl:docInfrl,
          docValAnt: docValAnt,
          docCerBan: docCerBan,
          docOtros:docOtros,
          clasificacion: clasificacion.description,
          agencia: agencia.id,
          tipoFormulario: search.tipoFormulario,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+search.razonSocial.toUpperCase();
        formData.append('originalFolderName', originalFolderName);
        const clientName = search.razonSocial.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        const sucur = {
          cedula: search.cedula,
          codigoSucursal: 1,
          nombreSucursal: search.razonSocial.toUpperCase()+' - '+search.nombreSucursal.toUpperCase(),
          direccion: search.direccionSucursal,
          ciudad: city.description,
          celular: search.celularSucursal,
          correoFacturaElectronica: search.correoSucursal,
          nombreContacto: search.razonSocial.toUpperCase(),
          celularContacto: search.celular,
          correoContacto: search.correoNotificaciones,
          createdAt:new Date(),
          userName:user.name
        }
        createSucursal(sucur)
        .then(()=>{
          console.log('sucursal creada')
        }).catch((err)=>{
          Swal.fire({
            title:'¡Uops!',
            text:'Ha ocurrido un error al momento de crear la sucursal de este cliente. Informa a el área de sistemas.'
          })
        })
        createCliente(body)
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
            deleteSucursalByName(search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase());
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
  /* const ValidadorCorreo = ({ correo }) => {
    const [mensajeValidacion, setMensajeValidacion] = useState('');
    
    const validarCorreo = () => {
      if (correo.includes('@') && correo.split('@')[1].includes('.')) {
        setMensajeValidacion('Correo válido');
      } else {
        setMensajeValidacion('Falta un punto después del @');
      }
    }
    validarCorreo();
    return (
      <div>
        <p>{mensajeValidacion}</p>
      </div>
    );
  } */
  const [selectedFiles, setSelectedFiles] = useState([]);

  const FileChange = (event, index) => {
    const newFiles = [...selectedFiles];
    const file = event.target.files[0];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };
  
    return(
    <div className=" wrapper d-flex justify-content-center w-100 m-auto" style={{userSelect:'none'}}>
    <div
      className=" login-wrapper shadow rounded-4 border border-3 pt-4 mt-5 overflow-auto" style={{backgroundColor:'white',userSelect:'none'}}
    >
    <center>
      <section className="d-flex flex-row justify-content-between align-items-center mb-2">
        <div className="d-flex flex-column">
          <center>
          <Fade cascade='true'>
          <h1 className="fs-3 fw-bold m-1 ms-4 me-4 text-danger pb-2"><strong>persona JURÍDICA - pago a CRÉDITO</strong></h1>
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
              <div className="d-flex flex-row mt-2 mb-2  w-100">
              <label className="fw-bold me-1" style={{fontSize:18}}>SOLICITANTE:</label>
              <input
                  id="solicitante"
                  value={search.solicitante}
                  onChange={handlerChangeSearch}
                  type="text"
                  min={0}
                  style={{textTransform:"uppercase"}}
                  placeholder="Nombre Solicitante"
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
                  <label className="me-1">Razón social:</label>
                  <input
                    id="razonSocial"
                    type="text"
                    style={{textTransform:"uppercase", width:286}}
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
                    min={100000000}
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
                  style={{textTransform:"uppercase"}}
                  className="form-control form-control-sm w-75"
                  min={0}
                  required
                  value={search.direccion}
                  onChange={handlerChangeSearch}
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
                    className="form-control form-control-sm "
                    min={1000000}
                    max={9999999999}
                    required
                    pattern="[0-9]"
                    value={search.celular}
                    onChange={handlerChangeSearch}
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
                    max={9999999999}
                    pattern="[0-9]"
                    value={search.telefono}
                    onChange={handlerChangeSearch}
                    placeholder="(Campo Opcional)"
                  >
                  </input>
                </div>
              </div>
              <div className="d-flex flex-row align-items-start mb-3 w-100">
                  <label className="me-1">Correo notificación:</label>
                  <input
                    id="correoNotificaciones"
                    type="email"
                    className="form-control form-control-sm "
                    min={0}
                    value={search.correoNotificaciones}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambio(e))}
                    required
                    style={{width:625,textTransform:'lowercase'}}
                    placeholder="Campo obligatorio"
                  >
                  </input>
{/*                   <validarCorreo correo={search.correoNotificaciones}/>
 */}                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
                  {/* <span className="validity fw-bold"></span> */}
              </div>
              
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
                    style={{width:668, textTransform:"uppercase"}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
              </div>
              <div className="d-flex flex-row align-items-start w-100 mt-2">
                  <label className="me-1">Dirección sucursal:</label>
                  <input
                    id="direccionSucursal"
                    type="text"
                    className="form-control form-control-sm"
                    min={0}
                    value={search.direccionSucursal}
                    onChange={handlerChangeSearch}
                    required
                    style={{width:660, textTransform:"uppercase"}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
              </div>

              <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-row w-100">
                <label className="me-1">Departamento:</label>
                <select                    
                    onChange={(e)=>setDepart(JSON.parse(e.target.value))}
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
                    disabled={depart ? false : true}
                    onChange={(e)=>setCity(JSON.parse(e.target.value))} 
                  >
                    
                  <option selected value='' disabled>
                    -- Seleccione la Ciudad --
                  </option>  
                  {ciudades
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    elem.id === depart.id ?
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
                    id="celularSucursal"
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    max={9999999999}
                    value={search.celularSucursal}
                    onChange={handlerChangeSearch}
                    required
                    pattern="[0-9]"
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
                    type="number"
                    className="form-control form-control-sm"
                    min={1000000}
                    pattern="[0-9]"
                    max={9999999999}
                    value={search.telefonoSucursal}
                    onChange={handlerChangeSearch}
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
                    value={search.correoSucursal}
                    style={{width:650,textTransform:'lowercase'}}
                    onChange={(e)=>(handlerChangeSearch(e),manejarCambioCorreo(e))}
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <p  className="ps-3" style={{color:colorSpan}}><strong>{mensajeValidacion}</strong></p>
                  {/* <p>{mensajeValidacion}</p> */}
                  {/* <span className="validity fw-bold"></span> */}
              </div>
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
                    style={{width:525,textTransform:'lowercase'}} 
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <p  className="ps-3" style={{color:color}}><strong>{mensaje}</strong></p>
                  {/* <span className="validity fw-bold"></span> */}
              </div>
              <div className="d-flex flex-row mb-4">
                <div className="pe-3" style={{width:265}}>
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
                <div className=" pe-3" style={{width:265}}>
                <label className="fw-bold" style={{fontSize:18}}>Responsabilidad fiscal:</label>
                <select
                ref={selectResponsabilidadRef}
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
                <div className="" style={{width:265}}>
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
              <div className="mt-4">
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
                  style={{width:257}}
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
                    type="number"
                    className="form-control form-control-sm"
                    min={10000}
                    max={9999999999}
                    pattern="[0-9]"
                    value={search.numeroDocRepLegal}
                    onChange={handlerChangeSearch}
                    required
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold"></span>
                </div>
              </div>
              </div>
              <hr className="my-1" />
            </div> 
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
                    style={{width:260}}
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
                  <label className="fw-bold mt-1 w-75" /* style={{width:200}} */>FORMATO DE VINCULACIÓN: </label>
                  {/* <a className="" style={{fontSize:18}} href={VinculacionCliente} download="FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf"> */}
                  <a className="" style={{fontSize:18}} href={NewVinCliente} download="SALF-02 FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
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
                  <label className="fw-bold mt-1 w-75">COMPROMISO ANTICORRUPCIÓN: </label>
                  {/* <a className="" style={{fontSize:18}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf"> */}
                  <a className="" style={{fontSize:18}} href={ComproAntiCorrup} download="SALF-05 COMPROMISO ANTICORRUPCION.pdf">
                  <FaFileDownload />Descargar
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
                    /* onChange={(e)=>(handleFileChange(e, 2),setDocCtaInst(1))} */
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
                    /* onChange={(e)=>(handleFileChange(e, 3),setDocPagare(1))} */
                    onChange={(e)=>(handleFileChange('Pagare',e),setDocPagare(1),FileChange(e,4))}
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
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocRut"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 4),setDocRut(1))} */
                    onChange={(e)=>(handleFileChange('Rut',e),setDocRut(1),FileChange(e,5))}
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
                  <label className="fw-bold mt-1 me-2">CERTIFICADO CAMARA DE COMERCIO: </label>
                  <label className="ms-2 mt-1 ">(Con una vigencia no mayor a 30 días) </label>

                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCcio"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 5),setDocCcio(1))} */
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
                  <label className="fw-bold mt-1 me-2">CÉDULA REPRESENTANTE LEGAL: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCrepL"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,6),setDocCrepL(1))} */
                    onChange={(e)=>(handleFileChange('CrepL',e),setDocCrepL(1),FileChange(e,7))}
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
                  <label className="fw-bold mt-1 me-2">ESTADOS FINANCIEROS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocEf"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 7),setDocEf(1))} */
                    onChange={(e)=>(handleFileChange('Ef',e),setDocEf(1),FileChange(e,8))}
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
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">CARTA VISTO BUENO ADMINIS. DE LA AGENCIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocCvbo"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 8),setDocCvbo(1))} */
                    onChange={(e)=>(handleFileChange('Cvbo',e),setDocCvbo(1),FileChange(e,9))}
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
                  <label className="fw-bold mt-1 me-2">REFERENCIAS COMERCIALES: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row mb-2">
                  <IconButton  style={{backgroundColor:'#2979FF',color:'white',width:40,height:40}} className="rounded-5 d-flex justify-content-center align-items-center me-1 " onClick={addFileInput}><MdNoteAdd />{/* <img src={Mas} style={{width:18}} /> */}</IconButton>       
                  <input
                    id="DocRefcom"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:282}}
                    /* onChange={(e)=>(handleFileChange(e, 9),setDocRefcom(1))} */
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
                      style={{backgroundColor:'#f3f3f3',width:282}}
                      /* onChange={(e)=>(handleFileChange(e,9),setDocRefcom(1))} */
                      onChange={(e)=>(handleFileChange(`Refcom${input.id+1}`,e),FileChange(e,11+index),actualizarFiles(input.id,e),changeSearch(e))}
                      className="form-control form-control-sm border border-5 rounded-3 d-flex flex-column mb-2"
                      accept=".pdf"                  
                    />
                    {/* <span>`Refcom {input.id+1}`</span> */}
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
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">INFOLAFT EMPRESA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocInfemp"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 10),setDocInfemp(1))} */
                    onChange={(e)=>(handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,14))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
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
                <div className="d-flex flex-column mt-2 w-100 ms-2">
                  <label className="fw-bold mt-1 me-2">INFOLAFT REP. LEGAL: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocInfrl"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e, 11),setDocInfrl(1))} */
                    onChange={(e)=>(handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,15))}
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
              </div>
              <div className="d-flex flex-row">
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">FICHA RELACIÓN DOCUMENTOS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docFirdoc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,12),setDocFirdoc(1))} */
                    onChange={(e)=>(handleFileChange('Firdoc',e),setDocFirdoc(1),FileChange(e,17))}
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
                <div className="d-flex flex-column mt-2 w-100 ">
                  <label className="fw-bold mt-1">CERTIFICACION BANCARIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docCerBan"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,13),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Certban',e),setDocCerBan(1),FileChange(e,18))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  
                    />
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
              <div className="d-flex flex-column mt-2 w-100">
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:736}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,19))}
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
            </div>

          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-bold" style={{fontSize:22}}>OBSERVACIONES</label>
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