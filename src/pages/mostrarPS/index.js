import React, { useState, useContext, useEffect } from "react"
import Logo from '../../assest/logo-gran-langostino.png'
import useUser from '../../hooks/useUser';
import { Navigate, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import { Divider } from "@mui/material";
import TextField from '@mui/material/TextField';
import { Fade } from "react-awesome-reveal";
import { validarCliente } from "../../services/clienteService"; 
import { validarProveedor } from "../../services/proveedorService";
import Swal from "sweetalert2";
import AuthContext from "../../context/authContext";
import { RiArrowGoBackFill } from "react-icons/ri";
import Button from '@mui/material/Button';
import Logo_pdf from '../../assest/logo_pdf.jpg'
import { CiEdit } from "react-icons/ci";
import { config } from "../../config";

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const url = `${config.apiUrl2}/uploadMultiple/obtener-archivo/${carpeta}/${archivo}`;
  return (
    <div>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );

};


export default function MostrarPS(){
  const { user, setUser } = useContext(AuthContext);
  const navigate =useNavigate()
    const [cedula,setCedula] = useState('');
    const [search,setSearch]=useState({
      cedula:'',
    })
    const handlerChangeSearch = (e) => {
      const { id, value } = e.target;
      setSearch({
        ...search,
        [id]: value,
      });
    };

    const [info,setInfo]=useState({
      cedula:'',
      razonSocial:'',
      
      ciudad:'',
      direccion:'',
      celular:'',
      correoNotificaciones:'',
      observations:'',
      createdAt:'',
      userName:'',
      agencia:'',
      tipoFormulario:'',
      solicitante:'',
      docVinculacion:'',
      docComprAntc:'',
      docCtalnst:'',
      docPagare:'',
      docRut:'',
      docCcio:'',
      docCrepL:'',
      docEf:'',
      docRefcom:'',
      docRefcom2:'',
      docRefcom3:'',
      docCvbo:'',
      docFirdoc:'',
      docInfemp:'',
      docInfrl:'',
      docCerBan:'',
      docValAnt:'',
      docOtros:'',

    })
    useEffect(()=>{
      const datosTercero = localStorage.getItem('data');
      if(datosTercero){
        setData(JSON.parse(datosTercero));
        setInfo(JSON.parse(datosTercero));
      }
    },[]);
    const [data,setData]=useState(null);
    const handleSearch = (e) =>{
      e.preventDefault();

        validarCliente(search.cedula)
        .then(({data})=>{  
          Swal.fire({
            icon:'success',
            title:`El Cliente ${data.razonSocial} si se encuentra registrado¡`,
            text:'La información la vera en pantalla',
            showConfirmButton:true,
            confirmButtonColor:'green',
            confirmButtonText:'Aceptar'
          })
          localStorage.setItem('cedula',JSON.stringify(data.cedula));
          setInfo({
            cedula:data.cedula,
            razonSocial:data.razonSocial,
            ciudad:data.ciudad,
            direccion:data.direccion,
            celular:data.celular,
            correoNotificaciones:data.correoNotificaciones,
            observations:data.observations,
            createdAt:data.createdAt,
            userName:data.userName,
            agencia:data.agencia,
            tipoFormulario:data.tipoFormulario,
            solicitante:data.solicitante,
            docVinculacion:data.docVinculacion,
            docComprAntc:data.docComprAntc,
            docCtalnst:data.docCtalnst,
            docPagare:data.docPagare,
            docRut:data.docRut,
            docCcio:data.docCcio,
            docCrepL:data.docCrepL,
            docEf:data.docEf,
            docRefcom:data.docRefcom,
            docRefcom2:data.docRefcom2,
            docRefcom3:data.docRefcom3,
            docCvbo:data.docCvbo,
            docFirdoc:data.docFirdoc,
            docInfemp:data.docInfemp,
            docInfrl:data.docInfrl,
            docCerBan:data.docCerBan,
            docValAnt:data.docValAnt,
            docOtros:data.docOtros,
          })
          })
          .catch((error)=>{
            Swal.fire({
              icon:'warning',
              title:'!El cliente no esta en nuestra base de datos¡',
              text:'¿Desea registrarlo?',
              showConfirmButton:true,
              confirmButtonColor:'green',
              cancelButtonColor:'red',
              confirmButtonText:'Sí',
              cancelButtonText:'No',
              showCancelButton:true,
            }).then(({isConfirmed})=>{
              if(isConfirmed){
                handleClickInicio(e);
              }
            })
          })
    }
    const searchProveedor = (e)=>{
      e.preventDefault();
      validarProveedor(search.cedula)
      .then(({data})=>{  
        Swal.fire({
          icon:'success',
          title:`El Proveedor ${data.razonSocial} si se encuentra registrado¡`,
          text:'La información la vera en pantalla',
          showConfirmButton:true,
          confirmButtonColor:'green',
          confirmButtonText:'Aceptar'
        })
        setInfo({
          cedula:data.cedula,
          razonSocial:data.razonSocial,
          ciudad:data.ciudad,
          direccion:data.direccion,
          celular:data.celular,
          correoNotificaciones:data.correoNotificaciones,
          observations:data.observations,
          createdAt:data.createdAt,
          userName:data.userName,
          agencia:data.agencia,
          tipoFormulario:data.tipoFormulario,
          solicitante:data.solicitante,
          docVinculacion:data.docVinculacion,
            docComprAntc:data.docComprAntc,
            docCtalnst:data.docCtalnst,
            docPagare:data.docPagare,
            docRut:data.docRut,
            docCcio:data.docCcio,
            docCrepL:data.docCrepL,
            docEf:data.docEf,
            docRefcom:data.docRefcom,
            docRefcom2:data.docRefcom2,
            docRefcom3:data.docRefcom3,
            docCvbo:data.docCvbo,
            docFirdoc:data.docFirdoc,
            docInfemp:data.docInfemp,
            docInfrl:data.docInfrl,
            docCerBan:data.docCerBan,
            docValAnt:data.docValAnt,
            docOtros:data.docOtros,
        })
        })
        .catch((error)=>{
          Swal.fire({
            icon:'warning',
            title:'!El Proveedor no está en nuestra base de datos¡',
            text:'¿Desea registrarlo?',
            showConfirmButton:true,
            confirmButtonColor:'green',
            cancelButtonColor:'red',
            confirmButtonText:'Sí',
            cancelButtonText:'No',
            showCancelButton:true,
          }).then(({isConfirmed})=>{
            if(isConfirmed){
              handleClickInicio(e);
            }
          })
        })
    }

    const handleClickInicio=(e)=>{
      e = e.target.value
      if(user.role==='agencias' || user.role==='cartera'){
        return navigate('/inicio')
      }else if(user.role==='compras'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
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
      /* return navigate('/validacion/admin') */
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
          setLogo(({Logo_pdf}))
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
        <label className="mb-2" style={{color:labelColor, height:18}}><strong>{nuevoTexto} {/* {mostrarImagen(valor)} */}</strong></label>
      )
    }
    const mostrarImagen=(valor)=>{
      if(valor===1){
        return <img src={Logo_pdf} style={{width:100}}></img>
      }
    }
    const [tipoForm,setTipoForm]=useState();
    const handleEditClient=(e)=>{
      if(data.tipoFormulario==='PMN'){
        return navigate('/editar/info/PMN')
      }else if(data.tipoFormulario==='PMJ'){
        return navigate('/editar/info/PMJ')
      }else if(data.tipoFormulario==='PS'){
        return navigate('/editar/info/PS')
      }else if(data.tipoFormulario==='PVJ'){
        return navigate('/editar/info/PVJ')
      }else if(data.tipoFormulario==='PVN'){
        return navigate('/editar/info/PVN')
      }else if(data.tipoFormulario==='CCP'){
        return navigate('/editar/info/CCP')
      }
    }
    return(
      <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mt-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
        <div className="w-100 d-flex flex-row" >
          <Button style={{height:35}} onClick={(e)=>handleClickBack(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />back</Button>
          <div style={{width:120}}></div>
          <h1 className="mb-3"><strong>Información Del Proveedor</strong></h1>
          <div style={{width:90}}></div>
          <button onClick={(e)=>navigate('/editar/info/PS')} style={{height:55,width:150}}><CiEdit />Actualizar</button>
        </div>
      <div className="w-100 rounded-4 p-2" style={{backgroundColor:'#C7C8CA'}}>
      <div className="d-flex flex-row mt-2 mb-2">
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1"><strong>Número de Identifiación:</strong></label>
                  {data ? (
                      <input
                      id="cedula"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.cedula}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1 fw-bold">Razon Social:</label>
                  {data ? (
                      <input
                      id="razonSocial"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.razonSocial}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1 fw-bold">Agencia:</label>
                  {data ? (
                      <input
                      id="agencia"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.agencia}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25">
                  <label className="me-1 fw-bold">Solicitante:</label>
                  {data ? (
                      <input
                      id="solicitante"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.solicitante}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
      </div>
      <div className="d-flex flex-row mt-2 mb-2">
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1 fw-bold">Dirección:</label>
                  {data ? (
                      <input
                      id="direccion"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.direccion}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1 fw-bold">Ciudad:</label>
                  {data ? (
                      <input
                      id="ciudad"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.ciudad}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25 me-4">
                  <label className="me-1 fw-bold">Teléfono Celular:</label>
                  {data ? (
                      <input
                      id="celular"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.celular}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-25">
                  <label className="me-1 fw-bold">Correo Electrónico:</label>
                  {data ? (
                      <input
                      id="correoElectronico"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.correoElectronico}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
      </div>
      <div className="d-flex flex-column mb-3 mt-3">
          <label className="fw-bold" style={{fontSize:18}}>OBSERVACIONES</label>
          {data ? (

            <textarea
              
              disabled
              id="observations"
              value={data.observations}
              className="form-control border border-3"
              style={{ minHeight: 70, maxHeight: 100, fontSize: 12 }}
            ></textarea>
          ):(
            <p>no hay nada</p>
          )}
        </div>
      <div className="d-flex flex-row mt-2">
                <div className="d-flex flex-column align-items-start w-25 me-4 " >
                  <label className="me-1 fw-bold">Doc_Vinculacion:</label>
                  {data ? (

                    <TextOfBinary valor={data.docVinculacion}>{info.docVinculacion}</TextOfBinary>
                  ):(
                    <p>no hay nada</p>
                  )}
                  {info.docVinculacion === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Vinculacion-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                    )}
                </div>
                  <div className="d-flex flex-column align-items-start w-25 me-4" >
                  <label className="me-1 fw-bold">Doc_Rut:</label>
                  {data ? (
                  <TextOfBinary valor={data.docRut}>{info.docRut}</TextOfBinary>
                  ):(
                    <p>no hay nada</p>
                  )}
                  {info.docRut === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Rut-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                    )}
                  </div>
                <div className="d-flex flex-column align-items-start w-25" >
                  <label className="me-1 fw-bold">Doc_Infemp:</label>
                  {data ? (
                  <TextOfBinary valor={data.docInfemp}>{info.docInfemp}</TextOfBinary>
                  ):(
                    <p>no hay nada</p>
                  )}
                  {info.docInfemp === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Infemp-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                    )}
                  </div>
                
                <div className="d-flex flex-column align-items-start w-25 " >
                  <label className="me-1 fw-bold">Doc_Otros:</label>
                  {data ? (
                  <TextOfBinary valor={data.docOtros}>{info.docOtros}</TextOfBinary>
                  ):(
                    <p>no hay nada</p>
                  )}
                  {info.docOtros === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Otros-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                    )}
                  </div>
      </div>
      <center>
      <div className="d-flex flex-row mt-2 mb-2">
                <div className="d-flex flex-column align-items-start w-75 me-5" >
                  <label className="me-1 fw-bold">Fecha Creación:</label>
                  {data ? (
                      <input
                      id="createdAt"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.createdAt}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-75 me-5" >
                  <label className="me-1 fw-bold">Usuario Creador:</label>
                  {data ? (
                      <input
                      id="userName"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.userName}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
                <div className="d-flex flex-column align-items-start w-75 ">
                  <label className="me-1 fw-bold">Tipo formato:</label>
                  {data ? (
                      <input
                      id="tipoFormulario"   
                      className="form-control form-control-sm"                   
                      disabled
                      value={data.tipoFormulario}
                    ></input>
                  ):(
                    <p>no hay nada</p>
                  )}
                </div>
      </div>
      </center>
      </div>
      </div>
    </div>
    </div>
    )
                  }