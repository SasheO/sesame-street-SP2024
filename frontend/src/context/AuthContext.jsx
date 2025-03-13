import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔥 Checking Firebase Auth State...");
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("✅ Firebase Auth User:", firebaseUser);
            setLoading(true);

            if (firebaseUser) {
                try {
                    const userDocRef = doc(db, "users", firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        console.log("📌 Firestore User Data:", userData);

                        // ✅ Merge Firestore data (profilePic, role, etc.)
                        setUser({ ...firebaseUser, ...userData });
                    } else {
                        console.warn("⚠️ No Firestore data found.");
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("⚠️ Firestore Error:", error);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

