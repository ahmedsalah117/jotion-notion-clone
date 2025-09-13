import Image from "next/image";
import {Poppins} from "next/font/google";
import React from 'react'
import {cn} from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/images/logo_light.png" alt="Logo" width={80} height={80} className="dark:hidden"/>
      <Image src="/images/logo_dark.png" alt="Logo" width={80} height={80} className="hidden dark:block"/>
      <p className={cn("font-semibold -ml-8", font.className)}>Jotion</p>
    </div>
  )
}

export default Logo