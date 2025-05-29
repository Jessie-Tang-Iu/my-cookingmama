"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Page() {

    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [users, setUsers] = useState(null);

    const [user, setUser] = useState(null);
    
      useEffect(() => {
        fetch('/user.json')
          .then((res) => res.json())
          .then((json) => setUsers(json));
      }, []);

    useEffect(() => {
        if (users && userName) {
        const foundUser = users.find((u) => u.userName === userName);
        setUser(foundUser);
        }
    }, [users, userName]);

    function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!userName || !password) {
            setError("Please enter both user name and password.")
            return;
        }

        setLoading(true);

        setTimeout(function () {
            if (userName === user.userName && password === user.password) {
                alert("Login successful!");
                router.push(`../userProfile?userName=${encodeURIComponent(userName)}`)             
            }
            else
            {
                setError("Invalid User Name or Password");
            }
            setLoading(false);
        }, 1000);
    }

    return (
        <main style={{ maxWidth: 400, margin: "2rem auto" }}>
            <h1 className="text-3xl font-bold">Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userName">User Name: </label>
                <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={function (e) {
                        setUserName(e.target.value);
                    }}
                    disabled={loading}
                    required
                    style={{ width: "100%", marginBottom: "1rem", borderWidth: 2, borderColor: "#1f1f1f" }}
                />

                <label htmlFor="password">Password: </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={function (e) {
                        setPassword(e.target.value);
                    }}
                    disabled={loading}
                    required
                    style={{ width: "100%", marginBottom: "1rem", borderWidth: 2, borderColor: "#1f1f1f" }}
                />

                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>

            </form>
            {/* <Link href="/" className="text-cyan-600 underline hover:text-cyan-300">Home</Link> */}
        </main>
    );
}