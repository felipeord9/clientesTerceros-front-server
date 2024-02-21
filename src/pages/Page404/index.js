import Logo from '../../assest/logo-gran-langostino.png'

export default function Page404() {
  return (
    <div className=" wrapper d-flex flex-row justify-content-center align-items-center vh-100 w-100 m-auto">
      <div className='rounder-4'>
      <div className='d-flex flex-row p-2 m-2'>
      <img src={Logo} alt=''/>
      <div >
      <center>
      <label className='' style={{fontSize:120,color:'black'}}>¡¡ERROR!!</label>
      <h2>404 - page no found</h2>
      </center>
      </div>
    </div>
    </div>
    </div>
  )
}