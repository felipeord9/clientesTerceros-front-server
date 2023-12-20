import './App.css';
import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContextProvider } from './context/authContext';
import Login from '../src/pages/Login/login'
import Navbar from './components/Navbar';
import RecoveryPassword from './pages/RecoveryPassword';
import SendRecovery from './pages/SendRecoveryPassword'
import Page404 from './pages/Page404'
import ChangePassword from './pages/ChangePassword'
import Inicio from './pages/inicio';
import VariosNatural from './pages/variosNatural';
import Inicio2 from './pages/inicio2';
import PrestadorServicios from './pages/pertadorServicios';
import ConvenioJuridico from './pages/convenioJuridico';
import TipoPersona from './pages/tipoPersona';
import Tipo from './pages/tipo';
import Bitacora from './pages/bitacora'
import ConvenioNatural from './pages/convenioNatural';
import ContadoPersonaNatural from './pages/contadoPN';
import React, { Component } from "react";
import Proveedores from './pages/proveedores';
import VariosJuridico from './pages/variosJuridico';
import InicioAdmin from './pages/inicioAdmin';
import PrivateRoute from '../src/components/PrivateRoute';
import ContadoPersonaJuridica from './pages/contadoPJ';
import CreditoPersonaNatural from './pages/creditoPN';
import CreditoPersonaJuridica from './pages/creditoPJ';
import Users from './pages/Users';
import Terceros from './pages/terceros';
import ValidarTercero from './pages/validarTercero';
import ValidarProveedor from './pages/validarProveedor';
import ValidacionAdmin from './pages/validacion';
import MostartInfo from './pages/mostrarInfo';
import MostrarProveedor from './pages/mostrarProveedor';
import EditarPNC from './pages/editPNC';
import EditarPNCR from './pages/editarPNCR';
import EditarPJC from './pages/editarPJC';
import EditarPJCR from './pages/editarPJCR';
import EditPMN from './pages/editarPMN';
import EditarPMJ from './pages/editarPMJ';
import EditPS from './pages/editarPS';
import EditPVN from './pages/editarPVN';
import EditarPVJ from './pages/editarPVJ';
import MenuPrincipalAdmin from './pages/mpAdmin';
import MenuPrincipalClientes from './pages/mpClientes';
import MenuPrincipalProveedores from './pages/mpProveedores';
import ShowInfoWithRzs from './pages/showWithRzs';
import ShowProveedorWithRzs from './pages/showProRzs';
import MpPrueba from './pages/mpPrueba';

function App() {
  return(
    <AuthContextProvider>
    <Router>
      <Navbar/>
      <div id='wrapper' className="d-flex vh-100 bg-gradient">
      <Routes>
        <Route path='/' element={<Navigate to='/login'/>}/>
        <Route path='/login' element={<Login/>}/>
{/*         <Route path='/recovery/password' element={<RecoveryPassword/>}/>
 */}        <Route path='/send/recovery' element={<SendRecovery/>}/>
        <Route path='/recuperacion/contrasena//:token' element={<RecoveryPassword/>} />

        {/* Validacion de tercero */}
        <Route path='/validar/tercero' element={<PrivateRoute component={ValidarTercero}/>}/>
        <Route path='/validar/Proveedor' element={<PrivateRoute component={ValidarProveedor}/>}/>
        <Route path='/validacion/admin' element={<PrivateRoute component={ValidacionAdmin}/>}/>

        {/* Mostrar validacion */}
        <Route path='/info/validacion' element={<PrivateRoute component={MostartInfo}/>}/>
        <Route path='/info/valid' element={<PrivateRoute component={ShowInfoWithRzs}/>}/>
        <Route path='/informacion/validacion' element={<PrivateRoute component={MostrarProveedor}/>}/>
        <Route path='/informacion/valid' element={<PrivateRoute component={ShowProveedorWithRzs}/>}/>


        {/* Editar informacion validada */}
        <Route path='/editar/info/PNC' element={<PrivateRoute component={EditarPNC}/>}/>
        <Route path='/editar/info/PNCR' element={<PrivateRoute component={EditarPNCR}/>}/>
        <Route path='/editar/info/PJC' element={<PrivateRoute component={EditarPJC}/>}/>
        <Route path='/editar/info/PJCR' element={<PrivateRoute component={EditarPJCR}/>}/>
        <Route path='/editar/info/PMN' element={<PrivateRoute component={EditPMN}/>}/>
        <Route path='/editar/info/PMJ' element={<PrivateRoute component={EditarPMJ}/>}/>
        <Route path='/editar/info/PS' element={<PrivateRoute component={EditPS}/>}/>
        <Route path='/editar/info/PVN' element={<PrivateRoute component={EditPVN}/>}/>
        <Route path='/editar/info/PVJ' element={<PrivateRoute component={EditarPVJ}/>}/>

        {/* menus principales */}
        <Route path='/menu/principal/admin' element={<PrivateRoute component={MenuPrincipalAdmin}/>}/>
        <Route path='/menu/principal/Clientes' element={<PrivateRoute component={MenuPrincipalClientes}/>}/>
        <Route path='/menu/principal/Proveedores' element={<PrivateRoute component={MenuPrincipalProveedores}/>}/>
        <Route path='/menu/principal/Prueba' element={<PrivateRoute component={MpPrueba}/>}/>

        {/* Inicios agencias y cartera */}
        <Route path='/inicio' element={<PrivateRoute component={Inicio}/>}/>

        {/* inicio compras */}
        <Route path='/compras' element={<PrivateRoute component={Inicio2}/>}/>
        {/* ruta proveedor/convenio - natural */}
        <Route path='/tipo/persona' element={<PrivateRoute component={TipoPersona}/>}/>
        <Route path='/proveedor/convenio/natural' element={<PrivateRoute component={ConvenioNatural}/>}/>
        <Route path='/proveedor/convenio/juridica' element={<PrivateRoute component={ConvenioJuridico}/>}/>

        {/* ruta prestador de servicios */}
        <Route path='/prestador/servicios' element={<PrivateRoute component={PrestadorServicios}/>}/>

        {/* ruta proveedor varios  */}
        <Route path='/tipo/proveedor' element={<PrivateRoute component={Tipo}/>}/>
        <Route path='/proveedor/varios/natural' element={<PrivateRoute component={VariosNatural}/>}/>
        <Route path='/proveedor/varios/juridico' element={<PrivateRoute component={VariosJuridico}/>}/>

        {/* inicio admin */}
        <Route path='/inicio/admin' element={<PrivateRoute component={InicioAdmin}/>}/>

        <Route path='/contado/persona/natural' element={<PrivateRoute component={ContadoPersonaNatural}/>}/>
        <Route path='/contado/persona/juridica' element={<PrivateRoute component={ContadoPersonaJuridica}/>}/>
        <Route path='/credito/persona/natural' element={<PrivateRoute component={CreditoPersonaNatural}/>}/>
        <Route path='/credito/persona/juridica' element={<PrivateRoute component={CreditoPersonaJuridica}/>}/>
        <Route path='/change/password' element={<PrivateRoute component={ChangePassword}/>}/>
        <Route path='/usuarios' element={<PrivateRoute component={Users}/>}/>
        <Route path='/terceros' element={<PrivateRoute component={Terceros}/>}/>
        <Route path='/Proveedores' element={<PrivateRoute component={Proveedores}/>}/>
        <Route path='/bitacora' element={<PrivateRoute component={Bitacora}/>}/>
        <Route path='*' element={<Page404/>}/>

      </Routes>
      </div>
    </Router>
  </AuthContextProvider>
);
}

export default App;
