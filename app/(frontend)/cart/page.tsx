import React from 'react'
import CartDetails from './cartDetails'
import { Metadata } from 'next'

export const metadata: Metadata = {
   title: "Shopping Cart",
}

const CartPage = () => {
   return <CartDetails />
}
export default CartPage;