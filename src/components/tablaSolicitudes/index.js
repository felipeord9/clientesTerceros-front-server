import DataTable from "react-data-table-component";
import { useState, useEffect } from "react";
import { getAllAgencies } from "../../services/agencyService";
import { FaEye } from "react-icons/fa6";
import { getAllTipoFormularios } from "../../services/tipoFormularioService";
import Button from "@mui/material/Button";

export default function TablaSolicitudes({
  solicitudes,
  loading,
  customStyles,
  setSelectedTercero,
  setShowModal,
}) {
  const [agencias, setAgencias] = useState([]);

  const [formularios, setFormularios] = useState([]);

  useEffect(() => {
    getAllAgencies().then((data) => setAgencias(data));
    getAllTipoFormularios().then((data) => setFormularios(data));
  }, []);

  const conditionalCellStyles = [
    {
      when: (cell) => cell === "Pendiente",
      style: {
        color: "green",
      },
    },
    {
      when: (cell) => cell === "Rechazado",
      style: {
        color: "red",
      },
    },
  ];
  const columns = [
    {
      id: "cedula",
      name: "NIT",
      cell: (row) => row.cedula,
      width: "120px",
      sortable: true,
    },
    {
      id: "razonSocial",
      name: "Razon Social",
      cell: (row) => row.razonSocial,
      width: "450px",
      sortable: true,
    },
    {
      id: "agencia",
      name: "Agencia",
      cell: (row) => {
        const buscar = agencias.find(
          (item) => item.id === row.agencia
        )?.description;
        return buscar || "N/A";
      },
      width: "300px",
      sortable: true,
    },
    {
      id: "solicitante",
      name: "Solictante",
      cell: (row) => row.solicitante,
      width: "300px",
      sortable: true,
    },
    {
      id: "tipoFormulario",
      name: "Tipo Formulario",
      cell: (row) => {
        const buscar = formularios.find(
          (item) => item.id === row.tipoFormulario
        )?.description;
        return buscar || "N/A";
      },
      width: "350px",
      sortable: true,
    },
    {
      id: "estado",
      name: "Estado",
      cell: (row) =>
        (row.pendiente === "1" && (
          <label style={{ color: "orange", textAlign: "center" }}>
            Pendiente
          </label>
        )) ||
        (row.rechazado === "1" && (
          <label style={{ color: "red" }}>Rechazado</label>
        )) ||
        (row.aprobado === "1" && (
          <label style={{ color: "green" }}>Aprobado</label>
        )),
      width: "120px",
      sortable: true,
      conditionalCellStyles,
    },
    {
      id: "Detalles",
      name: "Detalles",
      cell: (row, index, column, id) => (
        <div className="d-flex">
          <Button
            variant="contained"
            title="Ver Información"
            onClick={(e) => (setSelectedTercero(row), setShowModal(true))}
            type="submit"
            className=""
          >
            <FaEye />
          </Button>
        </div>
      ),
      width: "130px",
      sortable: true,
      customStyles: {
        style: {},
      },
    },
  ];

  return (
    <div
      className="d-flex flex-column rounded m-0 p-0 table-orders"
      style={{ width: "100%" }}
    >
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{ fontSize: 20 }}
        columns={columns}
        data={solicitudes}
        fixedHeaderScrollHeight={200}
        customStyles={customStyles}
        progressPending={loading}
        conditionalCellStyles={conditionalCellStyles}
        progressComponent={
          <div class="d-flex align-items-center text-danger gap-2 mt-2">
            <strong>Cargando...</strong>
            <div
              class="spinner-border spinner-border-sm ms-auto"
              role="status"
              aria-hidden="true"
            ></div>
          </div>
        }
        dense
        striped
        fixedHeader
        pagination
        paginationComponentOptions={{
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
        }}
        paginationPerPage={50}
        paginationRowsPerPageOptions={[15, 25, 50, 100]}
        noDataComponent={
          <div style={{ padding: 24 }}>Ningún resultado encontrado...</div>
        }
      />
    </div>
  );
}
