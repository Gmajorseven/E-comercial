import axios from 'axios'
import { toast } from 'react-toastify'
import React, { useState } from 'react'

const Register = () => {
  const [ form, setForm ] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  
  }

  const handleSubmit = async(e) => {
    try {
      e.preventDefault()

      if(form.password !== form.confirmPassword) {
        return toast.error('Password is not match')
      }
      console.log(form)
   
      const res = await axios.post('http://localhost:5000/api/register', form)
      console.log(res)

      toast.success(res.data?.msg)
    } catch (error) {
      const errMsg = error.response?.data?.msg
      toast.error(errMsg)
      console.log(error)
    }
  }

  return (
    <div>
      Register
      <form onSubmit={handleSubmit}>
        Email:
        <input type="email" className='border'
          name='email' onChange={handleOnChange}
        />
        Password:
        <input type="text" className='border'
          name='password' onChange={handleOnChange}
        />
        Confirm Password:
        <input type="text" className='border'
          name='confirmPassword' onChange={handleOnChange}
        />
        <button className='bg-black rounded-md text-white'>Register</button>

      </form>
    </div>
  )
}

export default Register