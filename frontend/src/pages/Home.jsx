import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Column - Hero Text */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="fade-in">
              <h1 className="display-3 fw-bold mb-4" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                บันทึกอารมณ์
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  ของคุณ
                </span>
              </h1>
              
              <p className="lead text-white-50 mb-5" style={{ fontSize: '1.25rem' }}>
                ระบบวิเคราะห์อารมณ์ด้วย AI ที่จะช่วยให้คุณเข้าใจตัวเองมากขึ้น
                <br />
                บันทึกความรู้สึก รับคำแนะนำ และติดตามอารมณ์ของคุณได้ทุกวัน
              </p>

              <div className="d-flex gap-3 flex-wrap">
                {isLoggedIn ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="btn btn-lg px-5 py-3"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-4px)'
                        e.target.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <i className="fas fa-chart-line me-2"></i>
                      ไปยัง Dashboard
                    </Link>
                    
                    <Link 
                      to="/journal" 
                      className="btn btn-lg px-5 py-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                        e.target.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      <i className="fas fa-pen-fancy me-2"></i>
                      เขียนบันทึกใหม่
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register" 
                      className="btn btn-lg px-5 py-3"
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
                        border: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-4px)'
                        e.target.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)'
                        e.target.style.boxShadow = '0 10px 25px rgba(99, 102, 241, 0.3)'
                      }}
                    >
                      <i className="fas fa-user-plus me-2"></i>
                      เริ่มต้นใช้งาน
                    </Link>
                    
                    <Link 
                      to="/login" 
                      className="btn btn-lg px-5 py-3"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.25)'
                        e.target.style.transform = 'translateY(-4px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.15)'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      <i className="fas fa-sign-in-alt me-2"></i>
                      เข้าสู่ระบบ
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="col-lg-6">
            <div className="row g-4">
              {[
                {
                  icon: 'fa-brain',
                  title: 'วิเคราะห์ด้วย AI',
                  description: 'ระบบ AI จาก AIForThai วิเคราะห์อารมณ์จากข้อความของคุณ',
                  gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                },
                {
                  icon: 'fa-chart-line',
                  title: 'ติดตามอารมณ์',
                  description: 'ดูกราฟและสถิติอารมณ์ของคุณแบบรายวัน',
                  gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
                },
                {
                  icon: 'fa-lightbulb',
                  title: 'รับคำแนะนำ',
                  description: 'รับคำแนะนำที่เหมาะสมกับสถานะอารมณ์ของคุณ',
                  gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                },
                {
                  icon: 'fa-lock',
                  title: 'ปลอดภัย 100%',
                  description: 'ข้อมูลของคุณเข้ารหัสและเก็บไว้อย่างปลอดภัย',
                  gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                }
              ].map((feature, index) => (
                <div key={index} className="col-md-6">
                  <div 
                    className="card h-100 border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)'
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="card-body text-white">
                      <div 
                        className="d-inline-flex align-items-center justify-content-center mb-3"
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '1rem',
                          background: feature.gradient,
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <i className={`fas ${feature.icon} fa-2x`}></i>
                      </div>
                      
                      <h5 className="fw-bold mb-2">{feature.title}</h5>
                      <p className="text-white-50 mb-0 small">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div 
              className="card border-0"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="card-body">
                <div className="row text-center text-white">
                  {[
                    { number: '10K+', label: 'ผู้ใช้งาน', icon: 'fa-users' },
                    { number: '50K+', label: 'บันทึก', icon: 'fa-file-alt' },
                    { number: '95%', label: 'ความพึงพอใจ', icon: 'fa-smile' }
                  ].map((stat, index) => (
                    <div key={index} className="col-md-4 mb-3 mb-md-0">
                      <i className={`fas ${stat.icon} fa-2x mb-3 opacity-75`}></i>
                      <h2 className="display-4 fw-bold mb-0">{stat.number}</h2>
                      <p className="text-white-50 mb-0">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home