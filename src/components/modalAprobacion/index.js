import { useState, useEffect , useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import Swal from 'sweetalert2'
import { createUser, updateUser } from "../../services/userService";
import * as Bs from "react-icons/bs";
import { createAprobacion } from '../../services/aprobacionService'
import { updateCliente } from '../../services/clienteService'
import { updateProveedor } from '../../services/proveedorService'
import AuthContext from "../../context/authContext";

export default function ModalAprobacion({
  tercero,
  setTercero,
  showModal,
  setShowModal,
}) {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('')
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const body={
      cedula:info.cedula,
      tipoFormulario:info.tipoFormulario,
      agencia: info.agencia,
      usuarioSolicitante:info.solicitante,
      fechaSolicitud:info.createdAt,
      quienAprueba: user.rowId,
      fechaAprobacion: new Date(),
      detalleAprobacion: detalle.comentarios,
    }
    createAprobacion(body)
      .then((data) => {  
        const update={
          pendiente:0,
          rechazado:0,
          aprobado:1,
        }   
        if(info.tipoFormulario==='PNC' || info.tipoFormulario==='PNCR'
        || info.tipoFormulario==='PJC' || info.tipoFormulario==='PJCR'
        || info.tipoFormulario==='CCP') {
          updateCliente(info.id, update)
          .then(()=>{
            setShowModal(!showModal)
            Swal.fire({
              title: `Aprobación exitosa`,
              text: 'Se ha registrado correctamente la aprobación del tercero en la base de datos.',
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
              text:'Ha ocurrido un error al momento de registrar la aprobación, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
            })
          })
        }else if(info.tipoFormulario==='PMJ' || info.tipoFormulario==='PMN'
        || info.tipoFormulario==='PVN' || info.tipoFormulario==='PVJ'
        || info.tipoFormulario==='PS'){
          updateProveedor(info.id,update)
          .then(()=>{
            setShowModal(!showModal)
            Swal.fire({
              title: `Aprobación exitosa`,
              text: 'Se ha registrado correctamente la aprobación del tercero en la base de datos.',
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
              text:'Ha ocurrido un error al momento de registrar la aprobación, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
            })
          })
        }     
      })
      .catch((error)=>{
        Swal.fire({
          title:'¡Oups!',
          text:'Ha ocurrido un error al momento de registrar la aprobación, por favor intente de nuevo. Si el problema persiste comuniquese con su jefe directo o con el área de sistemas para brindarle una solución oportuna.'
        })
      })
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
    setDetalles({
      comentarios:''
    })
  }

  const [detalle, setDetalles] = useState({
    comentarios:'',
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
          <strong className="w-100 justify-content-center"> Aprobación</strong>
        </Modal.Title>
        </center>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form >
            <div>
              <div>
                <label className="fw-bold" style={{fontSize:19}}>Comentarios</label>
                <textarea
                  id="comentarios"
                  className="form-control border border-3"
                  value={detalle.comentarios}
                  placeholder="(Campo Opcional)"
                  onChange={handlerChangeDetalle}
                  style={{ minHeight: 80, maxHeight: 100, fontSize: 15 }}
                ></textarea>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
            <div className="d-flex justify-content-center gap-2 mt-3 ">
              <button className="me-4" type="submit"
              onClick={handlesubmit}
              >Guardar</button>
              <Button variant="secondary" onClick={(e) => {
                setShowModal(false)
                /* cleanForm() */
              }}>
                Cancelar
              </Button>
            </div>
      </Modal.Footer>
    </Modal>
    </div>
  );
}
