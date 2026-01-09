import React from 'react';
import '../App.css';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '50px 20px', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* বাম পাশ */}
        <div>
          <h3 style={{ borderBottom: '2px solid #f42a41', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>জনসেবা</h3>
          <p style={{ color: '#ccc', lineHeight: '1.6' }}>
            গ্রামীণ নাগরিকদের জীবন সহজ করতে আমরা আছি আপনার পাশে। ঘরে বসেই সকল সরকারি সেবা গ্রহণ করুন।
          </p>
          
          <h4 style={{ borderBottom: '2px solid #f42a41', display: 'inline-block', paddingBottom: '5px', marginTop: '30px', marginBottom: '20px' }}>যোগাযোগ করুন</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#ccc' }}>
            <p>📍 ধানমন্ডি, ঢাকা-১২০৯</p>
            <p>📞 ০১৭৯৪১৪৭৩০৭</p>
            <p>📧 support@jonoseba.gov.bd</p>
          </div>
        </div>

        {/* ডান পাশ - লিংক */}
        <div>
          <h3 style={{ borderBottom: '2px solid #f42a41', display: 'inline-block', paddingBottom: '5px', marginBottom: '20px' }}>গুরুত্বপূর্ণ লিংক</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>হোম</a></li>
            <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>আমাদের সম্পর্কে</a></li>
            <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>যোগাযোগ</a></li>
            <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>গোপনীয়তা নীতি</a></li>
          </ul>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', borderTop: '1px solid #333', marginTop: '40px', paddingTop: '20px', color: '#777' }}>
        <p>&copy; ২০২৫ জনসেবা (JonoSeba) | ডিজিটাল বাংলাদেশ</p>
      </div>
    </footer>
  );
}

export default Footer;