import Link from 'next/link'
import React from 'react'

const Header = () => {
   return (

      <header>
         <nav className="navbar justify-between bg-base-300">
            <Link href="/" className="btn btn-ghost text-lg">
               Next Amazon
            </Link>

            <ul className="flex">
               <li>
                  <Link href="/cart" className='btn btn-ghost rounded-btn'>CART</Link>
               </li>
               <li>
                  <Link href="/signin" className='btn btn-ghost rounded-btn'>SIGN IN</Link>
               </li>
            </ul>
         </nav>
      </header>
   )
}

export default Header 