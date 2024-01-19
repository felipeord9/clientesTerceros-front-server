import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'
import Swal from 'sweetalert2';
import { MdDeleteOutline } from "react-icons/md";
import { deleteByCedula } from '../../services/proveedorService';
import { useState } from 'react';

export default function TableProveedores({ proveedores, loading }) {
  const columns = [
    {
      id: "delete",
      name: "Eliminar",
      center: true,
      cell: (row, index, column, id) => (
        <div className='d-flex gap-2 p-1'>
          <button title="Eliminar proveedor" className='btn btn-sm btn-danger ' onClick={(e) => {
            /* setSelectedTercero(row) */
            Swal.fire({
              title:'¿Esta segur@?',
              icon:'question',
              text:`Se eliminará el proveedor de nombre "${row.razonSocial}" y número de identifiación "${row.cedula}"de la base de datos`,
              showCancelButton:true,
              showConfirmButton:true,
              cancelButtonColor:'grey',
              confirmButtonColor:'#D92121',
              confirmButtonText:'Si, eliminar'
            }).then((result)=>{
              if(result.isConfirmed){
                deleteByCedula(row.cedula)
                .then(()=>{
                  Swal.fire({
                    title:'Eliminado',
                    text:`Proveedor "${row.razonSocial}" eliminado con éxito`,
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
                    text:'Ha ocurrido un error al borrar el proveedor, intentalo de nuevo. Si el problema persiste, comunicate con el área de sistemas',
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
    },
    {
      id: "tipoPersona",
      name: "TipoP",
      selector: (row) => row.tipoPersona,
      sortable: true,
      width: '95px'
    },
    {
      id: "cedula",
      name: "Código siesa",
      selector: (row) => row.cedula,
      sortable: true,
      width: '160px'
    },
    {
      id: "tipoDocumento",
      name: "TipoDoc",
      selector: (row) => row.tipoDocumento,
      sortable: true,
      width: '110px',
    }, 
    {
      id: "razonSocial",
      name: "Razon social",
      selector: (row) => row.razonSocial,
      sortable: true,
      width: '350px',
    },
    {
        id: "departamento",
        name: "Dpto",
        selector: (row) => row.departamento,
        sortable: true,
        width: '90px'
      },
      {
        id: "ciudad",
        name: "City",
        selector: (row) => row.ciudad,
        sortable: true,
        width: '100px',
      }, {
        id: "direccion",
        name: "Direccion",
        selector: (row) => row.direccion,
        sortable: true,
        width: '300px',
      },{
        id: "celular",
        name: "# Celular",
        selector: (row) => row.celular,
        sortable: true,
        width: '150px',
      },{
        id: "telefono",
        name: "# Telefónico",
        selector: (row) => row.telefono,
        sortable: true,
        width: '130px',
      },
      {
        id: "correoElectronico",
        name: "Correo Electrónico",
        selector: (row) => row.correoElectronico,
        sortable: true,
        width: '300px',
      },{
        id: "actividadEconomica",
        name: "Actividad eco.",
        selector: (row) => row.actividadEconomica,
        sortable: true,
        width: '150px',
      },
      {
        id: "correoFacturaElectronica",
        name: "Correo Factura Electrónica",
        selector: (row) => row.correoFacturaElectronica,
        sortable: true,
        width: '300px',
      },
      {
        id: "nameRep",
        name: "NombreRepLegal",
        selector: (row) => row.nameRepLegal,
        sortable: true,
        width: '150px',
      },
      {
        id: "apellidoRepLegal",
        name: "Apellido rep",
        selector: (row) => row.apellidoRepLegal,
        sortable: true,
        width: '150px',
      },
      {
        id: "tipoDocRepLegal",
        name: "TipDocRep",
        selector: (row) => row.tipoDocRepLegal,
        sortable: true,
        width: '120px',
      },
      {
        id: "numeroDocRepLegal",
        name: "# Doc",
        selector: (row) => row.numeroDocRepLegal,
        sortable: true,
        width: '120px',
      },
      {
        id: "solicitante",
        name: "Solicitante",
        selector: (row) => row.solicitante,
        sortable: true,
        width: '200px'
      },
      {
        id: "observaciones",
        name: "Observaciones",
        selector: (row) => row.observations,
        sortable: true,
        width: '250px',
      },
      {
        id: "agencia",
        name: "Agencia",
        selector: (row) => row.agencia,
        sortable: true,
        width: '110px',
      },{
        id: "tipoFormulario",
        name: "TipoFor",
        selector: (row) => row.tipoFormulario,
        sortable: true,
        width: '120px',
      },{
        id: "docVinculacion",
        name: "Vincula",
        selector: (row) => row.docVinculacion,
        sortable: true,
        width: '100px',
      },
      {
        id: "docComprAntc",
        name: "ComprAntc",
        selector: (row) => row.docComprAntc,
        sortable: true,
        width: '120px',
      },
      {
        id: "docRut",
        name: "Rut",
        selector: (row) => row.docRut,
        sortable: true,
        width: '100px',
      },
      {
        id: "docCcio",
        name: "Ccio",
        selector: (row) => row.docCcio,
        sortable: true,
        width: '100px',
      },
      {
        id: "docCrepL",
        name: "CrepL",
        selector: (row) => row.docCrepL,
        sortable: true,
        width: '100px',
      },
      {
        id: "docEf",
        name: "Ef",
        selector: (row) => row.docEf,
        sortable: true,
        width: '100px',
      },
      {
        id: "docRefcom",
        name: "Refcom",
        selector: (row) => row.docRefcom,
        sortable: true,
        width: '110px',
      },
      {
        id: "docRefcom2",
        name: "Refcom2",
        selector: (row) => row.docRefcom2,
        sortable: true,
        width: '120px',
      },
      {
        id: "docRefcom3",
        name: "Refcom3",
        selector: (row) => row.docRefcom3,
        sortable: true,
        width: '120px',
      },
      {
        id: "docInfemp",
        name: "Infemp",
        selector: (row) => row.docInfemp,
        sortable: true,
        width: '100px',
      },
      {
        id: "docInfrl",
        name: "Infrl",
        selector: (row) => row.docInfrl,
        sortable: true,
        width: '100px',
      },
      {
        id: "docValAnt",
        name: "ValAnt",
        selector: (row) => row.docValAnt,
        sortable: true,
        width: '100px',
      },
      {
        id: "docCerBan",
        name: "CerBan",
        selector: (row) => row.docCerBan,
        sortable: true,
        width: '110px',
      },
      {
        id: "docOtros",
        name: "Otros",
        selector: (row) => row.docOtros,
        sortable: true,
        width: '100px',
      },
      {
        id: "Create by",
        name: "Creado por",
        selector: (row) => row.userName,
        sortable: true,
        width: '150px',
      },{
        id: " createdAt",
        name: "FechaCreación",
        selector: (row) => row.createdAt,
        sortable: true,
        width: '200px',
      }
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
        data={proveedores}
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
  )
}