import { StartupForm } from '@/components/forms/StartupForm'
import React from 'react'

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full">
        <StartupForm />
      </div>
    </div>
  )
}

export default page