import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Forum from "../../components/Forum/Forum";

// Mock React Router's useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    "forumPosts",
    JSON.stringify([
      {
        id: "mock-1",
        title: "Local herbs for migraine",
        user: "@username1",
        date: "Dec 1, 2023",
        content:
          "Natural remedies may help prevent the onset of migraine attacks. Here are some tips. This is a long enough text to trigger the 'Read More' button...",
        likes: 3456,
        comments: [],
        tags: ["health", "migraine", "herbs"],
      },
      {
        id: "mock-2",
        title: "What type of herb is this?",
        user: "@username2",
        date: "Jan 23, 2024",
        content: "I came across this plant, does anyone know what this is?",
        likes: 2540,
        comments: [],
        tags: ["plants", "herbs", "identification"],
      },
    ])
  );
});

test("filters posts by multiple selected tags", () => {
  render(
    <MemoryRouter>
      <Forum />
    </MemoryRouter>
  );

  // Use `getAllByText` and find the correct "migraine" tag span
  const migraineTag = screen.getAllByText(/migraine/i).find(
    (element) => element.tagName.toLowerCase() === "span"
  );
  fireEvent.click(migraineTag);

  const herbsTag = screen.getAllByText(/herbs/i).find(
    (element) => element.tagName.toLowerCase() === "span"
  );
  fireEvent.click(herbsTag);

  expect(screen.getByText(/Local herbs for migraine/i)).toBeInTheDocument();
  expect(screen.queryByText(/What type of herb is this?/i)).not.toBeInTheDocument();
});

test("truncates content and shows 'Read More' option", () => {
  render(
    <MemoryRouter>
      <Forum />
    </MemoryRouter>
  );

  // Check truncated text appears
  expect(
    screen.getByText(/Natural remedies may help prevent the onset of migraine attacks.../i)
  ).toBeInTheDocument();

  // Ensure "Read More" button is rendered
  expect(
    screen.getByText((content, element) => {
      return element.tagName.toLowerCase() === "button" && /Read More/i.test(content);
    })
  ).toBeInTheDocument();
});

test("clicking 'Read More' navigates to full post", () => {
  const mockNavigate = jest.fn();
  useNavigate.mockReturnValue(mockNavigate);

  render(
    <MemoryRouter>
      <Forum />
    </MemoryRouter>
  );

  const readMoreButton = screen.getByText(/Read More/i);
  fireEvent.click(readMoreButton);

  // Confirm navigation was triggered
  expect(mockNavigate).toHaveBeenCalledWith("/forum/mock-1", expect.any(Object));
});
