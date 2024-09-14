import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../../services/api';
import './Login.css'

function Login() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {

    const res = await handleLogin(username, otp)
    console.log(res)

    if(res.status===200)
    navigate('./quotes')
  };

  return (
    <div className='login-container'>
      <div className="container">
          <h1>Login</h1>
          <div className="input-box">
            <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
            <i className='bx bx-envelope'></i>
          </div>

          <div className="input-box">
            <input type="password" placeholder="Password" onChange={(e)=>setOtp(e.target.value)} />
            <i className='bx bx-lock-alt' ></i>
          </div>
          <button className="btn"  onClick={()=>login()}>Login</button>
      </div>

    </div>
  );
}

export default Login;
