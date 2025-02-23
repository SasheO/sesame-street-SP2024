import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../components/login/login.jsx";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// ✅ Mock Firebase Authentication properly
jest.mock("../../firebase", () => ({
  auth: { currentUser: null },
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({ currentUser: null })),
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.reject({ message: "Firebase: Error (auth/network-request-failed)." })
  ),
}));

describe("Login Component", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows error for invalid login", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "wrong@email.com" } });
      fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpass" } });
      fireEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    // ✅ Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });

    // ✅ Ensure Firebase auth was called with the entered credentials
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, "wrong@email.com", "wrongpass");
  });

  test("Password visibility toggle works correctly", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByRole("button", { name: "Toggle password visibility" });

    // ✅ Initially hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // ✅ Click to show password
    await act(async () => fireEvent.click(toggleButton));
    expect(passwordInput).toHaveAttribute("type", "text");

    // ✅ Click again to hide password
    await act(async () => fireEvent.click(toggleButton));
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
