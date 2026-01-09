import React from 'react';
import { useNavigate } from 'react-router-dom'; // ১. ইম্পোর্ট

function CitizenDashboard() {
  const navigate = useNavigate(); // ২. হুক কল

  const myApplications = [
    { id: 1, type: 'জন্ম নিবন্ধন', date: '১২-০১-২০২৫', status: 'Approved' },
    { id: 2, type: 'ট্রেড লাইসেন্স', date: '১৫-০১-২০২৫', status: 'Pending' },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', minHeight: '80vh' }}>
      <h1>স্বাগতম, নাগরিক ড্যাশবোর্ড</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        
        {/* কার্ড ১: আবেদন */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #006a4e', paddingBottom: '10px' }}>আমার আবেদনসমূহ</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {myApplications.map(app => (
              <li key={app.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <span>{app.type} ({app.date})</span>
                <span style={{ color: app.status === 'Approved' ? 'green' : 'orange', fontWeight: 'bold' }}>{app.status}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => navigate('/apply')} 
            style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#006a4e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            নতুন আবেদন করুন
          </button>
        </div>

        {/* কার্ড ২: অভিযোগ */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '2px solid #f42a41', paddingBottom: '10px' }}>আমার রিপোর্ট বা অভিযোগ</h3>
          <p>কোনো অভিযোগ পাওয়া যায়নি।</p>
          
          {/* ৩. এই বাটনটি এখন লাল করেছি এবং ক্লিক ঠিক করেছি */}
          <button 
            onClick={() => navigate('/report')}
            style={{ marginTop: '10px', width: '100%', padding: '10px', backgroundColor: '#f42a41', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            নতুন সমস্যা জানান
          </button>
        </div>

      </div>
    </div>
  );
}

export default CitizenDashboard;