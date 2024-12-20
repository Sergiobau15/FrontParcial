import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <div className="relative flex items-center">
      <Link to="/Cart" className="flex items-center text-white hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <span className={`ml-2 ${cartCount > 0 ? 'mr-8' : ''}`}>Mi carrito</span>
      </Link>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
          {cartCount}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
