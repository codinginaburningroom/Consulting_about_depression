import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import api from '../services/api'
import EditModal from '../components/EditModal'

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [entries, setEntries] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // โหลดสถิติ
      const statsResponse = await api.get('/journal/statistics/?days=30')
      setStats(statsResponse.data)

      // โหลดบันทึก
      const entriesResponse = await api.get('/journal/entries/?page_size=5')
      setEntries(entriesResponse.data.results || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
  }

  const getSentimentBadge = (sentiment) => {
    const badges = {
      positive: (
        <span className="badge bg-success d-inline-flex align-items-center gap-1">
          <i className="fas fa-smile"></i> ดี
        </span>
      ),
      neutral: (
        <span className="badge bg-warning d-inline-flex align-items-center gap-1">
          <i className="fas fa-meh"></i> ปกติ
        </span>
      ),
      negative: (
        <span className="badge bg-danger d-inline-flex align-items-center gap-1">
          <i className="fas fa-frown"></i> ไม่ดี
        </span>
      )
    }
    return badges[sentiment] || null
  }

  const handleEdit = (entry) => {
    setCurrentEntry(entry)
    setShowEditModal(true)
  }

  const handleDelete = async (entryId) => {
    if (!window.confirm('คุณแน่ใจว่าต้องการลบบันทึกนี้?')) return

    try {
      await api.delete(`/journal/entries/${entryId}/`)
      alert('ลบบันทึกสำเร็จ')
      loadDashboard()
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('เกิดข้อผิดพลาด')
    }
  }

  if (!stats) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const pieData = {
    labels: ['อารมณ์ดี', 'อารมณ์ปกติ', 'อารมณ์ไม่ดี'],
    datasets: [
      {
        data: [
          stats.sentiment_distribution.positive,
          stats.sentiment_distribution.neutral,
          stats.sentiment_distribution.negative
        ],
        backgroundColor: ['#28a745', '#ffc107', '#dc3545']
      }
    ]
  }

  const lineData = {
    labels: stats.daily_sentiments.reverse().map((d) => d.date),
    datasets: [
      {
        label: 'คะแนนอารมณ์',
        data: stats.daily_sentiments.map((d) => d.sentiment_score),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102,126,234,0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const lineOptions = {
    responsive: true,
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          callback: (value) => (value > 0 ? 'ดี' : value < 0 ? 'ไม่ดี' : 'ปกติ')
        }
      }
    }
  }

  let avgText = ''
  if (stats.average_sentiment > 0.2) {
    avgText = `คะแนนอารมณ์เฉลี่ย: ${stats.average_sentiment.toFixed(2)} - คุณมีอารมณ์เป็นบวกโดยรวม ดีมากเลย!`
  } else if (stats.average_sentiment < -0.2) {
    avgText = `คะแนนอารมณ์เฉลี่ย: ${stats.average_sentiment.toFixed(2)} - คุณอาจกำลังผ่านช่วงเวลาที่ท้าทายอยู่ อย่าลืมดูแลตัวเองนะ`
  } else {
    avgText = `คะแนนอารมณ์เฉลี่ย: ${stats.average_sentiment.toFixed(2)} - อารมณ์ของคุณค่อนข้างสมดุล`
  }

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title fw-bold mb-4">
                <i className="fas fa-chart-line text-primary"></i> สถิติอารมณ์ของคุณ
              </h4>

              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <h2>{stats.total_entries}</h2>
                      <p className="mb-0">จำนวนบันทึกทั้งหมด</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h2>{stats.sentiment_distribution.positive}</h2>
                      <p className="mb-0">อารมณ์ดี</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <h2>{stats.sentiment_distribution.neutral}</h2>
                      <p className="mb-0">อารมณ์ปกติ</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                      <h2>{stats.sentiment_distribution.negative}</h2>
                      <p className="mb-0">อารมณ์ไม่ดี</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <Doughnut
                    data={pieData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'การกระจายของอารมณ์' }
                      }
                    }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <Line data={lineData} options={lineOptions} />
                </div>
              </div>

              <div className="alert alert-info">
                <i className={`fas fa-${stats.average_sentiment > 0.2 ? 'smile' : stats.average_sentiment < -0.2 ? 'frown' : 'meh'}`}></i> {avgText}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="card-title fw-bold mb-0">
                  <i className="fas fa-book text-primary"></i> บันทึกล่าสุด
                </h4>
                <Link to="/journal" className="btn btn-primary">
                  <i className="fas fa-plus"></i> เขียนบันทึกใหม่
                </Link>
              </div>

              {entries.length === 0 ? (
                <p className="text-muted text-center py-4">
                  ยังไม่มีบันทึก เริ่มต้นเขียนบันทึกแรกของคุณเลย!
                </p>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{entry.title || 'ไม่มีหัวเรื่อง'}</h5>
                        <div className="d-flex gap-2">
                          {getSentimentBadge(entry.sentiment?.sentiment_label)}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(entry)}
                          >
                            <i className="fas fa-edit"></i> แก้ไข
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <i className="fas fa-trash"></i> ลบ
                          </button>
                        </div>
                      </div>
                      <p className="card-text text-muted small mb-2">
                        <i className="fas fa-calendar"></i>{' '}
                        {new Date(entry.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="card-text">
                        {entry.content.substring(0, 150)}
                        {entry.content.length > 150 ? '...' : ''}
                      </p>
                      {entry.suggestions?.[0]?.suggestion && (
                        <div className="alert alert-light mb-0">
                          <small>
                            <i className="fas fa-lightbulb text-warning"></i>{' '}
                            {entry.suggestions[0].suggestion}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditModal
          entry={currentEntry}
          onClose={() => {
            setShowEditModal(false)
            setCurrentEntry(null)
          }}
          onSave={() => {
            setShowEditModal(false)
            setCurrentEntry(null)
            loadDashboard()
          }}
        />
      )}
    </div>
  )
}

export default Dashboard