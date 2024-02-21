import { useState, useEffect , useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, updateUser } from "../../services/userService";
import * as Bs from "react-icons/bs";
import { getAllCategorias } from '../../services/categoriaRechazoService'
import { createRechazo } from '../../services/rechazoService'
import AuthContext from "../../context/authContext";
import { updateCliente } from '../../services/clienteService'
import { updateProveedor } from '../../services/proveedorService'

export default function ModalRechazo({
  tercero,
  setTercero,
  showModal,
  setShowModal,
  reloadInfo
}) {
  const { user } = useContext(AuthContext);
  const [info, setInfo] = useState({
    cedula: "",
    id:'',
    razonSocial:'',
    agencia:'',
    tipoFormulario:'',
    solicitante:'',
    direccion:'',
    ciudad:'',
    celular:'',
    correoNotificaciones:'',
    observations:'',
    docVinculacion:'',
    docComprAntc:'',
    docCtalnst:'',
    docPagare:'',
    docRut:'',
    docCcio:'',
    docCrepL:'',
    docEf:'',
    docRefcom:'',
    docRefcom2:'',
    docRefcom3:'',
    docCvbo:'',
    docFirdoc:'',
    docInfemp:'',
    docInfrl:'',
    docCerBan:'',
    docValAnt:'',
    docOtros:'',
    createdAt:'',
    userName:'',
    correoElectronico:'',
    primerApellido:'',
    primerNombre:'',
    segundoApellido:'',
    otrosNombres:'',
  });
 
  useEffect(() => {
    if(tercero) {
      setInfo({
        id: tercero?.id,
        cedula: tercero?.cedula,
        razonSocial: tercero?.razonSocial,
        agencia: tercero?.agencia,
        tipoFormulario:tercero?.tipoFormulario,
        solicitante: tercero?.solicitante,
        direccion: tercero?.direccion,
        ciudad: tercero?.ciudad,
        celular: tercero?.celular,
        correoNotificaciones:tercero?.correoNotificaciones,
        observations: tercero?.observations,
        docVinculacion: tercero?.docVinculacion,
        docComprAntc: tercero?.docComprAntc,
        docCtalnst: tercero?.docCtalnst,
        docPagare:tercero?.docPagare,
        docRut: tercero?.docRut,
        docCcio: tercero?.docCcio,
        docCrepL: tercero?.docCrepL,
        docEf: tercero?.docEf,
        docRefcom:tercero?.docRefcom,
        docRefcom2: tercero?.docRefcom2,
        docRefcom3: tercero?.docRefcom3,
        docCvbo: tercero?.docCvbo,
        docFirdoc: tercero?.docFirdoc,
        docInfemp:tercero?.docInfemp,
        docInfrl: tercero?.docInfrl,
        docCerBan: tercero?.docCerBan,
        docValAnt: tercero?.docValAnt,
        docOtros: tercero?.docOtros,
        createdAt:tercero?.createdAt,
        userName: tercero?.userName,
        primerApellido:tercero?.primerApellido,
        primerNombre:tercero?.primerNombre,
        segundoApellido:tercero?.segundoApellido,
        otrosNombres:tercero?.otrosNombres,
      })
    }
  }, [tercero])

  const[mensaje,setMensaje] = useState(false)

  const handlesubmit = (e) => {
    e.preventDefault();
    if(detalle.categoria !=='' && detalle.comentarios !== ''){
    const body={
      idrct:detalle.categoria,
      cedula:info.cedula,
      tipoFormulario:info.tipoFormulario,
      agencia: info.agencia,
      usuarioSolicitante:info.solicitante,
      fechaSolicitud:info.createdAt,
      quienRechaza: user.rowId,
      fechaRechazo: new Date(),
      detalleRechazo: detalle.comentarios,
    }
    createRechazo(body)
      .then((data) => { 
        const update={
          pendiente:0,
          rechazado:1,
          aprobado:0,
        }    
        if(info.tipoFormulario==='PNC' || info.tipoFormulario==='PNCR'
        || info.tipoFormulario==='PJC' || info.tipoFormulario==='PJCR'
        || info.tipoFormulario==='CCP'){
          updateCliente(info.id, update)
          .then(()=>{
            setShowModal(!showModal)
            Swal.fire({
              title: `Rechazo exitoso`,
              text: 'Se ha registrado correctamente el rechazo del tercero en la base de datos.',
              icon: 'success',
              showConfirmButton: false,
              timer: 4500
            })
            .then(()=>{
              window.location.reload();
              cleanForm()
            })
          })
          .catch((error)=>{
            Swal.fire({
              title:'¡Oups!',
              text:'Ha ocurrido un error al momento de registrar el rechazo, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
            })
          })
        }else if(info.tipoFormulario==='PMJ' || info.tipoFormulario==='PMN'
        || info.tipoFormulario==='PVN' || info.tipoFormulario==='PVJ'
        || info.tipoFormulario==='PS'){
          updateProveedor(info.id, update)
          .then(()=>{
          setShowModal(!showModal)
            Swal.fire({
              title: `Rechazo exitoso`,
              text: 'Se ha registrado correctamente el rechazo del tercero en la base de datos.',
              icon: 'success',
              showConfirmButton: false,
              timer: 4500
            })
            .then(()=>{
              window.location.reload();
              cleanForm()
            })
          })
          .catch((error)=>{
            Swal.fire({
              title:'¡Oups!',
              text:'Ha ocurrido un error al momento de registrar el rechazo, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
            })
          })
        }   
      })
      .catch((error)=>{
        Swal.fire({
          title:'¡Oups!',
          text:'Ha ocurrido un error al momento de registrar el rechazo, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
        })
      })
    }else{
        setMensaje(true)
    }
  };

  const cleanForm = () => {
    setInfo({
      cedula: "",
    razonSocial:'',
    agencia:'',
    tipoFormulario:'',
    solicitante:'',
    direccion:'',
    ciudad:'',
    celular:'',
    correoNotificaciones:'',
    observations:'',
    docVinculacion:'',
    docComprAntc:'',
    docCtalnst:'',
    docPagare:'',
    docRut:'',
    docCcio:'',
    docCrepL:'',
    docEf:'',
    docRefcom:'',
    docRefcom2:'',
    docRefcom3:'',
    docCvbo:'',
    docFirdoc:'',
    docInfemp:'',
    docInfrl:'',
    docCerBan:'',
    docValAnt:'',
    docOtros:'',
    createdAt:'',
    userName:'',
    correoElectronico:'',
    primerApellido:'',
    primerNombre:'',
    segundoApellido:'',
    otrosNombres:'',
    })
    setCategoria('')
    setDetalles({
      comentarios:''
    })
  }

  const [categorias,setCategorias] = useState([])
  const [categoria,setCategoria] = useState('')
  useEffect(()=>{
    getAllCategorias().then((data)=>setCategorias(data))
  },[])

  const [detalle, setDetalles] = useState({
    comentarios:'',
    categoria:''
  })

  const handlerChangeDetalle = (e) => {
    const { id, value } = e.target;
    console.log(value);
    setDetalles({
      ...detalle,
      [id]: value,
    });
  };

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} style={{ fontSize: 18, userSelect:'none' , backgroundColor:'rgba(0, 0, 0, 0.5)' }} centered>
      <Modal.Header >
        <center>
        <Modal.Title className="text-danger justify-content-center w-100" style={{fontSize:40}}>
          <strong className="w-100 justify-content-center">Rechazo</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form onSubmit={handlesubmit}>
            <div>
            <div>
                <label className="fw-bold">Motivo de Rechazo</label>
                <select
                    id="categoria"
                    value={detalle.categoria}
                    className="form-select form-select-sm w-100"
                    required
                    onChange={handlerChangeDetalle}
                  >
                    <option selected value='' disabled>
                    -- Seleccione el Motivo de su Rechazo --
                  </option>
                  {categorias
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    <option id={elem.id} value={elem.id}>
                    {elem.description}
                    </option>
                  ))
                }
                  </select>
              </div>
              <div>
                <label className="fw-bold" style={{fontSize:19}}>Comentarios</label>
                <textarea
                  id="comentarios"
                  className="form-control border border-3"
                  value={detalle.comentarios}
                  placeholder="(Campo Obligatorio)"
                  onChange={handlerChangeDetalle}
                  required
                  style={{ minHeight: 80, maxHeight: 100, fontSize: 15 }}
                ></textarea>
              </div>
              {mensaje && (
                <div className="d-flex w-100 mt-1">
                  <span className="text-danger">Debes dar un motivo y un comentario o detalle para poder efectuar el rechazo</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <form onSubmit={handlesubmit}>
            <div className="d-flex justify-content-center gap-2 mt-3 ">
              <button className="me-4" type="submit"
              onSubmit={(e)=>handlesubmit(e)}>Guardar</button>
              <Button variant="secondary" onClick={(e) => {
                setShowModal(false)
                /* cleanForm() */
                setMensaje(false)
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
