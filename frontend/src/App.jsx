import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Login from './components/Login';
import CitizenDashboard from './components/CitizenDashboard';
import ApplyService from './components/ApplyService';
import ReportProblem from './components/ReportProblem';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer'; // এই লাইনটি চেক করুন
import './App.css';

function Home() {
  return (
    <>
      <Hero />
      <Services />
    </>
  );
}

function App() {
  return (
    <div className="page-container">
      <Navbar />
      
      <div className="content-wrap">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/apply" element={<ApplyService />} />
          <Route path="/report" element={<ReportProblem />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      <Footer /> 
    </div>
  )
}

export default App;