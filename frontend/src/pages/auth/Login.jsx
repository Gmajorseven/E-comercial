import axios from 'axios'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const actionLogin = useEcomStore((c) => c.actionLogin)
  const user = useEcomStore((c) => c.user)
  const navigate = useNavigate()

  const [ form, setForm ] = useState({
    email: '',
    password: ''
  })

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  
  }

  const handleSubmit = async(e) => {
    
    e.preventDefault()
    try {
      const res = await actionLogin(form)
      const role = res.data.payload.role
      console.log(role)
      roleRedirect(role)
      toast.success('Welcome back!')
    } catch (error) {
      const errMsg = error.response?.data?.msg
      toast.error(errMsg)
      console.log(error)   
    }

  }

  const roleRedirect = (role) => {
    role === 'admin' ? navigate('/admin') : navigate('/user')
  }

  return (
    <div>
      Login
      <form onSubmit={handleSubmit}>
        Email:
        <input type="email" className='border'
          name='email' onChange={handleOnChange}
        />
        Password:
        <input type="password" className='border'
          name='password' onChange={handleOnChange}
        />
        <button className='bg-black rounded-md text-white'>Login</button>

      </form>
    </div>
  )
}

export default Login