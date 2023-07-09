'use client'

import { Metadata } from 'next';
import './globals.css';
import Header from '@components/header/header';
import { useState } from 'react';
import SignInContext from './context/signincontext';
import UserContext from './context/usercontext';
import useCurrentUser from './hooks/useCurrentUser';

export const metadata:Metadata = {
  title: 'Blitz',
  description: 'Host and create fun and educational live games for students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [signInPopup, setSignInPopup] = useState(false);
  const { currentUser, signedIn, userLoading } = useCurrentUser();

  return (
    <html lang="en">
      <body>
        <SignInContext.Provider value={{ get: signInPopup, set:setSignInPopup }}><UserContext.Provider value={{ currentUser: currentUser, signedIn: signedIn, userLoading: userLoading }}>
          <Header />
          {children}
        </  UserContext.Provider></SignInContext.Provider>
      </body>
    </html>
  )
}