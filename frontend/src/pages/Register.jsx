import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: ''
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
      const response = await api.post('/accounts/register/', formData)

      setAlert({
        type: 'success',
        message: response.data.message
      })

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      let errorMsg = 'เกิดข้อผิดพลาด: '
      if (error.response && error.response.data) {
        for (let key in error.response.data) {
          errorMsg += error.response.data[key] + ' '
        }
      }
      setAlert({
        type: 'danger',
        message: errorMsg
      })
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body p-5">
              <h3 className="card-title text-center mb-4 fw-bold">
                <i className="fas fa-user-plus text-primary"></i> สมัครสมาชิก
              </h3>

              {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">ชื่อผู้ใช้ *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">อีเมล *</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">ชื่อจริง</label>
                    <input
                      type="text"
                      className="form-control"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">นามสกุล</label>
                    <input
                      type="text"
                      className="form-control"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">รหัสผ่าน *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">ยืนยันรหัสผ่าน *</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  <i className="fas fa-user-plus"></i> สมัครสมาชิก
                </button>

                <div className="text-center">
                  <span className="text-muted">มีบัญชีอยู่แล้ว?</span>{' '}
                  <Link to="/login" className="text-decoration-none">
                    เข้าสู่ระบบ
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

export default Register