import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button/* , Modal */ } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { getAllTipoFormularios } from '../../services/tipoFormularioService'
import { getAllPrecios } from "../../services/precioService";
import { createCliente, deleteCliente , sendMail } from "../../services/clienteService";
import { createPreAprovacion, deletePreAprovacion } from "../../services/preAprovacionService";
import DepartmentContext  from "../../context/departamentoContext";
import { Fade } from "react-awesome-reveal";
import { Navigate } from "react-router-dom";
import { TiDelete } from "react-icons/ti";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { MdNoteAdd } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import Modal from '@mui/material/Modal';
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import { FaFileDownload } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import TextField from '@mui/material/TextField';
import Logo from '../../assest/logo-gran-langostino.png'
import { updateBitacora } from '../../services/bitacoraService';
import { createSucursal, deleteSucursalByName } from "../../services/sucursalService";
import ComproAntiCorrup from '../../pdfs/SALF-05 COMPROMISO ANTICORRUPCION.pdf';
import NewVinCliente from '../../pdfs/SALF-02 FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf';
import  {  NumericFormat  }  from  'react-number-format' ;
import { Box } from "@mui/material";
import { validarCliente , findClientes } from "../../services/clienteService"; 
import { validarProveedor , findProveedores } from "../../services/proveedorService";
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height:600,
  overflow:'auto',
  bgcolor: 'background.paper',
  justifyContent:'center',
  boxShadow: 24,
  p: 4,
  /* borderRadius:5, */
};

export default function CreditoPersonaNatural(){
  /* instancias de contexto */
  const { user, setUser } = useContext(AuthContext);
  const {department,setDepartment}=useContext(DepartmentContext)
  const navigate = useNavigate()

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
  const [formularios,setFormularios] = useState([]);

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

    input15: null,
    input16: null,
    input17: null,
    input18: null,

    input19: null,
    input20: null,
    input21: null,
  });

  /* agregar un input de referencias comerciales */
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
    } 
  };
  const actualizarFiles =(id,event)=>{
    const updatedInputs = fileInputs.map((input) =>
      input.id === id ? { ...input, file: event.target.files[0] } : input
    );
    setFileInputs(updatedInputs);
  }

  const handleFileChange = (fieldName, e) => {
    const selectedFile = e.target.files[0];
    if(selectedFile && selectedFile.type === 'application/pdf'){
      setFiles(prevFiles => ({ ...prevFiles, [fieldName]: selectedFile }));
    }else{
      Swal.fire({
        icon:'warning',
        title:'¡ATENCION!',
        text:'El aplicativo solo acepta archivo con extensión .pdf',
        showConfirmButton:true,
        confirmButtonColor:'#198754',
        confirmButtonText:'Entendido'
      })
    }
  };

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
    nombreComercial:'',
  });

  const [docVboAg,setDocVboAg] = useState(0);
  const [docVboDc,setDocVboDc] = useState(0);
  const [docVboDf,setDocVboDf] = useState(0);
  
  const [info,setInfo]=useState({
    fechaRenovaCcio:'',
    puntajeDataCredito:'',
    capitalTrabajo:'',
    razonEndeudamiento:'',
    IndiceSolvencia:'',
    observations:'',
    estadoVboAg:'Pendiente Revision',
    estadoVboDc:'Pendiente Revision',
    estadoVboDf:'Pendiente Revision',
    nivelEndeudamiento:'',
    cupoRecomendado:'',
    plazoRecomendado:'',
    cupoAprovado:'',
    plazoAprovado:'',
    fechaCreacion:'',
  })

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
    getAllTipoFormularios().then((data)=>setFormularios(data));

},[]);

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    setSearch({
      ...search,
      [id]: value,
    });
  };

  const handlerChangeInfo = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const [actualizar,setActualizar] = useState('')
  const [rzNotEnty,setRzNotEnty] = useState(false)
  const [clientes,setClientes] = useState()
  const [proveedores,setProveedores] = useState()
  useEffect(()=>{
    findClientes()
    .then(({data})=>{
      setClientes(data)
    })
    findProveedores()
    .then(({data})=>{
      setProveedores(data)
    })
  },[])

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if(search.cedula.length>=5 && search.cedula.length<=10){
        const filtroCliente = clientes.filter((item)=>{
          if(item.cedula === search.cedula){
            return item
          }
        })
        const filtroProveedor = proveedores.filter((elem)=>{
          if(elem.cedula === search.cedula){
            return elem
          }
        })
        if(filtroCliente.length>0 || filtroProveedor.length>0){
          Swal.fire({
            title:'¡ATENCIÓN!',
            text:`El numero de identificación ${search.cedula}
            se encuentra registrado en nuestra base de datos como 
            
            ${filtroCliente.map((elem)=>{
              return elem.tipoFormulario
            })} ${filtroProveedor.map((item)=>{
              return item.tipoFormulario
            })}. 
            ¿Qué acción desea realizar?`,
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:'#D92121',
            confirmButtonText:'Consultar',
            cancelButtonText:'Regresar',
            showDenyButton:true,
            denyButtonColor:'blue',
            denyButtonText:'Actualizar'
          }).then(({isConfirmed,isDenied})=>{
            if(isConfirmed){
              if(user.role==='admin'){
                navigate('/validacion/admin')
              }
              if(user.role==='cartera'){
                navigate('/validar/tercero')
              }
              if(user.role==='compras' || user.role==='agencias'
              || user.role==='comprasnv'){
                navigate('/validar/proveedor')
              }
            }else if(isDenied){
              if(filtroCliente.length>0 && filtroProveedor.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido:item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento                  })
                })
              }else if(filtroCliente.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido:item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento                  })
                })
              }else if(filtroProveedor.length>0){
                filtroProveedor.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido:item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento                  })
                })
              }
              setActualizar('SI')
              setRzNotEnty(true)
            }
          })
        }
      }else{
        Swal.fire({
          icon:'warning',
          title:'Recuerda que el NÚMERO DE IDENTIFICACIÓN debe contener entre 5 y 10 caracteres',
          confirmButtonColor:'#D92121',
          confirmButtonText:'OK'
        })
      }
    };
  }

  const devolverLista = (lista) =>{
    const filtrar = lista.map((item)=>{
      //funcion para que los prefijos de los formatos quede amplio
      /* if(item.tipoFormulario==='PNC'){
        return 'PERSONA NATURAL CONTADO,'
      }else if(item.tipoFormulario==='PJCR'){
        return 'PERSONA JURIDICA CONTADO,'
      }else if(item.tipoFormulario==='PNCR'){
        return 'PERSONA NATURAL CREDITO,'
      }else if(item.tipoFormulario==='PJCR'){
        return 'PERSONA JURIDICA CREDITO,'
      }else if(item.tipoFormulario==='PMJ'){
        return 'PROVEEDOR MCIA Y CONVENIOS - PERSONA JURIDICA,'
      }else if(item.tipoFormulario==='PMN'){
        return 'PROVEEDOR MCIA Y CONVENIOS - PERSONA NATURAL,'
      }else if(item.tipoFormulario==='PS'){
        return 'PRESTADOR DE SERVICIOS,'
      }else if(item.tipoFormulario==='PVJ'){
        return 'PROVEEDORES VARIOS - PERSONA JURIDICA,'
      }else if(item.tipoFormulario==='PVN'){
        return 'PROVEEDORES VARIOS - PERSONA NATURAL,'
      } */
      return item.tipoFormulario
    })
    const conjunto = new Set(filtrar)
    return Array.from(conjunto)
  }

  //funcion para que cuando se cambie de input se ejecute 
  const handleInputBlur = () => {
    if(search.cedula.length>=5 && search.cedula.length<=10){
      const filtroCliente = clientes.filter((item)=>{
        if(item.cedula === search.cedula){
          return item
        }
      })
      const filtroProveedor = proveedores.filter((elem)=>{
        if(elem.cedula === search.cedula){
          return elem
        }
      })
      if(filtroCliente.length>0 || filtroProveedor.length>0){
        Swal.fire({
          title:'¡ATENCIÓN!',
          text:`El numero de identificación ${search.cedula}
          se encuentra registrado en nuestra base de datos como 
          ${devolverLista(filtroCliente)} ${devolverLista(filtroProveedor)}
          ¿Qué acción desea realizar?`,
          showCancelButton:true,
          showConfirmButton:true,
          confirmButtonColor:'#D92121',
          confirmButtonText:'Consultar',
          cancelButtonText:'Regresar',
          showDenyButton:true,
          denyButtonColor:'blue',
          denyButtonText:'Actualizar'
        }).then(({isConfirmed,isDenied})=>{
          //si es confirmado es porque le dio a consultar
          if(isConfirmed){
            if(user.role==='admin'){
              navigate('/validacion/admin')
            }
            if(user.role==='cartera'){
              navigate('/validar/tercero')
            }
            if(user.role==='compras' || user.role==='agencias'
            || user.role==='comprasnv'){
              navigate('/validar/proveedor')
            }
          }else if(isDenied){
            //si es deni es porque le dio a actualizar
              if(filtroCliente.length>0 && filtroProveedor.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido:item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento
                  })
                })
              }else if(filtroCliente.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido:item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento

                  })
                })
              }else if(filtroProveedor.length>0){
                filtroProveedor.map((item)=>{
                  setSearch({
                    ...search,
                    primerApellido: item.primerApellido,
                    segundoApellido: item.segundoApellido,
                    primerNombre: item.primerNombre,
                    otrosNombres: item.otrosNombres,
                    document: item.tipoDocumento

                  })
                })
              }
            setActualizar('SI')
            setRzNotEnty(true)
          }
        })
      }
    }else{
      Swal.fire({
        icon:'warning',
        title:'Recuerda que el NÚMERO DE IDENTIFICACIÓN debe contener entre 5 y 10 caracteres',
        confirmButtonColor:'#D92121',
        confirmButtonText:'OK'
      })
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
          createdBy: user.rowId.toUpperCase(),
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
          docRefcom2:compare.docRefcom2,
          docRefcom3:compare.docRefcom3,
          docCvbo:docCvbo,
          docFirdoc:docFirdoc,
          docInfemp:docInfemp,
          docInfrl:docInfrl,
          docValAnt:docValAnt,
          docCerBan:docCerBan,
          docOtros:docOtros,
          nombreComercial: search.nombreComercial.toUpperCase(),
          pendiente:1,
          rechazado:0,
          aprobado:0,
          actulizado : actualizar==='' ? null:'SI',
          fechaActualizacion : actualizar === '' ? null:new Date(),

        };
        const preAprovacion = {
          cedula: search.cedula,
          razonSocial: search.primerApellido.toUpperCase() +' '+ search.segundoApellido.toUpperCase() +' '+ search.primerNombre.toUpperCase() +' '+ search.otrosNombres.toUpperCase(),
          fechaRenovaCcio: info.fechaRenovaCcio,
          puntajeDataCredito: info.puntajeDataCredito,
          capitalTrabajo: info.capitalTrabajo,
          razonEndeudamiento: info.razonEndeudamiento,
          IndiceSolvencia: info.IndiceSolvencia,
          observations: info.observations,
          docRut: docRut,
          docCcio: docCcio,
          docRefcom: docRefcom,
          docRefcom2:compare.docRefcom2,
          docInfemp: docInfemp,
          docVboAg: docVboAg,
          docVboDc: docVboDc,
          docVboDf: docVboDf,
          estadoVboAg: info.estadoVboAg,
          estadoVboDc: info.estadoVboDc,
          estadoVboDf: info.estadoVboDf,
          nivelEndeudamiento: info.nivelEndeudamiento,
          cupoRecomendado: info.cupoRecomendado,
          cupoAprovado: info.cupoAprovado,
          plazoAprovado: info.plazoAprovado,
          fechaCreacion: new Date(),
          plazoRecomendado: info.plazoRecomendado,
        }
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+search.primerApellido.toUpperCase()+'-'+ search.segundoApellido.toUpperCase()+'-'+ search.primerNombre.toUpperCase()+'-'+ search.otrosNombres.toUpperCase();
        formData.append('originalFolderName',originalFolderName);
        //creamos una constante con el nombre del cliente para darselo a todos los documentos
        const clientName = search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        const sucur = {
          cedula: search.cedula,
          codigoSucursal: 1,
          nombreSucursal: search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase() + ' - PRINCIPAL',
          direccion: search.direccion,
          departamento:departamento.description,
          ciudad: ciudad.description,
          celular: search.celular,
          correoFacturaElectronica: search.correoFacturaElectronica,
          nombreContacto: search.primerApellido.toUpperCase()+' '+ search.segundoApellido.toUpperCase()+' '+ search.primerNombre.toUpperCase()+' '+ search.otrosNombres.toUpperCase(),
          celularContacto: search.celular,
          correoContacto: search.correoNotificaciones,
          createdAt:new Date(),
          userName:user.rowId
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
          const filtro = formularios.filter((item)=>{
            if(item.id===search.tipoFormulario){
              return item.description
            }
          })
          const tipo = filtro.map((item)=>{
            return item.description
          })
          const mail = {
            agencia: agencia.description,
            razonSocial: search.primerApellido.toUpperCase() +' '+ search.segundoApellido.toUpperCase() +' '+ search.primerNombre.toUpperCase() +' '+ search.otrosNombres.toUpperCase(),
            tipoFormulario: tipo,
          }
          sendMail(mail)
          .then(()=>{
          fileSend(formData)
          /* createPreAprovacion(preAprovacion) */
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
        .catch((error)=>{
          Swal.fire({
            title: "¡Ha ocurrido un error!",
            text: `
            Ha ocurrido un error al momento de enviar el correo a cartera, intente de nuevo.
            Si el problema persiste por favor comuniquese con el área de sistemas.`,
            icon: "error",
            showConfirmButton: true,
            confirmButtonColor:'#198754',
            confirmButtonText:'Aceptar',       
          })
        })
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
  const [open,setOpen]=useState(false);
  
  const handleOpenModal=(e)=>{
    e.preventDefault();
    setOpen(true)
  }
  const handleCloseModal=()=>{
    setOpen(false);
  }
  const[colorText,setColorText] = useState('orange');
  const cambiarColorSelect=(e)=>{
    const opcionSelect=e.target.value;
    let nuevoColor='orange';
    switch(opcionSelect){
      case 'Pendiente Revision':
        nuevoColor='orange';
        break;
      case 'Rechazado':
        nuevoColor='red';
        break;
      case 'Aprobado':
        nuevoColor='green';
        break;
      default:
        nuevoColor='orange';
    }
    setColorText(nuevoColor);
  };
  const[colorTextAg,setColorTextAg] = useState('orange');
  const cambiarColorSelectAg=(e)=>{
    const opcionSelect=e.target.value;
    let nuevoColor='orange';
    switch(opcionSelect){
      case 'Pendiente Revision':
        nuevoColor='orange';
        break;
      case 'Rechazado':
        nuevoColor='red';
        break;
      case 'Aprobado':
        nuevoColor='green';
        break;
      default:
        nuevoColor='orange';
    }
    setColorTextAg(nuevoColor);
  };
  const[colorTextDf,setColorTextDf] = useState('orange');
  const cambiarColorSelectDf=(e)=>{
    const opcionSelect=e.target.value;
    let nuevoColor='orange';
    switch(opcionSelect){
      case 'Pendiente Revision':
        nuevoColor='orange';
        break;
      case 'Rechazado':
        nuevoColor='red';
        break;
      case 'Aprobado':
        nuevoColor='green';
        break;
      default:
        nuevoColor='orange';
    }
    setColorTextDf(nuevoColor);
  };
  const fechaActual = new Date();
  const formatoFecha = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  const fechaFormateada = fechaActual.toLocaleDateString(undefined, formatoFecha);

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
          <hr className="my-1" />
          { actualizar === 'SI' &&
            <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2"><strong>ACTUALIZACIÓN</strong></label>
          }
          </center>
        </div>
      </section>
    </center>
    
      <form className="" onSubmit={handleSubmit} /* onSubmit={handleOpenModal} */>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
            <div className="mb-2">
              <label className="fw-bold mb-1" style={{fontSize:20}}>INFORMACIÓN DEL CLIENTE</label>
              <div className="d-flex flex-row mt-2">
              <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">No.Identificación:</label>
                  <input
                    id="cedula"
                    type="number"
                    className="form-control form-control-sm w-100"
                    min={10000}
                    max={9999999999}
                    value={search.cedula}
                    pattern="[0-9]"
                    onChange={handlerChangeSearch}
                    required
                    placeholder="Campo obligatorio"
                    maxLength={10}
                    onKeyPress={actualizar==='' ? handleKeyPress:null}
                    onBlur={actualizar==='' ?handleInputBlur:null}
                    disabled={actualizar==='' ? false:true }

                  >
                  </input>
                  <span className="validity fw-bold me-3"></span>
                </div>
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Tipo documento:</label>
                  <select
                  style={{width:245}}
                    ref={selectDocumentoRef}
                    className="form-select form-select-sm m-100 me-3"
                    onChange={(e)=>setDocument(JSON.parse(e.target.value))}
                    required
                    disabled={actualizar==='' ? false:true }

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
                
              </div>
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
                    disabled={actualizar==='' ? false:true }
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
                    disabled={actualizar==='' ? false:true }
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
                    disabled={actualizar==='' ? false:true }
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
                    disabled={actualizar==='' ? false:true }
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm w-100"                     
                    min={0}
                    placeholder="(Campo Opcional)"
                    value={search.otrosNombres}
                    onChange={handlerChangeSearch}
                  />
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
                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
              </div>
            <div className="d-flex flex-row align-items-start mt-2">
            <label className="me-1"><strong>Nombre comercial:</strong></label>
                <input
                value={search.nombreComercial.toLowerCase()}
                onChange={handlerChangeSearch}
                  placeholder="(Campo Opcional)"
                  type="text"
                  id="nombreComercial"
                  style={{width:610 ,textTransform:"uppercase"}}
                  className="form-control form-control-sm"
                  min={0}
                >
                </input>
            </div>
            </div> 
            <hr className="my-1" />
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
                    style={{width:250}}
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
                  {/* <a className="" style={{fontSize:18}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf"> */}
                  <a className="" style={{fontSize:18}} href={ComproAntiCorrup} download="SALF-05 COMPROMISO ANTICORRUPCION.pdf">
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
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
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
                  <label className="ms-2 mt-1 ">(Con una vigencia no mayor a 30 días) </label>
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
                  <div className="d-flex flex-row">
                  {/* <div style={{width:50}}></div> */}
                  <label className="fw-bold mt-1 me-2">REFERENCIAS COMERCIALES: </label>
                  </div>
                  <div className=" d-flex flex-row">
                  <div className="">
                  <div className="d-flex flex-row">
                    <IconButton  style={{backgroundColor:'#2979FF',color:'white',width:40,height:40}} className="rounded-5 d-flex justify-content-center align-items-center me-1" onClick={addFileInput}><MdNoteAdd />{/* <img src={Mas} style={{width:18}} /> */}</IconButton>
                  <input
                      id="DocRefcom"
                      type="file"
                      style={{backgroundColor:'#f3f3f3',width:282}}
                      /* onChange={(e)=>(handleFileChange(e,9),setDocRefcom(1))} */
                      onChange={(e)=>(handleFileChange(`Refcom`,e),setDocRefcom(1),FileChange(e,10))}
                      className="form-control form-control-sm border border-5 rounded-3 d-flex flex-column mb-2 "
                      accept=".pdf"                  
                    />
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
                    onChange={(e)=>(handleFileChange('Cvbo',e),setDocCvbo(1),FileChange(e,15))}
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
                  <label className="fw-bold mt-1 me-2">INFOLAFT: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfemp"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,11),setDocValAnt(1))} */
                    onChange={(e)=>(handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,16))}
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
              <div className="d-flex flex-column mt-2 w-100 me-2">
                  <label className="fw-bold mt-1 me-2">FICHA RELACIÓN DOCUMENTOS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocFirdoc"
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
                  <label className="fw-bold mt-1">OTROS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="DocOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:331}}
                    /* onChange={(e)=>(handleFileChange(e,13),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,18))}
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
        {/* <Modal show={loading} centered>
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
        </Modal> */}
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
            /* onSubmit={handleOpenModal} */
          >
            {actualizar==='' ? 'REGISTRAR':'ACTUALIZAR'}
          </button>
          <Modal
            open={open}
            onclose={handleCloseModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={style}>
            <div>
              <div className="w-100 d-flex flex-row">
                <div className="w-50">
                  <img src={Logo} style={{height:80}}/>
                </div>
                <div className="w-50 d-flex justify-content-end">
                  <label className="text-danger"><strong>Yumbo, {fechaFormateada}</strong></label>
                </div>
              </div>
              <div className="form-control form-control-sm rounded rounded-2 mt-3 mb-3">
                <label style={{fontSize:15}}>Se realiza un estudio al cliente <strong>{search.primerApellido.toUpperCase()} {search.segundoApellido.toUpperCase()} {search.primerNombre.toUpperCase()} {search.otrosNombres.toUpperCase()}</strong> Con NIT: <strong>{search.cedula}</strong>, 
                en donde nos arroja la siguiente información financiera del cliente para la aprobación de credito.
                </label>
              </div>
              <center>
              <h2 className="mb-2 text-danger"><strong>Informe Detallado de Credito</strong></h2>
              </center>
              <hr className="my-1 mb-2" />
              <div className="d-flex flex-row w-100">
              <div className="d-flex flex-column w-50 ">
              <label><strong>Última actualización C.cio</strong></label>
              <input  
                id="fechaRenovaCcio" 
                value={info.fechaRenovaCcio} 
                label='Última actualización Ccio'
                type="date" 
                onChange={handlerChangeInfo} 
                className="rounded rounded-2"
                style={{backgroundColor:'whitesmoke', color:'black',width:192}}
                variant="outlined" 
                size="small"
                color="error"
              />
              </div>
              <div className="w-25 ps-3" /* style={{width:120}} */>
                <center>
                <label><strong>C.cio:</strong></label>
                {selectedFiles[6] ? (
                    <div className="pt-1" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[6])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                ):(
                  <p className="text-danger"><strong>Sin Archivo</strong></p>
                )}
                </center>
              </div>
              <div className="w-25" /* style={{width:120}} */>
                <center>
                <label><strong>Rut:</strong></label>
                {selectedFiles[5] ? (
                    <div className="pt-1 " style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[5])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  ):(
                    <p className="text-danger"><strong>Sin Archivo</strong></p>
                  )} 
                </center>
              </div>
              <div className="w-25 ">
                <center>
                <label><strong>Infolaft:</strong></label>
                {selectedFiles[16] ? (
                    <div className=" pt-1 " style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[16])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                ):(
                  <p className="text-danger"><strong>Sin Archivo</strong></p>
                )}
                </center> 
              </div>
              <div className="w-25 ">
                <center>
                <label><strong>RefCom 1:</strong></label>
                {selectedFiles[10] ? (
                    <div className=" pt-1" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[10])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  ):(
                    <p className="text-danger"><strong>Sin Archivo</strong></p>
                  )}
                </center>
              </div>
              <div className="w-25 ">
                <center>
                <label><strong>RefCom 2:</strong></label>
                {selectedFiles[11] ? (
                    <div className=" pt-1" style={{width:50}} >
                    <a href={URL.createObjectURL(selectedFiles[11])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  ):(
                    <p className="text-danger"><strong>Sin Archivo</strong></p>
                  )}
                </center>
              </div>
              </div>
              <div className="d-flex flex-row w-100 mt-2">
                <TextField
                  id="puntajeDataCredito"
                  type="number"
                  value={info.puntajeDataCredito}
                  className="form-control form-control-sm me-2"
                  onChange={handlerChangeInfo}
                  autoComplete="off"
                  required
                  label="Puntaje Datacredito"
                  variant="outlined"
                  size="small"
                  color="error"
                />
                <TextField
                  id="capitalTrabajo"
                  type="number"
                  value={info.capitalTrabajo}
                  className="form-control form-control-sm me-2"
                  onChange={handlerChangeInfo}
                  autoComplete="off"
                  required
                  label="Capital trabajo"
                  variant="outlined"
                  size="small"
                  color="error"
                />
                <TextField
                  id="razonEndeudamiento"
                  type="number"
                  value={info.razonEndeudamiento}
                  className="form-control form-control-sm me-2"
                  onChange={handlerChangeInfo}
                  autoComplete="off"
                  required
                  label="Razon Endeudamiento"
                  variant="outlined"
                  size="small"
                  color="error"
                />
                <TextField
                  id="IndiceSolvencia"
                  type="number"
                  value={info.IndiceSolvencia}
                  className="form-control form-control-sm"
                  onChange={handlerChangeInfo}
                  autoComplete="off"
                  required
                  label="Indice Solvencia"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <TextField
                id="observations"
                value={info.observations}
                onChange={handlerChangeInfo}
                label="Observaciones"
                className="w-100 mt-2"
                style={{width:600}}
                multiline
                rows={2}
                color="error"
                variant="filled"
              />
              <div className="d-flex flex-row w-100">
              <div className="d-flex flex-column  w-50 me-2">
                  <label className="fw-bold mt-1 me-2">VISTO BUENO ADMIN. AGENCIA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-column">
                  <select
                    className="form-select form-select-sm mb-1"
                    required
                    id="estadoVboAg"
                    value={info.estadoVboAg}
                    style={{width:330,color:colorText}}
                    onChange={(e)=>(cambiarColorSelect(e),handlerChangeInfo(e))}
                  >
                    <option value={'Pendiente Revision'} style={{color:'orange'}}>
                      Pendiente Revision 
                    </option>
                    <option style={{color:'red'}} value={'Rechazado'}>Rechazado</option>
                    <option style={{color:'green'}} value={'Aprobado'}>Aprobado</option>
                  </select>
                  <div className="d-flex flex-row">
                  <input
                    id="docVboAg"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    /* onChange={(e)=>(handleFileChange(e,2),setDocVboAg(1))} */
                    onChange={(e)=>(handleFileChange('VboAg',e),setDocVboAg(1),FileChange(e,22))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[22] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[22])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                  </div>
                </div> 
                <div className="d-flex flex-column w-50 me-2">
                  <label className="fw-bold mt-1 me-2">VISTO BUENO DIRECCION COMERCIAL: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-column">
                  <select
                    className="form-select form-select-sm mb-1"
                    required
                    id="estadoVboDc"
                    value={info.estadoVboDc}
                    
                    style={{width:330,color:colorTextAg}}
                    onChange={(e)=>(cambiarColorSelectAg(e),handlerChangeInfo(e))}
                  >
                    <option value={'Pendiente Revision'} style={{color:'orange'}}>
                      Pendiente Revision 
                    </option>
                    <option style={{color:'red'}} value={'Rechazado'}>Rechazado</option>
                    <option style={{color:'green'}} value={'Aprobado'}>Aprobado</option>
                  </select>
                  <div className="d-flex flex-row">
                  <input
                    id="docVboDc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    /* onChange={(e)=>(handleFileChange(e,2),setDocCtaInst(1))} */
                    onChange={(e)=>(handleFileChange('VboDc',e),setDocVboDc(1),FileChange(e,20))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[20] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[20])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )} 
                  </div>
                  </div>
                  </div>
                </div> 
                </div>
                <div className="d-flex flex-column mt-2 w-50 me-2">
                  <label className="fw-bold mt-1 me-2">VISTO BUENO DIRECTOR FINANCIERO: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-column">
                  <select
                    className="form-select form-select-sm mb-1"
                    required
                    id="estadoVboDf"
                    value={info.estadoVboDf}
                    style={{width:330,color:colorTextDf}}
                    onChange={(e)=>(cambiarColorSelectDf(e),handlerChangeInfo(e))}
                  >
                    <option value={'Pendiente Revision'} style={{color:'orange'}}>
                      Pendiente Revision 
                    </option>
                    <option style={{color:'red'}} value={'Rechazado'}>Rechazado</option>
                    <option style={{color:'green'}} value={'Aprobado'}>Aprobado</option>
                  </select>
                  <div className="d-flex flex-row">
                  <input
                    id="docVboDf"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    /* onChange={(e)=>(handleFileChange(e,2),setDocCtaInst(1))} */
                    onChange={(e)=>(handleFileChange('VboDf',e),setDocVboDf(1),FileChange(e,21))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[21] && (
                    <div className="d-flex justify-content-start pt-1 ps-2" style={{width:50}}>
                    <a href={URL.createObjectURL(selectedFiles[21])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                  </div> 
                  </div>
                  </div>
                </div> 
                  <hr></hr>
                <div className="form-control form-control-sm  rounded rounded-2 mt-3 d-flex flex-row">
                <label className="">
                  <strong>ANALISIS DE CREDITO:</strong> De acuerdo al análisis Detallado de <strong>
                  {search.primerApellido.toUpperCase()} {search.segundoApellido.toUpperCase()} {search.primerNombre.toUpperCase()} {search.otrosNombres.toUpperCase()}</strong>,
                   presenta un nivel de 
                   Endeudamiento <input id="nivelEndeudamiento" 
                   value={info.nivelEndeudamiento}
                   onChange={(e)=>handlerChangeInfo(e)} 
                   type="number" style={{width:150, height:25}}></input>
                  , como parte documental se recomienda dar un cupo de <input 
                  type="number" 
                  id="cupoRecomendado"
                  value={info.cupoRecomendado} onChange={handlerChangeInfo}
                  style={{width:150, height:25}}></input> a un plazo de 
                  <input type="number"
                   id="plazoRecomendado"
                  value={info.plazoRecomendado} onChange={handlerChangeInfo}
                  style={{width:150, height:25}}></input> dias, lo recomendado por el vendedor.
                </label>
                </div>
                <hr></hr>
                <div className="form-control form-control-sm mt-2" style={{backgroundColor:'#f0f0f0'}} >
                  <center>
                  <h4 className="text-danger"><strong>DATOS DE APROBACIÓN FINAL</strong></h4>
                  </center>
                  <div className="d-flex flex-row mb-2" >
                    <div className="d-flex flex-row w-50 ">
                      <label style={{fontSize:20}}><strong>Cupo Aprobado:</strong></label>
                      <input style={{width:190}}
                      id="cupoAprovado" 
                      value={info.cupoAprovado} onChange={handlerChangeInfo}
                      className="form-control form-control-sm ms-2"
                      ></input>
                    </div>
                    <div className="d-flex flex-row w-50">
                      <label style={{fontSize:20}}><strong>Plazo Aprobado:</strong></label>
                      <input style={{width:190}} id="plazoAprovado"
                      value={info.plazoAprovado} onChange={handlerChangeInfo}
                      className="form-control form-control-sm ms-2"></input>
                    </div>
                  </div>
                </div>
              {/* <Fade cascade direction="right"> */}
              <div className="mt-3 d-flex flex-row justify-content-end">
                <button onClick={(e)=>(handleSubmit(e),handleCloseModal(e))} className="me-4">REGISTRAR</button>
                <button style={{backgroundColor:'grey'}} onClick={handleCloseModal}>VOLVER</button>
              </div>
              {/* </Fade> */}
            </div>
            </Box>
          </Modal>
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