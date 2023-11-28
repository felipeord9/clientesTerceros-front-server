import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import * as Bs from "react-icons/bs";
import { changeRecoveryPassword } from '../../services/authService';
import Logo from '../../assest/logo-gran-langostino.png'
import './styles.css'

export default function RecoveryPassword() {
    const { isLogged } = useUser()
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorInput, setErrorInput] = useState('')
    const { token } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
      if (isLogged) navigate('/inicio');
    }, [isLogged, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault()
    if(newPassword !== confirmNewPassword) {
      setErrorInput('La contraseña nueva no coincide')
      return setTimeout(() => setErrorInput (''), 3000)
    }
    changeRecoveryPassword({token, newPassword})
      .then((data) => {
        Swal.fire({
          title: "¡CORECTO!",
          text: "La contraseña se ha cambiado exitosamente.",
          icon: 'success',
          confirmButtonText: "Aceptar",
          timer: 3000
        })
        navigate('/login')
      })
      .catch((error) => {
        setErrorInput('El token ha expirado, será redirigido al login')
        return setTimeout(() => navigate('/login'), 4000)
      })
  }
  const [shown,setShown]=useState("");
  const switchShown =()=>setShown(!shown);

  const [mostrar,setMostrar]=useState('');
  const switchMostart=()=>setMostrar(!mostrar);
  return (
    <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto " style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 shadow-lg border-light rounded-4 border border-3 bg-gradient d-flexjustify-content-between ' style={{backgroundColor:'white'}}>
      <img src={Logo} alt=''/>
      <h1 style={{color:'black'}}><strong>Cambiar contraseña</strong></h1>
      <form onSubmit={handleSubmit} className=''>
        <div className='input_group m-3 '>
          <input type={shown ? 'text':'password'} id='contraseña' className='input_group_input' required onChange={(e)=> setNewPassword(e.target.value)}/>
          <label for="contraseña" className='input_group_label'>Nueva contraseña</label>
          <span className='position-absolute' onClick={switchShown}  style={{ right: 10, cursor: "pointer",fontSize:25 }}>{shown ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
        </div>
        <div className='input_group m-3 d-flex flex-column'>
          <input type={mostrar ? 'text':'password'} id='confirm' onChange={(e)=>setConfirmNewPassword(e.target.value)} className='input_group_input' required/>
          <label for='confirm' className='input_group_label'>Ingresar de nuevo</label>
          <span className='position-absolute' onClick={switchMostart}  style={{ right: 10, cursor: "pointer",fontSize:25 }}>{mostrar ? <Bs.BsEye/>:<Bs.BsEyeSlash/>}</span>
        </div>
        <div className='align-content-center text-align-center align-items-center'>
          <center>
          <button type="submit"><strong>Reestablecer</strong></button>
          </center>
        </div>
      </form>
    </div>
    </div>
    </div>
  )
}