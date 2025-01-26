import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  // Handle login
  const handleLogin = (values) => {
    console.log("Login attempt:", values);
    if (values.email === "test@example.com" && values.password === "password123") {
      navigate("/home"); // Redirect to Home Page
    } else {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <Formik initialValues={{ email: "", password: "" }} validationSchema={validationSchema} onSubmit={handleLogin}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <div>
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error-message" />
            </div>
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
