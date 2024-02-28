import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createDepartamento , updateDepartamento , findOneDepartamento , deleteDepartamento } from "../../services/departamentoService";
import { createCiudad , updateCiudad , findOneCity , deleteCiudad } from "../../services/ciudadService";

import * as Bs from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function ModalDepartamento({
  showModal,
  setShowModal,
}) {
  const [editar,setEditar] = useState(false)
  const [buscando,setBuscando] = useState(false)
  const [notFound,setNotFound] = useState(false)
  const [vacio,setVacio] = useState(false)
  const [info, setInfo] = useState({
    id:'',
    codigo:'',
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

  const handleCreateNewDepartamento = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer agregar el país ${info.description}?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        const body ={
          id: info.codigo,
          codigo: info.codigo,
          description: info.description
        }
        createDepartamento(body)
          .then((data) => {
            createCiudad(body)
            .then(()=>{
            setShowModal(!showModal)
            Swal.fire(
              '¡Correcto!', 'El país se ha agregado con éxito', 'success'
            )
            setShowModal(!showModal)
          })
          .catch((err)=>{
            Swal.fire(
              'Uops!', 'Hubo un error al momento de registrar el pais. intente de nuevo. Si el problema persiste comuniquese con su jefe directo ó con el área de sistemas para darle una oportuna y rápido solución.', 'warning'
            )
            setShowModal(!showModal)
          })
        })
        .catch((err)=>{
          Swal.fire(
            'Uops!', 'Hubo un error al momento de registrar el pais. intente de nuevo. Si el problema persiste comuniquese con su jefe directo ó con el área de sistemas para darle una oportuna y rápido solución.', 'warning'
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

  const handleUpdateDepartamento = (e) => {
    e.preventDefault();
    Swal.fire({
      title: `¿Está segur@ de querer editar el país "${info.description}" ?`,
          showDenyButton: true,
          confirmButtonText: 'Confirmar',
          confirmButtonColor: '#D92121',
          denyButtonText: `Cancelar`,
          denyButtonColor:'blue',
          icon:'question'
    }).then((result)=>{
      if(result.isConfirmed){
        const body ={
          id: info.codigo,
          codigo: info.codigo,
          description: info.description
        }
        updateDepartamento(info.codigo, body)
          .then((data) => {   
            updateCiudad(info.codigo,body)    
            .then(()=>{
              setShowModal(!showModal)
              Swal.fire({
                title: '¡Correcto!',
                text: 'El país se ha actualizado correctamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 2500
              })
            })
            .catch((err)=>{
              Swal.fire(
                'Uops!', 'Hubo un error al momento de editar el pais. intente de nuevo. Si el problema persiste comuniquese con su jefe directo ó con el área de sistemas para darle una oportuna y rápido solución.', 'warning'
              )
              setShowModal(!showModal)
            }) 
          })
          .catch((err)=>{
            Swal.fire(
              'Uops!', 'Hubo un error al momento de editar el pais. intente de nuevo. Si el problema persiste comuniquese con su jefe directo ó con el área de sistemas para darle una oportuna y rápido solución.', 'warning'
            )
            setShowModal(!showModal)
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
      description:'',
    })
    setNotFound(false)
    setEditar(false)
  }

  const handleButton = (e) => {
    e.preventDefault();
    setBuscando(true)
    if(info.codigo===''){
      setVacio(true)
      setTimeout(() => setVacio(false), 3000)
      setBuscando(false)
      setNotFound(false)
      cleanForm()
    }else{
    findOneDepartamento(info.codigo)
    .then(({data})=>{
      /* Swal.fire({
        title:`${JSON.stringify(data)}`
      }) */
      setBuscando(false)
      setInfo({
        id:data.id,
        codigo:data.id,
        description:data.description,
      })
      setEditar(true)
      setNotFound(false)
      
    }) 
    .catch((err)=>{
      setBuscando(false)
      setNotFound(true)
      setTimeout(() => setNotFound(false), 4000)
      setInfo({
        ...info,
        description:'',
      })
      setEditar(false)
      setVacio(false)
    })
   }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    Swal.fire({
      title:`¿Está segur@?`,
      text:`Se eliminará el país "${info.description}" de la base de datos`,
      showConfirmButton:true,
      confirmButtonColor:'#D92121',
      confirmButtonText:'Confirmo',

      showCancelButton:true,
      cancelButtonColor:'grey',
      cancelButtonText:'Cancelar',
      icon:'question'
    }).then(({isConfirmed})=>{
      if(isConfirmed){
        deleteDepartamento(info.codigo)
        .then(()=>{
          deleteCiudad(info.codigo)
          .then(()=>{
            setShowModal(!showModal)
            Swal.fire({
              icon:'success',
              title:'¡Excelente!',
              text:'El país se ha eliminado con éxito',
              timer:'4000',
              showConfirmButton:false,
            })
          })
          .catch((err)=>{
            Swal.fire(
              'Uops!', 'Hubo un error al momento de eliminar el pais. intente de nuevo. Si el problema persiste comuniquese con su jefe directo ó con el área de sistemas para darle una oportuna y rápido solución.', 'warning'
            )
            setShowModal(!showModal)
          })
        })
        .catch((err)=>{
          Swal.fire({
            title:'¡ERROR!',
            text:'Ha ocurrio un error al momento de eleminar el país. Intentalo de nuevo, si el problema persiste comunicate con tu jefe inmediato ó con el área de sistemas para darle una oportuna y rápida solución.'
          })
          setShowModal(!showModal)
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
          <strong>Gestionar Paises</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={editar ? handleUpdateDepartamento : handleCreateNewDepartamento}>
            <div className="d-flex w-100 flex-row">
              <div className="d-flex flex-column me-2 w-75">
                <label className="fw-bold">Código</label>
                <input
                  id="codigo"
                  type="number"
                  value={info.codigo}
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
            {/* <div className="d-flex flex-column w-100 mt-2">
                <label className="fw-bold">Código</label>
                <input
                  id="codigo"
                  type="number"
                  value={info.codigo}
                  className="form-control form-control-sm"
                  onChange={handleChange}
                  autoComplete="off"
                  required
                />
              </div> */}
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
            {vacio ?
            <span className="d-flex w-100 text-align-center text-danger me-3">Ingrese un código para hacer la busqueda</span>
            :''
            }
            {notFound ?
            <span className="d-flex w-100 justify-content-center text-align-center text-danger">Esta clasificación no se encuentra en nuestra base de datos</span>
            :''
            }
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <form onSubmit={editar ? handleUpdateDepartamento : handleCreateNewDepartamento}>
      <div className="d-flex justify-content-center gap-0 mt-2 ">
              {editar ? 
                <button onClick={handleDelete} className="me-3" type="submit">Eliminar</button>
                : ''
              }
              <button style={{backgroundColor:'#008F39'}} onSubmit={editar ? handleUpdateDepartamento : handleCreateNewDepartamento} className="me-3" type="submit">{editar ? "Editar" : "Crear"}</button>
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
