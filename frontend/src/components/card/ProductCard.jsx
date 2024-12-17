import React from 'react'
import { ShoppingCart } from 'lucide-react';


const ProductCard = () => {
  return (
    <div className='border rounded-md shadow-md p-2 w-52'>
      <div>
        <div className='w-full h-24 bg-gray-100 rounded-md text-center flex items-center justify-center shadow-md'>
          No Image
        </div>
      </div>
      <div className='py-2'>
        <p className='text-xl font-bold'>Title</p>
        <p className='text-sm text-gray-500'>Description</p>
      </div>
      <div className='flex justify-between items-end'>
        <span className='text-sm font-bold'>price</span>
        <button className='bg-blue-500 rounded-md p-2 hover:bg-blue-600 shadow-md '><ShoppingCart /></button>
      </div>
    </div>
  )
}

export default ProductCard