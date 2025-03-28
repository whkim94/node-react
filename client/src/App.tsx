import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactNode } from 'react';
import { RootState } from './store';
import Login from './components/Login';
import Register from './components/Register';
import InvoiceListPage from './pages/InvoiceListPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/invoices" 
          element={
            <ProtectedRoute>
              <InvoiceListPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
