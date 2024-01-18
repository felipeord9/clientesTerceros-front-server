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

export default function CertiTable({ terceros, loading }) {
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
  useEffect(()=>{
    const data = localStorage.getItem('certificado');
    if(data){
      setInfo(JSON.parse(data));
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
      width: '220px',
    }, 
    {
      id: "sumaDebito",
      name: "Debito ",
      selector: (row) => row.sumaDebito,
      sortable: true,
      width: '120px',
    },
    {
        id: "sumaCredito",
        name: "Credito",
        selector: (row) => row.sumaCredito,
        sortable: true,
        width: '120px'
      },
      {
        id: "sumaMovimiento",
        name: "Neto",
        selector: (row) => row.sumaMovimiento,
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
        id: "tasa",
        name: "Tasa",
        selector: (row) => row.tasa,
        sortable: true,
        width: '120px',
      }
  ]

  /* boton para RICA */
  const handlerFiltroRica=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RICA')){
        return elem
      }
    })
    if(filtroTipo.length>0){
      localStorage.setItem('generar',JSON.stringify(filtroTipo));
      localStorage.setItem('codCity',JSON.stringify(info.codCiudad))
      navigate('/generar/certificados')
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
  /* boton para RIVA */
  const handlerFiltroRiva=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RIVA')){
        return elem
      }
    })
    if(filtroTipo.length>0){
      localStorage.setItem('generar',JSON.stringify(filtroTipo));
      localStorage.setItem('codCity',JSON.stringify(info.codCiudad))
      navigate('/generar/certificados')
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
  /* boton para RFTE */
  const handlerFiltroRfte=(e)=>{
    e.preventDefault();
    const filtroTipo = terceros.filter((elem)=>{
      if(elem.tipoCertificado.includes('RFTE')){
        return elem
      }
    })
    if(filtroTipo.length>0){
      localStorage.setItem('generar',JSON.stringify(filtroTipo));
      localStorage.setItem('codCity',JSON.stringify(info.codCiudad))
      navigate('/generar/certificados')
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

  const fechaActual = new Date();
  const formatoFecha = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };
  const fechaFormateada = fechaActual.toLocaleDateString(undefined, formatoFecha);

    const suma = terceros.reduce((acumular, item)=>{
      const numeroNormal = parseFloat((item.base).replace(/[,.]/g, '')/* .replace(/./g, '') */)
      return acumular + numeroNormal;
    },0);    
    const totalBase = suma.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });   
     
    const credit = terceros.reduce((acumular, item)=>{
      const numeroNormal = parseInt((item.sumaCredito).replace(/[,.]/g, '')/* .replace(/./g, '') */)
      return acumular + numeroNormal;
    },0); 
    const totalCredito = credit.toLocaleString(undefined,{
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });    
  const totalRow ={tipoCertificado:'TOTAL',cuenta:'',
  concepto:'',sumaDebito:'',sumaCredito:totalCredito,sumaMovimiento:'',
  sumaValorBase:totalBase,ciudadIca:'',tasa:''}

  const dataWithTotal = [...terceros,totalRow];

  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4 ' style={{width:1000,maxHeight:350,backgroundColor:'white'}} >
    <div className='d-flex w-100 justify-content-start mb-2'>
      <Button onClick={(e)=>navigate('/consultar/certificado')} variant='contained'><RiArrowGoBackFill className="me-1" />Volver</Button>
    </div> 
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{fontSize:20}}
        columns={columns}
        data={dataWithTotal}
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
        noDataComponent={
          <div style={{padding: 24}}>Ningún resultado encontrado...</div>} 
      />
      <div className='d-flex w-100 justify-content-center mt-2'>
        <Button variant='contained' color="success" className='me-4' onClick={handlerFiltroRiva}>Certificado ReteIva</Button>
        <Button onClick={handlerFiltroRica} variant='contained' color="info" className='me-4'>Certificado ReteIca</Button>
        <Button onClick={handlerFiltroRfte} variant='contained' color="error" >Certificado retefuente</Button>
      </div>
      </div>
    </div>
  )
}