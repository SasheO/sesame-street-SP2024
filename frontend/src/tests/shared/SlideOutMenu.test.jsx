import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SlideOutMenu from "../../components/shared/SlideOutMenu";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({
    currentUser: { email: "testuser@example.com", displayName: "Test User" },
  })),
}));

describe("SlideOutMenu Component", () => {
  test("renders menu when open", () => {
    render(
      <MemoryRouter>
        <SlideOutMenu isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Healthcare near you")).toBeInTheDocument();
    expect(screen.getByText("Community forum")).toBeInTheDocument();
  });

  test("closes menu when close button is clicked", () => {
    const onCloseMock = jest.fn();
    render(
      <MemoryRouter>
        <SlideOutMenu isOpen={true} onClose={onCloseMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Close icon/i));

    expect(onCloseMock).toHaveBeenCalled();
  });

  test("navigates to the correct page when menu item is clicked", () => {
    render(
      <MemoryRouter>
        <SlideOutMenu isOpen={true} onClose={jest.fn()} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Community forum"));

    expect(mockNavigate).toHaveBeenCalledWith("/forum");
  });
});
