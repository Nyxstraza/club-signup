import { Link } from "react-router-dom";

function ShieldMark() {
  return (
    <svg
      className="shield-mark"
      viewBox="0 0 40 46"
      width="30"
      height="34"
      aria-hidden="true"
    >
      <path
        d="M20 2 L37 9 V22 C37 33 30 41 20 44 C10 41 3 33 3 22 V9 Z"
        fill="#0B2545"
        stroke="#E6B325"
        strokeWidth="2"
      />
      <path
        d="M20 10 L22.9 16.4 L29.8 17.1 L24.6 21.7 L26.1 28.5 L20 25 L13.9 28.5 L15.4 21.7 L10.2 17.1 L17.1 16.4 Z"
        fill="#E6B325"
      />
    </svg>
  );
}

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <ShieldMark />
        <span>Club Sign-Up</span>
      </Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
