import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../components/login/login";

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
