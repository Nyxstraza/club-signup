import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import type { MemberRecord } from "../../types/SignUpFormData";

const ALL_CLUBS = "All clubs";

function AdminDashboardPage() {
  const { isAdmin, logout } = useAdminAuth();
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clubFilter, setClubFilter] = useState(ALL_CLUBS);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/members")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load members.");
        return res.json();
      })
      .then((data: MemberRecord[]) => setMembers(data))
      .catch(() => setError("Could not load members from the server."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // Distinct clubs actually present in the data, so the filter only ever
  // offers choices that exist (and updates itself as new clubs appear).
  const clubOptions = useMemo(() => {
    const unique = Array.from(new Set(members.map((m) => m.club))).sort();
    return [ALL_CLUBS, ...unique];
  }, [members]);

  const visibleMembers = useMemo(
    () => (clubFilter === ALL_CLUBS ? members : members.filter((m) => m.club === clubFilter)),
    [members, clubFilter]
  );

  // Route guard: bounce back to login if not authenticated
  if (!isAdmin) return <Navigate to="/admin" replace />;

  function handleLogout() {
    logout();
    navigate("/admin");
  }

  async function handleRemove(id: number) {
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="page page-wide">
      <div className="card">
        <div className="dashboard-header">
          <h2>
            Registered Members ({visibleMembers.length}
            {clubFilter !== ALL_CLUBS ? ` of ${members.length}` : ""})
          </h2>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </div>

        {loading && <p className="subtitle">Loading…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && members.length === 0 && (
          <p className="subtitle">No registrations yet.</p>
        )}

        {!loading && !error && members.length > 0 && (
          <>
            <div className="filter-row">
              <label htmlFor="clubFilter">Filter by club</label>
              <select
                id="clubFilter"
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
              >
                {clubOptions.map((club) => (
                  <option key={club} value={club}>
                    {club}
                  </option>
                ))}
              </select>
            </div>

            {visibleMembers.length === 0 ? (
              <p className="subtitle">No members registered under {clubFilter}.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Club</th>
                      <th>Registered</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleMembers.map((m) => (
                      <tr key={m.id}>
                        <td>
                          {m.firstName} {m.lastName}
                        </td>
                        <td>{m.email}</td>
                        <td>{m.club}</td>
                        <td>{new Date(m.registeredAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => handleRemove(m.id)}>
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
