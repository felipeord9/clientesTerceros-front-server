import { useEffect, useState, useContext, useRef, Suspense } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { getAllTipoFormularios } from '../../services/tipoFormularioService'
import { FaEye } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";
import { getAllPrecios } from "../../services/precioService";
import { getAllResponsabilidad } from '../../services/responsabilidadService'
import { getAllDetalles } from "../../services/detalleService";
import { getAllRegimen } from "../../services/regimenService";
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllAgencies } from "../../services/agencyService";
import { getAllClasificaciones } from "../../services/clasificacionService";
import { getAllDocuments } from '../../services/documentService';
import { createCliente, deleteCliente , sendMail } from "../../services/clienteService";
import { createSucursal, deleteSucursalByName } from "../../services/sucursalService";
import { fileSend, deleteFile } from "../../services/fileService";
import { updateBitacora } from '../../services/bitacoraService';
import { FaFileDownload } from "react-icons/fa";
import NewFormCliente from '../../pdfs/SALF-11 FORMATO  VINCULACION CLIENTES.pdf';
import  {  NumericFormat  }  from  'react-number-format' ;
import { validarCliente , findClientes } from "../../services/clienteService"; 
import { validarProveedor , findProveedores } from "../../services/proveedorService";
import { useNavigate } from 'react-router-dom';

export default function ContadoPersonaJuridica(){
  /* instancias de contexto */
  const { user } = useContext(AuthContext);
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
  const [formularios,setFormularios] = useState([]);
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
  });

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

  /* Inicializar los input */
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
    nombreSucursal:'Principal',
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
  });
  const [loading, setLoading] = useState(false);

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
    getAllTipoFormularios().then((data)=>setFormularios(data));

},[]);

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setSearch({
      ...search,
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
      if(search.cedula.length===9){
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
              || user.role==='comprasnv' || user.role==='asistente agencia'){
                navigate('/validar/proveedor')
              }
            }else if(isDenied){
              if(filtroCliente.length>0 && filtroProveedor.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    razonSocial:item.razonSocial,
                  })
                })
              }else if(filtroCliente.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    razonSocial:item.razonSocial,
                  })
                })
              }else if(filtroProveedor.length>0){
                filtroProveedor.map((item)=>{
                  setSearch({
                    ...search,
                    razonSocial:item.razonSocial,
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
          title:'Recuerda que el NIT debe entre 9 caracteres',
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
    if(search.cedula.length===9){
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
                    razonSocial:item.razonSocial,
                  })
                })
              }else if(filtroCliente.length>0){
                filtroCliente.map((item)=>{
                  setSearch({
                    ...search,
                    razonSocial:item.razonSocial,
                  })
                })
              }else if(filtroProveedor.length>0){
                filtroProveedor.map((item)=>{
                  setSearch({
                    ...search,
                    razonSocial:item.razonSocial,
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
        title:'Recuerda que el NIT debe contener 9 caracteres',
        confirmButtonColor:'#D92121',
        confirmButtonText:'OK'
      })
    }
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    Swal.fire({
      title:'¿Está segur@?',
      text:'Se realizará el registro del Cliente',
      icon:'question',
      showConfirmButton:true,
      confirmButtonText:'Aceptar',
      confirmButtonColor:'#198754',
      showCancelButton:true,
      cancelButtonText:'Cancelar'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        setLoading(true)
        const formData = new FormData();
        for (const fieldName in files) {
          if (files[fieldName]) {
            formData.append(fieldName, files[fieldName]);
          }
        }
        const body={
          cedula:search.cedula,
          numeroDocumento: search.cedula, 
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
          direccionSucursal: search.direccion.toUpperCase(),
          departamentoSucursal: departamento.codigo,
          ciudadSucursal: ciudad.codigo,
          celularSucursal: search.celular,
          telefonoSucursal: search.telefono,
          correoSucursal: search.correoNotificaciones.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          regimenFiscal: regimen.id,
          responsabilidadFiscal: responsabilidad.id,
          detalleTributario: detalle.id,
          numeroDocRepLegal: search.numeroDocRepLegal,
          nameRepLegal: search.nameRepLegal.toUpperCase(),
          tipoDocRepLegal: search.tipoDocumento,
          apellidoRepLegal: search.apellidoRepLegal.toUpperCase(),
          valorEstimado: search.valorEstimado,
          precioSugerido: precio.description,
          observations: search.observations,
          createdAt: new Date(),
          createdBy: user.rowId.toUpperCase(),
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
          actulizado : actualizar==='' ? null:'SI',
          fechaActualizacion : actualizar === '' ? null:new Date(),
          pendiente:1,
          rechazado:0,
          aprobado:0,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        formData.append('originalFolderName', originalFolderName);
        const clientName = search.razonSocial.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        const sucur = {
          cedula: search.cedula,
          codigoSucursal: 1,
          nombreSucursal: search.razonSocial.toUpperCase()+' - '+ search.nombreSucursal.toUpperCase(),
          direccion: search.direccion,
          departamento:departamento.description,
          ciudad: ciudad.description,
          celular: search.celular,
          correoFacturaElectronica: search.correoNotificaciones,
          nombreContacto: search.razonSocial.toUpperCase(),
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
        .then(({data})=>{
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
            razonSocial:search.razonSocial.toUpperCase(),
            tipoFormulario: tipo,
          }
          sendMail(mail)
          .then(()=>{
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
            deleteSucursalByName(sucur.nombreSucursal.toUpperCase());
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
          })
          }).catch((err)=>{
            Swal.fire({
              title: "¡Ha ocurrido un error!",
              text: `
              Ha ocurrido un error al momento de enviar el correo de solicitud, intente de nuevo.
              Si el problema persiste por favor comuniquese con el área de sistemas.`,
              icon: "error",
              showConfirmButton: true,
              confirmButtonColor:'#198754',
              confirmButtonText:'Aceptar',       
            })
            .then(()=>{
              window.location.reload();
            })
          })
        })
        .catch((err)=>{
          Swal.fire({
            title: "¡Ha ocurrido un error!",
            text: `
            Ha ocurrido un error al momento de crear el Cliente, intente de nuevo.
            Si el problema persiste por favor comuniquese con el área de sistemas.`,
            icon: "error",
            showConfirmButton: true,
            confirmButtonColor:'#198754',
            confirmButtonText:'Aceptar',       
          })
          .then(()=>{
            window.location.reload();
          })
        })
      }else{
        window.location.reload();
      }
    })
    .catch((err)=>{
      Swal.fire({
        title: `${err}`,
        showConfirmButton: true,
        confirmButtonColor:'#198754',
        confirmButtonText:'Aceptar',       
      })
    })
  }

  /* const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title:'¿Está segur@?',
      text:'Se realizará el registro del Cliente',
      icon:'question',
      confirmButtonText:'Aceptar',
      confirmButtonColor:'#198754',
      showCancelButton:true,
      cancelButtonText:'Cancelar',
    }).then(({isConfirmed})=>{
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
          direccionSucursal: search.direccion.toUpperCase(),
          departamentoSucursal: departamento.codigo,
          ciudadSucursal: ciudad.codigo,
          celularSucursal: search.celular,
          telefonoSucursal: search.telefono,
          correoSucursal: search.correoNotificaciones.toLowerCase(),
          correoFacturaElectronica: search.correoFacturaElectronica.toLowerCase(),
          regimenFiscal: regimen.id,
          responsabilidadFiscal: responsabilidad.id,
          detalleTributario: detalle.id,
          numeroDocRepLegal: search.numeroDocRepLegal,
          nameRepLegal: search.nameRepLegal.toUpperCase(),
          tipoDocRepLegal: search.tipoDocumento,
          apellidoRepLegal: search.apellidoRepLegal.toUpperCase(),
          valorEstimado: search.valorEstimado,
          precioSugerido: precio.description,
          observations: search.observations,
          createdAt: new Date(),
          createdBy: user.rowId.toUpperCase(),
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
          actulizado : actualizar==='' ? null:'SI',
          fechaActualizacion : actualizar === '' ? null:new Date(),
          pendiente:1,
          rechazado:0,
          aprobado:0,
        };
        //creamos una constante la cual llevará el nombre de nuestra carpeta
        const folderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        //agregamos la carpeta donde alojaremos los archivos
        formData.append('folderName', folderName); // Agregar el nombre de la carpeta al FormData
        const originalFolderName = search.cedula+'-'+ search.razonSocial.toUpperCase();
        formData.append('originalFolderName', originalFolderName);
        const clientName = search.razonSocial.toUpperCase();
        formData.append('clientName',clientName)
        //ejecutamos nuestra funcion que creara el cliente
        const sucur = {
          cedula: search.cedula,
          codigoSucursal: 1,
          nombreSucursal: search.razonSocial.toUpperCase()+' - '+ search.nombreSucursal.toUpperCase(),
          direccion: search.direccion,
          departamento:departamento.description,
          ciudad: ciudad.description,
          celular: search.celular,
          correoFacturaElectronica: search.correoNotificaciones,
          nombreContacto: search.razonSocial.toUpperCase(),
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
            razonSocial:search.razonSocial.toUpperCase(),
            tipoFormulario: tipo,
          }
          sendMail(mail)
          .then(()=>{
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
            deleteSucursalByName(sucur.nombreSucursal.toUpperCase());
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
  }; */

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
          <h1 className="fs-3 fw-bold m-1 ms-4 me-4 text-danger pb-2" style={{fontSize:150}}><strong>persona JURÍDICA - pago a CONTADO</strong></h1>
          </Fade>
          <hr className="my-1" />
          { actualizar === 'SI' &&
            <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2"><strong>ACTUALIZACIÓN</strong></label>
          }
          </center>
        </div>
      </section>
    </center>
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
            <div>
            <label className="fw-bold mb-1" style={{fontSize:22}}>INFORMACIÓN OFICINA PRINCIPAL</label>
            <div className="d-flex flex-row">
                <div className="d-flex flex-column w-100" style={{fontSize:18}}> 
                <label className="me-1 ">Número de Identificación:</label>
                <div className="d-flex flex-row align-items-start w-100">
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
                    disabled={actualizar==='' ? false:true }
                    onKeyPress={actualizar==='' ? handleKeyPress:null}
                    onBlur={actualizar==='' ?handleInputBlur:null}
                  >
                  </input>
                  <span className="validity fw-bold me-1"></span>
                </div>
                </div> 
                <div className="d-flex flex-column align-items-start w-100 ps-3" style={{fontSize:18}}>
                  <label className=" me-1 ">Razón Social:</label>
                  <input
                    id="razonSocial"
                    type="text"
                    style={{textTransform:"uppercase"}}
                    className="form-control form-control-sm me-3"
                    value={search.razonSocial}
                    onChange={handlerChangeSearch}
                    min={0}
                    required
                    disabled={rzNotEnty ? true:false}
                    placeholder="Campo obligatorio"
                  />
                </div> 
              </div>
              <div>
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
                  <p className="ps-3" style={{color:Span}}><strong>{Validacion}</strong></p>
              </div>
            </div> 
              <hr className="my-1 mt-3 mb-2" />
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
                 required
              />
              </div>        
            </div>  
            <hr className=" mt-3 mb-3 my-1" />

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
                    value={valorEstimado}
                    onChange={cambiarInput}
                    style={{width:225}}
                    value={((search.valorEstimado))}
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
                {/* <span>{search.valorEstimado}</span> */}
                  <div className="w-100 d-flex flex-row">
                  <label className="me-1">Lista de Precios:</label>
                  <select
                    style={{width:245}}
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
              <label className="fw-bold" style={{fontSize:22}}>DOCUMENTOS OBLIGATORIOS</label>
              <div className="d-flex flex-row ">
              <div className="me-2 w-50">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:280}}>FORMATO DE VINCULACIÓN: </label>
                  {/* <a className="" style={{fontSize:18}} href={VinculacionCliente} download="FORMATO  VINCULACION CLIENTES CON SOLICITUD DE CREDITO.pdf"> */}
                  <a className="" style={{fontSize:18}} href={NewFormCliente} download="SALF-11 FORMATO  VINCULACION CLIENTES.pdf">
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
                    accept="application/pdf"                  />
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
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Infrl',e),setDocInfrl(1),FileChange(e,2))}
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
              <div className="d-flex flex-row">
              <div className="pe-2 w-50">
                  <label className="fw-bold mt-1 ">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2023) </label>
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
                    onChange={(e) => (handleFileChange('Rut', e),setDocRut(1),FileChange(e,3))}
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
              <div className="d-flex flex-column ">
                  <label className="fw-bold mt-1 me-2 ms-2">INFOLAFT EMPRESA: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docInfemp"
                    type="file"
                    placeholder="docInfemp"
                    style={{backgroundColor:'#f3f3f3',width:330}}
                    className="form-control form-control-sm border border-5 rounded-3 ms-2"
                    accept=".pdf"
                    /* onChange={(e) => (handleFileChange(e, 2),setDocOtros(1))} */
                    onChange={(e) => (handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,4))}
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
              <div className="d-flex flex-column mt-2 w-100">
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="docOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:736}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,16))}
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
            </div>
          </div>
        </div>
        <div className="d-flex flex-column mb-3">
          <label className="fw-bold" style={{fontSize:22}}>OBSERVACIONES</label>
          <textarea
            id="observations"
            className="form-control border border-3"
            value={search.observations}
            onChange={handlerChangeSearch}
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
            {actualizar==='' ? 'REGISTRAR':'ACTUALIZAR'}
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