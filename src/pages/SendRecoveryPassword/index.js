import { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useUser from '../../hooks/useUser';
import { sendRecovery } from '../../services/authService';
import Logo from '../../assest/logo-gran-langostino.png'
import './styles.css'
import { GiSandsOfTime } from "react-icons/gi";

export default function SendRecoveryPassword() {
  const { isLogged } = useUser()
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [cargando,setCargando] = useState(false)

  useEffect(() => {
    if (isLogged) navigate('/inicio');
  }, [isLogged, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault()
    setCargando(true)
    sendRecovery(email)
      .then((data) => {
        setCargando(false)
        Swal.fire({
          title: "¡CORECTO!",
          text: "Se te acaba de enviar el enlace de recuperación, revisa tu correo y sigue los pasos para reestablecer tu contraseña (Tienes 15 minutos para llevar a cabo este proceso)",
          icon: 'success',
          confirmButtonText: "Aceptar",
          confirmButtonColor:'green'
        })
        navigate('/login')
      })
      .catch((error) => {
        Swal.fire({
          title:'¡Uops!',
          text:'Ha ocurrido un error a la hora de mandar el correo electrónico. Verificalo y vuelve a intentarlo. Si el problema persiste comunicate con el área de sistemas.',
          showConfirmButton:true,
          confirmButtonText:'OK',
          confirmButtonColor:'#D92121'
        })
      })
  }

  return (
    <div className=" wrapper d-flex justify-content-center align-items-center vh-100 w-100 m-auto" style={{userSelect:'none'}}>
      <div className='rounder-4'>
      <div className='login-wrapper p-2 shadow border-light rounded-4 border border-1 bg-gradient d-flexjustify-content-between' style={{backgroundColor:'white'}}>
      <img src={Logo} alt=''/>
      <h1 style={{color:'black'}}><strong>Validar correo</strong></h1>
      <form onSubmit={handleSubmit}>
        <div className='input_group m-3 '>
          <input type='text' id='usuario' va className='input_group_input' required onChange={(e)=> setEmail(e.target.value)}/>
          <label for="usuario" className='input_group_label'>Correo electrónico</label>
        </div>
        <div className='align-content-center text-align-center align-items-center'>
          <center>
          <button type="submit"><strong>{cargando ? <strong>Cargando... <GiSandsOfTime /></strong>:<strong>Entrar</strong>}</strong></button>
          </center>
        </div>
        <center>
        <label><a href='/login' className='text-decoration-none' style={{fontSize:'medium'}}><strong>Volver al login</strong></a></label>
        </center>
      </form>
    </div>
    </div>
    </div>
    
  )
}