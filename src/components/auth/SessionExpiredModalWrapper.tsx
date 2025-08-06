'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SessionExpiredModal } from './SessionExpiredModal'

export function SessionExpiredModalWrapper() {
  const { showSessionExpiredModal, setShowSessionExpiredModal } = useAuth()
  
  return (
    <SessionExpiredModal 
      isOpen={showSessionExpiredModal} 
      onClose={() => setShowSessionExpiredModal(false)} 
    />
  )
} 