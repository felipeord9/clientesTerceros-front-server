import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';

export default function TableUsers({ users, loading, setSelectedUser, setShowModal }) {
  const { successAlert } = useAlert()
  const columns = [
    {
      id: "id",
      name: "#Identificación",
      selector: (row) => row.rowId,
      sortable: true,
      width: '145px',
    },
    {
      id: "name",
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      width: '250px'
    },
    {
      id: "email",
      name: "Correo",
      selector: (row) => row.email,
      sortable: true,
      width: '400px'
    },
    {
      id: "role",
      name: "Rol",
      selector: (row) => row.role.toUpperCase(),
      sortable: true,
      width: '120px',
    },
    {
      id: "options",
      name: "Acciones",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Editar usuario" className='btn btn-sm btn-primary' onClick={(e) => {
            setSelectedUser(row)
            setShowModal(true)
          }}>
            <FiIcons.FiEdit />
          </button>
        </div>
      ),
      width: '100px'
    },
  ]
  
  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded" style={{userSelect:'none'}}
    >
    <div className='rounder-4'>
    <div className='login-wrapper rounder-4' style={{width:1040,height:400}} >
      <DataTable
        className="bg-light text-center border border-2 h-100"
        style={{fontSize:20 , height:450}}
        columns={columns}
        data={users}
        fixedHeaderScrollHeight={200}
        
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
    </div>
  )
}