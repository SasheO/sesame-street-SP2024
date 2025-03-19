import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreatePost from "../../components/forum/CreatePost";

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

test("renders create post form", () => {
  render(
    <MemoryRouter>
      <CreatePost />
    </MemoryRouter>
  );

  expect(screen.getByText("Create a New Post")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter a descriptive title...")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Write your post here...")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("e.g. health, wellness, herbal")).toBeInTheDocument();
});

test("submits a new post and redirects", () => {
  render(
    <MemoryRouter>
      <CreatePost />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("Enter a descriptive title..."), {
    target: { value: "New Test Post" },
  });

  fireEvent.change(screen.getByPlaceholderText("Write your post here..."), {
    target: { value: "This is the test post content." },
  });

  fireEvent.change(screen.getByPlaceholderText("e.g. health, wellness, herbal"), {
    target: { value: "test, react" },
  });

  fireEvent.click(screen.getByText("Post"));

  expect(mockNavigate).toHaveBeenCalledWith("/forum");
});
