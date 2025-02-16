import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./signup.css";
import { auth, db } from "../../firebase";  // Import Firebase config - Angelica
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
  });

  // // Handle sign-up
  // const handleSignUp = (values) => {
  //   let users = JSON.parse(localStorage.getItem("users")) || [];

  //   // Check if user already exists
  //   const userExists = users.some(user => user.email === values.email);
  //   if (userExists) {
  //     setErrorMessage("User already exists. Please log in.");
  //     return;
  //   }

  //   // Create new user object
  //   const newUser = {
  //     name: values.name,
  //     email: values.email,
  //     password: values.password,
  //     profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Default profile picture
  //   };

  //   users.push(newUser);
  //   localStorage.setItem("users", JSON.stringify(users));
  //   localStorage.setItem("loggedInUser", JSON.stringify(newUser));

  //   console.log("✅ User Signed Up:", newUser);
  //   navigate("/");
  // };
  // ✅ Handle sign-up by calling Firebase backend
  const handleSignUp = async (values) => {
    setErrorMessage(""); // Reset previous error

    // // Split the full name into first name and surname
    // const [first_name, ...surnameArr] = values.name.trim().split(" ");
    // const surname = surnameArr.join(" ") || "Unknown"; // Default if no surname provided

    try {
      const response = await fetch("https://app-jpiptb5loq-uc.a.run.app/sign_up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          first_name: values.firstname,
          surname: values.lastname,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Sign-up failed");
      }

      console.log("✅ User Signed Up:", data);
      navigate("/login"); // Redirect to login page after successful sign-up
      console.log("Navigating to login page...");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Formik
        initialValues={{ firstname: "", lastname: "", email: "", password: "", confirmPassword: "" }}
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

            <button type="submit" disabled={isSubmitting}>Sign Up</button>
          </Form>
        )}
      </Formik>

      <p>Already have an account? <a href="/">Log in</a></p>
    </div>
  );
};

export default SignUp;
