import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Forum from "../components/forum/forum";
import ForumThread from "../components/Forum/ForumThread"; // Correct component
import CreatePost from "../components/Forum/CreatePost";


describe("Forum Page", () => {
  test("clicking a post navigates to the thread view", () => {
    render(
      <MemoryRouter initialEntries={["/forum"]}>
        <Routes>
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/:id" element={<ForumThread />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate clicking a post
    const post = screen.getByText("Local herbs for migraine"); // Adjust if needed
    fireEvent.click(post);

    // Expect the thread page to be displayed
    expect(screen.getByText(/Back to Forum/i)).toBeInTheDocument();
  });

  test("clicking the create post button navigates to create post page", () => {
    render(
      <MemoryRouter initialEntries={["/forum"]}>
        <Routes>
          <Route path="/forum" element={<Forum />} />
          <Route path="/forum/create" element={<CreatePost />} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate clicking the create post button
    const createPostBtn = screen.getByTestId("create-post-btn");
    fireEvent.click(createPostBtn);

    // Expect the create post page to be displayed
    expect(screen.getByText("Create a New Post")).toBeInTheDocument();
  });
});
