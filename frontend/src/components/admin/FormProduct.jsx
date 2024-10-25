import { useState, useEffect } from 'react'
import React from 'react'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'
import { createProduct, deleteProduct } from '../../api/Product'
import Uploadfile from './Uploadfile'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'


const initialState = {
    title: '',
    description: '',
    price: '',
    quantity: '',
    categoryId: null,
    images: []
}

const FormProduct = () => {
    const token = useEcomStore((c) => c.token)
    const getCategory = useEcomStore((c) => c.getCategory)
    const categories = useEcomStore((c) => c.categories)
    const getProduct = useEcomStore((c) => c.getProduct)
    const products = useEcomStore((c) => c.products)

    const [state, setState] = useState({
        title: '',
        description: '',
        price: '',
        quantity: '',
        categoryId: null,
        images: []
    })

    useEffect(() => {
        getCategory(token)
        getProduct(token)
    }, [])

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

            const res = await createProduct(token, state)
            setState(initialState)
            getProduct(token)

            toast.success(`Added ${res.data.title} successful!`)
            

        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async(id) => {
        
        if(window.confirm('Are you sure to Delete?')) {
            try {
                const res = await deleteProduct(token, id)
                toast.success(res.data.msg)
                getProduct(token)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className='container mx-auto p-4 bg-white'>
            <form onSubmit={handleSubmit}>
                <h1>Add Product Detail</h1>
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

                <button className='bg-black text-white p-1 rounded-md font-medium'>Add Product</button>
                <hr />
                <br />

                <table className="table table-striped w-full border">
                    <thead>
                        <tr className='bg-gray-200 border'>
                            <th scope="col">No.</th>
                            <th scope='col'>Image</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Sold</th>
                            <th scope="col">Updated At</th>
                            <th scope="col">Manage</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            products.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            {
                                                item.images.length > 0
                                                    ? <img src={item.images[0].url} className='w-24 h24 rounded-lg shadow-md' />
                                                    : <div className='w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm'>No Image</div>
                                            }
                                        </td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.sold}</td>
                                        <td>{item.updatedAt}</td>
                                        <td className='flex gap-1'>
                                            <p className='bg-black text-white rounded-md p-1 shadow-md text-center'>
                                                <Link to={'/admin/product/' + item.id}><Pencil />  Edit</Link>
                                            </p>
                                            <p onClick={() => handleDelete(item.id)} className='bg-red-500 text-center p-1 rounded-md shadow-md text-white'>
                                                Delete
                                            </p>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </form>
        </div>
    )
}

export default FormProduct