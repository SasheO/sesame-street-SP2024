import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../components/login/login";
import { signInWithEmailAndPassword } from "firebase/auth";

describe("Login Component", () => {
  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("shows error for invalid login", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Simulate user input
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Email"), {
        target: { value: "wrong@email.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Password"), {
        target: { value: "wrongpass" },
      });
    });

    // Click login button
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      // Ensure error message appears
      expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
    });
  });

  test("Password visibility toggle works correctly", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password");
    const toggleButton = screen.getByLabelText("Toggle password visibility");

    // Initially, password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click to show password
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click again to hide password
    await act(async () => {
      fireEvent.click(toggleButton);
    });
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});


jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

test("successful login redirects the user", async () => {
  signInWithEmailAndPassword.mockResolvedValue({
    user: { uid: "123456", email: "testuser@example.com" },
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "ValidPassword123!" },
    });
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "testuser@example.com",
      "ValidPassword123!"
    );
  });

  // Check that user is redirected after successful login
  expect(window.location.pathname).not.toBe("/login");
});

test("shows validation errors when fields are empty", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});

test("displays Firebase error message when login fails", async () => {
  signInWithEmailAndPassword.mockRejectedValue(new Error("Firebase: Error (auth/user-not-found)."));

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "nonexistentuser@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "SomeRandomPass!" },
    });
  });

  fireEvent.click(screen.getByRole("button", { name: "Login" }));

  await waitFor(() => {
    expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
  });
});
