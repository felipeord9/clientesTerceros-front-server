import React, { useState, useContext, useEffect } from "react"
import Logo from '../../assest/logo-gran-langostino.png'
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Fade } from "react-awesome-reveal";
import { validarCliente } from "../../services/clienteService"; 
import { validarProveedor } from "../../services/proveedorService";
import Swal from "sweetalert2";
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';
import { IoMdPersonAdd } from "react-icons/io";

export default function ValidacionAdmin(){
  const { user } = useContext(AuthContext);
  const navigate =useNavigate()
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
      docCvbo:'',
      docFirdoc:'',
      docInfemp:'',
      docInfrl:'',
      docCerBan:'',
      docValAnt:'',
      docOtros:'',
    })
    const handleSearch = (e) =>{
      e.preventDefault();

        validarCliente(search.cedula)
        .then(({data})=>{  
          Swal.fire({
            icon:'success',
            title:`¡El Cliente ${data.razonSocial} si se encuentra registrado¡`,
            text:'La información la podras visualizar en pantalla',
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
            docCvbo:data.docCvbo,
            docFirdoc:data.docFirdoc,
            docInfemp:data.docInfemp,
            docInfrl:data.docInfrl,
            docCerBan:data.docCerBan,
            docValAnt:data.docValAnt,
            docOtros:data.docOtros,
          })
          localStorage.setItem('data',JSON.stringify(data));
          if(data.tipoFormulario==='PNC'){
            navigate('/info/validacion')
          }else if(data.tipoFormulario==='PNCR'){
            navigate('/info/validacion')
          }else if(data.tipoFormulario==='PJC'){
            navigate('/info/valid')
          }else if(data.tipoFormulario==='PJCR'){
            navigate('/info/valid')
          }else if(data.tipoFormulario==='CCP'){
            navigate('/informacion/valid')
          }
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
          title:`¡El Proveedor ${data.razonSocial} si se encuentra registrado¡`,
          text:'La información la podras visualizar en pantalla',
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
          docCvbo:data.docCvbo,
          docFirdoc:data.docFirdoc,
          docInfemp:data.docInfemp,
          docInfrl:data.docInfrl,
          docCerBan:data.docCerBan,
          docValAnt:data.docValAnt,
          docOtros:data.docOtros,
        })
        localStorage.setItem('data',JSON.stringify(data));
        if(data.tipoFormulario==='PMN' || data.tipoFormulario==='PS' || data.tipoFormulario==='PVN'){
          navigate('/informacion/validacion')
        }else if(data.tipoFormulario==='PMJ' || data.tipoFormulario==='PVJ' ){
          navigate('/informacion/valid')
        }
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

    const validacionDoble=(e)=>{
      e.preventDefault();

      validarCliente(search.cedula) && validarProveedor(search.cedula)
          Swal.fire({
            title:'El usuario con este número de identificación es <strong>CLIENTE</strong> y <strong>PROVEEDOR</strong>',
            text:'¿De cuál de los dos desea visualizar la informacíon en pantalla?',
            showCancelButton:true,
            showConfirmButton:true,
            confirmButtonColor:'#D92121',
            confirmButtonText:'Cliente',

            showDenyButton:true,
            denyButtonColor:'blue',
            denyButtonText:'Proveedor'
          })
          .then(({ isConfirmed, isDenied }) => {
            if(isConfirmed){
              validarCliente(search.cedula)
              .then(({data})=>{
                localStorage.setItem('data',JSON.stringify(data));
                if(data.tipoFormulario==='PNC'){
                  navigate('/informacion/PNC')
                }else if(data.tipoFormulario==='PNCR'){
                  navigate('/informacion/PNCR')
                }else if(data.tipoFormulario==='PJC'){
                  navigate('/informacion/PJC')
                }else if(data.tipoFormulario==='PJCR'){
                  navigate('/informacion/PJCR')
                }else if(data.tipoFormulario==='CCP'){
                  navigate('/informacion/CCP')
                }
              })
            }else if(isDenied){
              validarProveedor(search.cedula)
              .then(({data})=>{
                localStorage.setItem('data',JSON.stringify(data));
                if(data.tipoFormulario==='PMN'){
                  navigate('/informacion/PMN')
                }else if(data.tipoFormulario==='PMJ'){
                  navigate('/informacion/PS')
                }else if(data.tipoFormulario==='PS'){
                  navigate('/informacion/PVN')
                }else if(data.tipoFormulario==='PVN'){
                  navigate('/informacion/PMJ')
                }else if(data.tipoFormulario==='PVJ'){
                  navigate('/informacion/PVJ')
                }
              })
            }
          })
          .catch((error)=>{
            console.log('no es duo')
          })
      }

    const validacionCompleta =(e)=>{
      e.preventDefault();
        /* ((validarProveedor(search.cedula)) && (validarCliente(search.cedula))) */
        validarProveedor(search.cedula)
        .then(()=>{
          validarCliente(search.cedula)
          .then(()=>{
              Swal.fire({
                title:'El usuario con este número de identificación es <strong>CLIENTE</strong> y <strong>PROVEEDOR</strong>',
                text:'¿De cuál de los dos desea visualizar la informacíon en pantalla?',
                showCancelButton:true,
                showConfirmButton:true,
                confirmButtonColor:'#D92121',
                confirmButtonText:'Cliente',
                showDenyButton:true,
                denyButtonColor:'blue',
                denyButtonText:'Proveedor'
              })
              .then(({ isConfirmed, isDenied }) => {
                if(isConfirmed){
                  validarCliente(search.cedula)
                  .then(({data})=>{
                    localStorage.setItem('data',JSON.stringify(data));
                    if(data.tipoFormulario==='PNC'){
                      navigate('/informacion/PNC')
                    }else if(data.tipoFormulario==='PNCR'){
                      navigate('/informacion/PNCR')
                    }else if(data.tipoFormulario==='PJC'){
                      navigate('/informacion/PJC')
                    }else if(data.tipoFormulario==='PJCR'){
                      navigate('/informacion/PJCR')
                    }else if(data.tipoFormulario==='CCP'){
                      navigate('/informacion/CCP')
                    }
                  })
                }else if(isDenied){
                  validarProveedor(search.cedula)
                  .then(({data})=>{
                    localStorage.setItem('data',JSON.stringify(data));
                    if(data.tipoFormulario==='PMN'){
                      navigate('/informacion/PMN')
                    }else if(data.tipoFormulario==='PMJ'){
                      navigate('/informacion/PMJ')
                    }else if(data.tipoFormulario==='PS'){
                      navigate('/informacion/PS')
                    }else if(data.tipoFormulario==='PVN'){
                      navigate('/informacion/PVN')
                    }else if(data.tipoFormulario==='PVJ'){
                      navigate('/informacion/PVJ')
                    }
                  })
                }
              })
            }).catch((error)=>{
              validarProveedor(search.cedula)
              .then(({data})=>{
                Swal.fire({
                  icon:'success',
                  title:`¡"${data.razonSocial}" es un@ <strong>PROVEEDOR</strong>¡`,
                  text:`Presiona "Aceptar" para ver la información en pantalla`,
                  showConfirmButton:true,
                  confirmButtonColor:'green',
                  confirmButtonText:'Aceptar'
                })
                localStorage.setItem('data',JSON.stringify(data));
                if(data.tipoFormulario==='PMN'){
                  navigate('/informacion/PMN')
                }else if(data.tipoFormulario==='PMJ'){
                  navigate('/informacion/PMJ')
                }else if(data.tipoFormulario==='PS'){
                  navigate('/informacion/PS')
                }else if(data.tipoFormulario==='PVN'){
                  navigate('/informacion/PVN')
                }else if(data.tipoFormulario==='PVJ'){
                  navigate('/informacion/PVJ')
                }
              })
            })
        })
            .catch((error)=>{
              validarCliente(search.cedula)
              .then(({data})=>{
                Swal.fire({
                  icon:"success",
                  title:`¡"${data.razonSocial}" es un@ <strong>CLIENTE</strong>¡`,
                  text:'Presiona "Aceptar" para ver la información en pantalla',
                  showConfirmButton:true,
                  confirmButtonColor:'green',
                  confirmButtonText:'Aceptar'
                })
                localStorage.setItem('data',JSON.stringify(data));
                if(data.tipoFormulario==='PNC'){
                  navigate('/informacion/PNC')
                }else if(data.tipoFormulario==='PNCR'){
                  navigate('/informacion/PNCR')
                }else if(data.tipoFormulario==='PJC'){
                  navigate('/informacion/PJC')
                }else if(data.tipoFormulario==='PJCR'){
                  navigate('/informacion/PJCR')
                }else if(data.tipoFormulario==='CCP'){
                  navigate('/informacion/CCP')
                }
              })
              .catch((error)=>{
                validarProveedor(search.cedula)
              .then(({data})=>{
                Swal.fire({
                  icon:'success',
                  title:`¡"${data.razonSocial}" es un@ <strong>PROVEEDOR</strong>¡`,
                  text:`Presiona "Aceptar" para ver la información en pantalla`,
                  showConfirmButton:true,
                  confirmButtonColor:'green',
                  confirmButtonText:'Aceptar'
                })
                localStorage.setItem('data',JSON.stringify(data));
                if(data.tipoFormulario==='PMN'){
                  navigate('/informacion/PMN')
                }else if(data.tipoFormulario==='PMJ'){
                  navigate('/informacion/PMJ')
                }else if(data.tipoFormulario==='PS'){
                  navigate('/informacion/PS')
                }else if(data.tipoFormulario==='PVN'){
                  navigate('/informacion/PVN')
                }else if(data.tipoFormulario==='PVJ'){
                  navigate('/informacion/PVJ')
                }
              })
              .catch((error)=>{
                Swal.fire({
                  icon:'warning',
                  title:`El número de idenficación "<strong>${search.cedula}</strong>" no está registrado en nuestra base de datos`,
                  text:'¿Desea resgistrarlo?',
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
              })
            })
      
    }

    const handleClickInicio=(e)=>{
      e = e.target.value
      if(user.role==='agencias' || user.role==='cartera'){
        return navigate('/inicio')
      }else if(user.role==='compras' || user.role==='comprasnv' || user.role==='asistente agencia'){
        return navigate('/compras')
      }else{
        return navigate('/inicio/admin')
      }
    }
    const handleClickImagen=(e)=>{
      e = e.target.value
      if( user.role==='cartera' || user.role==='agencias'){
        /* return navigate('/inicio') */
        return navigate('/menu/principal/Clientes')
      }else if(user.role==='compras' || user.role==='asistente agencia'){
        /* return navigate('/compras') */
        return navigate('/menu/principal/Proveedores')
      }else{
        /* return navigate('/inicio/admin') */
        return navigate('/menu/principal/admin')
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
      /* const valorBinario = valor */
      /* const nuevoTexto = valor ? 'Fue cargado':'No fue cargado'; */
      useEffect(()=>{
        if(valor=== 1){
          setLabelColor('#008F39')
          setNuevoTexto('Cargado')
        }else if(valor===0){
          setLabelColor('#CB3234')
          setNuevoTexto('No fue cargado')
        }else{
          setLabelColor(null)
          setNuevoTexto('')
        }
      },[valor]);
      return (
        <label className="" style={{color:labelColor, height:18}}><strong>{nuevoTexto}</strong></label>
      )
    }

    return(
      <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row '>
    <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <div className="d-flex flex-row">
      <div className="me-5 d-flex justify-content-center align-items-center flex-column">
        <div className="w-100" >
          <Button style={{height:35}} onClick={(e)=>handleClickInicio(e)} variant="contained" className="d-flex justify-content-start"><IoMdPersonAdd  className="me-1" />Ir a registro</Button>
        </div>
        <img onClick={handleClickImagen} src={Logo} style={{width:450,height:200, cursor: "pointer"}} />
      </div>
      
      <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>¿Ya existe el tercero?</strong></label>
        <hr style={{width:550, color:'black'}}/>
        </center>
        <div className="d-flex flex-row">
        <h2 className="me-3 mt-3">Validación de Tercero: </h2>
        <div className="d-flex flex-row">
        
        <TextField min={10000000}
                    max={9999999999}
                    value={search.cedula}
                    className="pe-3 mt-1"
                    pattern="[0-9]"
                    onChange={handlerChangeSearch} id="cedula" type="number" style={{fontSize:20}} label="Número de documento" variant="standard"></TextField>
        
        </div>
        </div>
        <center>
        <div className="mt-3 mb-3">
          {/* <button onClick={(e)=>handleSearch(e)} className="ms-3 mt-1">Buscar Cliente</button>
          <button  style={{backgroundColor:'#4169E1'}} onClick={(e)=>searchProveedor(e)} className="ms-3 mt-1">Buscar Proveedor</button> */}
          <button /* style={{backgroundColor:'green'}} */ onClick={(e)=>(validacionCompleta(e))} className="ms-3 mt-1">VALIDAR EXISTENCIA</button>
        </div>
        </center>
      </div>
      </div>
      </Fade>
      
    </div>
    </div>
    </div>
    </div>
    

    )
}

/* <Fade cascade damping={0.1} direction="down" triggerOnce='true'>
      <div className="d-flex flex-row">
      <div className="me-5 d-flex justify-content-center align-items-center">
        <img src={Logo} style={{width:450,height:200}} />
      </div>
      
      <div>
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>¡Bienvenid@!</strong></label>
        <hr style={{width:400, color:'black'}}/>
        </center>
        <div className="d-flex flex-row">
        <h4 className="me-5 mt-3">Validación de Tercero: </h4>
        <div className="d-flex flex-row">
        
        <TextField min={10000000}
                    max={9999999999}
                    value={search.cedula}
                    pattern="[0-9]"
                    onChange={handlerChangeSearch} id="cedula" type="number" style={{fontSize:20}} label="Número de documento" variant="standard"></TextField>
        
        </div>
        </div>
        <center>
        <div className="mt-2">
          <button onClick={(e)=>handleSearch(e)} className="ms-3 mt-1">Buscar Cliente</button>
          <button  style={{backgroundColor:'blue'}} onClick={(e)=>searchProveedor(e)} className="ms-3 mt-1">Buscar Proveedor</button>
        </div>
        </center>
      </div>
      </div>
      </Fade> */