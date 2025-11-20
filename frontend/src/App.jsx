import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import MovieCard from "./MovieCard";
import MovieListView from "./MovieListView";
import SearchIcon from "./search.svg";

const API_KEY = "17e094fe4d43dd69063e8122d425a71a";
const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`;
const BACKEND_URL = `${(import.meta.env.VITE_API_URL || "http://localhost:5500")}/api/v1/auth`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Controlled inputs for authentication form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // View toggle state
  const [view, setView] = useState("search"); // "search" | "watchlist" | "watched"

  
  const searchMovies = async (title) => {
    try {
      const cleanTitle = title.trim();
      if (!cleanTitle) {
        setError("Please enter a movie title to search.");
        return;
      }

      setError(null);
      const response = await fetch(
        `${API_URL}&query=${encodeURIComponent(cleanTitle)}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const rawResults = data.results || [];

      // FILTER: remove movies without poster_path or without release_date
      const filtered = rawResults.filter((m) => {
        const hasPoster = !!(m.poster_path && m.poster_path.trim());
        const hasRelease = !!(m.release_date && m.release_date.trim());
        return hasPoster && hasRelease;
      });

      setMovies(filtered);
      if (filtered.length === 0) setError("No movies found for the given search term.");
    } catch (error) {
      console.error("Failed to fetch movies:", error.message);
      setError("Failed to fetch movies. Please try again later.");
    }
  };


  useEffect(() => {
    searchMovies("Batman");
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.className === "form-popup") setShowForm(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedEmail = localStorage.getItem("userEmail");
    if (token && storedEmail) setUser({ email: storedEmail, token });
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formType === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const endpoint = formType === "login" ? "sign-in" : "sign-up";
      const payload =
        formType === "login"
          ? { email, password }
          : { name: email.split("@")[0], email, password };

      const { data } = await axios.post(`${BACKEND_URL}/${endpoint}`, payload);

      setUser({ email: data.data.user.email, token: data.data.token });
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("userEmail", data.data.user.email);

      setShowForm(false);
      setError(null);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const token = user?.token;
      if (!token) return;

      await axios.post(
        `${BACKEND_URL}/sign-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      setUser(null);
    } catch (err) {
      console.error("Sign out failed:", err.message);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>MovieLand</h1>
        {user ? (
          <img
            src="https://i.pinimg.com/474x/2a/fe/8a/2afe8a2aa5ab2402671ac8b536ca6516.jpg"
            alt="Sign-out"
            className="signout-btn"
            onClick={handleSignOut}
          />
        ) : (
          <img
            src="https://cdn-icons-png.flaticon.com/256/3541/3541871.png"
            alt="Account"
            className="account-icon"
            onClick={() => setShowForm(true)}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="view-toggle">
        <button onClick={() => setView("search")}>Search Movies</button>
        <button onClick={() => setView("watchlist")}>My Watchlist</button>
        <button onClick={() => setView("watched")}>My Watched</button>
      </div>

      {/* Search view */}
      {view === "search" && (
        <>
          <div className="search">
            <input
              placeholder="Search for movies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchTerm.trim()) {
                  searchMovies(searchTerm);
                }
              }}
            />
            <img
              src={SearchIcon}
              alt="Search"
              onClick={() => {
                if (searchTerm.trim()) searchMovies(searchTerm);
                else setError("Please enter a movie title to search.");
              }}
            />
          </div>

          {error && (
            <div className="empty">
              <h3>{error}</h3>
            </div>
          )}

          {movies.length > 0 && !error ? (
            <div className="container">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} user={user} />
              ))}
            </div>
          ) : null}
        </>
      )}

      {/* Watchlist or Watched view */}
      {view !== "search" && <MovieListView status={view} user={user} />}

      {/* Auth popup */}
      {showForm && (
        <div className="form-popup">
          <div className="form-box">
            <h2>{formType === "login" ? "Login" : "Sign Up"}</h2>
            <form onSubmit={handleAuthSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {formType === "signup" && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : formType === "login"
                  ? "Login"
                  : "Sign Up"}
              </button>
            </form>
            <p>
              {formType === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <span
                onClick={() =>
                  setFormType(formType === "login" ? "signup" : "login")
                }
              >
                {formType === "login" ? "Sign up" : "Login"}
              </span>
            </p>
            <button className="close-btn" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
