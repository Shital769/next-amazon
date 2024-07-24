import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

const Header = () => {
   return (

      <header>
         <nav className="navbar justify-between bg-base-300">
            <Link href="/" className="btn btn-ghost text-lg">
               Next Amazon
            </Link>
            <Menu />
         </nav>
      </header>
   )
}

export default Header;