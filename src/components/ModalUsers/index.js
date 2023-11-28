import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, updateUser } from "../../services/userService";
import * as Bs from "react-icons/bs";
/* import bcrypt from 'bcrypt';
 */
export default function ModalUsers({
  user,
  setUser,
  showModal,
  setShowModal,
  reloadInfo,
}) {
  const [info, setInfo] = useState({
    rowId: "",
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState('')
 
  useEffect(() => {
    if(user) {
      setInfo({
        rowId: user?.rowId,
        name: user?.name,
        email: user?.email,
        password:user?.password,
        role: user?.role,
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer agregar este usuario?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        createUser(info)
          .then((data) => {
            setShowModal(!showModal)
            reloadInfo();
            Swal.fire(
              '¡Correcto!', 'El usuario se ha creado con éxito', 'success'
              /* title: '¡Correcto!',
              text: 'El usuario se ha creado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2500 */
            )
            
          })
        }else if(result.isDenied){
          Swal.fire('Oops', 'La información suministrada se ha descartado', 'info')
          setShowModal(!showModal)
        }
        cleanForm()
    })
      .catch((error) => {
        setError(error.response.data.errors.original.detail)
        setTimeout(() => setError(''), 2500)
      });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer editar este usuario?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        updateUser(user.id, info)
          .then((data) => {           
            setShowModal(!showModal)
            reloadInfo();
            Swal.fire({
              title: '¡Correcto!',
              text: 'El usuario se ha actualizado correctamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            })
          })
      }else if(result.isDenied){
        Swal.fire('Oops', 'La información suministrada se ha descartado', 'info')
        setShowModal(!showModal)
      }
      cleanForm()
    })
      .catch((error) => {
        setError(error.response.data.errors.original.detail)
        setTimeout(() => setError(''), 2500)
      });
  };

  const cleanForm = () => {
    setInfo({
      rowId: "",
      name: "",
      email: "",
      password: "",
      role: "",
    })
  }
  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);
  
  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="text-danger" style={{fontSize:40}}>
          <strong>{user ? "Actualizar" : "Crear"} Usuario</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={user ? handleUpdateUser : handleCreateNewUser}>
            <div>
              <div>
                <label className="fw-bold">Rol</label>
                <select
                  id="role"
                  value={info.role}
                  className="form-select form-select-sm"
                  onChange={handleChange}
                  required
                >
                  <option selected disabled value="">
                    -- Seleccione un rol --
                  </option>
                  <option value="agencias">AGENCIAS</option>
                  <option value='cartera'>CARTERA</option>
                  <option value='compras'>COMPRAS</option>
                  <option value="admin">ADMINISTRADOR</option>
                </select>
              </div>
              <div>
                <label className="fw-bold">Identificador</label>
                <input
                  id="rowId"
                  type="text"
                  value={info.rowId}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">Nombre</label>
                <input
                  id="name"
                  type="text"
                  value={info.name}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="fw-bold">Correo</label>
                <input
                  id="email"
                  type="email"
                  value={info.email}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              {!user && (
                <div>
                  <label className="fw-bold" for='password'>Contraseña</label>
                  <input
                    id="password"
                    /* type={shown ? 'text':'password'} */
                    type="text"
                    value={info.password}
                    className="form-control form-control-sm"
                    minLength={8}
                    onChange={handleChange}
                    autoComplete="off"
                    required></input>
{/*                   <span for='password' className='position-absolute' onClick={switchShown} style={{ right: 10, cursor: "pointer",fontSize:25 }}>{shown ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
 */}                </div>
               )} 
            </div>
            <div className="d-flex w-100 mt-2">
              <span 
                className="text-center text-danger w-100 m-0"
                style={{height: 15}}
              >
                {error}
              </span>
            </div>
            <div className="d-flex justify-content-center gap-2 mt-2 ">
              {/* <Button type="submit" variant="success">
                {user ? "Guardar Cambios" : "Guardar"}
              </Button> */}
              <button className="me-5" type="submit">{user ? "Guardar Cambios" : "Guardar"}</button>
              <Button variant="secondary" onClick={(e) => {
                setShowModal(false)
                cleanForm()
                setUser(null)
              }}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Modal.Body>
      {<Modal.Footer></Modal.Footer>}
    </Modal>
    </div>
  );
}
