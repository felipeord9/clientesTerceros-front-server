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
import { findByTercero , findAll } from "../../services/certificadoService";
import { validarCliente } from "../../services/clienteService"; 
import { validarProveedor } from "../../services/proveedorService";
import Swal from "sweetalert2";
import AuthContext from "../../context/authContext";
import Button from '@mui/material/Button';
import { RiArrowGoBackFill } from "react-icons/ri";
import { IoMdPersonAdd } from "react-icons/io";

export default function ConsultarCertificado(){
  const { user, setUser } = useContext(AuthContext);
  const [certificados,setCertificados]=useState([]);
  const [suggestions, setSuggestions] = useState([])
  const navigate =useNavigate()
    const [search,setSearch]=useState({
      tercero:'',
      name:''
    })
    const handlerChangeSearch = (e) => {
      const { id, value } = e.target;
      setSearch({
        ...search,
        [id]: value,
      });
    };

    const searchProveedor = (e)=>{
      e.preventDefault();
      /* const {value} = e.target
      if(value!==""){
        const filteredCertificado = certificados.filter((elem)=>{
          if(elem.tercero.includes(value)||(elem.nombreTercero.includes(value))){
            return elem
          }
        })
        if(filteredCertificado.length>0){
          setSuggestions(filteredCertificado)
        }else{
          setSuggestions(certificados)
        }
      }else{
        setSuggestions(certificados)
      } */
      findByTercero(search.tercero)
      .then(({data})=>{  
        Swal.fire({
          icon:'success',
          title:`¡El Tercero con NIT <strong>${search.tercero}</strong> y nombre <strong>${data.nombreTercero}</strong> si se encuentra registrado¡`,
          text:'La información la podras visualizar en pantalla',
          showConfirmButton:true,
          confirmButtonColor:'green',
          confirmButtonText:'Aceptar'
        })
        setSearch({tercero:data.tercero,name :data.nombreTercero})
        localStorage.setItem('certificado',JSON.stringify(data));
        localStorage.setItem('dataCerti',JSON.stringify(search.tercero));
        navigate('/informacion/tercero/certificados')
        })
        .catch((error)=>{
          Swal.fire({
            icon:'warning',
            title:'¡ERROR!',
            text:`El Tercero de NIT "${search.tercero}" no se encuentra registrado en nuestra base de datos. Verifica la infomación suministrada. Si el problema persiste comunicate con el área de sistemas`,
            showConfirmButton:true,
            confirmButtonColor:'green',
            confirmButtonText:'OK',
          })
        })
    }

    const handleClickInicio=(e)=>{
      if( user.role==='cartera'){
        /* return navigate('/inicio') */
        return navigate('/menu/principal/Clientes')
      }else if(user.role==='compras' || user.role==='agencias' || user.role==='comprasnv'){
        /* return navigate('/compras') */
        return navigate('/menu/principal/Proveedores')
      }else{
        /* return navigate('/inicio/admin') */
        return navigate('/menu/principal/admin')
      }
    }
    const handleClickImagen=(e)=>{
      e = e.target.value
      if( user.role==='cartera'){
        /* return navigate('/inicio') */
        return navigate('/menu/principal/Clientes')
      }else if(user.role==='compras' || user.role==='agencias' || user.role==='comprasnv'){
        /* return navigate('/compras') */
        return navigate('/menu/principal/Proveedores')
      }else{
        /* return navigate('/inicio/admin') */
        return navigate('/menu/principal/admin')
      }
    }

    return(
      <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto "style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 mb-5 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
    <div className='d-flex flex-row '>
    <Fade cascade damping={0.1} direction="left" triggerOnce='true'>
      <div className="d-flex flex-column">
      <div className="m-0 p-0 d-flex justify-content-center align-items-center flex-column" >
        <div className="w-100 h-100"  >
        <Button style={{height:35}} onClick={(e)=>handleClickInicio(e)} variant="contained" className="d-flex justify-content-start"><RiArrowGoBackFill className="me-1" />Back</Button>
        </div>
     </div>
      
      <div >
        <center>
        <label className='text-danger' style={{color:'black', marginBottom:5, fontSize:60, userSelect:'none'}}><strong>Generar certificados</strong></label>
        <div className="d-flex flex-column">
        <label className="" style={{fontSize:18}}>Para Generar uno o varios certificados, primero debes </label>
        <label style={{fontSize:18}}> buscar el tercero por <strong>NIT</strong> o por <strong>NOMBRE</strong></label>
        </div>
        <hr style={{width:650, color:'black'}}/>
        </center>
        <div className="d-flex flex-row w-100">
        <div className="d-flex flex-row w-50 ms-3 me-3">
        <h2 className="me-3 mt-3">NIT: </h2>
        <div className="d-flex flex-row">
        
        <TextField min={10000000}
                    max={9999999999}
                    value={search.tercero}
                    className="pe-3 mt-1"
                    pattern="[0-9]"
                    onChange={handlerChangeSearch} id="tercero" type="number" style={{fontSize:20}} label="Número de documento" variant="standard"></TextField>
        </div>
        </div>
        <div className="d-flex flex-row w-75 me-3">
          <h2 className="me-3 mt-3">NOMBRE:</h2>
          <TextField 
            id='name'
            value={search.name}
            type="text"
            className="rounded rounded-4"
            style={{fontSize:20,backgroundColor:'grey'}}
            label='Nombre del tercero'
            variant="standard"
            disabled
            onChange={handlerChangeSearch}
          />
        </div>
        </div>
        <center>
        <div className="mt-3 mb-3">
          <button onClick={(e)=>searchProveedor(e)} className="ms-3 mt-1">BUSCAR</button>
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