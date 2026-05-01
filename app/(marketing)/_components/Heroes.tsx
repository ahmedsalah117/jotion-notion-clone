import Image from 'next/image'
import React from 'react'

const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px]">
          <Image src="/images/left_person_light.png" fill alt="Documents" className="object-contain dark:hidden" />
          <Image src="/images/left_person_dark.png" fill alt="Documents" className="object-contain dark:block hidden" />
        </div>

        <div className="relative w-[400px] h-[400px] hidden md:block">
          <Image className="object-contain dark:hidden" src="/images/right_person_light.png" fill alt="Reading" />
          <Image className="object-contain dark:block hidden" src="/images/right_person_dark.png" fill alt="Reading" />
        </div>
      </div>
    </div>
  );
}

export default Heroes