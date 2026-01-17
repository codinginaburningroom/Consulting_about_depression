import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [alert, setAlert] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAlert(null)

    try {
      const response = await api.post('/accounts/login/', formData)
      
      // เก็บ token
      localStorage.setItem('token', response.data.access)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('refreshToken', response.data.refresh)

      // Trigger custom event เพื่อให้ Navbar อัพเดท
      window.dispatchEvent(new Event('authChange'))

      setAlert({
        type: 'success',
        message: '✅ เข้าสู่ระบบสำเร็จ กำลังพาไปยัง Dashboard...'
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setAlert({
        type: 'danger',
        message: '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      })
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="card">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4 fw-bold">
                <i className="fas fa-sign-in-alt text-primary"></i> เข้าสู่ระบบ
              </h3>

              {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">ชื่อผู้ใช้</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">รหัสผ่าน</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  <i className="fas fa-sign-in-alt"></i> เข้าสู่ระบบ
                </button>

                <div className="text-center">
                  <span className="text-muted">ยังไม่มีบัญชี?</span>{' '}
                  <Link to="/register" className="text-decoration-none">
                    สมัครสมาชิก
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login