import React from 'react'
//npm i lucide-react   for icons
import {Loader} from 'lucide-react'
const PageLoader = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
        <Loader className="size-10 animate-spin"/>
    </div>
  )
}

export default PageLoader