import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import ApplicationForm from './pages/ApplicationForm';
import HazardReport from './pages/HazardReport';
import ThankYou from './pages/ThankYou';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/report-hazard" element={<HazardReport />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App; 