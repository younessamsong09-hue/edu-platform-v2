import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Link } from 'react-router-dom'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  link: string
  is_read: boolean
  created_at: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      fetchNotifications()
      
      // الاستماع للإشعارات الجديدة
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
          (payload) => {
            setNotifications(prev => [payload.new as Notification, ...prev])
            setUnreadCount(prev => prev + 1)
          }
        )
        .subscribe()
      
      return () => {
        subscription.unsubscribe()
      }
    }
  }

  async function fetchNotifications() {
    if (!user) return
    
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.is_read).length)
    }
  }

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      )
      setUnreadCount(prev => prev - 1)
    }
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id)
    
    for (const id of unreadIds) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
    }
    
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  async function deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id))
      if (!notifications.find(n => n.id === id)?.is_read) {
        setUnreadCount(prev => prev - 1)
      }
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success_lesson':
        return '✅'
      case 'success_certificate':
        return '🏆'
      case 'warning':
        return '⚠️'
      case 'success':
        return '🎉'
      default:
        return '🔔'
    }
  }

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return '#f9fafb'
    switch (type) {
      case 'success_lesson':
        return '#d4edda'
      case 'success_certificate':
        return '#fff3cd'
      case 'warning':
        return '#f8d7da'
      default:
        return '#e3f2fd'
    }
  }

  const formatTime = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'الآن'
    if (minutes < 60) return `${minutes} دقيقة`
    if (hours < 24) return `${hours} ساعة`
    return `${days} يوم`
  }

  if (!user) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          position: 'relative',
          padding: '5px'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-10px',
            background: '#ef4444',
            color: 'white',
            fontSize: '12px',
            borderRadius: '50%',
            padding: '2px 6px',
            minWidth: '18px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '40px',
          left: '-280px',
          width: '320px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '15px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                تعليم الكل كمقروء
              </button>
            )}
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                لا توجد إشعارات
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 15px',
                    borderBottom: '1px solid #eee',
                    background: getBgColor(notif.type, notif.is_read),
                    cursor: notif.link ? 'pointer' : 'default'
                  }}
                  onClick={() => {
                    if (notif.link) {
                      window.location.href = notif.link
                    }
                    if (!notif.is_read) markAsRead(notif.id)
                    setShowDropdown(false)
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ fontSize: '20px' }}>{getIcon(notif.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {notif.message}
                      </div>
                      <div style={{ fontSize: '10px', color: '#999', marginTop: '6px' }}>
                        {formatTime(notif.created_at)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notif.id)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
