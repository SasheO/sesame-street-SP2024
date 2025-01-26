import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  // Initial user data (replace this with real user data from a backend)
  const initialUserData = {
    name: "John Doe",
    username: "johndoe",
    preferredLanguage: "English",
    gender: "Male",
    birthdate: "2000-01-01",
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
    username: Yup.string().min(3, "Username must be at least 3 characters").required("Username is required"),
    preferredLanguage: Yup.string().required("Preferred language is required"),
    gender: Yup.string().required("Gender is required"),
    birthdate: Yup.date().required("Birthdate is required"),
  });

  // Handle profile update
  const handleProfileUpdate = (values) => {
    console.log("Updated Profile:", values);
    setSuccessMessage("Profile updated successfully!");
    
    setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3s
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      <Formik initialValues={initialUserData} validationSchema={validationSchema} onSubmit={handleProfileUpdate}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Name:</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            <div>
              <label>Username:</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error-message" />
            </div>
            <div>
              <label>Preferred Language:</label>
              <Field as="select" name="preferredLanguage">
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese">Chinese</option>
                <option value="Yoruba">Yoruba</option>
              </Field>
              <ErrorMessage name="preferredLanguage" component="div" className="error-message" />
            </div>
            <div>
              <label>Gender:</label>
              <Field as="select" name="gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="error-message" />
            </div>
            <div>
              <label>Birthdate:</label>
              <Field type="date" name="birthdate" />
              <ErrorMessage name="birthdate" component="div" className="error-message" />
            </div>
            <button type="submit" disabled={isSubmitting}>Save Changes</button>
          </Form>
        )}
      </Formik>
      <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Profile;
