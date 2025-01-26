import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Handle Sign Up
  const handleSignUp = (values) => {
    console.log("User Signed Up:", values);
    setSuccessMessage("Account created successfully! Redirecting...");
    
    setTimeout(() => navigate("/"), 2000); // Redirect to login page after 2s
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      <Formik initialValues={{ name: "", email: "", password: "", confirmPassword: "" }} validationSchema={validationSchema} onSubmit={handleSignUp}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
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
            <div>
              <label>Confirm Password:</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>Sign Up</button>
          </Form>
        )}
      </Formik>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
};

export default SignUp;
