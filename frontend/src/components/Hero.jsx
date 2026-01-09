import React from 'react';
import { useNavigate } from 'react-router-dom'; // ১. পেজ চেঞ্জ করার টুল আনলাম
import '../App.css';

function Hero() {
  const navigate = useNavigate(); // ২. টুলটা রেডি করলাম

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>জনসেবা: ডিজিটাল বাংলাদেশ গড়ি</h1>
        <p>জন্ম নিবন্ধন, জমির মিউটেশন এবং অন্যান্য সরকারি সেবা এখন আপনার হাতের মুঠোয়।</p>
        
        <div className="hero-buttons">
            {/* ৩. বাটনগুলোতে onClick বসালাম */}
            <button 
              onClick={() => navigate('/apply')} 
              className="btn-primary"
            >
              আবেদন করুন
            </button>
            
            <button 
              onClick={() => navigate('/report')} 
              className="btn-secondary"
            >
              অভিযোগ জানান
            </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;