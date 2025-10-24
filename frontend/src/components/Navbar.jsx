import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./navbar.css";
import ThemeToggle from "./ThemeToggle";
import WriteIcon from "./icons/WriteIcon";
import LogoutIcon from "./icons/LogoutIcon";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="nav">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
        <div className="nav-left">
          <Link to="/" className="logo"><span className="dot" /> BlogStation</Link>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <ThemeToggle />

          <button className="hamburger" aria-label="Open menu" onClick={()=>setOpen(s=>!s)}>
            <span className="bar" />
            <span className="bar" style={{width:16}} />
            <span className="bar" style={{width:12}} />
          </button>

          <div className="nav-right">
            {isAuthenticated() ? (
              <>
                <Link to="/write" className="nav-link" title="Write"><WriteIcon fill="#fff" /></Link>
                <button onClick={handleLogout} className="nav-link btn" title="Logout"><LogoutIcon fill="#fff" /></button>
                <span className="nav-user">{user?.username}</span>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      { /* mobile menu */ }
      {open && (
        <div className="mobile-menu" role="menu" onClick={()=>setOpen(false)}>
          {isAuthenticated() ? (
            <>
              <Link to="/write" className="nav-link" role="menuitem">Write</Link>
              <button onClick={handleLogout} className="nav-link btn" role="menuitem">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" role="menuitem">Login</Link>
              <Link to="/register" className="nav-link" role="menuitem">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
