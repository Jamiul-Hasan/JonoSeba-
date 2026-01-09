import React from 'react';
import { useNavigate } from 'react-router-dom'; // ১. পেজ চেঞ্জ করার টুল

function Login() {
  const navigate = useNavigate(); // ২. টুলটা রেডি করলাম

  const handleLogin = () => {
    console.log("Button Clicked!"); // কনসোলে চেক করার জন্য
    navigate('/dashboard'); // ৩. বাটন টিপলে ড্যাশবোর্ডে নিয়ে যাবে
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', height: '60vh' }}>
      <h2>লগইন করুন</h2>
      <div style={{ maxWidth: '300px', margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="ইমেইল এড্রেস" style={{ padding: '10px' }} />
        <input type="password" placeholder="পাসওয়ার্ড" style={{ padding: '10px' }} />
        
        {/* ৪. বাটনে ক্লিক করলে handleLogin ফাংশন চলবে */}
        <button 
          onClick={handleLogin} 
          className="btn-primary"
          style={{ padding: '10px', backgroundColor: '#f42a41', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          লগইন
        </button>
      </div>
    </div>
  );
}

export default Login;