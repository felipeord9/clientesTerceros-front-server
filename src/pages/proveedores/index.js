import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableProveedores from "../../components/tableProveedores"
import { findProveedores } from "../../services/proveedorService"

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllProveedores()
  }, []);

  const getAllProveedores = () => {
    setLoading(true)
    findProveedores()
      .then(({ data }) => {
        setProveedores(data)
        setSuggestions(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchProveedores = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredProveedores = proveedores.filter((elem) => {
        if(
          /* elem.tipoPersona.includes(value) ||   */       
          elem.cedula.includes(value.toUpperCase()) ||
          elem.razonSocial.includes(value.toUpperCase())
        ) {
          return elem
        }
      })
      if(filteredProveedores.length > 0) {
        setSuggestions(filteredProveedores)
      } else {
        setSuggestions(proveedores)
     }
    } else {
      setSuggestions(proveedores)
    }
    setSearch(value)
  }

  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <h1 className="text-danger fw-bold">Listado de Proveedores registrados</h1>
      <div className="d-flex flex-column gap-1 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100 rounded-2"
            placeholder="Buscar Proveedor por 'ID' o 'Nombre'"
            onChange={searchProveedores}
            style={{width:500, fontSize:20}}
          />
          {/* <button
            title="Nuevo usuario"
            className="d-flex  text-nowrap btn btn-sm btn-danger text-light gap-1" 
            style={{fontSize:18}}
            onClick={(e) => setShowModalUsers(!showModalUsers)}>
              Nuevo usuario
              <GoIcons.GoPersonAdd style={{width: 25, height: 25}} />
          </button> */}
        </div>
        <TableProveedores proveedores={suggestions} loading={loading} style={{fontSize:20}}/>
      </div>
    </div>
    </div>
    </div>
  )
} 