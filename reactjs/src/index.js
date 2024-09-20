import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManageNews from './pages/ManageNews';
import Upload from './pages/Upload';
import Details from './pages/Details';
import Edit from './pages/Edit';
import LoginForm from './pages/Login';
import AuthLayout from './AuthLayout';
import AccountPage from './pages/AccountPage';
import Background from './pages/Background';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="/news" element={<ManageNews />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/background" element={<Background />} />
        </Route>
        <Route path="/login" element={<AuthLayout />}>
          <Route index element={<LoginForm />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
