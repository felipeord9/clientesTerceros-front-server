import * as FiIcons from 'react-icons/fi';
import DataTable from 'react-data-table-component'

export default function TableTerceros({ terceros, loading }) {
  const columns = [
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
        id: "correoNotificacion",
        name: "Correo Notificaciones",
        selector: (row) => row.correoNotificaciones,
        sortable: true,
        width: '300px',
      },
      {
        id: "nombreSucursal",
        name: "Sucursal",
        selector: (row) => row.nombreSucursal,
        sortable: true,
        width: '200px',
      },
      {
        id: "direccionSucursal",
        name: "Direccion Sucursal",
        selector: (row) => row.direccionSucursal,
        sortable: true,
        width: '200px',
      },
      {
        id: "departamentoSucursal",
        name: "Dpto",
        selector: (row) => row.departamentoSucursal,
        sortable: true,
        width: '90px',
      },
      {
        id: "ciudadSucursal",
        name: "City",
        selector: (row) => row.ciudadSucursal,
        sortable: true,
        width: '90px',
      },
      {
        id: "celularSucursal",
        name: "Celular Suc",
        selector: (row) => row.celularSucursal,
        sortable: true,
        width: '150px',
      },
      {
        id: "telefonoSucursal",
        name: "Teléfono Suc",
        selector: (row) => row.telefonoSucursal,
        sortable: true,
        width: '150px',
      },
      {
        id: "correoSucursal",
        name: "Correo Sucursal",
        selector: (row) => row.correoSucursal,
        sortable: true,
        width: '300px',
      },
      {
        id: "correoFe",
        name: "Correo Factura",
        selector: (row) => row.correoFacturaElectronica,
        sortable: true,
        width: '300px',
      },
      {
        id: "regimen",
        name: "Regimen",
        selector: (row) => row.regimenFiscal,
        sortable: true,
        width: '120px',
      },
      {
        id: "responsabilidad",
        name: "Respo.Fiscal",
        selector: (row) => row.responsabilidadFiscal,
        sortable: true,
        width: '130px'
      },
      {
        id: "detalle",
        name: "Deta.Tributario",
        selector: (row) => row.detalleTributario,
        sortable: true,
        width: '145px'
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
        id: "valorEstimado",
        name: "Valor estimado",
        selector: (row) => row.valorEstimado,
        sortable: true,
        width: '150px',
      },
      {
        id: "precioSugerido",
        name: "Precio Sugerido",
        selector: (row) => row.precioSugerido,
        sortable: true,
        width: '150px',
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
        id: "clasificacion",
        name: "Clasificación",
        selector: (row) => row.clasificacion,
        sortable: true,
        width: '130px',
      },{
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
        id: "docCtalnst",
        name: "Ctalnst",
        selector: (row) => row.docCtalnst,
        sortable: true,
        width: '120px',
      },
      {
        id: "docPagare",
        name: "Pagare",
        selector: (row) => row.docPagare,
        sortable: true,
        width: '100px',
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
        id: "docCvbo",
        name: "Cvbo",
        selector: (row) => row.docCvbo,
        sortable: true,
        width: '100px',
      },
      {
        id: "docFirdoc",
        name: "Firdoc",
        selector: (row) => row.docFirdoc,
        sortable: true,
        width: '100px',
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
        width: '250px',
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
      className="wrapper justify-content-center d-flex flex-column rounded" style={{userSelect:'none',fontSize:20}}
    >
    <div className='rounder-4'>
    <div className='login-wrapper rounder-4' style={{width:1000,height:400}} >
      <DataTable
        className="bg-light text-center border border-2 h-100 w-100"
        style={{fontSize:20}}
        columns={columns}
        data={terceros}
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