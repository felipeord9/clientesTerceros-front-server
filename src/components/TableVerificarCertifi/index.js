import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2';
import { MdDeleteOutline } from "react-icons/md";
import { deleteByCedula } from '../../services/clienteService';
import { useState } from 'react';

export default function TableVerificarCertifi({ certificados, loading , customStyles }) {
  const [selectedCliente, setSelectedTercero] = useState();
  const columns = [
    {
      id: "tercero",
      name: "NIT",
      selector: (row) => row.tercero,
      sortable: true,
      width: '120px',
    },
    {
      id: "nombreTercero",
      name: "Nombre",
      selector: (row) => row.nombreTercero,
      sortable: true,
      width: 'auto',
    },
    {
      id: "concepto",
      name: "Concepto",
      selector: (row) => row.concepto,
      sortable: true,
      width: '270px',
    },
    {
      id: "tipoCertificado",
      name: "Tipo",
      selector: (row) => row.tipoCertificado,
      sortable: true,
      width: '100px'
    },
    {
      id: "correoEnvio",
      name: "Correo",
      selector: (row) => row.correoEnvio,
      sortable: true,
      width: 'auto'
    },
    {
      id: "usuarioEnvio",
      name: "Envió",
      selector: (row) => row.usuarioEnvio,
      sortable: true,
      width: '120px'
    },
  ]
  
  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4 ' style={{width:1000,height:400,backgroundColor:'white'}} >
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{fontSize:20}}
        columns={columns}
        data={certificados}
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