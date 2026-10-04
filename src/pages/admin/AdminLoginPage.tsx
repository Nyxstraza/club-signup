import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const ok = await login(username, password);
      if (ok) navigate("/admin/dashboard");
      else setError("Invalid username or password.");
    } catch {
      setError("Could not reach the server. Is it running?");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Checking…" : "Log In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
