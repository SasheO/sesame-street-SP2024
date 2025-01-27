import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "./Profile";

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({ name: "Test User", email: "test@example.com", bio: "Hello world!" })
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("renders the profile page with user details", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });

  test("allows editing and saving profile details", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Edit Profile"));
    const bioInput = screen.getByLabelText(/bio/i);
    fireEvent.change(bioInput, { target: { value: "Updated bio!" } });
    fireEvent.click(screen.getByText("Save Changes"));

    expect(screen.getByText("Updated bio!")).toBeInTheDocument();
  });

  test("logs out when logout button is clicked", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Logout"));
    expect(localStorage.getItem("loggedInUser")).toBeNull();
  });
});
