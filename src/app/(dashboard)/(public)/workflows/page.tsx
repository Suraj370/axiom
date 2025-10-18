import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

async function Workflow() {
  await requireAuth();
  return (
    <div>Workflow</div>
  )
}

export default Workflow