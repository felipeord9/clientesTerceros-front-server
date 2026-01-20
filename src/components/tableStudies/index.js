import Swal from "sweetalert2";
import * as Fa from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function Tablestudies({
  formData,
  setFormData,
  currentStudy,
  setCurrentStudy,
  editIndex,
  setEditIndex,
  list,
  setList,
}) {
  const deleteStudiesList = (e) => {
    const { id } = e.target.parentNode;
    Swal.fire({
      icon: "warning",
      title: "¡Cuidado!",
      html: `
        <div>¿Está seguro que desea eliminar el estudio de la lista?</div>
        <div>${list.agregados[id].nivel} - ${list.agregados[id].titulo}</div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Si, eliminar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowEnterKey: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        let newList = [...list.agregados];
        if (newList.length === 1) {
          newList = [];
        } else {
          newList.splice(id, 1);
        }
        setList({
          agregados: newList,
        });
      }
    });
  };

  const restoreProductList = (e) => {
    Swal.fire({
      icon: "warning",
      title: "¡Cuidado!",
      html: `
        <div>¿Está seguro que desea restaurar la lista de estudio?</div>
        <div>Vaciará la lista por completo, esta acción no se puede rehacer</div>
      `,
      showConfirmButton: true,
      confirmButtonText: "Si, restaurar",
      confirmButtonColor: "#dc3545",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      allowEnterKey: true,
    }).then(({ isConfirmed }) => {
      if (isConfirmed) {
        setList({
          agregados: [],
          total: "0",
        });
      }
    });
  };

  const handleRowClick = (elem, index) => {
    setFormData({
      ...formData,
      nivelEstudio: elem.nivel,
      currentStudy: elem.estado === "Finalizado" ? "no" : "si",
      typeStudy: elem.titulo,
      establecimiento: elem.establecimiento,
      semestre: elem.semestre,
    });
    setCurrentStudy({
      ...currentStudy,
      si: elem.estado === "Finalizado" ? false : true,
      no: elem.estado === "Finalizado" ? true : false,
    });
    setEditIndex(index);
  };

  return (
    <div
      className="table-responsive mt-2 mb-3 rounded"
      style={{ fontSize: 13 }}
    >
      <table className="table table-bordered table-hover align-middle text-center m-0 caption-top">
        <caption>ESTUDIOS AGREGADOS DEL EMPLEADO</caption>
        <thead>
          <tr>
            <th style={{ backgroundColor: "whitesmoke" }}>Nivel</th>
            <th style={{ width: 120, backgroundColor: "whitesmoke" }}>
              Estado
            </th>
            <th style={{ backgroundColor: "whitesmoke" }}>Título</th>
            <th style={{ backgroundColor: "whitesmoke" }}>Establecimiento</th>
            <th style={{ width: 80, backgroundColor: "whitesmoke" }}>
              Semestre
            </th>
            <th style={{ width: 55, backgroundColor: "whitesmoke" }}>
              {list.agregados.length > 1 && (
                <button
                  type="button"
                  className="d-flex align-items-center btn btn-danger m-auto p-0"
                  title="Restaurar"
                  onClick={restoreProductList}
                >
                  <Fa.FaTrashRestore
                    style={{ width: 30, height: 30 }}
                    className="p-2"
                  />
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {list.agregados.map((elem, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(elem, index)}
              style={{ cursor: "pointer" }}
            >
              <td>{elem.nivel}</td>
              <td>{elem.estado}</td>
              <td>{elem.titulo}</td>
              <td>{elem.establecimiento}</td>
              <td>{elem.semestre ? elem.semestre : ""}</td>
              <td>
                <button
                  id={index}
                  title="Borrar producto"
                  type="button"
                  className="d-flex align-items-center btn btn-danger m-auto p-0"
                  onClick={deleteStudiesList}
                >
                  <Fa.FaTrash
                    id={index}
                    style={{ width: 30, height: 30 }}
                    className="p-2"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tablestudies;
