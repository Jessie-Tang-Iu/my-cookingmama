"use client";

import { useEffect, useState } from 'react';

export default function MyComponent({ name }) {

  const [users, setUsers] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/user.json')
      .then((res) => res.json())
      .then((json) => setUsers(json));
  }, []);

  useEffect(() => {
    if (users && name) {
      const foundUser = users.find((u) => u.userName === name);
      setUser(foundUser);
    }
  }, [users, name]);

  if (!users) return <p>Loading users...</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div>
      <h1>User Name: {user.userName}</h1>
      <p>Password: {user.password}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}