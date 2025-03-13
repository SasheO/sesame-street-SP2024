import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./login.css"; // ✅ Ensure CSS file exists
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";  // Import Firebase config
import { BiShow, BiHide } from "react-icons/bi"; // Import eye icons
import { useAuth } from "../../context/AuthContext"; // ✅ Import Auth Context
import { doc, getDoc } from "firebase/firestore"; // ✅ Import missing Firestore functions



const Login = () => {
  const { setUser } = useAuth(); 
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility state


  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });



  // const handleLogin = async (values) => {
  //   try {
  //     const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
  //     const user = userCredential.user;
  //     console.log("✅ User logged in:", userCredential.user);
  //     const userDoc = await getDoc(doc(db, "users", user.uid));

  //     if (userDoc.exists()) {
  //       const userData = userDoc.data();
  //       const userRole = userData.role; // Get role from Firestore

  //       // ✅ Store user session in localStorage
  //     localStorage.setItem("loggedInUser", JSON.stringify({
  //       email: user.email,
  //       uid: user.uid,
  //       role: userRole,
  //     }));

  //     navigate(userRole === "doctor" ? "/doctor-dashboard" : "/home");
  //   } else {
  //     console.error("❌ User role not found in Firestore");
  //     setErrorMessage("User data is incomplete. Please contact support.");
  //   }

  //     //navigate("/"); // Redirect to home page
  //   } catch (error) {
  //     console.error("❌ Login error:a", error.message);
  //     setErrorMessage("Invalid email or password.");
  //   }
  // }; 

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
  
      console.log("✅ User logged in:", user);
  
      // ✅ Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("✅ User Role:", userData.role);
  
        // ✅ Store user in AuthContext before navigation
        setUser({ ...user, ...userData });
  
        // ✅ Redirect based on role AFTER state update
        setTimeout(() => {
          navigate(userData.role === "doctor" ? "/doctor-dashboard" : "/home");
        }, 500); // Small delay to ensure UI updates
      } else {
        setErrorMessage("User data is incomplete. Please contact support.");
      }
    } catch (error) {
      console.error("❌ Login error:", error.message);
      setErrorMessage("Invalid email or password.");
    } finally {
      setSubmitting(false);
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
