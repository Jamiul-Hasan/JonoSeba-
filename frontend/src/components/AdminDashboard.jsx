import React, { useState } from 'react';

function AdminDashboard() {
  const [applications, setApplications] = useState([
    { id: 1, name: 'রহিম উদ্দিন', service: 'জন্ম নিবন্ধন', status: 'Pending' },
    { id: 2, name: 'করিম শেখ', service: 'ট্রেড লাইসেন্স', status: 'Pending' },
  ]);

  return (
    <div style={{ padding: '20px', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center' }}>অ্যাডমিন প্যানেল</h1>
      <div style={{ maxWidth: '800px', margin: '20px auto', background: 'white', padding: '20px', borderRadius: '10px' }}>
        <h3>আবেদন যাচাই-বাছাই</h3>
        <ul>
          {applications.map(app => (
            <li key={app.id} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
              {app.name} - {app.service} ({app.status})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;