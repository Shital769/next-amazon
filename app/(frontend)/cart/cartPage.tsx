import React from 'react'
import { Metadata } from 'next'
import CartDetails from './cartDetails'

export const metadata = {
   title: "Shopping Cart",
}

const CartPage = () => {
   return <CartDetails />
}
export default CartPage;