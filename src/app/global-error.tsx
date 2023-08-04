'use client'

import "./globals.css";

import { useEffect } from 'react'
import { pushAnalyticsEvent, AnalyticsEventType } from './backend/firebase/analytics'
import BasicReturn from './components/basic-return/return'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    pushAnalyticsEvent({
      type: AnalyticsEventType.NextError,
      data: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        <BasicReturn text='An error has occurred. Sorry :(' returnLink='/' />
      </body>
    </html>
  )
}