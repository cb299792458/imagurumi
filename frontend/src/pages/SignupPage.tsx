import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./SignupPage.module.css";
import { SIGNUP } from "../utilities/gql";
import { useMutation } from "@apollo/client";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [signup, { loading }] = useMutation(SIGNUP);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const { data } = await signup({ variables: { username, email, password } });
      localStorage.setItem("imagurumiToken", data.signup.token);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <Layout>
      <div className={styles.authWrapper}>
        <div className={styles.authForm}>
          <h2>Sign Up</h2>

          <form onSubmit={handleSignup} className={styles.formContainer}>
            <div className={styles.inputs}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>


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