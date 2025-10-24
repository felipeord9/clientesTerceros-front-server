import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createCargo , updateCargo , findOne , deleteCargo , getAllCargos } from "../../services/cargoService";
import * as Bs from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useRef } from "react";

export default function ModalCargos({
  showModal,
  setShowModal,
}) {
  const [editar,setEditar] = useState(false)
  const [buscando,setBuscando] = useState(false)
  const [notFound,setNotFound] = useState(false)
  const [info, setInfo] = useState({
    id:'',
    description:'',
  });
  const [error, setError] = useState('')
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const ref = useRef();
  const [suggestions, setSuggestions] = useState([]);
  const [cargos, setCargos] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  useEffect(()=>{
    getAllCargos().then((data) => (setCargos(data), setSuggestions(data)));
  },[showModal])

  const handlerChangeSuggestions = (e) => {
    const { value } = e.target;
    setItemSeleccionado(null);
    if (value !== "") {
      const filter = cargos.filter((elem) =>
        elem.description.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filter);
    } else {
      setSuggestions(null);
    }
    ref.current.selectedIndex = 0;
    setInfo({
      ...info,
      description: value
    })
  };

  const handleCreateNewCargo = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer agregar el cargo: ${info.description}?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        const body = {
          id: info.id,
          codigo: info.id,
          description: info.description,
        }
        createCargo(body)
          .then((data) => {
            setShowModal(!showModal)
            Swal.fire(
              '¡Correcto!', 'El cargo se ha agregado con éxito', 'success'
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

  const handleUpdateCargo = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer editar el cargo: ${info.description} ?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        updateCargo(info.id, info)
          .then((data) => {           
            setShowModal(!showModal)
            Swal.fire({
              title: '¡Correcto!',
              text: 'El cargo se ha actualizado correctamente',
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
      id:'',
      description:'',
    })
    setNotFound(false)
    setEditar(false)
  }

  const handleButton = (e) => {
    e.preventDefault();
    setBuscando(true)
    findOne(info.id)
    .then(({data})=>{
      /* Swal.fire({
        title:`${JSON.stringify(data)}`
      }) */
      setBuscando(false)
      setInfo({
        id:data.id,
        description:data.description,
      })
      setEditar(true)
      setNotFound(false)
      
    }) 
    .catch((err)=>{
      setBuscando(false)
      setNotFound(true)
      setInfo({
        ...info,
        description:'',
      })
      setEditar(false)
    })
  }

  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title:`¿Está segur@?`,
      text:`Se eliminará el cargo: "${info.description}" de la base de datos`,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'Confirmo',

      showCancelButton:true,
      cancelButtonColor:'grey',
      cancelButtonText:'Cancelar',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        setShowModal(!showModal)
        deleteCargo(info.id)
        .then(()=>{
          Swal.fire({
            icon:'success',
            title:'¡Excelente!',
            text:'El cargo se ha eliminado con éxito',
            timer:'4000',
            showConfirmButton:false,
          })
        })
        .catch((err)=>{
          Swal.fire({
            title:'¡ERROR!',
            text:'Ha ocurrio un error al momento de eliminar el cargo. Intentalo de nuevo, si el problema persiste comunicate con tu jefe inmediato ó con el área de sistemas para darle una oportuna y rápida solución.'
          })
        })
      }
      cleanForm();
    })
  }

  const findById = (e) => {
    const { value } = e.target;
    const item = cargos.find((elem) => parseInt(elem.id) === parseInt(value));

    if (item) {
      setItemSeleccionado(item);
    } else {
      setItemSeleccionado(null);
    }
  };

  const findByDescrip = (e) => {
    const { value } = e.target;
    setEditar(false)
    const item = cargos.find((elem)=> elem.description.toLowerCase() === value.toLowerCase());
    if(item){
      setItemSeleccionado(item)
    }else{
      setItemSeleccionado(null)
    }
  }

  const handleActionUpdate = (e) => {
    setEditar(true);
    setInfo({
      description: itemSeleccionado.description,
      id: itemSeleccionado.id
    })
    setItemSeleccionado({})
  }

  const handleCancelarUpdate = (e) => {
    setEditar(false)
    setInfo({
      description:'',
      id:''
    });
    setItemSeleccionado({});
  }

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="text-danger" style={{fontSize:40}}>
          <strong>Gestionar Cargos</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={editar ? handleUpdateCargo : handleCreateNewCargo}>
            <div className="d-flex w-100 flex-row">
              <div className="d-flex flex-column me-2 w-100">
                <label className="fw-bold">ID</label>
                <input
                  id="id"
                  type="number"
                  value={
                    itemSeleccionado ?
                    itemSeleccionado.id :
                    info?.id
                  }
                  className="form-control form-control-sm"
                  onChange={(e) =>(
                    handleChange(e),
                    findById(e)
                  )}
                  autoComplete="off"
                  required
                />
              </div>
              {/* <div className="d-flex flex-column w-25">
              <button
                title="Buscar"
                className="d-flex mt-4 ms-2 text-nowrap btn btn-sm  text-light gap-1" 
                style={{height:35 ,fontSize:18,backgroundColor:'#D92121', color:'white'}}
                onClick={(e)=>handleButton(e)}
                >
                 <FaMagnifyingGlass className="mt-1 me-1"/> {buscando ? 'Buscando...' : 'Buscar'}
              </button>
              </div> */}
            </div>
            <div className="w-100 mt-2">
              <label className="fw-bold">Descripción</label>
              <div className="d-flex align-items-center position-relative w-100">
                <input
                  id="description"
                  type="search"
                  autoComplete="off"
                  placeholder="Selecciona un producto para agregarlo"
                  value={
                    itemSeleccionado ?
                    itemSeleccionado.description :
                    info?.description
                  }
                  onChange={handlerChangeSuggestions}
                  className="form-control form-control-sm input-select"
                  style={{textTransform:'uppercase'}}
                    /* required={productoSeleccionado ? false : true} */
                />
                <select
                  ref={ref}
                  id="description"
                  className="form-select form-select-sm"
                    /* value={
                      info.description
                    } */
                  onChange={(e)=>findByDescrip(e)}
                  required
                >
                  <option value="" selected disabled>
                    -- SELECCIONE --
                  </option>
                  {suggestions
                    ?.sort((a,b)=>a.id - b.id)
                    .map((elem) => (
                    <option key={elem.id} value={elem.description}>
                      {elem.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className="d-flex flex-column w-100 mt-2">
                <label className="fw-bold">Descripción</label>
                <textarea
                  id="description"
                  type="text"
                  value={info.description}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div> */}
            <div className="d-flex w-100 mt-2">
              <span 
                className="text-center text-danger w-100 m-0"
                style={{height: 15}}
              >
                {error}
              </span>
            </div>
            {notFound ?
            <span className="d-flex w-100 text-align-center text-danger me-3">Este cargo no se encuentra en nuestra base de datos</span>
            :''
            }
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <form /* onSubmit={editar ? handleUpdateCargo : handleCreateNewCargo} */>
        <div className="d-flex justify-content-center gap-0 mt-2 ">
          {!editar &&
            <button style={{backgroundColor:'#008F39'}} onClick={(e)=> itemSeleccionado ? handleActionUpdate(e) : handleCreateNewCargo(e)} className="me-3" type="submit">{itemSeleccionado ? "Editar" : "Crear"}</button>
          }
          {editar ? 
            <button onClick={handleUpdateCargo} className="me-3" style={{backgroundColor:'#008F39'}} type="submit">Guardar</button>
              : ''
          }
          {editar ? 
            <Button variant="secondary" onClick={(e) => {
              handleCancelarUpdate(e)
            }}>
              Cancelar
            </Button>
              : ''
          }
          {(itemSeleccionado && !editar) ? 
            <button onClick={handleDelete} className="me-3" type="submit">Eliminar</button>
              : ''
          }
          {!editar &&
            <Button variant="secondary" onClick={(e) => {
              setShowModal(false)
              cleanForm()
            }}>
              Cancelar
            </Button>
          }
        </div>
      </form>
      </Modal.Footer>
    </Modal>
    </div>
  );
}
