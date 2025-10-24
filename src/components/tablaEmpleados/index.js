import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import Swal from 'sweetalert2';
import { findEmpleadoByCedula , deleteEmpleado } from '../../services/empleadoService';
import { MdDeleteOutline } from "react-icons/md";
import AuthContext from "../../context/authContext";
import { useContext } from 'react';

export default function TableEmpleados({ empleados, loading, setSelectedEmpleado, setShowModal , customStyles }) {
  const { user } = useContext(AuthContext);
  const { successAlert } = useAlert()
  const columnsForComprasnv = [
    {
      id: "rowId",
      name: "C.C",
      selector: (row) => row.rowId,
      sortable: true,
      width: '130px',
    },
    {
      id: "Nombre",
      name: "Nombre Empleado",
      selector: (row) => `${row.primerNombre} ${row.otrosNombres} ${row.primerApellido} ${row.segundoApellido}`,
      sortable: true,
      width: 'auto'
    },
    {
      id: "Agencia",
      name: "Agencia",
      selector: (row) => row.agencia,
      sortable: true,
      width: 'auto'
    },
    {
      id: "Cargo",
      name: "Cargo",
      selector: (row) => row.cargo,
      sortable: true,
      width: 'auto'
    },
    {
      id: "options",
      name: "Editar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Editar Sucursal" className='btn btn-sm btn-primary' onClick={(e) => {
            setSelectedEmpleado(row)
            setShowModal(true)
          }}>
            <FiIcons.FiEdit />
          </button>
        </div>
      ),
      width: '80px'
    },
    {
      id: "delete",
      name: "Delete",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Eliminar Sucursal" className='btn btn-sm btn-danger ' onClick={(e) => {
            Swal.fire({
              title:'¿Esta segur@?',
              icon:'question',
              text:`Se eliminará el empleado 
              "${row.primerNombre.toUpperCase()} ${row.otrosNombres.toUpperCase()}
              ${row.primerApellido.toUpperCase()} ${row.segundoApellido.toUpperCase()}" de la base de datos`,
              showCancelButton:true,
              showConfirmButton:true,
              cancelButtonColor:'grey',
              confirmButtonColor:'#D92121',
              confirmButtonText:'Si, eliminar'
            }).then((result)=>{
              if(result.isConfirmed){
                deleteEmpleado(row.nombreSucursal)
                .then(()=>{
                  Swal.fire({
                    title:'Eliminado',
                    text:`Sucursal "${row.nombreSucursal.toUpperCase()}" eliminada con éxito`,
                    icon:'success',
                    showConfirmButton:'true',
                    confirmButtonColor:'green',
                    timer:5000
                  })
                })
                .then(()=>{
                  window.location.reload();
                })
                .catch((err)=>{
                  Swal.fire({
                    title:'Algo salió mal',
                    text:'Ha ocurrido un error al borrar la sucursal, intentalo de nuevo. Si el problema persiste, comunicate con el área de sistemas',
                    icon:'error',
                    showConfirmButton:'true',
                    confirmButtonColor:'green'
                  })
                })
              }
            })
            .catch((err)=>{
              Swal.fire({
                title:'Algo salió mal',
                text:'Ha ocurrido un error al borrar la sucursal, intentalo de nuevo. Si el problema persiste, comunicate con el área de sistemas',
                icon:'error',
                showConfirmButton:'true',
                confirmButtonColor:'green'
              })
            })
          }}>
            <MdDeleteOutline />
          </button>
        </div>
      ),
      width: '80px'
    },
    
  ]
  const columnsForRecursosHumanos = [
    {
      id: "rowId",
      name: "C.C",
      selector: (row) => row.rowId,
      sortable: true,
      width: '150px',
    },
    {
      id: "Nombre",
      name: "Nombre Empleado",
      selector: (row) => `${row.primerNombre} ${row.otrosNombres} ${row.primerApellido} ${row.segundoApellido}`,
      sortable: true,
      width: '400px'
    },
    {
      id: "agencia",
      name: "Agencia",
      selector: (row) => row.agencia,
      sortable: true,
      width: 'auto',
    },
    {
      id: "Cargo",
      name: "Cargo",
      selector: (row) => row.cargo,
      sortable: true,
      width: 'auto'
    },
    
  ]
  const columns = (user.role === 'admin' || user.role==='comprasnv') ? columnsForComprasnv :columnsForRecursosHumanos;

  return (
    
    <div className='d-flex justify-content-center shadow border border-2 rounded-4 ' style={{height: "calc(100% - 100px)",backgroundColor:'white'}} >
      <DataTable
        className="bg-light d-flex text-center border border-2"
        style={{fontSize:20}}
        columns={columns}
        data={empleados}
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
          <div style={{padding: 24}}>No hay ningún registro en la base de datos...</div>}  
      />
    
    </div>
  )
}