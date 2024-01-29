import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'

export default function TableBitacora({ bitacoras, loading , customStyles }) {
  const columns = [
    {
      id: "usuario",
      name: "Usuario logged",
      selector: (row) => row.usuario,
      sortable: true,
      width: '250px',
    },
    {
      id: "accion",
      name: "Acciones",
      selector: (row) => row.accion,
      sortable: true,
      width: '100px'
    },
    {
      id: "fechaIngreso",
      name: "Fecha_Hora_Ingreso",
      selector: (row) => row.fechaIngreso,
      sortable: true,
      width: '200px'
    },
    {
      id: "fechaSalida",
      name: "Fecha_Hora_Salida",
      selector: (row) => row.fechaSalida,
      sortable: true,
      width: '200px'
    },
    {
      id: "macEquipo",
      name: "Mac Equipo Ingresado",
      selector: (row) => row.macEquipo,
      sortable: true,
      width: '200px'
    },
    
  ]
  
  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4' style={{width:1000,height:430, backgroundColor:'white'}} >
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
          <div style={{padding: 24}}>Ningún resultado encontrado...</div>} 
      />
      </div>
    </div>
  )
}