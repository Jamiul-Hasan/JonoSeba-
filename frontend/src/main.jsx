import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // ১. রাউটার ইম্পোর্ট

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ২. পুরো অ্যাপকে রাউটারের ভেতর রাখলাম */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)