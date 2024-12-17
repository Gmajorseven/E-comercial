import React from 'react'
import ProductCard from '../components/card/ProductCard'

const Shop = () => {
  return (
    <div className='flex'>

      {/* SearchBar */}
      <div className='w-1/4 p-4 bg-gray-100 h-screen'>
        Searchbar
      </div>


      {/* Product */}
      <div className='w-1/2 p-4 h-screen overflow -y-auto'>
        <p className='text-2xl font-bold mb-4'>Total Products</p>
        <div className='flex gap-4'>
          {/* Product Card */}
          <ProductCard />
          {/* Product Card */}
        </div>
      </div>

      {/* Cart */}
      <div className='w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto'>
        Cart
      </div>

    </div>
  )
}

export default Shop