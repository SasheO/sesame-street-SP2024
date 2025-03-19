import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ForumThread from "../../components/Forum/ForumThread";
import React from "react";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "testuser@example.com", displayName: "Test User" },
    loading: false,
  }),
}));
// Mock localStorage before each test
beforeEach(() => {
  localStorage.setItem("forumPosts", JSON.stringify([
    { 
      id: "test-post", 
      title: "Test Post", 
      author: "testuser", 
      date: "2023-10-01", 
      content: "This is a test post.", 
      likes: 10, 
      comments: []
    }
  ]));
});

// Mock useNavigate to prevent navigation during tests
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

test("renders the post title and content", async () => {
  render(
    <MemoryRouter initialEntries={["/forum/test-post"]}>
      <Routes>
        <Route path="/forum/:id" element={<ForumThread />} />
      </Routes>
    </MemoryRouter>
  );
  // Wait for UI updates
  expect(await screen.findByText("Test Post")).toBeInTheDocument();
  expect(screen.getByText("This is a test post.")).toBeInTheDocument();
});

test("displays an error message when post is not found", async () => {
  localStorage.setItem("forumPosts", JSON.stringify([]));

  render(
    <MemoryRouter initialEntries={["/forum/test-post"]}>
      <Routes>
        <Route path="/forum/:id" element={<ForumThread />} />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText("⚠️ Post not found.")).toBeInTheDocument();
});

test("adds a new comment", async () => {
  render(
    <MemoryRouter initialEntries={["/forum/test-post"]}>
      <Routes>
        <Route path="/forum/:id" element={<ForumThread />} />
      </Routes>
    </MemoryRouter>
  );

  const commentInput = screen.getByPlaceholderText("Join the conversation");
  fireEvent.change(commentInput, { target: { value: "Great post!" } });
  fireEvent.click(screen.getByText("Reply"));

  expect(await screen.findByText("Great post!")).toBeInTheDocument();
});
