import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableVerificar from "../../components/TableVerificarCertifi"
import { findCertificados } from "../../services/certificadoService"
import { RiArrowGoBackFill } from "react-icons/ri";
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function Certificados() {
  const [certificados, setCertificados] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate =useNavigate()

  useEffect(() => {
    getAllCertificados()
  }, []);

  const getAllCertificados = () => {
    setLoading(true)
    findCertificados()
      .then(({data}) => {
        const filtro = data.filter((elem)=>{
          if(elem.correoEnvio!==null){
            return elem
          }
        })
        setCertificados(filtro)
        setSuggestions(filtro)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchCertificados = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredCertificados = certificados.filter((elem) => {
        if(      
          elem.tercero.includes(value.toUpperCase()) ||
          elem.nombreTercero.includes(value.toUpperCase())
        ) {
          return elem
        }
      })
      if(filteredCertificados.length > 0) {
        setSuggestions(filteredCertificados)
      } else {
        setSuggestions(certificados)
     }
    } else {
      setSuggestions(certificados)
    }
    setSearch(value)
  }
  const customStyles = {
    cells: {
      style: {
        fontSize: '15px', // ajustar el tamaño de la fuente de las celdas
      },
    },
    rows: {
      style: {
        height:'35px' // ajusta el alto de las filas según tus necesidades
      },
    },
    headCells: {
      style: {
        fontSize: '16px',
        height:'35px',
        backgroundColor:'#D92121',
        opacity:0.9,
        color:'white'
      },
    },
  };
  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <div className="d-flex flex-row space-between">
        <Button style={{height:35}} onClick={(e)=>navigate('/consultar/certificado')} variant="contained" className="d-flex justify-content-start mt-2"><RiArrowGoBackFill className="me-1" />Back</Button>
        <h1 className="text-danger fw-bold ms-5 me-5">Listado Información de Correos Enviados</h1>
      </div>
      <div className="d-flex flex-column gap-1 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100 rounded-2"
            placeholder="Buscar Cliente por 'NIT' o 'Razon Social'"
            onChange={searchCertificados}
            style={{width:500, fontSize:20}}
          />
        </div>
        <TableVerificar certificados={suggestions} loading={loading} style={{fontSize:20}} customStyles={customStyles}/>
      </div>
    </div>
    </div>
    </div>
  )
} 