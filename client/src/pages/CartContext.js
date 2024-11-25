// import React, { createContext, useState, useContext, useEffect } from 'react';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     // Obtener el carrito del localStorage al inicializar
//     const storedCart = localStorage.getItem('cart');
//     return storedCart ? JSON.parse(storedCart) : [];
//   });

//   useEffect(() => {
//     // Guardar el carrito en localStorage cada vez que se actualiza
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = (product, quantity) => {
//     setCart((prevCart) => {
//       const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
//       if (existingItemIndex > -1) {
//         // Si el producto ya está en el carrito, actualiza la cantidad
//         const updatedCart = [...prevCart];
//         updatedCart[existingItemIndex].cantidad += quantity;
//         return updatedCart;
//       }
//       // Si el producto no está en el carrito, añade un nuevo objeto
//       return [...prevCart, { ...product, cantidad: quantity }];
//     });
//   };

//   const updateItemQuantity = (id, quantity) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.map((item) =>
//         item.id === id ? { ...item, cantidad: quantity } : item
//       );
//       return updatedCart;
//     });
//   };

//   const removeItemFromCart = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => item.id !== id));
//   };

//   const cartCount = cart.reduce((total, item) => total + item.cantidad, 0);

//   const value = { cart, setCart, addToCart, updateItemQuantity, removeItemFromCart, cartCount };

//   return (
//     <CartContext.Provider value={value}>
//       {children}
//     </CartContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    const storedCart = user ? localStorage.getItem(`cart_${user.id}`) : null;
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    if (user) {
      // Actualiza el carrito en localStorage cada vez que cambia el estado
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].cantidad += quantity;
        return updatedCart;
      }
      // Añadir nuevo producto al carrito
      return [...prevCart, { ...product, cantidad: quantity }];
    });
  };

  const updateItemQuantity = (id, quantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === id ? { ...item, cantidad: quantity } : item
      );
    });
  };

  const removeItemFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    const user = JSON.parse(sessionStorage.getItem('usuario'));
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  // Calcular el número total de artículos en el carrito
  const cartCount = cart.reduce((total, item) => total + item.cantidad, 0);

  const value = { cart, setCart, addToCart, updateItemQuantity, removeItemFromCart, clearCart, cartCount };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
