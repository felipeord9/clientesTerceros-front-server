import { useState, useEffect , useContext } from "react";
import TableTerceros from "../../components/TableTercerosContado"
import { findClientes } from "../../services/clienteService"
import * as GoIcons from "react-icons/go"
import { useNavigate } from 'react-router-dom';
import AuthContext from "../../context/authContext";

export default function Terceros() {
  const [terceros, setTerceros] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate =useNavigate()
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getAllTerceros()
  }, []);

  const getAllTerceros = () => {
    setLoading(true)
    findClientes()
      .then(({ data }) => {
        setTerceros(data)
        setSuggestions(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchTerceros = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredTerceros = terceros.filter((elem) => {
        if(      
          elem.cedula.includes(value.toUpperCase()) ||
          elem.razonSocial.includes(value.toUpperCase())
        ) {
          return elem
        }
      })
      if(filteredTerceros.length > 0) {
        setSuggestions(filteredTerceros)
      } else {
        setSuggestions(terceros)
     }
    } else {
      setSuggestions(terceros)
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
        fontSize: '15px',
        height:'35px',
        backgroundColor:'#D92121',
        opacity:0.9,
        color:'white'
      },
    },
  };

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
  
  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <h1 className="text-danger fw-bold">Listado de Clientes registrados</h1>
      <div className="d-flex flex-column gap-1 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100 rounded-2"
            placeholder="Buscar Cliente por 'ID' o 'Nombre'"
            onChange={searchTerceros}
            style={{width:500, fontSize:20}}
          />
          <button
            title="Nuevo Cliente"
            className="d-flex  text-nowrap btn btn-sm  text-light gap-1" 
            style={{fontSize:18,backgroundColor:'#D92121', color:'white'}}
            onClick={handleClickInicio}>
              Nuevo Cliente
              <GoIcons.GoPersonAdd style={{width: 25, height: 25}} />
          </button>        
          </div>
        <TableTerceros terceros={suggestions} loading={loading} style={{fontSize:20}} customStyles={customStyles}/>
      </div>
    </div>
    </div>
    </div>
  )
} 