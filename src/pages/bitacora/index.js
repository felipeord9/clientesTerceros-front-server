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

  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <h1 className="text-danger fw-bold">Listado Bitacora (registro de actividad)</h1>
      <div className="d-flex flex-column gap-1 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          {/* <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100"
            placeholder="Buscar Registro"
            onChange={searchBitacoras}
            style={{width:500, fontSize:20}}
          /> */}
          {/* <button
            title="Nuevo usuario"
            className="d-flex  text-nowrap btn btn-sm btn-danger text-light gap-1" 
            style={{fontSize:18}}
            onClick={(e) => setShowModalUsers(!showModalUsers)}>
              Nuevo usuario
              <GoIcons.GoPersonAdd style={{width: 25, height: 25}} />
          </button> */}
        </div>
        <TableBitacora bitacoras={suggestions} loading={loading} style={{fontSize:20}}/>
      </div>
    </div>
    </div>
    </div>
  )
} 