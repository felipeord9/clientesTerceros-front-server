import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableUsers from "../../components/TableUsers"
import ModalUsers from "../../components/ModalUsers";
import { findUsers } from "../../services/userService"
import './styles.css'

export default function Users() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suggestions, setSuggestions] = useState([])
  const [search, setSearch] = useState('')
  const [showModalUsers, setShowModalUsers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAllUsers()
  }, []);

  const getAllUsers = () => {
    setLoading(true)
    findUsers()
      .then(({ data }) => {
        setUsers(data)
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
      const filteredUsers = users.filter((elem) => {
        if(
          elem.rowId.includes(value) ||
          elem.name.toLowerCase().includes(value.toLowerCase()) ||
          elem.role.toLowerCase().includes(value.toLowerCase())
        ) {
          return elem
        }
      })
      if(filteredUsers.length > 0) {
        setSuggestions(filteredUsers)
      } else {
        setSuggestions(users)
     }
    } else {
      setSuggestions(users)
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

  //logica para saber si es celular
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 900); // Establecer a true si la ventana es menor o igual a 768px
      };
  
      // Llama a handleResize al cargar y al cambiar el tamaño de la ventana
      window.addEventListener("resize", handleResize);
      handleResize(); // Llama a handleResize inicialmente para establecer el estado correcto
  
      // Elimina el event listener cuando el componente se desmonta
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  return (
    <div className="wrap w-100 d-flex" style={{userSelect:'none'}}>
    <div className={`container d-flex flex-column w-100 py-3 mt-5 rounded-4 ${!isMobile && 'justify-content-center'}`} >
      <h1 className="text-danger fw-bold">Listado de Usuarios registrados</h1>
      <ModalUsers 
        user={selectedUser}
        setUser={setSelectedUser}
        showModal={showModalUsers} 
        setShowModal={setShowModalUsers} 
        reloadInfo={getAllUsers} 
      />
      <div className="d-flex flex-column gap-1" style={{height: "calc(100% - 60px)",}}>
        <div className="div-botons justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100"
            placeholder="Buscar Usuario por 'Nombre' ó 'ID'"
            onChange={searchUsers}
            style={{width:500, fontSize:20}}
          />
          <button
            title="Nuevo usuario"
            className="d-flex justify-content-center align-text-center text-nowrap btn btn-sm  text-light gap-1" 
            style={{fontSize:18,backgroundColor:'#D92121', color:'white'}}
            onClick={(e) => setShowModalUsers(!showModalUsers)}>
              Nuevo usuario
              <GoIcons.GoPersonAdd style={{width: 25, height: 25}} />
          </button>
        </div>
        <TableUsers users={suggestions} setShowModal={setShowModalUsers} setSelectedUser={setSelectedUser} loading={loading} customStyles={customStyles}/>
      </div>
    </div>
    </div>
  )
} 