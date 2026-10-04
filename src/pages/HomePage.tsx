import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="page">
      <div className="hero">
        <p className="pill">Office of Student Organizations</p>
        <h1>Join a club.</h1>
        <p className="hero-sub">
          Register in two short steps — an account, then a bit about you —
          and your club will have your details on file.
        </p>
        <Link to="/signup" className="btn btn-primary">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
