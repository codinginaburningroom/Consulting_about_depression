import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // เช็ค token ตอน mount
    const checkAuth = () => {
      const token = localStorage.getItem('token') || localStorage.getItem('access_token')
      setIsLoggedIn(!!token)
    }
    
    checkAuth()
    
    // ฟัง custom event สำหรับการ login/logout
    const handleAuthChange = () => {
      checkAuth()
    }
    
    window.addEventListener('authChange', handleAuthChange)
    
    // Cleanup
    return () => {
      window.removeEventListener('authChange', handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    
    // Trigger custom event
    window.dispatchEvent(new Event('authChange'))
    
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light mb-5 py-3" style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="fas fa-book-heart text-primary"></i> Mood Journal
        </Link>
        <button 
          className="navbar-toggler" 
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item me-3">
                  <Link className="nav-link fw-semibold" to="/dashboard">
                    <i className="fas fa-chart-line"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link fw-semibold" to="/journal">
                    <i className="fas fa-plus"></i> เขียนบันทึกใหม่
                  </Link>
                </li>
                <li className="nav-item me-3">
                  <Link className="nav-link fw-semibold" to="/profile/edit">
                    <i className="fas fa-user"></i> โปรไฟล์
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link text-danger fw-semibold btn btn-link" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> ออกจากระบบ
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/login">
                  <i className="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar