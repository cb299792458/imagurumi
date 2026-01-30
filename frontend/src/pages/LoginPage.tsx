import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");
        try {
        const response = await fetch("http://localhost:4000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            query: `
                mutation Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                    token
                    user { id email username }
                }
                }
            `,
            variables: { email, password },
            }),
        });

        const result = await response.json();

        if (result.errors) {
            throw new Error(result.errors[0].message);
        }
        localStorage.setItem("token", result.data.login.token);
        navigate("/");
        } catch (err:any) {
        setError(err.message || "Login failed");
        console.error(err);
        }
    };

    return (
        <Layout>
        <div className={styles.authWrapper}>
            <div className={styles.authForm}>
            <h2>Login</h2>

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

            <button onClick={handleLogin}>Login</button>
            <div className={styles.signupRow}>
                <span>Not a user?</span>
                <NavLink to="/signup" className={styles.signupLink}>
                    Signup
                </NavLink>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            </div>
        </div>
        </Layout>
    );
}
