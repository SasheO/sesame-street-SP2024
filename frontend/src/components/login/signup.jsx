import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./signup.css";
import { BiShow, BiHide } from "react-icons/bi"; // ✅ Import eye icons
import { auth, db } from "../../firebase";  // Import Firebase config - Angelica
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext"; // ✅ Import Auth Context



const SignUp = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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


  const handleSignUp = async (values, { setSubmitting }) => {
    setErrorMessage(""); // Reset previous errors
  
    try {
      const { firstname, lastname, email, password, role } = values;
  
      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ User Created:", user);
  
      // ✅ Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        first_name: firstname,
        surname: lastname,
        email: values.email,
        role: values.role,
        profilePic: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",  // Default profile picture
        createdAt: new Date(),
      });
  
      console.log("✅ User Data Saved to Firestore");

    //    // ✅ Store user session in localStorage
    //    localStorage.setItem("loggedInUser", JSON.stringify({
    //     uid: user.uid,
    //     email: user.email,
    //     first_name: firstname,
    //     surname: lastname,
    //     role: role
    // }));
  
      // ✅ Store session in Firebase (Automatically managed)
      setUser(user);
      // Redirect based on role
      // navigate(role === "doctor" ? "/doctor-dashboard" : "/home");
      navigate("/");
  
    } catch (error) {
      console.error("❌ Sign-up error:", error.message);
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
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

            {/* Password Input with Eye Icon */}
            <div className="form-group password-container">
              <label>Password:</label>
              <Field 
                type={passwordVisible ? "text" : "password"} 
                name="password" 
                className="password-input"
                placeholder="Password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label="Toggle password visibility"
              >
                {passwordVisible ? <BiHide /> : <BiShow />}
              </button>
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            {/* Confirm Password Input with Eye Icon */}
            <div className="form-group password-container">
              <label>Confirm Password:</label>
              <Field 
                type={confirmPasswordVisible ? "text" : "password"} 
                name="confirmPassword" 
                className="password-input"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                aria-label="Toggle confirm password visibility"
              >
                {confirmPasswordVisible ? <BiHide /> : <BiShow />}
              </button>
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

      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
};

export default SignUp;
