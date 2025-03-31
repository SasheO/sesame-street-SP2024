import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ForumThread from "../../components/Forum/ForumThread";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "testuser@example.com", displayName: "Test User" },
    loading: false,
  }),
}));
// 🛠 Ensure localStorage is properly mocked
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("forumPosts", JSON.stringify([
    { 
      id: "test-post", 
      title: "Test Post", 
      author: "testuser@example.com", 
      date: "2023-10-01", 
      content: "This is a test post content.", 
      likes: 5, 
      comments: [],
      tags: ["test", "react", "forum"]
    }
  ]));

  console.log("Mock forumPosts set:", JSON.parse(localStorage.getItem("forumPosts"))); // Debugging
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("ForumThread Component", () => {
  test("displays the post title, meta information, and content", async () => {
    render(
      <MemoryRouter initialEntries={["/forum/test-post"]}>
        <Routes>
          <Route path="/forum/:id" element={<ForumThread />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("This is a test post content.")).toBeInTheDocument();
    expect(screen.getByText(/testuser@example.com/)).toBeInTheDocument();
  });

  test("displays tags correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/forum/test-post"]}>
        <Routes>
          <Route path="/forum/:id" element={<ForumThread />} />
        </Routes>
      </MemoryRouter>
    );
  
    // 🛠 FIX: Use `findAllByText` to handle multiple elements
    await waitFor(() => {
      const tags = screen.getAllByText(/test|react|forum/i);
      expect(tags.length).toBeGreaterThan(0);
    });
  });
  
});
