import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableBitacora from "../../components/TableBitacora"
import { findBitacoras } from "../../services/bitacoraService"

export default function Bitacora() {
  const [bitacoras, setBitacoras] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllBitacoras()
  }, []);

  const getAllBitacoras = () => {
    setLoading(true)
    findBitacoras()
      .then(({ data }) => {
        setBitacoras(data)
        setSuggestions(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchBitacoras = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredBitacoras = bitacoras.filter((elem) => {
        if(
          elem.usuario.includes(value)
        ) {
          return elem
        }
      })
      if(filteredBitacoras.length > 0) {
        setSuggestions(filteredBitacoras)
      } else {
        setSuggestions(bitacoras)
     }
    } else {
      setSuggestions(bitacoras)
    }
    setSearch(value)
  }

  /* diseño de la tabla bitacora */
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
      <h1 className="text-danger fw-bold">Listado Bitacora (registro de actividad)</h1>
      <div className="d-flex flex-column gap-1 h-100">
        <TableBitacora bitacoras={suggestions} loading={loading} customStyles={customStyles}/>
      </div>
    </div>
    </div>
    </div>
  )
} 