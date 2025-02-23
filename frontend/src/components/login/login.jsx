import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ Ensure CSS file exists
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";  // Import Firebase config
import { BiShow, BiHide } from "react-icons/bi"; // Import eye icons


const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state


  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // // Handle login
  // const handleLogin = (values) => {
  //   let users = JSON.parse(localStorage.getItem("users")) || []; // Get all registered users
  //   console.log("🔍 Users in storage:", users); // Debugging log
  
  //   const user = users.find(user => user.email === values.email && user.password === values.password);
  //   if (user) {
  //     console.log("✅ User authenticated:", user);
  //     localStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Save user in storage
  //     navigate("/"); // ✅ Redirect to Home Page
  //   } else {
  //     console.log("❌ Invalid email or password.");
  //     setErrorMessage("Invalid email or password.");
  //   }
  // };

  const handleLogin = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("✅ User logged in:", userCredential.user);
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("❌ Login error:", error.message);
      setErrorMessage("Invalid email or password.");
    }
  };

  const handleSignUp = (values) => {
    let users = JSON.parse(localStorage.getItem("users")) || []; // Get existing users
    const userExists = users.some(user => user.email === values.email);
  
    if (userExists) {
      setErrorMessage("User already exists. Please log in.");
    } else {
      const newUser = { name: values.name, email: values.email, password: values.password }; // ✅ Ensure only necessary fields
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users)); // ✅ Save updated user list
      console.log("✅ User signed up:", newUser);
      setSuccessMessage("Account created! Redirecting...");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2s
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleLogin}>
        {({ isSubmitting }) => (
          <Form>
            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" className="error-message" />

            {/* Password Input with Eye Icon */}
            {/* Password Input with Eye Icon */}
            <div className="password-container">
              <Field 
                type={passwordVisible ? "text" : "password"} 
                name="password" 
                placeholder="Password" 
                className="password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label="Toggle password visibility"
              >
                {passwordVisible ? <BiHide /> : <BiShow />}
              </button>
            </div>          
            <ErrorMessage name="password" component="div" className="error-message" />
            <button type="submit" disabled={isSubmitting}>Login</button>
          </Form>
        )}
      </Formik>
      <p>Forgot your password? <a href="/forgot-password">Reset here</a></p>
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
    </div>
  );
};

export default Login;
