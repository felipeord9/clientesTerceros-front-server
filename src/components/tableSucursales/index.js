import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";
import { deleteUserByName } from '../../services/userService';
import { deleteSucursalByName } from '../../services/sucursalService';
import { MdDeleteOutline } from "react-icons/md";

export default function TableSucursales({ users, loading, setSelectedUser, setShowModal , customStyles }) {

  const { successAlert } = useAlert()
  const columns = [
    {
      id: "cedula",
      name: "Código Siesa",
      selector: (row) => row.cedula,
      sortable: true,
      width: '150px',
    },
    /* {
      id: "codigoSucursal",
      name: "Cód Suc.",
      selector: (row) => row.codigoSucursal,
      sortable: true,
      width: '70px',
    }, */
    {
      id: "nombreSucursal",
      name: "Nombre Sucursal",
      selector: (row) => row.nombreSucursal,
      sortable: true,
      width: '325px'
    },
    {
      id: "direccion",
      name: "Dirección",
      selector: (row) => row.direccion,
      sortable: true,
      width: '250px'
    },
    {
      id: "ciudad",
      name: "Ciudad",
      selector: (row) => row.ciudad,
      sortable: true,
      width: '150px',
    },
    {
      id: "options",
      name: "Editar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Editar Sucursal" className='btn btn-sm btn-primary' onClick={(e) => {
            setSelectedUser(row)
            setShowModal(true)
          }}>
            <FiIcons.FiEdit />
          </button>
        </div>
      ),
      width: '70px'
    },
    {
      id: "delete",
      name: "Eliminar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Eliminar Sucursal" className='btn btn-sm btn-danger ' onClick={(e) => {
            /* setSelectedUser(row) */
            Swal.fire({
              title:'¿Esta segur@?',
              icon:'question',
              text:`Se eliminará la Sucursal "${row.nombreSucursal.toUpperCase()}" de la base de datos`,
              showCancelButton:true,
              showConfirmButton:true,
              cancelButtonColor:'grey',
              confirmButtonColor:'#D92121',
              confirmButtonText:'Si, eliminar'
            }).then((result)=>{
              if(result.isConfirmed){
                deleteSucursalByName(row.nombreSucursal)
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
  
  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4 ' style={{width:1070,height:400,backgroundColor:'white'}} >
      <DataTable
        className="bg-light text-center border border-2 h-100"
        style={{fontSize:20 , height:450}}
        columns={columns}
        data={users}
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
          <div style={{padding: 24}}>No hay ningún registro en la base de datos...</div>}  
      />
    </div>
    </div>
  )
}

/* import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import useAlert from '../../hooks/useAlert';
import Swal from 'sweetalert2';
import { MdDelete } from "react-icons/md";
import { deleteUserByName } from '../../services/userService';
import { deleteUSucursalByName } from '../../services/sucursalService'
import { MdDeleteOutline } from "react-icons/md";

export default function TableSucursales({ users, loading, setSelectedUser, setShowModal }) {

  const { successAlert } = useAlert()
  const columns = [
    {
      id: "cedula",
      name: "Código siesa",
      selector: (row) => row.cedula,
      sortable: true,
      width: '145px',
    },
    {
      id: "codigoSucursal",
      name: "Cód. sucursal",
      selector: (row) => row.codigoSucursal,
      sortable: true,
      width: '250px'
    },
    {
      id: "nombreSucursal",
      name: "Nombre Sucursal",
      selector: (row) => row.nombreSucursal,
      sortable: true,
      width: '250px'
    },
    {
      id: "direccion",
      name: "Dirección",
      selector: (row) => row.direccion,
      sortable: true,
      width: '350px'
    },
    {
      id: "ciudad",
      name: "Ciudad",
      selector: (row) => row.ciudad,
      sortable: true,
      width: '120px',
    },
    {
      id: "celular",
      name: "Celular",
      selector: (row) => row.celular,
      sortable: true,
      width: '120px',
    },
    {
      id: "correoFacturaElectronica",
      name: "Correo F.E",
      selector: (row) => row.correoFacturaElectronica,
      sortable: true,
      width: '120px',
    },
    {
      id: "nombreContacto",
      name: "Nombre Contacto",
      selector: (row) => row.nombreContacto,
      sortable: true,
      width: '120px',
    },
    {
      id: "celularContacto",
      name: "Celular Contacto",
      selector: (row) => row.celularContacto,
      sortable: true,
      width: '120px',
    },
    {
      id: "correoContacto",
      name: "Correo Contacto",
      selector: (row) => row.correoContacto,
      sortable: true,
      width: '120px',
    },
    {
      id: "options",
      name: "Editar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Editar Sucursal" className='btn btn-sm btn-primary' onClick={(e) => {
            setSelectedUser(row)
            setShowModal(true)
          }}>
            <FiIcons.FiEdit />
          </button>
        </div>
      ),
      width: '70px'
    },{
      id: "delete",
      name: "Eliminar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Eliminar Sucursal" className='btn btn-sm btn-danger ' onClick={(e) => {
            setSelectedUser(row)
            Swal.fire({
              title:'¿Esta segur@?',
              icon:'question',
              text:`Se eliminará la Sucursal "${row.name.toUpperCase()}" de la base de datos`,
              showCancelButton:true,
              showConfirmButton:true,
              cancelButtonColor:'grey',
              confirmButtonColor:'#D92121',
              confirmButtonText:'Si, eliminar'
            }).then((result)=>{
              if(result.isConfirmed){
                deleteUSucursalByName(row.name)
                .then(()=>{
                  Swal.fire({
                    title:'Eliminado',
                    text:`Usuari@ "${row.name.toUpperCase()}" eliminado con éxito`,
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
                    text:'Ha ocurrido un error al borrar el usuario, intentalo de nuevo. Si el problema persiste, comunicate con el área de sistemas',
                    icon:'error',
                    showConfirmButton:'true',
                    confirmButtonColor:'green'
                  })
                })
              }
            })
          }}>
            <MdDeleteOutline />
          </button>
        </div>
      ),
      width: '80px'
    }
  ]
  
  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded" style={{userSelect:'none'}}
    >
    <div className='rounder-4'>
    <div className='login-wrapper rounder-4' style={{width:1050,height:400}} >
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
          <div style={{padding: 24}}>En este momento no hay sucursales en la base de datos...</div>}  
      />
    </div>
    </div>
    </div>
  )
} */