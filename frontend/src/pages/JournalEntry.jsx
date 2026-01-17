import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function JournalEntry() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [alert, setAlert] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      console.log('Submitting journal entry:', formData)
      const response = await api.post('/journal/entries/', formData)
      console.log('API Response:', response.data)
      
      // รองรับทั้ง response แบบเดิมและแบบใหม่
      setAnalysis(response.data)
      setFormData({ title: '', content: '' })
      
      setAlert({
        type: 'success',
        message: 'บันทึกสำเร็จ! กำลังแสดงผลการวิเคราะห์...'
      })
    } catch (error) {
      console.error('Error creating entry:', error)
      console.error('Error response:', error.response?.data)
      setAlert({
        type: 'danger',
        message: 'เกิดข้อผิดพลาด: ' + (error.response?.data?.detail || error.response?.data?.error || 'การเชื่อมต่อล้มเหลว')
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

  if (analysis) {
    // รองรับ response structure หลายแบบ
    const sentiment = analysis.sentiment || analysis
    const suggestions = analysis.suggestions || []

    return (
      <div className="container">
        <div className="row justify-content-center mt-4">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4">
                  <i className="fas fa-chart-pie text-primary"></i> ผลการวิเคราะห์อารมณ์
                </h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="text-center p-4 border rounded bg-light">
                      <h6 className="text-muted mb-2">อารมณ์ของคุณ</h6>
                      <div className="display-4">
                        {getSentimentDisplay(sentiment)}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="text-center p-4 border rounded bg-light">
                      <h6 className="text-muted mb-2">คะแนน</h6>
                      <div className={`display-4 ${getScoreColor(sentiment.sentiment_score)}`}>
                        {parseFloat(sentiment.sentiment_score).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {suggestions?.[0]?.suggestion && (
                  <div className="alert alert-info mt-3">
                    <i className="fas fa-lightbulb"></i> {suggestions[0].suggestion}
                  </div>
                )}

                {analysis.title && (
                  <div className="mt-3">
                    <h6 className="text-muted">หัวเรื่อง</h6>
                    <p className="fw-bold">{analysis.title}</p>
                  </div>
                )}

                <div className="text-center mt-4">
                  <Link to="/dashboard" className="btn btn-primary me-2">
                    <i className="fas fa-chart-line"></i> ดู Dashboard
                  </Link>
                  <button onClick={() => setAnalysis(null)} className="btn btn-outline-primary">
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
                <i className="fas fa-pen-fancy text-primary"></i> เขียนบันทึกความรู้สึก
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

export default JournalEntry