import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';

export default function Homepage() {
  // --- SCROLL ANIMATION EFFECT ---
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-up, .reveal-scale');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // --- IMMERSIVE FULL-SCREEN CSS (FINTECH THEME) ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap');

    :root {
      --primary-green: #38bdf8; /* Vibrant Sky Blue */
      --primary-green-hover: #0ea5e9;
      --text-light: #f8fafc;
      --text-muted: #94a3b8;
      
      /* Enhanced Glass variables */
      --glass-bg: rgba(15, 23, 42, 0.45);
      --glass-border: rgba(255, 255, 255, 0.08);
      --glass-blur: blur(20px);
    }

    /* --- KEYFRAMES FOR DYNAMIC MOTION --- */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
      70% { box-shadow: 0 0 0 15px rgba(99, 102, 241, 0); }
      100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
    }

    /* --- FIXED FULL-BLEED BACKGROUND --- */
    body {
      margin: 0;
      padding: 0;
      background-color: none;
      color: var(--text-light);
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      display: flex;
      justify-content: center;
    }

    .background-video {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      object-fit: cover;
      opacity: 0.9;
    }

    /* Dynamic gradient overlay for readability and vignette */
    .background-overlay {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 1;
      background: linear-gradient(135deg, rgba(15,23,42,0.4) 0%, rgba(2,6,23,0.7) 100%);
    }

    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      position: relative;
      z-index: 10;
    }

    /* --- ANIMATIONS --- */
    .reveal-up { opacity: 0; transform: translateY(50px); transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal-scale { opacity: 0; transform: scale(0.92); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
    .is-visible { opacity: 1 !important; transform: translate(0) scale(1) !important; }
    .delay-100 { transition-delay: 150ms; }
    .delay-200 { transition-delay: 300ms; }
    .delay-300 { transition-delay: 450ms; }

    /* --- GLASS NAVBAR --- */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      margin: 2rem 0 4rem 0;
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(12px);
      border-radius: 100px;
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.6rem;
      font-weight: 700;
      font-family: 'Playfair Display', serif;
      letter-spacing: 1px;
      background: linear-gradient(to right, #ffffff, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 20px rgba(56, 189, 248, 0.3);
    }
    .nav-links {
      display: flex;
      gap: 3rem;
      font-weight: 500;
      font-size: 0.85rem;
      letter-spacing: 1px;
    }
    .nav-link {
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.3s ease;
      text-transform: uppercase;
      position: relative;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0%;
      height: 2px;
      background: var(--primary-green);
      transition: width 0.3s ease;
    }
    .nav-link:hover { color: white; }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }
    .nav-link.active { color: white; }
    
    .search-bar {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      color: white;
      padding: 0.6rem 1.2rem 0.6rem 2.5rem;
      border-radius: 100px;
      font-family: 'Inter';
      font-size: 0.85rem;
      width: 200px;
      outline: none;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .search-bar::placeholder { color: rgba(255,255,255,0.6); }
    .search-bar:focus { 
      background: rgba(255,255,255,0.15); 
      width: 260px; 
      border-color: var(--primary-green);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
    }
    .search-bar-container { position: relative; display: flex; align-items: center; gap: 1.5rem; }
    .search-icon { position: absolute; left: 14px; color: rgba(255,255,255,0.6); width: 16px; height: 16px; z-index: 1; }

    .btn-glass {
      background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
      border: none;
      color: white;
      padding: 0.6rem 1.8rem;
      border-radius: 100px;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
    }
    .btn-glass::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 50%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      transition: all 0.6s ease;
    }
    .btn-glass:hover { transform: translateY(-3px); box-shadow: 0 12px 25px rgba(99, 102, 241, 0.6), 0 0 20px rgba(56, 189, 248, 0.4); }
    .btn-glass:hover::before { left: 150%; }

    /* --- CENTERED IMMERSIVE HERO --- */
    .hero-section {
      text-align: center;
      padding: 6vh 0 10vh 0;
      max-width: 900px;
      margin: 0 auto;
      animation: float 6s ease-in-out infinite;
    }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(3.5rem, 6vw, 6rem);
      font-weight: 700;
      line-height: 1.05;
      margin-bottom: 1.5rem;
      color: white;
      text-shadow: 0 10px 30px rgba(0,0,0,0.6);
      background: linear-gradient(to bottom right, #ffffff, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-desc {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.7;
      max-width: 650px;
      margin: 0 auto;
      font-weight: 400;
      text-shadow: 0 4px 12px rgba(0,0,0,0.8);
    }

    /* --- FLOATING STATS STRIP --- */
    .stats-strip {
      display: flex;
      justify-content: space-between;
      max-width: 900px;
      margin: 0 auto 8rem auto;
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      transform-style: preserve-3d;
    }
    .stat-item { text-align: center; flex: 1; transition: transform 0.3s ease; }
    .stat-item:hover { transform: translateY(-5px); }
    
    .stat-num { 
      font-family: 'Playfair Display', serif; 
      font-size: 3rem; 
      font-weight: 600; 
      margin-bottom: 0.5rem; 
      background: linear-gradient(to right, #a5b4fc, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 10px rgba(99,102,241,0.3));
    }
    .stat-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500;}

    /* --- SECTION TITLES --- */
    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      font-weight: 600;
      text-align: center;
      margin-bottom: 3.5rem;
      color: white;
      text-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }

    /* --- FLOATING CATEGORY CARDS --- */
    .category-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 8rem;
    }
    @media (max-width: 900px) { .category-grid { grid-template-columns: repeat(2, 1fr); } }
    
    .cat-card {
      height: 400px;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cat-card::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 24px;
      border: 2px solid transparent;
      transition: all 0.4s ease;
      pointer-events: none;
    }
    .cat-card:hover {
      transform: translateY(-12px);
      box-shadow: 0 30px 60px rgba(0,0,0,0.6);
    }
    .cat-card:hover::after {
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: inset 0 0 20px rgba(99, 102, 241, 0.2);
    }
    .cat-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s;
      filter: brightness(0.8);
    }
    .cat-card:hover .cat-img { transform: scale(1.1); filter: brightness(1); }
    
    .cat-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(5,10,15,0.3) 50%, transparent 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 2.5rem 2rem;
      transition: padding 0.3s ease;
    }
    .cat-card:hover .cat-overlay { padding-bottom: 3rem; }
    
    .cat-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.8rem;
      margin: 0 0 0.5rem 0;
      color: white;
      transition: color 0.3s ease;
    }
    .cat-card:hover .cat-title { color: var(--primary-green); }
    
    .cat-subtitle {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.5px;
      line-height: 1.4;
    }
    .cat-action {
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      background: var(--primary-green);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transform: translateX(-20px) rotate(-45deg);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cat-card:hover .cat-action { opacity: 1; transform: translateX(0) rotate(0); }

    /* --- WHY CHOOSE US & FARMERS --- */
    .why-section, .farmers-section { margin: 10rem auto; max-width: 1200px; text-align: center; position: relative; }
    
    .why-grid, .farmers-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
      margin-top: 4rem;
    }
    
    .why-card {
      position: relative;
      padding: 3rem 2.5rem;
      border-radius: 24px;
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.08);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .why-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(99,102,241,0.15), transparent 70%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }
    .why-card:hover::before { opacity: 1; }
    .why-card:hover {
      transform: translateY(-10px);
      border-color: rgba(99,102,241,0.4);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      background: rgba(255,255,255,0.05);
    }
    .why-icon { color: var(--primary-green); margin-bottom: 1.5rem; }
    .why-card h3 { font-size: 1.5rem; margin-bottom: 1rem; font-family: 'Playfair Display', serif; color: white; }
    .why-card p { color: #94a3b8; font-size: 1rem; line-height: 1.7; }

    .farmer-card {
      position: relative;
      border-radius: 24px;
      overflow: hidden;
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.08);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      padding-bottom: 1.5rem;
    }
    .farmer-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 30px 60px rgba(0,0,0,0.5);
      border-color: rgba(255,255,255,0.2);
    }
    .farmer-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      transition: transform 0.8s ease;
    }
    .farmer-card:hover img { transform: scale(1.05); }
    .farmer-card h4 { margin: 1.5rem 0 0.3rem; font-size: 1.4rem; font-family: 'Playfair Display', serif; color: white; }
    .farmer-card p { color: var(--primary-green); font-size: 0.95rem; font-weight: 500; padding: 0 1rem; }

    @media (max-width: 900px) { .why-grid, .farmers-grid { grid-template-columns: 1fr; } }

    /* --- GLASS FOOTER --- */
    .footer {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 6rem 0 3rem 0;
      background: linear-gradient(to top, rgba(2,6,23,0.95) 0%, transparent 100%);
      backdrop-filter: blur(20px);
      margin: 0 -50vw; 
      position: relative;
      left: 50%;
      right: 50%;
      width: 100vw;
    }
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 4rem;
    }
    @media (max-width: 768px) { .footer-inner { grid-template-columns: 1fr; gap: 2rem; } }
    
    .footer-brand { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: white; margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;}
    .footer-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; max-width: 280px; }
    .footer-col h4 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: white; margin-bottom: 1.5rem; font-weight: 600; letter-spacing: 0.5px;}
    .footer-link { display: block; color: var(--text-muted); text-decoration: none; font-size: 0.95rem; margin-bottom: 1rem; transition: all 0.3s; }
    .footer-link:hover { color: var(--primary-green); transform: translateX(5px); }
    
    .footer-bottom {
      max-width: 1200px;
      margin: 4rem auto 0 auto;
      padding: 2rem 2rem 0 2rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      display: flex;
      justify-content: space-between;
      color: #64748b;
      font-size: 0.9rem;
    }
  `;

  return (
    <div>
      <style>{styles}</style>

      {/* --- FIXED BACKGROUND VIDEO --- */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
      >
        {/* Reliable tech video from Mixkit */}
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connection-background-2720-large.mp4" type="video/mp4" />
        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-numbers-and-data-moving-in-a-financial-background-30403-large.mp4" type="video/mp4" />
      </video>
      <div className="background-overlay"></div>

      <div className="app-container">

        {/* --- NAVBAR --- */}
        <nav className="navbar reveal-up">
          <div className="brand">
            <Wallet size={28} color="var(--primary-green)" />
            VaultCore
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link active">Home</a>
            <a 
              href="#about" 
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              About
            </a>
            <a 
              href="#contact" 
              className="nav-link" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact
            </a>
          </div>
          <div className="search-bar-container" style={{ justifyContent: 'flex-end' }}>
            <Link to="/login">
              <button className="btn-glass">Get Started</button>
            </Link>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <div className="hero-section reveal-up delay-100">
          <h1 className="hero-title">Financial Intelligence,<br />Simplified by AI.</h1>
          <p className="hero-desc">
            Experience a new era of personal finance. VaultCore uses advanced AI to analyze your spending, suggest budget optimizations, and protect you from predatory lending.
          </p>
        </div>

        {/* --- FLOATING STATS STRIP --- */}
        <div className="stats-strip reveal-scale delay-200">
          <div className="stat-item">
            <div className="stat-num">98%</div>
            <div className="stat-label">AI Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">₹0</div>
            <div className="stat-label">Hidden Costs</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">24/7</div>
            <div className="stat-label">Smart Monitoring</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">SEC</div>
            <div className="stat-label">Instant Analysis</div>
          </div>
        </div>

        {/* --- ABOUT SECTION --- */}
        <section id="about" className="reveal-up" style={{ margin: '8rem 0', scrollMarginTop: '100px' }}>
          <h2 className="section-title">Our Mission</h2>
          <div className="glass-card" style={{ 
            padding: '4rem', 
            borderRadius: '40px',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '2.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: 'white' }}>
              We're Bridging the Gap Between <span style={{ color: 'var(--primary-green)' }}>Data and Wealth.</span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
              VaultCore was founded on a simple belief: personal finance shouldn't be complicated. By leveraging Google's Gemini AI, we transform complex bank statements and credit scores into actionable insights. We empower users to take control of their financial destiny without the need for an expensive advisor.
            </p>
          </div>
        </section>

        {/* --- CONTACT SECTION (SIMPLIFIED) --- */}
        <section id="contact" className="reveal-up" style={{ margin: '8rem 0', scrollMarginTop: '100px' }}>
          <h2 className="section-title">Get In Touch</h2>
          <div className="glass-card" style={{ 
            display: 'flex', 
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '3rem', 
            padding: '3rem', 
            borderRadius: '40px',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(30px)',
            border: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center'
          }}>
            <div>
              <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Call Us</h4>
              <p style={{ color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>+91 (020) 2440-1234</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Email</h4>
              <p style={{ color: 'var(--primary-green)', fontSize: '1.2rem', fontWeight: '600' }}>support@vaultcore.ai</p>
            </div>
            <div>
              <h4 style={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Location</h4>
              <p style={{ color: '#cbd5e1', fontSize: '1.2rem', fontWeight: '600' }}>FinTech Plaza, Pune, India</p>
            </div>
          </div>
        </section>

        {/* --- FULL WIDTH GLASS FOOTER --- */}
        <footer className="footer reveal-up">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">
                <Wallet size={24} color="var(--primary-green)" />
                VaultCore.
              </div>
              <p className="footer-desc">The next generation of AI-powered personal finance management. Intelligent, secure, and always on your side.</p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#" className="footer-link">AI Advisor</a>
              <a href="#" className="footer-link">Loan Matching</a>
              <a href="#" className="footer-link">Audit Engine</a>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <a href="#" className="footer-link">Financial Blog</a>
              <a href="#" className="footer-link">Security Whitepaper</a>
              <a href="#" className="footer-link">API Docs</a>
            </div>
            <div className="footer-col">
              <h4>Connect</h4>
              <a href="#" className="footer-link">Twitter</a>
              <a href="#" className="footer-link">LinkedIn</a>
              <a href="#" className="footer-link">Support</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 VaultCore Financial Technologies.</span>
            <span>Empowering financial freedom through AI.</span>
          </div>
        </footer>

      </div>
    </div>
  );
}