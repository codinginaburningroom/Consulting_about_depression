import { useState, useEffect } from 'react'
import api from '../services/api'

function EditModal({ entry, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [analysis, setAnalysis] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || '',
        content: entry.content
      })
    }
  }, [entry])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await api.put(`/journal/entries/${entry.id}/`, formData)
      setAnalysis(response.data)
      onSave()
    } catch (error) {
      console.error('Error updating entry:', error)
      alert('เกิดข้อผิดพลาด')
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

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">แก้ไขบันทึก</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  ชื่อบันทึก
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder="ชื่อบันทึก"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  เนื้อหา
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  rows="6"
                  placeholder="เนื้อหาบันทึก"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>
            </form>

            {analysis && (
              <div className="mt-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-3">
                      <i className="fas fa-chart-pie text-primary"></i> ผลการวิเคราะห์อารมณ์
                    </h5>

                    <div className="row text-center mb-3">
                      <div className="col-md-6 mb-3">
                        <h6 className="text-muted mb-2">อารมณ์ของคุณ</h6>
                        <div className="display-4">
                          {getSentimentDisplay(analysis.sentiment)}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h6 className="text-muted mb-2">คะแนน</h6>
                        <div className={`display-4 ${getScoreColor(analysis.sentiment.sentiment_score)}`}>
                          {parseFloat(analysis.sentiment.sentiment_score).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {analysis.suggestions?.[0]?.suggestion && (
                      <div className="alert alert-info d-flex align-items-center gap-2">
                        <i className="fas fa-lightbulb"></i>
                        <div>{analysis.suggestions[0].suggestion}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ยกเลิก
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกและวิเคราะห์'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModal