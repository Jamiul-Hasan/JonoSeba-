import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ReportProblem() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('আপনার অভিযোগটি সফলভাবে রেকর্ড করা হয়েছে! দ্রুত ব্যবস্থা নেওয়া হবে।');
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#f42a41', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>সমস্যা বা অভিযোগ জানান</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        {/* সমস্যার ধরন */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>সমস্যার ধরন:</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            <option>রাস্তাঘাট ভাঙাচোরা</option>
            <option>পানির সমস্যা</option>
            <option>ময়লা আবর্জনা পরিষ্কার</option>
            <option>সড়ক বাতি নষ্ট</option>
            <option>অন্যান্য</option>
          </select>
        </div>

        {/* এলাকা বা লোকেশন */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>এলাকা / স্থানের নাম:</label>
          <input type="text" placeholder="সমস্যাটি কোন এলাকায়?" required style={{ width: '96%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* বিবরণ */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>বিস্তারিত বিবরণ:</label>
          <textarea rows="4" placeholder="সমস্যাটি সম্পর্কে বিস্তারিত লিখুন..." required style={{ width: '96%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}></textarea>
        </div>

        {/* ছবি আপলোড */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ছবি বা প্রমাণ (যদি থাকে):</label>
          <input type="file" style={{ padding: '10px' }} />
        </div>

        {/* বাটন */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, backgroundColor: '#f42a41', cursor: 'pointer' }}>অভিযোগ দাখিল করুন</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', background: '#ddd', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>বাতিল</button>
        </div>

      </form>
    </div>
  );
}

export default ReportProblem;