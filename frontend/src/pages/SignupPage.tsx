import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./SignupPage.module.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_GRAPHQL_BACKEND_URL;


  const handleSignup = async () => {
    setError("");
    setSuccess(false);

    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation Signup($username: String!, $email: String!, $password: String!) {
              signup(username: $username, email: $email, password: $password) {
                token
                user { id username email }
              }
            }
          `,
          variables: { username, email, password },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const token = result.data.signup.imagurumiToken;
      localStorage.setItem("imagurumiToken", token);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Signup failed");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className={styles.authWrapper}>
        <div className={styles.authForm}>
          <h2>Sign Up</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSignup}>Sign Up</button>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>Signed up successfully! Redirecting...</p>}

          <p className={styles.loginRedirect}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className={styles.loginLink}>
              Log in
            </span>
          </p>
        </div>
      </div>
    </Layout>
  );
}