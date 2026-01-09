import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function ApplyService() {
  const navigate = useNavigate();

  // ফর্ম সাবমিট হলে কি হবে
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('আপনার আবেদনটি সফলভাবে জমা হয়েছে! (ডেমো)');
    navigate('/dashboard'); // কাজ শেষে আবার ড্যাশবোর্ডে ফেরত যাবে
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: 'white', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#006a4e', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>নতুন সেবার আবেদন</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        
        {/* সেবার ধরন */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>সেবার ধরন নির্বাচন করুন:</label>
          <select style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}>
            <option>জন্ম নিবন্ধন সনদ</option>
            <option>জমির নামজারি (Mutation)</option>
            <option>নাগরিকত্ব সনদ</option>
            <option>ট্রেড লাইসেন্স</option>
          </select>
        </div>

        {/* নাম */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>আবেদনকারীর নাম:</label>
          <input type="text" placeholder="আপনার পূর্ণ নাম লিখুন" required style={{ width: '96%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* মোবাইল নম্বর */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>মোবাইল নম্বর:</label>
          <input type="text" placeholder="017xxxxxxxx" required style={{ width: '96%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }} />
        </div>

        {/* ডকুমেন্ট আপলোড */}
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>প্রয়োজনীয় কাগজপত্র (PDF/Image):</label>
          <input type="file" style={{ padding: '10px' }} />
        </div>

        {/* বাটন */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" className="btn-primary" style={{ flex: 1, cursor: 'pointer' }}>আবেদন জমা দিন</button>
          <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '10px', background: '#ddd', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>বাতিল</button>
        </div>

      </form>
    </div>
  );
}

export default ApplyService;