import { useEffect, useState, useContext, useRef } from "react";
import Swal from "sweetalert2";
import { Button, Modal } from "react-bootstrap";
import AuthContext from "../../context/authContext";
import "./styles.css";
import { getAllTipoFormularios } from '../../services/tipoFormularioService'
import { Fade } from "react-awesome-reveal";
import { createProveedor, deleteProveedor , sendMail } from '../../services/proveedorService';
import { getAllDepartamentos } from "../../services/departamentoService";
import { getAllCiudades } from "../../services/ciudadService";
import { getAllActividad} from '../../services/actividadService';
import { FaEye } from "react-icons/fa";
import { getAllAgencies } from "../../services/agencyService";
import { getAllDocuments } from '../../services/documentService'
import { fileSend, deleteFile } from "../../services/fileService";
import { FaFileDownload } from "react-icons/fa";
import { updateBitacora } from '../../services/bitacoraService';
import NewFormProvee from '../../pdfs/SALF-01 FORMATO VINCULACION DE PROVEEDORES.pdf'
import { validarCliente , findClientes } from "../../services/clienteService"; 
import { validarProveedor , findProveedores } from "../../services/proveedorService";
import { useNavigate } from 'react-router-dom';

export default function PrestadorServicios(){
  /* instancias de contexto */
  const { user } = useContext(AuthContext);
  const navigate =useNavigate()

  /* inicializar variables */
  const [agencia, setAgencia] = useState(null);
  const [document,setDocument] = useState(null);
  const [ciudad, setCiudad] = useState(null);
  const [departamento,setDepartamento]= useState('');
  const [actividad, setActividad] = useState(null);
  const [formularios,setFormularios] = useState([]);

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
    tipoFormulario:'PS'
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
      getAllTipoFormularios().then((data)=>setFormularios(data));

  },[]);

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
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
            text:`El número de identificación ${search.cedula}
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
            /* showDenyButton:true,
            denyButtonColor:'blue',
            denyButtonText:'Actualizar' */
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
          title:'Recuerda que el Número de Identificación debe contener entre 5 y 10 caracteres',
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
          /* showDenyButton:true,
          denyButtonColor:'blue',
          denyButtonText:'Actualizar' */
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
        title:'Recuerda que el Número de Identificación debe contener entre 5 y 10 caracteres',
        confirmButtonColor:'#D92121',
        confirmButtonText:'OK'
      })
    }
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
        //creamos el cuerpo de nuestra instancia
        const body={
          cedula: search.cedula,
          numeroDocumento: search.cedula,
          tipoDocumento: actualizar === '' ? document.codigo:document,
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
          tipoDocRepLegal:actualizar === '' ? document.codigo:document,
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
          pendiente:1,
          rechazado:0,
          aprobado:0,
          actulizado : actualizar==='' ? null:'SI',
          fechaActualizacion : actualizar === '' ? null:new Date(),

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
            Ha ocurrido un error al momento de enviar el correo a cartera, intente de nuevo.
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
          <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2" style={{fontSize:100}}><strong>PRESTADOR DE SERVICIOS</strong></label>
          </Fade>
          <hr className="my-1" />
          { actualizar === 'SI' &&
            <label className="fs-3 fw-bold m-1 ms-4 me-4 text-danger mb-2"><strong>ACTUALIZACIÓN</strong></label>
          }
          </center>
          <label>(Este formulario es para personas naturales)</label>
        </div>
      </section>
    </center>
      <form className="" onSubmit={handleSubmit}>
        <div className="bg-light rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-column gap-1">
              <label className="fw-bold" style={{fontSize:20}}>INFORMACIÓN DEL PROVEEDOR</label>
              <div className="d-flex flex-row mt-2">
              <div className="d-flex flex-row align-items-start w-100">
                  <label for='cedula' className="me-1">No.Identificación:</label>
                  <input
                    id="cedula"
                    type="number" 
                    className="form-control form-control-sm w-100"
                    min={10000}
                    name="cedula"
                    pattern="[0-9]"
                    value={search.cedula}
                    onChange={(e)=>(handlerChangeSearch(e),handleInputChange(e))}
                    required
                    max={9999999999}
                    minLength={0}
                    maxLength={10}
                    size={10}
                    onKeyPress={actualizar==='' ? handleKeyPress:null}
                    onBlur={actualizar==='' ?handleInputBlur:null}
                    disabled={actualizar==='' ? false:true }
                    placeholder="Campo obligatorio"
                  >
                  </input>
                  <span className="validity fw-bold me-3"></span>
{/*                   <p className="ps-3" style={{color:colorVality}}><strong>{vality}</strong></p>
 */}                </div>
                <div className="d-flex flex-row align-items-start w-100">
                  <label className="me-1">Tipo documento:</label>
                  <select
                    ref={selectDocumentoRef}
                    style={{width:240}}
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
                    className="form-control form-control-sm "                     
                    min={0}
                    style={{textTransform:"uppercase"}}
                    required
                    disabled={rzNotEnty ? true:false}
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
                    disabled={rzNotEnty ? true:false}
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
                    disabled={rzNotEnty ? true:false}
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
                    disabled={rzNotEnty ? true:false}
                    style={{textTransform:"uppercase"}}
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
                    elem.id == departamento.id ?
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
                    onChange={(e)=>setActividad(JSON.parse(e.target.value))}
                    ref={selectActividadRef}
                    style={{width:760}}
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
            <hr className="my-1" />
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
                  <label className="fw-bold mt-1" style={{width:290}}>FORMATO DE VINCULACIÓN PROVEE: </label>
                  {/* <a className="" style={{fontSize:17}} href={VinculacionProveedor} download="VINCULACION DE PROVEEDORES.pdf"> */}
                  <a className="" style={{fontSize:17}} href={NewFormProvee} download="SALF-01 FORMATO VINCULACION DE PROVEEDORES.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className="d-flex flex row pt-1">
                  <div className="" style={{width:340}}>
                  <input
                    id="DocVinculacion"
                    type="file"
                    style={{backgroundColor:'#f3f3f3'}}
                    /* onChange={(e)=>(handleFileChange(e, 0),setDocVinculacion(1))} */
                    onChange={(e)=>(handleFileChange('Vinculacion',e),setDocVinculacion(1),FileChange(e,1))}
                    className="form-control form-control-sm w-100 border border-5 rounded-3"
                    accept=".pdf"                  /></div>
                  {selectedFiles[1] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:70}}>
                    <a href={URL.createObjectURL(selectedFiles[1])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}  
                  </div>
                </div>
                {/* <div className="ms-2 w-100">
                  <div className="d-flex flex-row w-100">
                  <label className="fw-bold mt-1" style={{width:290}}>COMPROMISO ANTICORRUPCIÓN: </label>
                  <a className="" style={{fontSize:18}} href={Compromiso} download="COMPROMISO ANTICORRUPCION.pdf">
                  <FaFileDownload />Descargar
                  </a>
                  </div>
                  <div className="d-flex flex row pt-1">
                    <div className="" style={{width:340}}>
                  <input
                    id="DocComprAntc"
                    type="file"
                    style={{backgroundColor:'#f3f3f3'}}
                    onChange={(e)=>(handleFileChange('ComprAntc',e),setDocComprAntc(1),FileChange(e,2))}
                    className="form-control form-control-sm w-100 border border-5 rounded-3"
                    accept=".pdf"                  /></div>
                  {selectedFiles[2] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:70}}>
                      <a href={URL.createObjectURL(selectedFiles[2])} target="_blank" rel="noopener noreferrer">
                      <FaEye />Ver
                      </a>
                    </div>
                  )} 
                    </div>
                </div> */}
                <div className=" w-100" >
                  <label className="fw-bold mt-1 me-2">RUT: </label>
                  <label className="ms-2 mt-1 ">(AÑO 2024) </label>
                  <div className=" rounded-2 pt-1" >
                  <div className="d-flex flex-row">
                  <input
                    id="INFOLAFT"
                    type="file"
                    placeholder="INFOLAFT"
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3',width:320}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Rut',e),setDocRut(1),FileChange(e,3))}
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
              <div className="d-flex flex-row ">
              
                <div className=" w-50">
                  <label className="fw-bold mt-1 me-2">INFOLAFT: </label>
                  <div className=" rounded-2" >
                  <div className="d-flex flex row">
                    <div className="" style={{width:340}}>
                  <input
                    id="Infemp"
                    type="file"
                    placeholder="Infemp"
                    className="form-control form-control-sm w-100 border border-5 rounded-3"
                    accept=".pdf"
                    style={{backgroundColor:'#f3f3f3'}}
                    /* onChange={(e) => (handleFileChange(e, 1),setDocInfrl(1))} */
                    onChange={(e) => (handleFileChange('Infemp',e),setDocInfemp(1),FileChange(e,4))}
                  /></div>
                  {selectedFiles[4] && (
                    <div className="d-flex justify-content-start ps-1 pt-1" style={{width:70}}>
                    <a href={URL.createObjectURL(selectedFiles[4])} target="_blank" rel="noopener noreferrer">
                    <FaEye />Ver
                    </a>
                  </div>
                  )}
                  </div>
                  </div>
                </div>

                <div className="d-flex flex-column mt-1 " >
                  <label className="fw-bold mt-1 me-2">OTROS: </label>
                  <div className="d-flex flex-row">
                  <input
                    id="DocOtros"
                    type="file"
                    style={{backgroundColor:'#f3f3f3',width:320}}
                    /* onChange={(e)=>(handleFileChange(e, 12),setDocOtros(1))} */
                    onChange={(e)=>(handleFileChange('Otros',e),setDocOtros(1),FileChange(e,5))}
                    className="form-control form-control-sm border border-5 rounded-3"
                    accept=".pdf"                  />
                    {selectedFiles[5] && (
                    <div className="d-flex justify-content-start ps-2 pt-1" style={{width:70}}>
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
    
  );
}
