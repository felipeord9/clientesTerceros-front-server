import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableCertificados from "../../components/tablaCertificados"
import CertiTable from "../../components/certiTable"
import { findClientes  } from "../../services/clienteService"
import { findAll , findByTercero , findCertificados } from '../../services/certificadoService'
import Swal from "sweetalert2";
import { getAllCiudades , getOneCiudad } from "../../services/ciudadService";

export default function GenerateCertificado() {
  const [terceros, setTerceros] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [info,setInfo]=useState({
    nombreTercero:'',
    tercero:'',
    codCiudad:'',
    emailTercero:'',
    direccion:''
  })

  const mensaje = 'NO hay correo registrado'
  
  useEffect(()=>{
    const datos = localStorage.getItem('certificado');
    const data = localStorage.getItem('dataCerti');
    if(datos){
      setInfo(JSON.parse(datos));
    }
    
  },[]);
  const [city,setCity] = useState({
    codigo:'',
    id:'',
    description:'',
  })
  const [ciudades,setCiudades] = useState([]);
  const [prueba,setPrueba] = useState('')
  useEffect(()=>{
    const city = localStorage.getItem('codCity');
    if(city){
      setPrueba(city)
      getOneCiudad(JSON.parse(city)).then((data)=>{
        if(data){
          setCity(JSON.parse(data))
        }
      })
    }
    getAllCiudades().then((data) => {
      const filtro = data.filter((Element)=>{
        if(Element.codigo.includes(JSON.parse(city))){
          return Element
        }
      })
      setCiudades(filtro)
    });
  },[]);

  const ChangeInput = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
    <h1 className="text-danger fw-bold">Información de Tercero y Generación de Certificados</h1>
      <div className="d-flex flex-column gap-2 h-100 ">
        <div className="d-flex flex-column rounded rounded-3 p-1 border border-2" style={{backgroundColor:'white'}}>
        <div className="d-flex flex-row ">
        <div className="d-flex flex-row me-2" style={{width:255}}>
          <h5>NIT:</h5>
          <input
            id="tercero"
            type="search"
            className="form-control form-control-sm d-flex justify-content-center align-content-center"
            /* onChange={searchTerceros} */
            value={info.tercero}
            disabled
            style={{backgroundColor:'grey', color:'white',fontSize:18}}
          >
          </input>
        </div>
        <div className="d-flex flex-row me-2 w-75">
        <h5>Nombre:</h5>
          <input
            value={info.nombreTercero}
            className="form-control form-control-sm"
            disabled
            style={{backgroundColor:'grey', color:'white', fontSize:18}}
          >
          </input>
        </div>
        <div className="d-flex flex-row w-50">
          <h5>Direccion:</h5>
          <input 
            className="form-control form-control-sm"
            disabled
            style={{backgroundColor:'grey', color:'white', fontSize:18}}
            value={info.direccion}
          />
        </div>
        </div>
        <div className="d-flex flex-row mt-1">
        <div className="d-flex flex-row me-2 w-75">
        <h5>Correo:</h5>
        {info.emailTercero ? (
          <input
            value={info.emailTercero}
            className="form-control form-control-sm"
            disabled
            style={{backgroundColor:'grey', color:'white', fontSize:18}}
          >
          </input>
        ):(
          <input
            value={mensaje}
            className="form-control form-control-sm"
            disabled
            style={{backgroundColor:'grey', color:'white', fontSize:18}}
          >
          </input>
        )}
        </div>
        <div className="d-flex flex-row w-50">
          <h5>Ciudad:</h5>
          <select
            id="codCiudad"
            value= {info.codCiudad}
            className="form-select form-select-sm w-100"
            required
            onChange={ChangeInput}
            style={{backgroundColor:'grey', color:'white',fontSize:18}}
            
          >
            {ciudades.map((item)=>(
              /* item.codigo == info.codCiudad ? */
              <option>{item.description}</option>
              /* : null */
            ))}
          {/* {ciudades
            .sort((a,b)=>a.id - b.id)
            .map((elem)=>(
              elem.codigo == info.codCiudad ?
              <option id={elem.id} value={elem.codigo}>
                {elem.description}
              </option>
              : null
            ))
          } */}
        </select>
        </div>
        </div>
        </div>
        <TableCertificados terceros={suggestions} loading={loading} ciudad={ciudades.map((item)=>item.description)} style={{fontSize:20}}/>
      </div>
    </div>
    </div>
    </div>
  )
} 