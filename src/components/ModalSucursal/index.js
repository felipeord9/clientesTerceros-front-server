import { useState, useEffect , useContext , useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, updateUser } from "../../services/userService";
import { createSucursal, updateSucursal } from "../../services/sucursalService";
import TextField from '@mui/material/TextField';
import { getAllCiudades } from "../../services/ciudadService";
import AuthContext from "../../context/authContext";
import { GrFormSubtract } from "react-icons/gr";
/* import bcrypt from 'bcrypt';
 */
export default function ModalSucursal({
  user,
  setUser,
  showModal,
  setShowModal,
  reloadInfo,
}) {
  const [usuario,setUsuario] = useState([]);
  const[infoSucursal,setInfoSucursal] = useState({
    razonSocial:'',
  })
  useEffect(()=>{
    const data = localStorage.getItem('user');
    const info = localStorage.getItem('infoSucursal');
    if(data){
      setUsuario(JSON.parse(data));
    }
    if(info){
      setInfoSucursal(JSON.parse(info));
    }
  })

  const [data,setData] = useState({
    ultimo:'',
    search:''
  })
  useEffect(()=>{
    const datos=localStorage.getItem('length');
    if(datos){
      setData(JSON.parse(datos));
    }
  })
  const [info, setInfo] = useState({
    cedula: '',
    codigoSucursal: '',
    nombreSucursal: "".toUpperCase(),
    direccion: "".toUpperCase(),
    ciudad: "".toUpperCase(),
    celular: "",
    correoFacturaElectronica: "",
    nombreContacto: "".toUpperCase(),
    celularContacto: "",
    correoContacto: "",
  });
  const [error, setError] = useState('')
 
  useEffect(() => {
    if(user) {
      setInfo({
        cedula: user?.cedula,
        /* codigoSucursal: user?.codigoSucursal, */
        nombreSucursal: user?.nombreSucursal.toUpperCase(),
        direccion:user?.direccion.toUpperCase(),
        ciudad: user?.ciudad.toUpperCase(),
        celular: user?.celular,
        correoFacturaElectronica: user?.correoFacturaElectronica.toLowerCase(),
        nombreContacto: user?.nombreContacto.toUpperCase(),
        celularContacto:user?.celularContacto,
        correoContacto: user?.correoContacto.toLowerCase(),
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
  const handleData = (e) => {
    const { id, value } = e.target;
    setData({
      ...data,
      [id]: value,
    });
  };
  const handleInfo = (e) => {
    const { id, value } = e.target;
    setInfoSucursal({
      ...infoSucursal,
      [id]: value,
    });
  };

  const handlerChangeSearch = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setInfo({
      ...info,
      [id]: value,
    });
  };
  const [ciudades,setCiudades] = useState([]);
  const [ciudad, setCiudad] = useState(null);

  const selectCiudadRef=useRef();
  useEffect(()=>{
    getAllCiudades().then((data) => setCiudades(data));
  },[]);

  const handleCreateNewSucursal = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer agregar esta sucursal?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        const body={
          cedula: data.search,
          codigoSucursal:  data.ultimo+1,
          nombreSucursal: infoSucursal.razonSocial.toUpperCase() + ' - ' + info.nombreSucursal.toUpperCase(),
          direccion: info.direccion.toUpperCase(),
          ciudad: info.ciudad.toUpperCase(),
          celular: info.celular,
          correoFacturaElectronica: info.correoFacturaElectronica.toLowerCase(),
          nombreContacto: info.nombreContacto.toUpperCase(),
          celularContacto: info.celularContacto,
          correoContacto: info.correoContacto.toLowerCase(),
          createdAt:new Date(),
          userName:usuario.name
        }
        createSucursal(body)
          .then(() => {
            setShowModal(!showModal)
            reloadInfo();
            Swal.fire(
              '¡Correcto!', 'La sucursal se ha creado de manera exitosa', 'success'
              
            )
            
          })
        }else if(result.isDenied){
          Swal.fire('Oops', 'La información suministrada se ha descartado', 'info')
          setShowModal(!showModal)
        }
        cleanForm()
    })
      .catch((error) => {
        /* setError(error.response.data.errors.original.detail)
        setTimeout(() => setError(''), 2500) */
        Swal.fire({
         title:'¡Uops!',
         /* text:`${error}`, */
         text:'Ha ocurrido un error a la hora de crear la sucursal, intentelo mas tarde y si el problema persiste, comuniquese con el área de sistemas.',
         showConfirmButton:true,
         confirmButtonColor:'#D92121',
         confirmButtonText:'OK'
        })
      });
  };

  const handleUpdateSucursal = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer editar esta sucursal?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        updateSucursal(user.id, info)
          .then((data) => {           
            setShowModal(!showModal)
            reloadInfo();
            Swal.fire({
              title: '¡Correcto!',
              text: 'El sucursal se ha actualizado correctamente',
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
      cedula: "",
      codigoSucursal: "",
      nombreSucursal: "",
      direccion: "",
      ciudad: "",
      celular: "",
      correoFacturaElectronica: "",
      nombreContacto: "",
      celularContacto: "",
      correoContacto: "",
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
          <strong>{user ? "Actualizar" : "Crear"} Sucursal</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={user ? handleUpdateSucursal : handleCreateNewSucursal}>
          <div>
            {/* <span>{data.ultimo+1}</span> */}
                <h4 className="mb-2">Información Sucursal</h4>
              <div className="d-flex flex-row w-100">
              <div className="d-flex flex-column w-50 pe-4">
              <TextField  
                id="cedula" 
                value={user ? info.cedula : data.search} 
                label="Código Siesa" 
                type="number" 
                onChange={handleChange} 
                disabled
                className="rounded rounded-2"
                style={{backgroundColor:'whitesmoke', color:'black'}}
                variant="outlined" 
                size="small"
                color="error"
              />
              </div>
              </div>
              {!user && (
                <div className="d-flex flex-row w-100 mt-2">
                <div className="d-flex w-50">
                <TextField
                  id="nombreSucursal"
                  type="text"
                  value={infoSucursal.razonSocial.toUpperCase() }
                  className="form-control form-control-sm"
                  style={{textTransform:'uppercase',backgroundColor:'whitesmoke'}}
                  disabled
                  label="Nombre Cliente"
                  variant="outlined"
                  size="small"
                  color="error"
                />
                </div>
                <label className="pt-1 ms-2 me-2"><stron><GrFormSubtract /> </stron> </label>
                <div className="d-flex w-50">
                <TextField
                  id="nombreSucursal"
                  type="text"
                  value={info.nombreSucursal.toUpperCase() }
                  className="form-control form-control-sm"
                  
                  style={{textTransform:'uppercase'}}
                  onChange={handleChange}
                  required
                  label="Nombre Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                />
                </div>
              </div>
              )}
              {user && (
              <div className="d-flex flex-column w-100 mt-2">
                <TextField
                  id="nombreSucursal"
                  type="text"
                  value={info.nombreSucursal.toUpperCase() }
                  className="form-control form-control-sm"
                  
                  style={{textTransform:'uppercase'}}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Nombre Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              )}
              <div className="d-flex flex-column w-100 mt-2">
                <TextField
                  id="celular"
                  type="number"
                  value={info.celular}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Celular Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <div className="d-flex flex-row w-100 mt-2">
              <div className="d-flex flex-column w-100">
                <TextField
                  id="direccion"
                  type="text"
                  value={info.direccion.toUpperCase()}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Dirección Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>
              
              <div className="d-flex flex-column w-100 mt-2">
                {/* <TextField
                  id="ciudad"
                  type="text"
                  value={info.ciudad.toUpperCase()}
                  className="form-control form-control-sm"
                  onChange={handlerChangeSearch}
                  autoComplete="off"
                  required
                  label="Ciudad Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                /> */}
                <select
                    id="ciudad"
                    value={info.ciudad}
                    onChange={handlerChangeSearch}
                    className="form-select form-select-sm w-100"
                    style={{height:40}}
                    required
                  >
                    
                  <option selected value='' disabled>
                    -- Seleccione la Ciudad de la Sucursal --
                  </option>  
                  {ciudades
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    
                    <option id={elem.id} value={elem.description}>
                    {elem.description}
                    </option>
                    
                  ))
                }
                  </select>
              </div>

              <div className="d-flex flex-row w-100 mt-2">
              
              <div className="d-flex flex-column w-100">
                <TextField
                  id="correoFacturaElectronica"
                  type="email"
                  value={info.correoFacturaElectronica.toLowerCase()}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Correo Factura Electrónica"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>
              <hr></hr>
              <h4>Información de contacto</h4>
              <div className="d-flex flex-row w-100 mt-2">
              <div className="d-flex flex-column w-50 pe-4">                
              <TextField
                  id="nombreContacto"
                  type="text"
                  value={info.nombreContacto.toUpperCase()}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Nombre Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <div className="d-flex flex-column w-50 ms-2">
                <TextField
                  id="celularContacto"
                  type="number"
                  value={info.celularContacto}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Celular Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>

              
              <div className="mt-2">
                <TextField
                  id="correoContacto"
                  type="email"
                  value={info.correoContacto.toLowerCase()}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Correo Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                  
                />
              </div>
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
              <button className="me-5" type="submit">{user ? "Editar" : "Guardar"}</button>
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


/* import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, updateUser } from "../../services/userService";
import { createSucursal, updateSucursal } from "../../services/sucursalService";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as Bs from "react-icons/bs";

export default function ModalSucursal({
  user,
  setUser,
  showModal,
  setShowModal,
  reloadInfo,
}) {

  const [info, setInfo] = useState({
    cedula: "",
    codigoSucursal: "",
    nombreSucursal: "",
    direccion: "",
    ciudad: "",
    celular: "",
    correoFacturaElectronica: "",
    nombreContacto: "",
    celularContacto: "",
    correoContacto: "",
  });
  const [error, setError] = useState('')
 
  useEffect(() => {
    if(user) {
      setInfo({
        cedula: user?.cedula,
        codigoSucursal: user?.codigoSucursal,
        nombreSucursal: user?.nombreSucursal,
        direccion:user?.direccion,
        ciudad: user?.ciudad,
        celular: user?.celular,
        correoFacturaElectronica: user?.correoFacturaElectronica,
        nombreContacto: user?.nombreContacto,
        celularContacto:user?.celularContacto,
        correoContacto: user?.correoContacto,
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

  const handleCreateNewSucursal = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer agregar esta sucursal?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        createSucursal(info)
          .then((data) => {
            setShowModal(!showModal)
            reloadInfo();
            Swal.fire(
              '¡Correcto!', 'La sucursal se ha creado con éxito', 'success'
              
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

  const handleUpdateSucursal = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Está segur@ de querer editar esta sucursal?',
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        updateSucursal(user.id, info)
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
      cedula: "",
      codigoSucursal: "",
      nombreSucursal: "",
      direccion: "",
      ciudad: "",
      celular: "",
      correoFacturaElectronica: "",
      nombreContacto: "",
      celularContacto: "",
      correoContacto: "",
    })
  }
  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);
  
  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="text-danger" style={{fontSize:45}}>
          <strong>{user ? "Actualizar" : "Crear"} Sucursal</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={user ? handleUpdateSucursal : handleCreateNewSucursal}>
            <div>
                <h4>Información Sucursal</h4>
              <div className="d-flex flex-row w-100">
              <div className="d-flex flex-column w-50 pe-4">
              <TextField required 
                id="cedula" 
                value={info.cedula} 
                label="Código Siesa" 
                type="number" 
                onChange={handleChange} 
                variant="outlined" 
                size="small"
                color="error"
              />
              
               
              </div>
              <div className="d-flex flex-column w-50 ms-2">
                <TextField
                  id="nombreSucursal"
                  type="text"
                  value={info.nombreSucursal}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Nombre Sucursal"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>
              <div className="d-flex flex-row w-100 mt-2">
              <div className="d-flex flex-column w-50 pe-4">
                <TextField
                  id="direccion"
                  type="text"
                  value={info.direccion}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Dirección"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <div className="d-flex flex-column w-50 ms-2">
                <TextField
                  id="ciudad"
                  type="text"
                  value={info.ciudad}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Ciudad"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>

              <div className="d-flex flex-row w-100 mt-2">
              <div className="d-flex flex-column w-50 pe-4">
                <TextField
                  id="celular"
                  type="number"
                  value={info.celular}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Celular"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <div className="d-flex flex-column w-50 ms-2">
                <TextField
                  id="correoFacturaElectronica"
                  type="email"
                  value={info.correoFacturaElectronica}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Correo Factura Electrónica"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>
              <hr></hr>
              <h4>Información de contacto</h4>
              <div className="d-flex flex-row w-100 mt-2">
              <div className="d-flex flex-column w-50 pe-4">                <TextField
                  id="nombreContacto"
                  type="text"
                  value={info.nombreContacto}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Nombre Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              <div className="d-flex flex-column w-50 ms-2">
                <TextField
                  id="celularContacto"
                  type="number"
                  value={info.celularContacto}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Celular Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                />
              </div>
              </div>

              
              <div className="mt-2">
                <TextField
                  id="correoContacto"
                  type="email"
                  value={info.correoContacto}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  label="Correo Contacto"
                  variant="outlined"
                  size="small"
                  color="error"
                  
                />
              </div>
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
              
              <button className="me-5" type="submit">{user ? "Actualizar" : "Guardar"}</button>
              <Button variant="secondary" onClick={(e) => {
                setShowModal(false)
                cleanForm()
                
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
} */
