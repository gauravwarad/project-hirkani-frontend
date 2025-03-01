import React from "react";
import { Button } from "react-bootstrap";

function ProfilePage() {
  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      <p>Create an account to get started.</p>
      <Button variant="primary">Sign Up</Button>
    </div>
  );
}

export default ProfilePage;
