import { useState, useEffect } from 'react'
import api from '../services/api'

function EditProfile() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  })
  const [alert, setAlert] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await api.get('/accounts/profile/')
      setFormData({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
        password: ''
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      setAlert({
        type: 'danger',
        message: 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'
      })
      setIsLoading(false)
    }
  }

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
      const bodyData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email
      }

      // ส่ง password เฉพาะถ้าใส่
      if (formData.password) {
        bodyData.password = formData.password
      }

      await api.put('/accounts/profile/', bodyData)

      setAlert({
        type: 'success',
        message: 'บันทึกสำเร็จ!'
      })

      // ล้างรหัสผ่าน
      setFormData({ ...formData, password: '' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setAlert({
        type: 'danger',
        message: JSON.stringify(error.response?.data || 'เกิดข้อผิดพลาดในการเชื่อมต่อ')
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
            </div>
          )}
          <div className="card">
            <div className="card-body">
              <h3 className="card-title fw-bold mb-4">
                <i className="fas fa-user-edit text-primary"></i> แก้ไขโปรไฟล์ของคุณ
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">ชื่อ</label>
                  <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">นามสกุล</label>
                  <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">อีเมล</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  <i className="fas fa-save"></i> บันทึก
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile