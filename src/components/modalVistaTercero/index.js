import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { RiArrowGoBackFill } from "react-icons/ri";
import Swal from 'sweetalert2'
import * as Bs from "react-icons/bs";
import { Button } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getAllAgencies } from "../../services/agencyService";
import { getAllTipoFormularios } from "../../services/tipoFormularioService";
import { getAllCiudades } from "../../services/ciudadService";
import { config } from "../../config";
import ModalAprobacion from '../modalAprobacion'
import ModalRechazo from '../modalRechazo'

const CarpetaArchivoLink = ({ carpeta, archivo }) => {
  const url = `${config.apiUrl2}/uploadMultiple/obtener-archivo/${carpeta}/${archivo}`;
  return (
    <div className="w-100">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {archivo}
      </a>
    </div>
  );
};

export default function ModalVistaTercero({
  tercero,
  setTercero,
  showModal,
  setShowModal,
}) {
  const [info, setInfo] = useState({
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
    aprobado:'',
  });
 
  useEffect(() => {
    if(tercero) {
      setInfo({
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
        aprobado:tercero?.aprobado,
        correoElectronico: tercero?.correoElectronico,
      })
    }
  }, [tercero])

  const [agencias,setAgencias] = useState([]);
  const [formularios,setFormularios] = useState([]);
  const [ciudades,setCiudades] = useState([]);

  useEffect(()=>{
    getAllCiudades().then((data) => setCiudades(data));
    getAllAgencies().then((data) => setAgencias(data));
    getAllTipoFormularios().then((data)=>setFormularios(data))
  },[]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const style ={
    backgroundColor: 'lightblue'
  }

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
      aprobado:'',
    })
  }
  const ChangeInput = (e) => {
    const { id, value } = e.target;
    setInfo({
      ...info,
      [id]: value,
    });
  };

  const [showModalAprobacion,setShowModalAprobacion] = useState(false);
  const [showModalRechazo,setShowModalRechazo] = useState(false);

  const handlerClose = () => {
    setShowModal(false)
    cleanForm()
    setTercero(null)
  }

  return (
    <div className="wrapper d-flex justify-content-center align-content-center" style={{userSelect:'none'}}>
    <Modal show={showModal} size="xl" style={{ fontSize: 18, userSelect:'none' }} centered  onHide={handlerClose}>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger d-flex flex-row w-100 justify-content-center text-align-center" style={{fontSize:40}}>
          <center>
          <div className="w-100 justify-content-center text-align-center" >
            <strong className="ps-3">Información Del Tercero</strong>
          </div>
          </center>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2">
        <div className="m-2 h-100">
          <form >
            <ModalAprobacion 
              tercero={tercero}
              setTercero={setTercero}
              showModal={showModalAprobacion}
              setShowModal={setShowModalAprobacion}
            />
            <ModalRechazo 
              tercero={tercero}
              setTercero={setTercero}
              showModal={showModalRechazo}
              setShowModal={setShowModalRechazo}
            />
            <div>
              <div className="d-flex flex-row">
              <div className="w-50">
                <label className="fw-bold">No.Identificación</label>
                <input
                  id="cedula"
                  type="number"
                  value={info.cedula}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Razón Social</label>
                <input
                  id="razonSocial"
                  type="text"
                  value={info.razonSocial}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Agencia</label>
                <select
                    id="agencia"
                    value={info.agencia}
                    className="form-control form-control-sm w-100"
                    required
                    onChange={ChangeInput}
                    disabled
                  >
                  {agencias
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    <option id={elem.id} value={elem.id}>
                    {elem.description}
                    </option>
                    
                  ))
                }
                  </select>
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Solicitante</label>
                <input
                  id="solicitante"
                  type="text"
                  value={info.solicitante}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              </div>
              <div className="d-flex flex-row">
              <div className="w-50">
                <label className="fw-bold">Celular</label>
                <input
                  id="celular"
                  type="text"
                  value={info.celular}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Ciudad</label>
                <select
                    id="ciudad"
                    value={info.ciudad}
                    className="form-control form-control-sm w-100"
                    required
                    onChange={ChangeInput}
                    disabled
                  >
                  {ciudades
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    <option id={elem.id} value={elem.codigo}>
                    {elem.description}
                    </option>
                    
                  ))
                }
                  </select>
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Direccion</label>
                <input
                  id="direccion"
                  type="text"
                  value={info.direccion}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              {(info.tipoFormulario === 'CCP' || info.tipoFormulario === 'PNC'
              || info.tipoFormulario === 'PNCR' || info.tipoFormulario === 'PJC'
              || info.tipoFormulario === 'PJCR') && (
                <div className="w-100 ms-3">
                <label className="fw-bold">Correo Notificaciones</label>
                <input
                  id="correoNotificaciones"
                  value={info.correoNotificaciones}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              )}
              {(info.tipoFormulario === 'PMJ' || info.tipoFormulario === 'PMN'
              || info.tipoFormulario === 'PS'|| info.tipoFormulario === 'PVJ'
              || info.tipoFormulario === 'PVN') && (
              <div className="w-100 ms-3">
                <label className="fw-bold">Correo Electrónico</label>
                <input
                  id="correoElectronico"
                  value={info.correoElectronico}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              )}
              </div>
              <div className="d-flex flex-column mb-2 mt-2">
                <label className="fw-bold" style={{fontSize:18}}>OBSERVACIONES</label>
                  <textarea
                    disabled
                    id="observations"
                    value={info.observations}
                    className="form-control form-control-sm border border-3"
                    style={{ minHeight: 80, maxHeight: 110, fontSize: 15 }}
                  ></textarea>
              </div>
              {/* documentos personas naturales con nombre concatenado PNC PNCR PVN PMN PS */}
              {(info.tipoFormulario==='PVN' || info.tipoFormulario==='PNC'
              || info.tipoFormulario==='PNCR' || info.tipoFormulario==='PMN'
              || info.tipoFormulario==='PS') && (
              <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Rut</label>
                {info.docRut === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Rut-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 ms-3 d-flex flex-column">
                <label className="fw-bold">INFOLAFT</label>
                {info.docInfemp === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Infemp-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 ms-3 d-flex flex-column">
                <label className="fw-bold">Otros</label>
                {info.docOtros === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Otros-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              {(info.tipoFormulario==='PNC' || info.tipoFormulario==='PNCR' 
              || info.tipoFormulario==='PMN' || info.tipoFormulario==='PS') && (
              <div className="w-100 ms-3 d-flex flex-column">
                <label className="fw-bold">Vinculacion</label>
              {info.docVinculacion === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Vinculacion-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              {(info.tipoFormulario==='PNCR' || info.tipoFormulario==='PMN') && (
                <div className="w-100 ms-3 d-flex flex-column">
                <label className="fw-bold">Compro. Ant. Corrup.</label>
              {info.docComprAntc === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`ComprAntc-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              </div>
              )}
              {(info.tipoFormulario==='PNCR' || info.tipoFormulario==='PMN') && (
              <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Cert. Ccio</label>
                {info.docCcio === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Ccio-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Cert. Bancario</label>
                {info.docCerBan === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Certban-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Cédula</label>
                {info.docCrepL === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`CrepL-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Estado finan.</label>
                {info.docEf === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Ef-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Ref. comerciles</label>
                {info.docRefcom === 1 ? (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Refcom-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
                {info.docRefcom2 === 1 && (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Refcom2-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                )}
                {info.docRefcom3 === 1 && (
                <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Refcom3-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                )}
              </div>
              </div>
              )}
              {info.tipoFormulario==='PNCR'&&(
                <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Carta Instrucciones</label>
                  {info.docCtalnst === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`CtaInst-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                  ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Pagaré</label>
                  {info.docPagare === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Pagare-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                  ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Ficha Relacción Doc.</label>
                  {info.docFirdoc === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Firdoc-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                  ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Carta Visto Bueno Admin.</label>
                  {info.docCtalnst === 1 ? (
                  <CarpetaArchivoLink carpeta={`${info.cedula}-${info.primerApellido}-${info.segundoApellido}-${info.primerNombre}-${info.otrosNombres}`} archivo={`Cvbo-${info.primerApellido} ${info.segundoApellido} ${info.primerNombre} ${info.otrosNombres}.pdf`}/>
                  ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                </div>
              )}

              {/* documentos terceros con Razon Social PVJ CCP PMJ PJCR PJC*/}
              {(info.tipoFormulario==='PVJ' || info.tipoFormulario==='CCP'
              || info.tipoFormulario==='PMJ' || info.tipoFormulario==='PJCR'
              || info.tipoFormulario==='PJC') && (
                <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Rut</label>
                  {info.docRut === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Rut-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">INFOLAFT</label>
                  {info.docInfemp === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Infemp-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Otros</label>
                  {info.docOtros === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Otros-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                {(info.tipoFormulario==='PJC' || info.tipoFormulario==='PJCR'
                || info.tipoFormulario==='PMJ')&&(
                  <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Vinculacion</label>
                  {info.docVinculacion === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Vinculacion-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                )}
                {(info.tipoFormulario==='PJC' || info.tipoFormulario==='PJCR'
                || info.tipoFormulario==='PMJ')&&(
                  <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Infolaft Rep.</label>
                  {info.docInfrl === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Infrl-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                )}
                </div>
              )}
              {(info.tipoFormulario==='PJCR' || info.tipoFormulario==='PMJ') &&(
                <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Compro. Ant. Corrup.</label>
                  {info.docComprAntc === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`ComprAntc-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Certi. Ccio</label>
                  {info.docCcio === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Ccio-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Certi. Bancaria</label>
                  {info.docCerBan === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Certban-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Estado finan.</label>
                  {info.docEf === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Ef-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Cédula</label>
                  {info.docCrepL === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`CrepL-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                </div>
                </div>
              )}
              <div className="d-flex flex-row mt-2 mb-2" style={{fontSize:16}}>
              {(info.tipoFormulario==='PJCR' || info.tipoFormulario==='PMJ') &&(
                <div className="w-100 d-flex flex-column">
                  <label className="fw-bold">Ref. Comerciales</label>
                  {info.docRefcom === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Refcom-${info.razonSocial}.pdf`}/>
                    ):(
                    <label className="text-danger"><strong>No fue cargado</strong></label>
                  )}
                  {info.docRefcom2 === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Refcom2-${info.razonSocial}.pdf`}/>
                    )}
                  {info.docRefcom3 === 1 && (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Refcom3-${info.razonSocial}.pdf`}/>
                    )}
                </div>
              )}
              {info.tipoFormulario==='PJCR' && (
                <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Carta Inst.</label>
                {info.docCtalnst === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`CtaInst-${info.razonSocial}.pdf`}/>
                    ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              {info.tipoFormulario==='PJCR' && (
                <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Pagaré</label>
                {info.docPagare === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Pagare-${info.razonSocial}.pdf`}/>
                    ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              {info.tipoFormulario==='PJCR' && (
                <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Visto Bueno Admin</label>
                {info.docCvbo === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Cvbo-${info.razonSocial}.pdf`}/>
                    ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              {info.tipoFormulario==='PJCR' && (
                <div className="w-100 d-flex flex-column">
                <label className="fw-bold">Ficha Rela. Doc.</label>
                {info.docFirdoc === 1 ? (
                    <CarpetaArchivoLink carpeta={`${info.cedula}-${info.razonSocial}`} archivo={`Firdoc-${info.razonSocial}.pdf`}/>
                    ):(
                  <label className="text-danger"><strong>No fue cargado</strong></label>
                )}
              </div>
              )}
              </div>
              <div className="d-flex flex-row">
              <div className="w-100">
                <label className="fw-bold">Fecha Creación</label>
                <input
                  id="createdAt"
                  type="text"
                  value={`${new Date(info.createdAt).toLocaleDateString()} - ${new Date(info.createdAt).toLocaleTimeString()}` }
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Usuario Creador</label>
                <input
                  id="userName"
                  type="text"
                  value={info.userName}
                  className="form-control form-control-sm"
                  maxLength={10}
                  onChange={handleChange}
                  autoComplete="off"
                  required
                  disabled
                />
              </div>
              <div className="w-100 ms-3">
                <label className="fw-bold">Tipo Formulario</label>
                <select
                    id="tipoFormulario"
                    value={info.tipoFormulario}
                    className={`form-control form-control-sm`}
                    required
                    onChange={ChangeInput}
                    disabled
                  >
                  {formularios
                  .sort((a,b)=>a.id - b.id)
                  .map((elem)=>(
                    <option id={elem.id} value={elem.id}>
                    {elem.description}
                    </option>
                    
                  ))
                }
                  </select>
              </div>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
      {info.aprobado !== '1' && (
      <center>
      <Modal.Footer className="d-flex justify-content-center">
            <div className="d-flex justify-content-center gap-4 mt-2 " style={{fontSize:15}}>
              <Button variant="contained" color="success" type="submit"
                onClick={(e)=>setShowModalAprobacion(true)}
              >Aprobar</Button>
              <Button variant="contained" color="error"
                onClick={(e)=>{setShowModalRechazo(true)}}
              >Rechazar</Button>
            </div>
      </Modal.Footer>
      </center>
      )}
      {info.aprobado ==='1' && (
      <center>
        <Modal.Footer className="d-flex justify-content-center">
        <label style={{color:'green'}} className="fw-bold">Esta Solicitud ya fue Aprobada</label>
        </Modal.Footer>
      </center>
      )}
    </Modal>
    </div>
  );
}
