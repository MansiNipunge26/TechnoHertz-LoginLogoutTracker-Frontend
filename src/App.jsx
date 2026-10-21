
import { useEffect, useState } from "react";
import "./App.css";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}

function formatDuration(seconds) {
  if (seconds == null) return "In progress";

  const total = Math.max(0, Number(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

function App() {
  const [username, setUsername] = useState("mansi");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [employeeName, setEmployeeName] = useState("Employee");
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  async function loadHistory(id) {
    const response = await fetch(`/api/auth/history/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not load session history.");
    }

    setHistory(Array.isArray(data) ? data : []);
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const body = new URLSearchParams();
      body.append("username", username.trim());
      body.append("password", password);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            (response.status === 409
              ? "An active session already exists for this user."
              : "Login failed. Check your username and password.")
        );
      }

      const newSessionId = data.id ?? data.sessionId;
      const newUserId = data.user?.id ?? data.userId;

      if (newSessionId == null || newUserId == null) {
        throw new Error(
          "Login succeeded, but the response did not include the session ID and user ID."
        );
      }

      setSessionId(newSessionId);
      setUserId(newUserId);
      setEmployeeName(
        data.user?.fullName || data.user?.username || username
      );
      setLoggedIn(true);
      setPage("Dashboard");
      setPassword("");
      setMessageType("success");
      setMessage("Login successful. Welcome to TechnoHertz!");

      try {
        await loadHistory(newUserId);
      } catch (historyError) {
        setMessage(historyError.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage(error.message || "Unable to connect to the server.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    if (sessionId == null) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/auth/logout/${sessionId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || "Logout failed. Please try again."
        );
      }

      if (userId != null) {
        try {
          await loadHistory(userId);
        } catch {
          // The logout request succeeded; history can be refreshed later.
        }
      }

      setLoggedIn(false);
      setSessionId(null);
      setUserId(null);
      setPassword("");
      setPage("Dashboard");
      setMessageType("success");
      setMessage("You have logged out successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to log out.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loggedIn || userId == null) return undefined;

    const interval = setInterval(() => {
      loadHistory(userId).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [loggedIn, userId]);

  const totalSessions = history.length;
  const activeSessions = history.filter(
    (item) => String(item.status || "").toUpperCase() === "ACTIVE"
  ).length;
  const completedSessions = history.filter(
    (item) => String(item.status || "").toUpperCase() === "COMPLETED"
  ).length;
  const totalSeconds = history.reduce(
    (sum, item) => sum + Number(item.durationSeconds || 0),
    0
  );

  const filteredHistory = history.filter((item) => {
    const text = [
      item.id,
      item.status,
      item.loginTime,
      item.logoutTime,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      String(item.status || "").toUpperCase() === filter.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  if (!loggedIn) {
    return (
      <main className="login-page">
        <section className="login-brand-panel">
          <div className="brand-lockup">
            <div className="brand-symbol">TH</div>
            <div>
              <div className="brand-name">TechnoHertz</div>
              <div className="brand-subtitle">WORKSPACE</div>
            </div>
          </div>

          <div className="brand-message">
            <span className="eyebrow">EMPLOYEE WORKSPACE</span>
            <h1>Every workday, in one place.</h1>
            <p>
              Manage your attendance, monitor login sessions, and keep track
              of your workday with your employee dashboard.
            </p>
            <div className="brand-feature">
              <span className="feature-check">✓</span>
              Secure employee access
            </div>
            <div className="brand-feature">
              <span className="feature-check">✓</span>
              Transparent session tracking
            </div>
            <div className="brand-feature">
              <span className="feature-check">✓</span>
              Your activity in one workspace
            </div>
          </div>

          <div className="brand-footer">
            © 2026 TechnoHertz · Employee Portal
          </div>
        </section>

        <section className="login-form-panel">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="mobile-brand">TECHNOHERTZ</div>
            <span className="eyebrow">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p className="muted">
              Enter your employee credentials to continue.
            </p>

            {message && (
              <div className={`notice ${messageType}`} role="alert">
                {message}
              </div>
            )}

            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <button className="primary-button login-button" disabled={loading}>
              {loading ? "Signing in..." : "Sign in to workspace"}
              {!loading && <span>→</span>}
            </button>

            <div className="login-security">
              <span>♧</span> Secure employee login
            </div>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-symbol">TH</div>
          <div>
            <div className="brand-name">TechnoHertz</div>
            <div className="brand-subtitle">WORKSPACE</div>
          </div>
        </div>

        <div className="nav-caption">WORKSPACE</div>

        <nav className="navigation">
          <button
            className={page === "Dashboard" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("Dashboard")}
          >
            <span>▦</span> Dashboard
          </button>
          <button
            className={
              page === "Session History" ? "nav-item active" : "nav-item"
            }
            onClick={() => setPage("Session History")}
          >
            <span>◷</span> Session History
          </button>
          <button
            className={page === "My Profile" ? "nav-item active" : "nav-item"}
            onClick={() => setPage("My Profile")}
          >
            <span>♙</span> My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="online-indicator">
            <span className="green-dot" />
            System connected
          </div>
          <div className="sidebar-user">
            <div className="avatar">{employeeName.charAt(0).toUpperCase()}</div>
            <div className="sidebar-user-info">
              <strong>{employeeName}</strong>
              <span>Employee</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{page}</strong>
          </div>
          <div className="topbar-right">
            <span className="online-indicator">
              <span className="green-dot" /> Online
            </span>
            <div className="avatar small">
              {employeeName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content">
          {message && (
            <div className={`notice ${messageType}`} role="status">
              {message}
              <button
                className="notice-close"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                ×
              </button>
            </div>
          )}

          {page === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">OVERVIEW</span>
                  <h1>Good to see you, {employeeName.split(" ")[0]}.</h1>
                  <p>Here is an overview of your employee sessions.</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() =>
                    loadHistory(userId).catch((error) => {
                      setMessage(error.message);
                      setMessageType("error");
                    })
                  }
                >
                  ↻ Refresh
                </button>
              </div>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total sessions</span>
                    <span className="stat-icon purple">▤</span>
                  </div>
                  <strong className="stat-number">{totalSessions}</strong>
                  <span className="stat-description">Recorded sessions</span>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Active sessions</span>
                    <span className="stat-icon green">◉</span>
                  </div>
                  <strong className="stat-number">{activeSessions}</strong>
                  <span className="stat-description">Currently active</span>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Completed sessions</span>
                    <span className="stat-icon blue">✓</span>
                  </div>
                  <strong className="stat-number">{completedSessions}</strong>
                  <span className="stat-description">Successfully logged out</span>
                </div>
                <div className="stat-card">
                  <div className="stat-top">
                    <span>Total tracked time</span>
                    <span className="stat-icon orange">◷</span>
                  </div>
                  <strong className="stat-number">
                    {formatDuration(totalSeconds)}
                  </strong>
                  <span className="stat-description">Recorded duration</span>
                </div>
              </section>

              <SessionTable
                history={history.slice(0, 5)}
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                fullHistory={false}
              />

              <div className="dashboard-footer">
                <span>Showing your five most recent sessions</span>
                <button className="text-button" onClick={() => setPage("Session History")}>
                  View all sessions →
                </button>
              </div>
            </>
          )}

          {page === "Session History" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">ACTIVITY</span>
                  <h1>Session history</h1>
                  <p>Review your recorded login and logout activity.</p>
                </div>
                <button
                  className="secondary-button"
                  onClick={() =>
                    loadHistory(userId).catch((error) => {
                      setMessage(error.message);
                      setMessageType("error");
                    })
                  }
                >
                  ↻ Refresh
                </button>
              </div>
              <SessionTable
                history={filteredHistory}
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                fullHistory
              />
            </>
          )}

          {page === "My Profile" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">ACCOUNT</span>
                  <h1>My profile</h1>
                  <p>Your employee account information.</p>
                </div>
              </div>
              <section className="profile-card">
                <div className="profile-banner" />
                <div className="profile-details">
                  <div className="avatar profile-avatar">
                    {employeeName.charAt(0).toUpperCase()}
                  </div>
                  <h2>{employeeName}</h2>
                  <p className="muted">TechnoHertz employee</p>
                  <div className="profile-info-grid">
                    <div>
                      <span>Username</span>
                      <strong>{username}</strong>
                    </div>
                    <div>
                      <span>Employee / User ID</span>
                      <strong>{userId}</strong>
                    </div>
                    <div>
                      <span>Current session ID</span>
                      <strong>{sessionId}</strong>
                    </div>
                    <div>
                      <span>Account status</span>
                      <strong className="status-text">● Logged in</strong>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          <footer className="main-footer">
            <span>© 2026 TechnoHertz</span>
            <span>Login Logout Tracker · Employee Workspace</span>
          </footer>
        </div>
      </main>

      <button
        className="floating-logout"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? "Please wait..." : "↪ Log out"}
      </button>
    </div>
  );
}

function SessionTable({
  history,
  search,
  setSearch,
  filter,
  setFilter,
  fullHistory,
}) {
  return (
    <section className="table-card">
      <div className="table-heading">
        <div>
          <h2>{fullHistory ? "All sessions" : "Recent sessions"}</h2>
          <p>
            {fullHistory
              ? "All recorded login activity for your account."
              : "A quick look at your recent login activity."}
          </p>
        </div>
        <span className="record-count">{history.length} records</span>
      </div>

      <div className="table-tools">
        <div className="search-box">
          <span>⌕</span>
          <input
            aria-label="Search sessions"
            placeholder="Search sessions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter session status"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>SESSION ID</th>
              <th>LOGIN TIME</th>
              <th>LOGOUT TIME</th>
              <th>DURATION</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-state">
                  No sessions found. Try refreshing or changing the filter.
                </td>
              </tr>
            ) : (
              history.map((item) => {
                const status = String(item.status || "UNKNOWN").toUpperCase();

                return (
                  <tr key={item.id}>
                    <td className="session-id">#{item.id}</td>
                    <td>{formatDate(item.loginTime)}</td>
                    <td>{formatDate(item.logoutTime)}</td>
                    <td>{formatDuration(item.durationSeconds)}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          status === "ACTIVE" ? "active-status" : "done-status"
                        }`}
                      >
                        <span className="status-dot" />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
