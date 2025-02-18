import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CreatePost from "../components/Forum/CreatePost";

describe("Create Post Page", () => {
  test("renders create post page correctly", () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    expect(screen.getByText("Create a New Post")).toBeInTheDocument();
  });

  test("user can enter post details", () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter a descriptive title..."), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write your post here..."), {
      target: { value: "Test Content" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. health, wellness, herbs"), {
      target: { value: "health, herbs" },
    });

    expect(screen.getByPlaceholderText("Enter a descriptive title...").value).toBe("Test Title");
    expect(screen.getByPlaceholderText("Write your post here...").value).toBe("Test Content");
    expect(screen.getByPlaceholderText("e.g. health, wellness, herbs").value).toBe("health, herbs");
  });

  

  test("clicking back button navigates back", () => {
    render(
      <MemoryRouter initialEntries={["/create-post"]}>
        <Routes>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/forum" element={<div>Forum Posts</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("← Back to Forum"));

    expect(screen.getByText("Forum Posts")).toBeInTheDocument();
  });
});
