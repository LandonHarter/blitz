'use client'

import BasicReturn from './components/basic-return/return'
 
export default function NotFound() {
  return (
    <div>
      <BasicReturn text='The page you are looking for cannot be found.' returnLink='/' />
    </div>
  )
}