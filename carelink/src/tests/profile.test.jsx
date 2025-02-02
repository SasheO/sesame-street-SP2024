import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "../components/profile/Profile";

describe("Profile Component", () => {
  beforeEach(() => {
    jest.spyOn(window, "confirm").mockImplementation(() => true); // ✅ Mock window.confirm()

    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ name: "Test User", email: "test@example.com", bio: "No bio set" })
    );

    localStorage.setItem(
      "users",
      JSON.stringify([{ name: "Test User", email: "test@example.com", bio: "No bio set" }])
    );
  });

  afterEach(() => {
    localStorage.clear(); // ✅ Reset local storage after each test
  });

  test("renders profile page", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByRole("heading", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test("allows user to edit profile", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    fireEvent.change(nameInput, { target: { value: "Updated User" } });

    const bioInput = screen.getByRole("textbox", { name: /bio/i });
    fireEvent.change(bioInput, { target: { value: "Updated Bio" } });

    fireEvent.click(screen.getByText(/save changes/i));

    expect(screen.getByText(/updated user/i)).toBeInTheDocument();
    expect(screen.getByText(/updated bio/i)).toBeInTheDocument();
  });

  test("logs out user", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/logout/i));

    expect(localStorage.getItem("loggedInUser")).toBeNull();
  });

  test("deletes user account", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/delete account/i));

    // ✅ Ensure local storage is updated correctly
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    expect(storedUsers.some(user => user.email === "test@example.com")).toBe(false);
  });
});
