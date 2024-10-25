import React, { useState, useEffect } from 'react'
import { createCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

const FormCategory = () => {

  const token = useEcomStore((c) => c.token)
  const [name, setName] = useState('')
  //const [categories, setCategories] = useState([])
  const categories = useEcomStore((c) => c.categories)
  const getCategory = useEcomStore((c) => c.getCategory)

  useEffect(() => {
    getCategory(token)
  }, [])

  const handleSubmit = async(e) => {
    e.preventDefault()
    if (!name) {
      return toast.warning('Please enter data!')
    }
    try {
      const res = await createCategory(token, { name })
      toast.success(res.data.msg)
      getCategory(token)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemove = async(token, id) => {
    console.log(id)
    try {
      const res = await removeCategory(token, id)
      toast.success(res.data.msg)
      getCategory(token)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='container mx-auto p-4 bg-white'>
      <h1>Category Management</h1>
      <form className='my' onSubmit={handleSubmit}>
        <input type="text" className='border'
          onChange={(e) => setName(e.target.value)} />
        <button className='bg-black text-white rounded-md font-medium'>Add Category</button>
      </form>
      <ul className='list-none'>
        {
          categories.map((item, index) =>
            <li key={index}
              className='flex justify-between my-2'>
              <span>
                {item.name}
              </span>
              <button onClick={() => handleRemove(token, item.id)} className='bg-red-500 p-1 text-white rounded-md font-medium'>Delete</button>
            </li>
          )
        }
      </ul>

    </div>
  )
}

export default FormCategory