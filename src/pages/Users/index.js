import { useState, useEffect } from "react";
import * as GoIcons from "react-icons/go"
import TableUsers from "../../components/TableUsers"
import ModalUsers from "../../components/ModalUsers";
import { findUsers } from "../../services/userService"

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

  return (
    <div className="wrapper justify-content-center  h-100 w-100 m-auto" style={{userSelect:'none'}}>
    <div className='rounder-4'>
    <div className="login-wrapper d-flex flex-column mt-5 pt-3" >
      <h1 className="text-danger fw-bold">Listado de Usuarios registrados</h1>
      <ModalUsers 
        user={selectedUser}
        setUser={setSelectedUser}
        showModal={showModalUsers} 
        setShowModal={setShowModalUsers} 
        reloadInfo={getAllUsers} 
      />
      <div className="d-flex flex-column gap-2 h-100">
        <div className="d-flex justify-content-end mt-1 gap-3 mb-1">
          <input
            type="search"
            value={search}
            className="form-control form-control-sm w-100"
            placeholder="Buscar usuario"
            onChange={searchUsers}
            style={{width:500, fontSize:20}}
          />
          <button
            title="Nuevo usuario"
            className="d-flex  text-nowrap btn btn-sm btn-danger text-light gap-1" 
            style={{fontSize:18}}
            onClick={(e) => setShowModalUsers(!showModalUsers)}>
              Nuevo usuario
              <GoIcons.GoPersonAdd style={{width: 25, height: 25}} />
          </button>
        </div>
        <TableUsers users={suggestions} setShowModal={setShowModalUsers} setSelectedUser={setSelectedUser} loading={loading} style={{fontSize:20}}/>
      </div>
    </div>
    </div>
    </div>
  )
} 