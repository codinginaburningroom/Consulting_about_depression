import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

function EditEntry() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [alert, setAlert] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEntry()
  }, [id])

  const loadEntry = async () => {
    try {
      const response = await api.get(`/journal/entries/${id}/`)
      setFormData({
        title: response.data.title || '',
        content: response.data.content
      })
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading entry:', error)
      navigate('/dashboard')
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
    setIsSubmitting(true)

    try {
      const response = await api.put(`/journal/entries/${id}/`, formData)
      setAnalysis(response.data)
    } catch (error) {
      console.error('Error updating entry:', error)
      setAlert({
        type: 'danger',
        message: 'เกิดข้อผิดพลาด: ' + JSON.stringify(error.response?.data || 'การเชื่อมต่อล้มเหลว')
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSentimentDisplay = (sentiment) => {
    if (sentiment.sentiment_label === 'positive') {
      return (
        <span className="text-success">
          <i className="fas fa-smile"></i> ดี
        </span>
      )
    } else if (sentiment.sentiment_label === 'negative') {
      return (
        <span className="text-danger">
          <i className="fas fa-frown"></i> ไม่ดี
        </span>
      )
    } else {
      return (
        <span className="text-warning">
          <i className="fas fa-meh"></i> ปกติ
        </span>
      )
    }
  }

  const getScoreColor = (score) => {
    if (score > 0) return 'text-success'
    if (score < 0) return 'text-danger'
    return 'text-warning'
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

  if (analysis) {
    return (
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-3">
                  <i className="fas fa-chart-pie text-primary"></i> ผลการวิเคราะห์อารมณ์
                </h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="text-center p-4 border rounded">
                      <h6 className="text-muted mb-2">อารมณ์ของคุณ</h6>
                      <div className="display-4">
                        {getSentimentDisplay(analysis.sentiment)}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="text-center p-4 border rounded">
                      <h6 className="text-muted mb-2">คะแนน</h6>
                      <div className={`display-4 ${getScoreColor(analysis.sentiment.sentiment_score)}`}>
                        {parseFloat(analysis.sentiment.sentiment_score).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {analysis.suggestions?.[0]?.suggestion && (
                  <div className="alert alert-info mt-3">
                    <i className="fas fa-lightbulb"></i> {analysis.suggestions[0].suggestion}
                  </div>
                )}

                <div className="text-center mt-3">
                  <Link to="/dashboard" className="btn btn-primary me-2">
                    <i className="fas fa-chart-line"></i> ดู Dashboard
                  </Link>
                  <button onClick={() => navigate('/journal')} className="btn btn-outline-primary">
                    <i className="fas fa-plus"></i> เขียนบันทึกใหม่
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body p-5">
              <h3 className="card-title mb-4 fw-bold">
                <i className="fas fa-pen-fancy text-primary"></i> แก้ไขบันทึกความรู้สึก
              </h3>

              {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}></i> {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">หัวเรื่อง</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="เช่น วันนี้เป็นวันที่ดี..."
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">เขียน Brain Dump ของคุณ *</label>
                  <textarea
                    className="form-control"
                    id="content"
                    rows="10"
                    placeholder="เขียนทุกอย่างที่คุณคิด รู้สึก หรืออยากระบาย... ไม่ต้องกังวลเรื่องไวยากรณ์ แค่เขียนออกมาให้หมด"
                    value={formData.content}
                    onChange={handleChange}
                    required
                  />
                  <small className="text-muted">
                    <i className="fas fa-info-circle"></i> ระบบจะวิเคราะห์อารมณ์จากข้อความของคุณโดยอัตโนมัติ
                  </small>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary flex-grow-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> กำลังวิเคราะห์...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i> บันทึกและวิเคราะห์
                      </>
                    )}
                  </button>
                  <Link to="/dashboard" className="btn btn-outline-secondary">
                    <i className="fas fa-times"></i> ยกเลิก
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

export default EditEntry