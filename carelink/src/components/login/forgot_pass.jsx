import React, { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (email) {
      setMessage(`Password reset instructions sent to ${email}`);
    } else {
      setMessage("Please enter a valid email address.");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleReset}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Send Reset Instructions</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
