import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./signup.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // Validation Schema
  const validationSchema = Yup.object({
    firstname: Yup.string().min(2, "Too short!").required("First name is required"),
    lastname: Yup.string().min(2, "Too short!").required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    role: Yup.string().oneOf(["patient", "doctor"], "Please select a role").required("Role is required"),
  });

  // Handle Sign-Up
  const handleSignUp = (values) => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const userExists = users.some(user => user.email === values.email);
    if (userExists) {
      setErrorMessage("User already exists. Please log in.");
      return;
    }

    // Create new user object
    const newUser = {
      name: `${values.firstname} ${values.lastname}`,
      email: values.email,
      password: values.password,
      role: values.role, // Store user role
      profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Default profile picture
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("loggedInUser", JSON.stringify(newUser));

    console.log("✅ User Signed Up:", newUser);

    // Redirect based on role
    setTimeout(() => {
      if (values.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/home");
      }
    }, 2000);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <Formik
        initialValues={{ firstname: "", lastname: "", email: "", password: "", confirmPassword: "", role: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSignUp}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <div className="form-group">
              <label>First Name:</label>
              <Field type="text" name="firstname" />
              <ErrorMessage name="firstname" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <Field type="text" name="lastname" />
              <ErrorMessage name="lastname" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Password:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" className="error" />
            </div>

            {/* Role Selection */}
            <div className="form-group role-selection">
              <label>
                <Field type="radio" name="role" value="patient" />
                Patient
              </label>
              <label>
                <Field type="radio" name="role" value="doctor" />
                Doctor
              </label>
            </div>
            <ErrorMessage name="role" component="div" className="error" />

            <button type="submit" disabled={isSubmitting}>Sign Up</button>
          </Form>
        )}
      </Formik>

      <p>Already have an account? <a href="/">Log in</a></p>
    </div>
  );
};

export default SignUp;
