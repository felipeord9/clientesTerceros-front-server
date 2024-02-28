import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createClasificacion , updateClasificacion , findOneClasificacion , deleteClasificacion } from "../../services/clasificacionService";
import * as Bs from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function ModalClasificacion({
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const handleCreateNewClasificacion = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer agregar la clasificación ${info.description}?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        createClasificacion(info)
          .then((data) => {
            setShowModal(!showModal)
            Swal.fire(
              '¡Correcto!', 'La clasificación se ha agregado con éxito', 'success'
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

  const handleUpdateAgency = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer editar la clasificación ${info.description} ?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        updateClasificacion(info.id, info)
          .then((data) => {           
            setShowModal(!showModal)
            Swal.fire({
              title: '¡Correcto!',
              text: 'La clasificación se ha actualizado correctamente',
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
    findOneClasificacion(info.id)
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
      text:`Se eliminará la Clasificación "${info.description}" de la base de datos`,
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
        deleteClasificacion(info.id)
        .then(()=>{
          Swal.fire({
            icon:'success',
            title:'¡Excelente!',
            text:'La Clasificación se ha eliminado con éxito',
            timer:'4000',
            showConfirmButton:false,
          })
        })
        .catch((err)=>{
          Swal.fire({
            title:'¡ERROR!',
            text:'Ha ocurrio un error al momento de eleminar la clasificación. Intentalo de nuevo, si el problema persiste comunicate con tu jefe inmediato ó con el área de sistemas para darle una oportuna y rápida solución.'
          })
        })
      }
      cleanForm();
    })
  }

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' }} centered>
      <Modal.Header>
        <center>
        <Modal.Title className="text-danger" style={{fontSize:40}}>
          <strong>Gestionar Clasificaciones</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={editar ? handleUpdateAgency : handleCreateNewClasificacion}>
            <div className="d-flex w-100 flex-row">
              <div className="d-flex flex-column me-2 w-75">
                <label className="fw-bold">ID</label>
                <input
                  id="id"
                  type="number"
                  value={info.id}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="d-flex flex-column w-25">
              <button
                title="Buscar"
                className="d-flex mt-4 ms-2 text-nowrap btn btn-sm  text-light gap-1" 
                style={{height:35 ,fontSize:18,backgroundColor:'#D92121', color:'white'}}
                onClick={(e)=>handleButton(e)}
                >
                 <FaMagnifyingGlass className="mt-1 me-1"/> {buscando ? 'Buscando...' : 'Buscar'}
              </button>
              </div>
            </div>
            <div className="d-flex flex-column w-100 mt-2">
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
              </div>
            <div className="d-flex w-100 mt-2">
              <span 
                className="text-center text-danger w-100 m-0"
                style={{height: 15}}
              >
                {error}
              </span>
            </div>
            {notFound ?
            <span className="d-flex w-100 text-align-center text-danger me-3">Esta clasificación no se encuentra en nuestra base de datos</span>
            :''
            }
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <form onSubmit={editar ? handleUpdateAgency : handleCreateNewClasificacion}>
      <div className="d-flex justify-content-center gap-0 mt-2 ">
              {editar ? 
                <button onClick={handleDelete} className="me-3" type="submit">Eliminar</button>
                : ''
              }
              <button style={{backgroundColor:'#008F39'}} onSubmit={editar ? handleUpdateAgency : handleCreateNewClasificacion} className="me-3" type="submit">{editar ? "Editar" : "Crear"}</button>
              <Button variant="secondary" onClick={(e) => {
                setShowModal(false)
                cleanForm()
              }}>
                Cancelar
              </Button>
            </div>
            </form>
      </Modal.Footer>
    </Modal>
    </div>
  );
}
