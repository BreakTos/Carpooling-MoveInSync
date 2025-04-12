import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './Home';
import AuthForm from './AuthForm';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute'

function App() {
  return(
    <>
      <Router>
        <Routes>
        <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
        <Route path="/auth" element={<PublicRoute> <AuthForm /> </PublicRoute>} />
      </Routes>
      </Router>
    </>
  )
}

export default App;
