import { SignIn, SignedIn } from '@clerk/nextjs'
import React from 'react'

type Props = {}

export default function SignInPage({}: Props) {
  return (
    <div className='flex justify-center items-center my-20'>
      <SignIn />
    </div>
  )
}