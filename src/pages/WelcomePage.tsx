import { Navigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

function WelcomePage() {
  const { user } = useUser();

  // If Context is empty (the user landed here without signing up),
  // send them back to the Sign Up page
  if (!user) return <Navigate to="/signup" replace />;

  return (
    <div className="page">
      <div className="card">
        <h2>✅ Welcome, {user.firstName}!</h2>
        <p className="subtitle">This data comes from Context — no props were passed.</p>
        <dl className="summary">
          <dt>Username</dt>
          <dd>{user.username}</dd>
          <dt>Email</dt>
          <dd>{user.email}</dd>
          <dt>Full Name</dt>
          <dd>
            {user.firstName} {user.middleInitial} {user.lastName}
          </dd>
          <dt>Gender</dt>
          <dd>{user.gender}</dd>
          <dt>Birthday</dt>
          <dd>{user.birthday}</dd>
          <dt>Address</dt>
          <dd>{user.address}</dd>
          <dt>Club</dt>
          <dd>{user.club}</dd>
        </dl>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
