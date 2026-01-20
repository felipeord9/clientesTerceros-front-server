import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  createContrato,
  updateContrato,
  deleteContrato,
} from "../../services/contratoService";
import { getAllContratos } from "../../services/contratoService";
import { useRef } from "react";
import Swal from "sweetalert2";
import "./styles.css";

export default function ModalContrato({ showModal, setShowModal }) {
  const [editar, setEditar] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [contratos, setContratos] = useState({});
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [info, setInfo] = useState({
    id: "",
    description: "",
  });
  const [error, setError] = useState("");
  const ref = useRef();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    getAllContratos().then(
      (data) => (setContratos(data), setSuggestions(data))
    );
  }, [showModal]);

  const handlerChangeSuggestions = (e) => {
    const { value } = e.target;
    setItemSeleccionado(null);
    if (value !== "") {
      const filter = contratos.filter((elem) =>
        elem.description.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filter);
    } else {
      setSuggestions(null);
    }
    ref.current.selectedIndex = 0;
    setInfo({
      ...info,
      description: value,
    });
  };

  const handleCreateNewContrato = (e) => {
    e.preventDefault();
    if (!itemSeleccionado) {
      Swal.fire({
        title: `¿Está segur@ de querer agregar el tipo de contrato: ${info.description.toUpperCase()}?`,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#D92121",
        denyButtonText: `Cancelar`,
        denyButtonColor: "blue",
        icon: "question",
      })
        .then((result) => {
          if (result.isConfirmed) {
            const body = {
              description: info.description.toUpperCase(),
            };
            createContrato(body).then((data) => {
              setShowModal(!showModal);
              Swal.fire(
                "¡Correcto!",
                "El tipo de contrato se ha agregado con éxito",
                "success"
              );
            });
          } else if (result.isDenied) {
            Swal.fire(
              "Oops",
              "La información suministrada se ha descartado",
              "info"
            );
            setShowModal(!showModal);
          }
          cleanForm();
        })
        .catch((error) => {
          setError(error.response.data.errors.original.detail);
          setTimeout(() => setError(""), 2500);
        });
    }
  };

  const handleUpdateContrato = (e) => {
    e.preventDefault();
    if (info.id !== "" && info.description !== "") {
      Swal.fire({
        title: `¿Está segur@ de querer actualizar el tipo de contrato: ${info.description.toUpperCase()} ?`,
        showDenyButton: true,
        confirmButtonText: "Confirmar",
        confirmButtonColor: "#D92121",
        denyButtonText: `Cancelar`,
        denyButtonColor: "blue",
        icon: "question",
      })
        .then((result) => {
          if (result.isConfirmed) {
            const body = {
              description: info.description.toUpperCase(),
            };
            updateContrato(info.id, body).then((data) => {
              setShowModal(!showModal);
              Swal.fire({
                title: "¡Correcto!",
                text: "El tipo de contrato se ha actualizado correctamente",
                icon: "success",
                showConfirmButton: false,
                timer: 2500,
              });
              setEditar(false);
            });
          } else if (result.isDenied) {
            setEditar(false);
            Swal.fire(
              "Oops",
              "La información suministrada se ha descartado",
              "info"
            );
            setShowModal(!showModal);
          }
          cleanForm();
        })
        .catch((error) => {
          setError(error.response.data.errors.original.detail);
          setTimeout(() => setError(""), 2500);
        });
    }
  };

  const handleEditar = (e) => {
    e.preventDefault();
    setEditar(true);
    setInfo({
      id: itemSeleccionado.id,
      description: itemSeleccionado.description,
    });
  };

  const handleCancelEditar = (e) => {
    e.preventDefault();
    setEditar(false);
    setInfo({
      id: "",
    });
  };

  const cleanForm = () => {
    setInfo({
      id: "",
      description: "",
    });
    setNotFound(false);
    setItemSeleccionado(null);
    setEditar(false);
    getAllContratos();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (itemSeleccionado) {
      Swal.fire({
        title: `¿Está segur@?`,
        text: `Se eliminará el tipo de contrato: "${itemSeleccionado.description}" de la base de datos`,
        showConfirmButton: true,
        confirmButtonColor: "#D92121",
        confirmButtonText: "Confirmo",

        showCancelButton: true,
        cancelButtonColor: "grey",
        cancelButtonText: "Cancelar",
        icon: "question",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          setShowModal(!showModal);
          deleteContrato(itemSeleccionado.id)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "¡Excelente!",
                text: "El tipo de contrato se ha eliminado con éxito",
                timer: "4000",
                showConfirmButton: false,
              });
            })
            .catch((err) => {
              Swal.fire({
                title: "¡ERROR!",
                text: "Ha ocurrio un error al momento de eliminar el tipo de contrato. Intentalo de nuevo, si el problema persiste comunicate con tu jefe inmediato ó con el área de sistemas para darle una oportuna y rápida solución.",
              });
            });
        }
        cleanForm();
      });
    }
  };

  const findByDescrip = (e) => {
    const { value } = e.target;
    setEditar(false);
    const item = contratos.find(
      (elem) => elem.description.toLowerCase() === value.toLowerCase()
    );
    if (item) {
      setItemSeleccionado(item);
    } else {
      setItemSeleccionado(null);
    }
  };

  return (
    <div
      className="wrapper d-flex justify-content-center align-content-center"
      style={{ userSelect: "none" }}
    >
      <Modal
        show={showModal}
        style={{ fontSize: 18, userSelect: "none" }}
        centered
      >
        <Modal.Header>
          <center>
            <Modal.Title className="text-danger" style={{ fontSize: 40 }}>
              <strong>Gestionar Tipos de Contratos</strong>
            </Modal.Title>
          </center>
        </Modal.Header>
        <Modal.Body className="p-2">
          <div className="m-2 h-100">
            <form
              onSubmit={
                itemSeleccionado
                  ? handleUpdateContrato
                  : handleCreateNewContrato
              }
            >
              <div className="w-100 mt-2">
                <label className="fw-bold">Descripción</label>
                <div className="d-flex align-items-center position-relative w-100">
                  <input
                    id="description"
                    type="search"
                    autoComplete="off"
                    placeholder="Selecciona un producto para agregarlo"
                    value={
                      itemSeleccionado
                        ? itemSeleccionado.description
                        : info?.description
                    }
                    onChange={handlerChangeSuggestions}
                    className="form-control form-control-sm input-select"
                    style={{ textTransform: "uppercase" }}
                    /* required={productoSeleccionado ? false : true} */
                  />
                  <select
                    ref={ref}
                    id="description"
                    className="form-select form-select-sm"
                    /* value={
                      info.description
                    } */
                    onChange={(e) => findByDescrip(e)}
                    required
                  >
                    <option value="" selected disabled>
                      -- SELECCIONE --
                    </option>
                    {suggestions
                      ?.sort((a, b) => a.id - b.id)
                      .map((elem) => (
                        <option key={elem.id} value={elem.description}>
                          {elem.description}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              {/* {JSON.stringify(itemSeleccionado)}---{JSON.stringify(info)} --- {JSON.stringify(editar)} */}
              <div className="d-flex w-100 mt-2">
                <span
                  className="text-center text-danger w-100 m-0"
                  style={{ height: 15 }}
                >
                  {error}
                </span>
              </div>
              {notFound ? (
                <span className="d-flex w-100 text-align-center text-danger me-3">
                  Este tipo de contrato no se encuentra en nuestra base de datos
                </span>
              ) : (
                ""
              )}
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <form /* onSubmit={itemSeleccionado ? handleUpdateContrato : handleCreateNewContrato} */
          >
            <div className="d-flex justify-content-center gap-0 mt-2 ">
              {!editar && (
                <div>
                  <button
                    style={{ backgroundColor: "#008F39" }}
                    onClick={(e) =>
                      itemSeleccionado
                        ? handleEditar(e)
                        : handleCreateNewContrato(e)
                    }
                    className="me-3"
                    type="submit"
                  >
                    {itemSeleccionado ? "Actualizar" : "Crear"}
                  </button>
                </div>
              )}
              {itemSeleccionado && !editar ? (
                <button onClick={handleDelete} className="me-3" type="submit">
                  Eliminar
                </button>
              ) : (
                ""
              )}
              {!editar && (
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    setShowModal(false);
                    cleanForm();
                  }}
                >
                  Cancelar
                </Button>
              )}
              {editar && (
                <div>
                  <button
                    style={{ backgroundColor: "#008F39" }}
                    onClick={(e) => handleUpdateContrato(e)}
                    className="me-3"
                    type="submit"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={(e) => handleCancelEditar(e)}
                    className="me-3"
                    type="submit"
                  >
                    Descartar
                  </button>
                </div>
              )}
            </div>
          </form>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
