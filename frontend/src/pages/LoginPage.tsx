import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import styles from "./LoginPage.module.css";
import { LOGIN } from "../utilities/gql";
import { useMutation } from "@apollo/client";
    

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [login] = useMutation(LOGIN);

    useEffect(() => {
        const token = localStorage.getItem("imagurumiToken");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await login({
                variables: { email, password },
            });

            localStorage.setItem("imagurumiToken", data.login.token);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Login failed");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className={styles.authWrapper}>
                <div className={styles.authForm}>
                    <h2>Login</h2>

                    <form onSubmit={handleLogin} className={styles.formContainer}>
                        <div className={styles.inputs}>
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
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

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
