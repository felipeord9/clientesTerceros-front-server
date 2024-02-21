import { useState, useEffect } from "react";
import TableSucursales from "../../components/tableSucursales"
import ModalSucursal from "../../components/ModalSucursal";
import { findSucursales } from "../../services/sucursalService"
import { validarCliente } from "../../services/clienteService"
import Swal from "sweetalert2";
import { BsBuildingFillAdd } from "react-icons/bs";

export default function Users() {
  const [sucursales, setSucursales] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [suggestions, setSuggestions] = useState([])
  const [ultimo,setUltimo] = useState([]);
  const [search, setSearch] = useState('')
  const [showModalSucursal, setShowModalSucursal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllUsers()
  }, []);

  const getAllUsers = () => {
    setLoading(true)
    findSucursales()
      .then(({ data }) => {
        setSucursales(data)
        setSuggestions(data)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const searchUsers = (e) => {
    const { value } = e.target
    if(value !== "") {
      const filteredUsers = sucursales.filter((elem) => {
        if(
          elem.cedula.includes(value) ||
          elem.nombreSucursal.includes(value.toUpperCase())
        ) {
          return elem
        }
      })
      if(filteredUsers.length > 0) {
        setSuggestions(filteredUsers)
        setUltimo(filteredUsers.length)
      } else {
        setSuggestions(sucursales)
     }
    } else {
      setSuggestions(sucursales)
    }
    setSearch(value)
  }

  const buscar = (e) =>{
    const { value } = e.target
    if(value !==""){
      const filtrar = sucursales.filter((elem)=>{
        if(elem.cedula.includes(value)){
          return elem[1]
        }
      })
      if(filtrar.length>0){
        setUltimo(filtrar)
      }
    }
  }

  const botonHabilitado = search.length > 5;

  const handlerNewSucursal = (e) =>{
    e.preventDefault();
    validarCliente(search)
    .then(({data})=>{
      Swal.fire({
        icon:'question',
        title:'Validando Información',
        text:`Se creará una nueva sucursal a nombre del client@ "${data.razonSocial}" de NIT "${data.cedula}". ¿Es esto correcto?`,
        showCancelButton:true,
        showConfirmButton:true,
        confirmButtonColor:'#D92121',
        confirmButtonText:'SI',
        cancelButtonColor:'grey',
        cancelButtonText:'NO'
      }).then((result)=>{
        if(result.isConfirmed){
          setShowModalSucursal(!showModalSucursal)
          localStorage.setItem('length',JSON.stringify({ultimo,search}))
          localStorage.setItem('infoSucursal',JSON.stringify(data))
        }
      })
    }).catch((err)=>{
      Swal.fire({
        icon:'warning',
        showConfirmButton:true,
        confirmButtonText:'OK',
        confirmButtonColor:'#D92121',
        title:'¡Atención!',
        text:'Debes ingresar el número de identificación completo para poder agregar una sucursal. Verifica que esté bien escrito y en su totalidad'
      })
    })
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
  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <h1 className="text-danger fw-bold">Edición y Creación de Sucursales</h1>
      <ModalSucursal 
        user={selectedSucursal}
        setUser={setSelectedSucursal}
        showModal={showModalSucursal} 
        setShowModal={setShowModalSucursal} 
        reloadInfo={getAllUsers} 
      />
      <div className="d-flex flex-column gap-2 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100 rounded-2"
            placeholder="Buscar Sucursal Por Nit"
            onChange={(e)=>(searchUsers(e),buscar(e))}
            autoComplete="on"
            style={{width:500, fontSize:20}}
          />
          <button
            title="Nueva Sucursal"
            className="d-flex pt-2 text-nowrap btn btn-sm btn-danger text-light gap-1" 
            style={{fontSize:18,backgroundColor:botonHabilitado ? '#D92121' : 'grey', border:botonHabilitado ? '#D92121' : 'grey' }}
            disabled={!botonHabilitado}
            onClick={(e)=>handlerNewSucursal(e)}
            /* onClick={(e) => (setShowModalSucursal(!showModalSucursal),localStorage.setItem('length',JSON.stringify({ultimo,search})))} */
            >
              {/* <BsBuildingAdd style={{width: 25, height: 25}}/> */}
              {/* <GoIcons.GoPersonAdd style={{width: 25, height: 25}} /> */}
              <BsBuildingFillAdd style={{width: 25, height: 25}}/>
              Nueva Sucursal
          </button>
        </div>
        <TableSucursales users={suggestions} setShowModal={setShowModalSucursal} setSelectedUser={setSelectedSucursal} loading={loading} customStyles={customStyles}/>
        
      </div>
    </div>
    </div>
    </div>
  )
}  