import {Routes, Route} from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// import Header from './nav/Header';


function App({routes}) {
  
  return (
    <Routes>
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/*"        element={<DashboardPage />} />
    </Routes>
  );
}

export default App;
