import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableCertificados from "../../components/tablaCertificados"
import CertiTable from "../../components/certiTable"
import { findClientes  } from "../../services/clienteService"
import { findAll , findByTercero , findCertificados } from '../../services/certificadoService'
import Swal from "sweetalert2";

export default function InfoCertificado() {
  const [terceros, setTerceros] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const [info,setInfo]=useState({
    nombreTercero:'',
    tercero:'',
  })

  useEffect(()=>{
    const datos = localStorage.getItem('certificado');
    const data = localStorage.getItem('dataCerti');
    if(datos){
      setInfo(JSON.parse(datos));
    }
    if(data){
      setSearch(JSON.parse(data));
      findAll(JSON.parse(data))
      .then(({data})=>{
        setTerceros(data)
        setSuggestions(data)
        setLoading(false)    
      })
    }
  },[]);

  const searchTerceros = () => {
    findAll(search)
    .then(({data})=>{
      setTerceros(data)
      setSuggestions(data)
      setLoading(false)    
    })
  }

  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
    <h1 className="text-danger fw-bold">Movimientos del Tercero </h1>
      <div className="d-flex flex-column gap-2 h-100 ">
        <div className="d-flex flex-row rounded rounded-3 p-3 border border-2" style={{backgroundColor:'white'}}>
        <div className="d-flex flex-row w-25 me-4">
          <h3>NIT:</h3>
          <input
            id="tercero"
            type="search"
            className="form-control form-control-sm d-flex justify-content-center align-content-center"
            onChange={searchTerceros}
            value={search}
            disabled
            style={{backgroundColor:'grey', color:'white',fontSize:22}}
          >
          </input>
        </div>
        <div className="d-flex flex-row w-75 ms-4">
        <h3>Nombre:</h3>
          <input
            value={info.nombreTercero}
            className="form-control form-control-sm"
            disabled
            style={{backgroundColor:'grey', color:'white', fontSize:22}}
          >
          </input>
        </div>
        </div>
        <CertiTable terceros={suggestions} loading={loading} style={{fontSize:20}}/>
      </div>
    </div>
    </div>
    </div>
  )
} 