import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import { useEffect, useState, useContext, useRef, Suspense } from "react";
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { MdDeleteOutline } from "react-icons/md";
import { deleteByCedula } from '../../services/clienteService';
import { Box, Button, Modal } from '@mui/material';
import { RiArrowGoBackFill } from "react-icons/ri";
import AuthContext from "../../context/authContext";
import { sendMail } from "../../services/mailService";
import { sendCertificado , sendCertiIVA , sendCertifiRFTE , updateCertificado } from "../../services/certificadoService";
import numberToWords from 'number-to-words';
import numeral from 'numeral';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  overflow:'auto',
  bgcolor: 'background.paper',
  justifyContent:'center',
  boxShadow: 24,
  p: 3,
  borderRadius:5,
};

export default function TableCertificados({ terceros, loading, ciudad }) {
  const { user, setUser } = useContext(AuthContext);
  const [selectedCliente, setSelectedTercero] = useState();
  const navigate = useNavigate();
  const [info,setInfo]=useState({
    nombreTercero:'',
    tercero:'',
    direccion:'',
    emailTercero:'',
    codCiudad:'',
    correoEnvio:'',
    emailTercero:'',
    sumaCredito:'',
  })
  const [update,setUpdate]=useState({
    correoEnvio:'',
    nombreSolicitante:'',
    usuarioEnvio:user.rowId,
    fechaEnvio:new Date(),
  })
  const [generar,setGenerar]=useState([]);
  useEffect(()=>{
    const data = localStorage.getItem('certificado');
    const generar = localStorage.getItem('generar');
    if(data){
      setInfo(JSON.parse(data));
    }
    if(generar){
      setGenerar(JSON.parse(generar));
    }
  })
  const columns = [
     {
      id: "tipoCertificado",
      name: "Tipo",
      selector: (row) => row.tipoCertificado,
      sortable: true,
      width: '88px'
    },
    {
      id: "cuenta",
      name: "Cuenta ",
      selector: (row) => row.cuenta,
      sortable: true,
      width: '110px'
    },
    {
      id: "concepto",
      name: "Concepto",
      selector: (row) => row.concepto,
      sortable: true,
      width: '270px',
    }, 
    {
      id: "tasa",
      name: "Tasa",
      selector: (row) => row.tasa,
      sortable: true,
      width: '120px',
    }, {
        id: "sumaValorBase",
        name: "Base",
        selector: (row) => row.sumaValorBase,
        sortable: true,
        width: '120px',
      },{
        id: "ciudadIca",
        name: "Ciudad Ica",
        selector: (row) => row.ciudadIca,
        sortable: true,
        width: '120px',
      },{
        id:'valorRetenido',
        name:'Valor Retenido',
        selector: (row) => row.valorRetenido,
        sortable:true,
        width:150
      }
  ]
  /* hallar totales de valorRetenido y valorBase */
    const suma = generar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.valorRetenido).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalRetenido = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    

    const suma2 = generar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0); 
    const totalBase = suma2.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    

    const totalRow ={tipoCertificado:'TOTAL',cuenta:'',
    concepto:'',tasa:'',sumaValorBase:totalBase,ciudadIca:'',
    valorRetenido:totalRetenido}

  /* tabla con total al final */
  const dataTable = [...generar,totalRow];

  /* se formatea el fomulario */
  const cleanForm = () => {
    setUpdate({
      nombreSolicitante: "",
      correoEnvio: "",
      fechaEnvio: "",
      usuarioEnvio: ""
    })
  }

  /* boton para todos los certificados */
  const [filtroRICA,setFiltroRICA]=useState([]);
  const [base,setBase] = useState(0);
  const [retenido,setRetenido] = useState(0);

  const handlerBotonUnido = (e) =>{
    e.preventDefault();
    if(generar[0].tipoCertificado===('RICA')){
      const filtroTipo = generar.filter((elem)=>{
        if(elem.tipoCertificado.includes('RICA')){
          return elem
        }
      })
      setFiltroRICA(filtroTipo);
      const filtrar = generar.filter((item)=>item.tipoCertificado.includes('RICA'));
      const suma = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalBase = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    
    setBase(suma);
    /* hallar el total retenido */
    const suma2 = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.valorRetenido).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalRetenido = suma2.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setRetenido(suma2);
    setOpenRIVA(false);
      Swal.fire({
        title:'¡Lee atentamente!',
        text:`Se le enviara un correo con el certificado RETEICA a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", sino de click en "CANCELAR"`,
        showCancelButton:true,
        showConfirmButton:true,
        confirmButtonColor:'#D92121',
        confirmButtonText:'ENVIAR',
        cancelButtonColor:'grey',
        cancelButtonText:'CANCELAR',
        icon:'question'
      }).then(({isConfirmed})=>{
        if(isConfirmed){
          const body={
            filtro: filtroTipo,
            correoEnvio: update.correoEnvio,
            nombreTercero: info.nombreTercero,
            cedula: info.tercero,
            direccion: info.direccion,
            fechaFormateada: fechaFormateada,
            fechaExpedicion: new Date(),
            ciudad: ciudad,
            baseFinal: totalBase,
            retenidoFinal: totalRetenido, 
            correoEmisor: user.email,
            usuarioEmisor: user.name,
          }
          sendCertificado(body)
          .then(()=>{
            const actualizar ={
              correoEnvio: update.correoEnvio,
              usuarioEnvio: user.rowId,
              nombreSolicitante: update.nombreSolicitante,
              fechaEnvio:new Date(),
            }
            const id = `${info.tercero}${filtrar[0].cuenta}`
            updateCertificado(id,actualizar)
            Swal.fire({
              icon:'success',
              title:'¡Felicidades!',
              text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
              timer:4000,
              showConfirmButton:true,
              confirmButtonColor:'green'
            })
            cleanForm();
          }).catch((err)=>{
            Swal.fire({
              icon:'warning',
              title:'¡ERROR',
              showConfirmButton:true,
              confirmButtonColor:'red',
              text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
            })
            cleanForm();
            console.log(err)
          })
        }else{
          cleanForm();
        }
      })
    } 
    if(generar[0].tipoCertificado===('RIVA')/* generar.filter((item)=>item.tipoCertificado.includes('RIVA')) */){
      const filtroTipo = generar.filter((elem)=>{
        if(elem.tipoCertificado.includes('RIVA')){
          return elem
        }
      })
      setFiltroRIVA(filtroTipo);
    const filtrar = generar.filter((item)=>item.tipoCertificado.includes('RIVA'));
    const suma = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalBase = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    
    setBase(suma);
    /* hallar el total retenido */
    const suma2 = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.valorRetenido).replace(/[,.]/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalRetenido = suma2.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setRetenido(suma2);
    setOpenRIVA(false);
    Swal.fire({
      title:'¡Lee atentamente!',
      text:`Se le enviara un correo con el certificado RETEIVA a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", si no de click en "CANCELAR"`,
      showCancelButton:true,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'ENVIAR',
      cancelButtonColor:'grey',
      cancelButtonText:'CANCELAR',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        const body={
          filtro: filtroTipo,
          correoEnvio: update.correoEnvio,
          nombreTercero: info.nombreTercero,
          cedula: info.tercero,
          direccion: info.direccion,
          fechaFormateada: fechaFormateada,
          fechaExpedicion: new Date(),
          ciudad: ciudad,
          baseFinal: totalBase,
          retenidoFinal: totalRetenido, 
          correoEmisor: user.email,
          usuarioEmisor: user.name,
        }
        sendCertiIVA(body)
        .then(()=>{
          const actualizar ={
            correoEnvio: update.correoEnvio,
            usuarioEnvio: user.rowId,
            nombreSolicitante: update.nombreSolicitante,
            fechaEnvio:new Date(),
          }
          const id = `${info.tercero}${filtrar[0].cuenta}`
          updateCertificado(id,actualizar)
          Swal.fire({
            icon:'success',
            title:'¡Felicidades!',
            text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
            timer:4000,
            showConfirmButton:true,
            confirmButtonColor:'green'
          })
          cleanForm();
        }).catch((err)=>{
          Swal.fire({
            icon:'warning',
            title:'¡ERROR',
            showConfirmButton:true,
            confirmButtonColor:'red',
            text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
          })
          cleanForm();
          console.log(err)
        })
      }else{
        cleanForm();
      }
    })
    } 
    if(generar[0].tipoCertificado===('RFTE')/* generar.filter((item)=>item.tipoCertificado.includes('RFTE')) */){
      const filtroTipo = generar.filter((elem)=>{
        if(elem.tipoCertificado.includes('RFTE')){
          return elem
        }
      })
      setFiltroRFTE(filtroTipo);
      const filtrar = generar.filter((item)=>item.tipoCertificado.includes('RFTE'));
      const suma = filtrar.reduce((acumular, item)=>{
        const numeroNormal = parseFloat((item.base).replace(/[,.]/g, ''))
        return acumular + numeroNormal;
      },0);    
      const totalBase = suma.toLocaleString(undefined,{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });    
      setBase(suma);
      /* hallar el total retenido */
      const suma2 = filtrar.reduce((acumular, item)=>{
        const numeroNormal = parseFloat((item.valorRetenido).replace(/[,.]/g, ''))
        return acumular + numeroNormal;
      },0);    
      const totalRetenido = suma2.toLocaleString(undefined,{
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setRetenido(suma2);
    setOpenRIVA(false);
    Swal.fire({
      title:'¡Lee atentamente!',
      text:`Se le enviara un correo con el certificado RETEFUENTE a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", si no de click en "CANCELAR"`,
      showCancelButton:true,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'ENVIAR',
      cancelButtonColor:'grey',
      cancelButtonText:'CANCELAR',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        const body={
          filtro: filtroTipo,
          correoEnvio: update.correoEnvio,
          nombreTercero: info.nombreTercero,
          cedula: info.tercero,
          direccion: info.direccion,
          fechaFormateada: fechaFormateada,
          fechaExpedicion: new Date(),
          ciudad: ciudad,
          baseFinal: totalBase,
          retenidoFinal: totalRetenido, 
          correoEmisor: user.email,
          usuarioEmisor: user.name,
        }
        sendCertifiRFTE(body)
        .then(()=>{
          const actualizar ={
            correoEnvio: update.correoEnvio,
            usuarioEnvio: user.rowId,
            nombreSolicitante: update.nombreSolicitante,
            fechaEnvio:new Date(),
          }
          const id = `${info.tercero}${filtrar[0].cuenta}`
          updateCertificado(id,actualizar)
          Swal.fire({
            icon:'success',
            title:'¡Felicidades!',
            text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
            timer:4000,
            showConfirmButton:true,
            confirmButtonColor:'green'
          })
          cleanForm();
        }).catch((err)=>{
          Swal.fire({
            icon:'warning',
            title:'¡ERROR',
            showConfirmButton:true,
            confirmButtonColor:'red',
            text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
          })
          cleanForm();
          console.log(err)
        })
      }else{
        cleanForm();
      }
    })
    }
  }

  const handlerFiltroRica=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RICA')){
        return elem
      }
    })
    setFiltroRICA(filtroTipo);
    /* hallar el total de la base */
    const filtrar = terceros.filter((item)=>item.tipoCertificado.includes('RICA'));
    const suma = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/'/g, '').replace(/,/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalBase = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    
    setBase(suma);
    /* hallar el total retenido */
    const suma2 = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.valorRetenido).replace(/'/g, '').replace(/,/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalRetenido = suma2.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setRetenido(suma2);
    setOpenRICA(false);
      Swal.fire({
        title:'¡Lee atentamente!',
        text:`Se le enviara un correo con el certificado RETEICA a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", sino de click en "CANCELAR"`,
        showCancelButton:true,
        showConfirmButton:true,
        confirmButtonColor:'#D92121',
        confirmButtonText:'ENVIAR',
        cancelButtonColor:'grey',
        cancelButtonText:'CANCELAR',
        icon:'question'
      }).then(({isConfirmed})=>{
        if(isConfirmed){
          const body={
            filtro: filtroTipo,
            correoEnvio: update.correoEnvio,
            nombreTercero: info.nombreTercero,
            cedula: info.tercero,
            direccion: info.direccion,
            fechaFormateada: fechaFormateada,
            fechaExpedicion: new Date(),
            ciudad: info.codCiudad,
            baseFinal: totalBase,
            retenidoFinal: totalRetenido, 
            correoEmisor: user.email,
          }
          sendCertificado(body)
          .then(()=>{
            const actualizar ={
              correoEnvio: update.correoEnvio,
              usuarioEnvio: user.rowId,
              nombreSolicitante: update.nombreSolicitante,
              fechaEnvio:new Date(),
            }
            const id = `${info.tercero}${filtrar[0].cuenta}`
            updateCertificado(id,actualizar)
            Swal.fire({
              icon:'success',
              title:'¡Felicidades!',
              text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
              timer:4000,
              showConfirmButton:true,
              confirmButtonColor:'green'
            })
            cleanForm();
          }).catch((err)=>{
            Swal.fire({
              icon:'warning',
              title:'¡ERROR',
              showConfirmButton:true,
              confirmButtonColor:'red',
              text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
            })
            cleanForm();
            console.log(err)
          })
        }else{
          cleanForm();
        }
      })
  }
  /* boton para RIVA */
  const [filtroRIVA,setFiltroRIVA]=useState([]);
  const handlerFiltroRiva=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RIVA')){
        return elem
      }
    })
    setFiltroRIVA(filtroTipo);
    const filtrar = terceros.filter((item)=>item.tipoCertificado.includes('RIVA'));
    const suma = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/'/g, '').replace(/,/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalBase = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    
    setBase(suma);
    /* hallar el total retenido */
    const suma2 = filtrar.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.valorRetenido).replace(/'/g, '').replace(/,/g, ''))
      return acumular + numeroNormal;
    },0);    
    const totalRetenido = suma2.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sumaRetenido = filtrar.reduce((acumular,item)=>parseFloat(acumular) + parseFloat(item.valorRetenido),0);
    setRetenido(suma2);
    setOpenRIVA(false);
    Swal.fire({
      title:'¡Lee atentamente!',
      text:`Se le enviara un correo con el certificado RETEIVA a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", si no de click en "CANCELAR"`,
      showCancelButton:true,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'ENVIAR',
      cancelButtonColor:'grey',
      cancelButtonText:'CANCELAR',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        const body={
          filtro: filtroTipo,
          correoEnvio: update.correoEnvio,
          nombreTercero: info.nombreTercero,
          cedula: info.tercero,
          direccion: info.direccion,
          fechaFormateada: fechaFormateada,
          fechaExpedicion: new Date(),
          ciudad: info.codCiudad,
          baseFinal: totalBase,
          retenidoFinal: totalRetenido, 
          correoEmisor: user.email,
        }
        sendCertiIVA(body)
        .then(()=>{
          const actualizar ={
            correoEnvio: update.correoEnvio,
            usuarioEnvio: user.rowId,
            nombreSolicitante: update.nombreSolicitante,
            fechaEnvio:new Date(),
          }
          const id = `${info.tercero}${filtrar[0].cuenta}`
          updateCertificado(id,actualizar)
          Swal.fire({
            icon:'success',
            title:'¡Felicidades!',
            text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
            timer:4000,
            showConfirmButton:true,
            confirmButtonColor:'green'
          })
          cleanForm();
        }).catch((err)=>{
          Swal.fire({
            icon:'warning',
            title:'¡ERROR',
            showConfirmButton:true,
            confirmButtonColor:'red',
            text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
          })
          cleanForm();
          console.log(err)
        })
      }else{
        cleanForm();
      }
    })
  }
  /* boton para RFTE */
  const [filtroRFTE,setFiltroRFTE]=useState([]);
  const handlerFiltroRfte=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RFTE')){
        return elem
      }
    })
    setFiltroRFTE(filtroTipo);
    const filtrar = terceros.filter((item)=>item.tipoCertificado.includes('RFTE'));
    const suma = filtrar.reduce((acumular,item)=>parseFloat(acumular) + parseFloat(item.base),0);
    setBase(suma);
    /* hallar el total retenido */
    const sumaRetenido = filtrar.reduce((acumular,item)=>parseFloat(acumular) + parseFloat(item.valorRetenido),0);
    setRetenido(sumaRetenido);
    setOpenRFTE(false);
    Swal.fire({
      title:'¡Lee atentamente!',
      text:`Se le enviara un correo con el certificado RETEFUENTE a ${info.nombreTercero} a la direccion ${update.correoEnvio}. Si es correcto de click en "ENVIAR", de lo contrario de click en "CANCELAR"`,
      showCancelButton:true,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'ENVIAR',
      cancelButtonColor:'grey',
      cancelButtonText:'CANCELAR',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        const body={
          filtro: filtroTipo,
          correoEnvio: update.correoEnvio,
          nombreTercero: info.nombreTercero,
          cedula: info.tercero,
          direccion: info.direccion,
          fechaFormateada: fechaFormateada,
          fechaExpedicion: new Date(),
          ciudad: info.codCiudad,
          baseFinal: suma,
          retenidoFinal: sumaRetenido, 
          correoEmisor: user.email,

        }
        sendCertifiRFTE(body)
        .then(()=>{
          const actualizar ={
            correoEnvio: update.correoEnvio,
            usuarioEnvio: user.rowId,
            nombreSolicitante: update.nombreSolicitante,
            fechaEnvio:new Date(),
          }
          const id = `${info.tercero}${filtrar[0].cuenta}`
          updateCertificado(id,actualizar)
          Swal.fire({
            icon:'success',
            title:'¡Felicidades!',
            text:'Se ha enviado el correo de manera satisfactoria. revisa tu correo para verificar la información',
            timer:4000,
            showConfirmButton:true,
            confirmButtonColor:'green'
          })
          cleanForm();
        }).catch((err)=>{
          Swal.fire({
            icon:'warning',
            title:'¡ERROR',
            showConfirmButton:true,
            confirmButtonColor:'red',
            text:'Ha ocurrido un error a la hora de generar y enviar el certificado, intenta nuevamente, si el problema persiste comunicate con el área de sistemas.'
          })
          cleanForm();
          console.log(err)
        })
      }else{
        cleanForm();
      }
    })

  }
  /*  */
  const [openRIVA,setOpenRIVA]=useState(false);
  const handleOpenModalRIVA=(e)=>{
    e.preventDefault();
    /* const filtro = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RIVA')){
        return elem
      }
    })
    if(filtro.length>0){ */
      setOpenRIVA(true)
    /* }else{
      Swal.fire({
        icon:'warning',
        title:'¡Oups...!',
        text:'Al parecer no hay movimientos en este tipo de formulario, Elige uno diferente',
        confirmButtonText:'OK',
        confirmButtonColor:'red',
        showConfirmButton:true
      })
    } */
  }
  const handleCloseModalRIVA=()=>{
    cleanForm();
    setOpenRIVA(false);
  }
/*  */
  const [openRICA,setOpenRICA]=useState(false);
  const handleOpenModalRICA=(e)=>{
    e.preventDefault();
    /* const filtro = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RICA')){
        return elem
      }
    })
    if(filtro.length>0){ */
       setOpenRICA(true)
    /* }else{
      Swal.fire({
        icon:'warning',
        title:'¡Oups...!',
        text:'Al parecer no hay movimientos en este tipo de formulario, Elige uno diferente',
        confirmButtonText:'OK',
        confirmButtonColor:'red',
        showConfirmButton:true
      })
    } */
  }
  const handleCloseModalRICA=()=>{
    cleanForm();
    setOpenRICA(false);
  }
/*  */
  const [openRFTE,setOpenRFTE]=useState(false);
  const handleOpenModalRFTE=(e)=>{
    e.preventDefault();
    const filtro = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RFTE')){
        return elem
      }
    })
    if(filtro.length>0){
      setOpenRFTE(true)
    }else{
      Swal.fire({
        icon:'warning',
        title:'¡Oups...!',
        text:'Al parecer no hay movimientos en este tipo de formulario, Elige uno diferente',
        confirmButtonText:'OK',
        confirmButtonColor:'red',
        showConfirmButton:true
      })
    }
  }

  const handleCloseModalRFTE=()=>{
    cleanForm();
    setOpenRFTE(false);
  }
  const handlerUpdate=(e)=>{
    const { id, value } = e.target;
    console.log(value);
    setUpdate({
      ...update,
      [id]: value,
    });
  }
  const [mostrarSpan,setMostrarSpan] = useState(false);

  /* utilizar correo registrado en el input */
  const cambiarValorCorreo = (e) =>{
    e.preventDefault();
    const value = info.emailTercero
    if(info.emailTercero===null){
      setMostrarSpan(true);
      setTimeout(() => {
        setMostrarSpan(false);
      }, 3000);
    }else{
      setUpdate({
        ...update,
        correoEnvio:value,
      })
    }
  }
  const handlerInfo=(e)=>{
    const { id, value } = e.target;
    console.log(value);
    setInfo({
      ...info,
      [id]: value,
    });
  }
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

  /* utilizar fecha actual sin la hora */
  const fechaActual = new Date();
  const formatoFecha = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const fechaFormateada = fechaActual.toLocaleDateString(undefined, formatoFecha);

  const formatearNumero = (numero) => {
    return numero.toLocaleString('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4 ' style={{width:1000,maxHeight:350,backgroundColor:'white'}} >
    <div className='d-flex w-100 justify-content-start mb-2'>
      <Button onClick={(e)=>window.history.back(e)} variant='contained'><RiArrowGoBackFill className="me-1" />Volver</Button>
    </div> 
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{fontSize:20}}
        columns={columns}
        /* data={generar} */
        data={dataTable}
        fixedHeaderScrollHeight={200}
        progressPending={loading}
        progressComponent={
          <div class="d-flex align-items-center text-danger gap-2 mt-2">
            <strong>Cargando...</strong>
            <div
              class="spinner-border spinner-border-sm ms-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        }
        dense
        striped
        fixedHeader
        paginationTotalRows={dataTable}
        noDataComponent={
          <div style={{padding: 24}}>Ningún resultado encontrado...</div>} 
      />
      <div className='d-flex w-100 justify-content-center mt-2'>
        <Button variant='contained' color="error" className='me-4' onClick={handleOpenModalRIVA}>Generar Certificado</Button>
          <Modal
            open={openRIVA}
            onClose={handleCloseModalRIVA}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={style}>
              <div className='d-flex w-100 h-100 flex-column'>
              <form onSubmit={handlerBotonUnido}>
                <center>
                <h1 className='text-danger'>GENERAR CERTIFICADO</h1>
                </center>
                <hr/>
                <div className='d-flex flex-column'>
                <div className='d-flex flex-row w-100 '>
                  <div className='w-50 justify-content-start'>
                    <h5 style={{width:190}} className='mt-1'>Correo Envio:</h5>
                  </div>
                    <div className='w-75 justify-content-end text-align-end pb-1'> 
                      <Button onClick={(e)=>cambiarValorCorreo(e)} variant='contained'>Usar correo registrado</Button>
                    </div>
                  </div>
                  <div className='d-flex flex-row'>                 
                  <input
                    id='correoEnvio'
                    value={update.correoEnvio}
                    onChange={(e)=>(handlerUpdate(e),manejarCambio(e))}
                    type='text'
                    required
                    placeholder='Correo de Destino'
                    style={{fontSize:16,height:10}}
                    className='form-control form-control-sm'
                  ></input>
                  <p className='ps-3' style={{color:Span}}><stron>{Validacion}</stron></p>
                  </div> 
                  {mostrarSpan && (
                    <span className='text-danger'>No hay correo registrado</span>
                  )}
                </div>
                <div className='d-flex flex-row mt-2'>
                  <h5 style={{width:185}}>Nombre Solicitante:</h5>
                  <input
                    id='nombreSolicitante'
                    required
                    value={update.nombreSolicitante}
                    onChange={handlerUpdate}
                    type='text'
                    placeholder='Nombre'
                    style={{fontSize:16, height:20}}
                    className='form-control form-control-sm mt-3 me-3'
                  />
                </div>
                <center>
                <div className='w-100 justify-content-center mt-2'>
                  <button onSubmit={handlerBotonUnido}>Enviar</button>
                </div>
                </center>
                </form>
              </div>
            </Box>
          </Modal>
        {/* <Button onClick={handleOpenModalRICA} variant='contained' color="info" className='me-4'>Certificado ReteIca</Button>
          <Modal
              open={openRICA}
              onClose={handleCloseModalRICA}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={style}>
              <div className='d-flex w-100 h-100 flex-column'>
                <form onSubmit={handlerFiltroRica}>
                <center>
                <h1 className='text-danger'>GENERAR CERTIFICADO</h1>
                </center>
                <hr/>
                <div className='d-flex flex-column'>
                  <div className='d-flex flex-row w-100 '>
                  <div className='w-50 justify-content-start'>
                    <h5 style={{width:190}} className='mt-1'>Correo Envio:</h5>
                  </div>
                    <div className='w-75 justify-content-end text-align-end pb-1'> 
                      <Button onClick={(e)=>cambiarValorCorreo(e)} variant='contained'>Usar correo registrado</Button>
                    </div>
                  </div>
                  <div className='d-flex flex-row'>
                  <input
                    id='correoEnvio'
                    value={update.correoEnvio}
                    onChange={(e)=>(handlerUpdate(e),manejarCambio(e))}
                    type='text'
                    required
                    placeholder='Correo de Destino'
                    style={{fontSize:16,height:10}}
                    className='form-control form-control-sm'
                  ></input>
                  <p className='ps-3' style={{color:Span}}><stron>{Validacion}</stron></p>
                  </div>
                  {mostrarSpan && (
                    <span className='text-danger'>No hay correo registrado</span>
                  )}
                </div>
                <div className='d-flex flex-row mt-2'>
                  <h5 style={{width:185}}>Nombre Solicitante:</h5>
                  <input
                    id='nombreSolicitante'
                    required
                    value={update.nombreSolicitante}
                    onChange={handlerUpdate}
                    type='text'
                    placeholder='Nombre'
                    style={{fontSize:16, height:20}}
                    className='form-control form-control-sm mt-3 me-3'
                  />
                </div>
                <center>
                <div className='w-100 justify-content-center mt-2'>
                  <button onSubmit={handlerFiltroRica}>Enviar</button>
                </div>
                </center>
                </form>
              </div>
              </Box>
            </Modal> */}
        {/* <Button onClick={handleOpenModalRFTE} variant='contained' color="error" >Certificado retefuente</Button>
          <Modal
              open={openRFTE}
              onClose={handleCloseModalRFTE}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={style}>
              <div className='d-flex w-100 h-100 flex-column'>
                <form onSubmit={handlerFiltroRfte}>
                <center>
                <h1 className='text-danger'>GENERAR CERTIFICADO</h1>
                </center>
                <hr/>
                <div className='d-flex flex-column'>
                <div className='d-flex flex-row w-100 '>
                  <div className='w-50 justify-content-start'>
                    <h5 style={{width:190}} className='mt-1'>Correo Envio:</h5>
                  </div>
                    <div className='w-75 justify-content-end text-align-end pb-1'> 
                      <Button onClick={(e)=>cambiarValorCorreo(e)} variant='contained'>Usar correo registrado</Button>
                    </div>
                  </div>                  
                  <div className='d-flex flex-row'>
                  <input
                    id='correoEnvio'
                    value={update.correoEnvio}
                    onChange={(e)=>(handlerUpdate(e),manejarCambio(e))}
                    type='text'
                    required
                    placeholder='Correo de Destino'
                    style={{fontSize:16,height:10}}
                    className='form-control form-control-sm'
                  ></input>
                  <p className='ps-3' style={{color:Span}}><stron>{Validacion}</stron></p>
                  </div>
                  {mostrarSpan && (
                    <span className='text-danger'>No hay correo registrado</span>
                  )}
                </div>
                <div className='d-flex flex-row mt-2'>
                  <h5 style={{width:190}}>Nombre Solicitante:</h5>
                  <input
                    id='nombreSolicitante'
                    value={update.nombreSolicitante}
                    onChange={handlerUpdate}
                    type='text'
                    placeholder='Nombre'
                    style={{fontSize:16, height:20}}
                    className='form-control form-control-sm mt-3'
                  />
                </div>
                <center>
                <div className='w-100 justify-content-center mt-2'>
                  <button onSubmit={handlerFiltroRfte}>Enviar</button>
                </div>
                </center>
                </form>
              </div>
              </Box>
            </Modal> */}
      </div>
      </div>
    </div>
  )
}