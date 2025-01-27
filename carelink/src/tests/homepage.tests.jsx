import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../home_page/HomePage";

describe("HomePage Component", () => {
  test("renders home page", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText(/healthcare near you/i)).toBeInTheDocument();
    expect(screen.getByText(/chat with a doctor/i)).toBeInTheDocument();
  });

  test("navigates to profile", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByAltText(/profile/i));

    expect(window.location.pathname).toBe("/profile");
  });
});
