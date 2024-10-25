import { useState, useEffect } from 'react'
import React from 'react'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import { readProduct, updateProduct } from '../../api/Product'
import Uploadfile from './Uploadfile'
import { useParams, useNavigate } from 'react-router-dom'

const initialState = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: null,
    images: []
}

const FormEditProduct = () => {
    const token = useEcomStore((c) => c.token)
    const getCategory = useEcomStore((c) => c.getCategory)
    const categories = useEcomStore((c) => c.categories)

    const { id } = useParams()
    const navigate = useNavigate()

    const [state, setState] = useState(initialState)

    //console.log(products)

    useEffect(() => {
        getCategory(token)
        fetchProduct(token, id)

    }, [])

    const fetchProduct = async(token, id) => {
        try {
            const res = await readProduct(token, id)
            setState(res.data)
            
        } catch (error) {
            console.log('Error, fetch data',error)
        }
    }

    const handleOnchange = (e) => {

        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (state.title == '') {
                return toast.warning('Please Enter Title!')
            }

            if (state.description == '') {
                return toast.warning('Please Enter Description!')
            }

            if (state.price == '') {
                return toast.warning('Please Enter Price!')
            }

            if (state.quantity == '') {
                return toast.warning('Please Enter Quantity!')
            }

            const res = await updateProduct(token, id, state)
            toast.success(`Update ${res.data.title} successful!`)
            navigate('/admin/product')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='container mx-auto p-4 bg-white'>
            <form onSubmit={handleSubmit}>
                <h1>Update Product Detail</h1>
                <p>Title:</p>
                <input
                    type="text" className='botder' value={state.title}
                    onChange={handleOnchange} placeholder='Title' name='title' />
                <p>Description:</p>
                <input
                    type="text" className='botder' value={state.description}
                    onChange={handleOnchange} placeholder='Description' name='description' />
                <p>Price:</p>
                <input
                    type="number" className='botder' value={state.price}
                    onChange={handleOnchange} placeholder='Price' name='price' />
                <p>Quantity:</p>
                <input
                    type="number" className='botder' value={state.quantity}
                    onChange={handleOnchange} placeholder='Quantity' name='quantity' />
                <p>Category:</p>
                <select name="categoryId" className='border rounded-md' onChange={handleOnchange} >
                    <option value={null} >Select Category</option>
                    {
                        categories.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)
                    }
                </select>
                <hr />
                {/*Upload File*/}
                <Uploadfile state={state} setState={setState} />

                <button className='bg-black text-white p-1 rounded-md font-medium'>Update Product</button>
                <hr />
                <br />

            </form>
        </div>
    )
}

export default FormEditProduct