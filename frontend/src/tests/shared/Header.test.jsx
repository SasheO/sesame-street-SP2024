import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../../components/shared/Header';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "testuser@example.com", displayName: "Test User" },
    loading: false,
  }),
}));
describe("Header Component", () => {
  test("renders the header with the given title and buttons", () => {
    const testLabel = "CareLink Home";
    render(
      <MemoryRouter>
        <Header label={testLabel} />
      </MemoryRouter>
    );

    // Check for the title
    expect(screen.getByText(testLabel)).toBeInTheDocument();

    // Check for menu button
    expect(screen.getByLabelText(/Menu/i)).toBeInTheDocument();

    // Check for profile icon
    expect(screen.getByLabelText(/Profile icon/i)).toBeInTheDocument();
  });

  test("renders with a different title when provided", () => {
    const testLabel = "Dashboard";
    render(
      <MemoryRouter>
        <Header label={testLabel} />
      </MemoryRouter>
    );

    expect(screen.getByText(testLabel)).toBeInTheDocument();
  });

  test("navigates to homepage when header title is clicked", () => {
    render(
      <MemoryRouter>
        <Header label="CareLink Home" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/CareLink Home/i));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("navigates to profile page when profile icon is clicked", () => {
    render(
      <MemoryRouter>
        <Header label="CareLink Home" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Profile icon/i));
    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  test("opens the slide-out menu when menu button is clicked", () => {
    render(
      <MemoryRouter>
        <Header label="CareLink Home" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Menu/i));
    expect(screen.getByTestId("slideout-menu")).toBeInTheDocument();
  });
});
