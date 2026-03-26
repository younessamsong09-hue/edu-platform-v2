import { useEffect, useState } from 'react'

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstall(false)
    localStorage.setItem('install-dismissed', 'true')
  }

  if (!showInstall || localStorage.getItem('install-dismissed') === 'true') {
    return null
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      background: 'white',
      borderRadius: '15px',
      padding: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '15px',
      flexWrap: 'wrap',
      direction: 'rtl'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '30px' }}>📱</span>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>ثبّت التطبيق</div>
          <div style={{ fontSize: '12px', color: '#666' }}>احصل على تجربة أفضل على هاتفك</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleInstall}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          تثبيت
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer'
          }}
        >
          تخطي
        </button>
      </div>
    </div>
  )
}
