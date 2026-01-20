import DataTable from "react-data-table-component";

export default function TableBitacora({ bitacoras, loading, customStyles }) {
  const columns = [
    {
      id: "usuario",
      name: "Usuario logged",
      selector: (row) => row.usuario,
      sortable: true,
      width: "400px",
    },
    {
      id: "accion",
      name: "Acciones",
      selector: (row) => row.accion,
      sortable: true,
      width: "140px",
    },
    {
      id: "fechaIngreso",
      name: "Fecha_Hora_Ingreso",
      selector: (row) => row.fechaIngreso,
      sortable: true,
      width: "300px",
    },
    {
      id: "fechaSalida",
      name: "Fecha_Hora_Salida",
      selector: (row) => row.fechaSalida,
      sortable: true,
      width: "300px",
    },
    {
      id: "macEquipo",
      name: "Mac Equipo Ingresado",
      selector: (row) => row.macEquipo,
      sortable: true,
      width: "300px",
    },
  ];

  return (
    <div
      className="d-flex flex-column rounded m-0 p-0 table-orders"
      style={{ width: "100%" }}
    >
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        columns={columns}
        data={bitacoras}
        fixedHeaderScrollHeight={200}
        customStyles={customStyles}
        progressPending={loading}
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
        noDataComponent={
          <div style={{ padding: 24 }}>Ningún resultado encontrado...</div>
        }
      />
    </div>
  );
}
