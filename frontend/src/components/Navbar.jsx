import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-semibold" to="/">
          Task Manager
        </Link>
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          <span className="text-light small d-none d-sm-inline">{user.email}</span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
