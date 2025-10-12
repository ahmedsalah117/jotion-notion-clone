"use client"
import React, { useEffect, useState } from 'react'
import SettingsModal from '../modals/settings-modal'

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  },[isMounted])

  if(!isMounted){
    return null
  }

  return (
    <>
    <SettingsModal/>
    </>
  )
}

export default ModalProvider