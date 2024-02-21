import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import { useState , useEffect } from 'react';
import * as React from 'react';
import { getAllAgencies } from '../../services/agencyService'
import { FaEye } from "react-icons/fa6";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getAllTipoFormularios } from "../../services/tipoFormularioService";

const styleStatus = {
  "Pendiente": "warning",
  "Rechazado": "danger",
  "Aprobado": "success",
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  justifyContent:'center',
  boxShadow: 24,
  p: 4,
  borderRadius:5
};

export default function TablaSolicitudes({ solicitudes, loading , customStyles , setSelectedTercero , setShowModal}) {
  const [agencias,setAgencias] = useState([]);

  const [open,setOpen]=useState(false);
  const handleOpen=()=>{
    setOpen(true);
  }
  const handleClose=()=>{
    setOpen(false);
  }

  const [formularios,setFormularios] = useState([])

  useEffect(()=>{
    getAllAgencies().then((data) => setAgencias(data));
    getAllTipoFormularios().then((data) => setFormularios(data));

  },[])

  const conditionalCellStyles  = [
    {
      when: cell => cell === 'Pendiente',
      style: {
        color: 'green',
      },
    },
    {
      when: cell => cell === 'Rechazado',
      style: {
        color: 'red',
      },
    },
  ];
  const columns = [
    {
      id:'cedula',
      name:'NIT',
      cell: (row) =>(row.cedula),
      width:'120px',
      sortable: true
    },{
      id:'razonSocial',
      name:'Razon Social',
      cell: (row) =>(row.razonSocial),
      width:'350px',
      sortable: true
    },{
      id:'agencia',
      name:'Agencia',
      cell: (row) =>{
        const buscar = agencias.find(item=>item.id===row.agencia)?.description;
        return buscar || 'N/A';
      },
      width:'250px',
      sortable: true
    },
    {
      id:'solicitante',
      name:'Solictante',
      cell: (row) =>(row.solicitante),
      width:'200px',
      sortable: true
    },
    {
      id:'tipoFormulario',
      name:'Tipo Formulario',
      cell: (row) =>{
        const buscar = formularios.find(item=>item.id===row.tipoFormulario)?.description;
        return buscar || 'N/A';
      },
      width:'350px',
      sortable: true
    },
    {
      id:'estado',
      name:'Estado',
      cell: (row)=> row.pendiente === '1' && (
        <label style={{color:'orange', textAlign:'center'}}>Pendiente</label>
      ) || row.rechazado === '1' &&(
        <label style={{color:'red'}}>Rechazado</label>
      ) || row.aprobado === '1' && (
        <label style={{color:'green'}}>Aprobado</label>
      ), 
      width:'120px',
      sortable: true,
      conditionalCellStyles
    },
    {
      id:'Detalles',
      name:'Detalles',
      cell: (row, index, column, id) =>(
        <div className='d-flex'>
          <Button variant='contained' title="Ver Información" 
            onClick={(e)=>(setSelectedTercero(row),setShowModal(true))}
            type='submit'
            className=''
            >
            <FaEye />
          </Button>
        </div>
      ),
      width:'130px',
      sortable: true,
      customStyles:{
        style:{
          
        }
      }
    }

  ]
  
  const updateState = (e, order) => {
    const { value } = e.target;
    console.log(value)
    const optionId = e.target.selectedOptions[0].id
      /* return updateOrder(order.id, {
        state: value,
      }) */
  };

  return (
    <div
      className="wrapper justify-content-center d-flex flex-column rounded w-100 h-100" style={{userSelect:'none',fontSize:20}}
    >
    <div className='login-wrapper justify-content-center shadow border border-2 rounded-4 ' style={{width:1000,height:400,backgroundColor:'white'}} >
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{fontSize:20}}
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
        noDataComponent={
          <div style={{padding: 24}}>Ningún resultado encontrado...</div>
        }
        /* pagination
        paginationComponentOptions={{
          rangeSeparatorText: "de",
          selectAllRowsItem: false,
        }} */
      />
      </div>
    </div>
  )
}