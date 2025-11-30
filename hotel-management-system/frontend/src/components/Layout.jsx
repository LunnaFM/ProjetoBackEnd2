import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">🏨 Hotel Management</h1>
          <nav className="nav">
            <Link to="/dashboard" className={isActive('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/clientes" className={isActive('/clientes')}>
              Clientes
            </Link>
            <Link to="/quartos" className={isActive('/quartos')}>
              Quartos
            </Link>
            <Link to="/reservas" className={isActive('/reservas')}>
              Reservas
            </Link>
          </nav>
          <div className="user-info">
            <span>👤 {user?.nome}</span>
            <button onClick={handleLogout} className="btn-logout">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <p>© 2024 Hotel Management System - UTFPR</p>
      </footer>
    </div>
  );
};

export default Layout;
