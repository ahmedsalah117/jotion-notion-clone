"use client"
import useScrollTop from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import React from 'react'
import Logo from './Logo'
import { ModeToggle } from '@/components/ModeToggle'


const Navbar = () => {
  const scrolled = useScrollTop()
  return (
    
    <nav className={cn("fixed top-0 z-50 flex items-center backdrop-blur-sm transition-all w-full p-6 dark:bg-[#1F1F1F]", scrolled && "border-b shadow-sm")}>

      <Logo />
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-6'>
        

      <ModeToggle/>
      </div>
    </nav>
  )
}

export default Navbar