import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Profile from "../components/profile/Profile";

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.setItem("loggedInUser", JSON.stringify({ name: "Test User", email: "test@example.com" }));
  });

  test("renders profile page", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  test("allows user to edit profile", () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText(/edit profile/i));
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Updated User" } });
    fireEvent.click(screen.getByText(/save changes/i));

    expect(screen.getByText(/updated user/i)).toBeInTheDocument();
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

    expect(localStorage.getItem("users")).not.toContain("test@example.com");
  });
});
