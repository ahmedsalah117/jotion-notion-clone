"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Error = () => {
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src="/error.svg" alt="Error" width={300} height={300} className='dark:hidden' />
      <Image src="/error-dark.svg" alt="Error" width={300} height={300} className='hidden dark:block' />
      <div className='flex flex-col items-center space-y-2'>
        <h2 className='text-xl font-semibold mb-4'>Something went wrong!</h2>
        <Button asChild>
         <Link href="/documents">
          Go back
         </Link>
        </Button>
      </div>
    </div>
  )
}

export default Error