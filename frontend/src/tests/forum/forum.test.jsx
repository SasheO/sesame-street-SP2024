import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Forum from "../../components/forum/forum";
import React from "react";

describe("Forum Page", () => {
  test("clicking multiple tags filters the posts correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/forum"]}>
        <Routes>
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for tags to render
    const tagHealthList = await screen.findAllByTestId("tag-health");
    const tagHerbsList = await screen.findAllByTestId("tag-herbs");

    // Click the first occurrence of each tag
    fireEvent.click(tagHealthList[0]);
    fireEvent.click(tagHerbsList[0]);

    // Ensure selected tags appear
    await waitFor(() => {
      expect(screen.getByTestId("selected-tag-health")).toBeInTheDocument();
      expect(screen.getByTestId("selected-tag-herbs")).toBeInTheDocument();
    });

    // Ensure all posts containing "health" OR "herbs" remain visible
    expect(screen.getByText("Local herbs for migraine")).toBeInTheDocument();
    expect(screen.getByText("Benefits of turmeric")).toBeInTheDocument();
    expect(screen.getByText("Best teas for digestion?")).toBeInTheDocument();
    expect(screen.getByText("What type of herb is this?")).toBeInTheDocument(); // ✅ Should be visible

    // Ensure unrelated posts (ones that do not contain "health" or "herbs") are hidden
    // Since all posts contain at least one of the selected tags, nothing should be hidden
  });

  test("clicking the X on selected tags removes them one by one", async () => {
    render(
      <MemoryRouter initialEntries={["/forum"]}>
        <Routes>
          <Route path="/forum" element={<Forum />} />
        </Routes>
      </MemoryRouter>
    );

    // Click multiple tags
    const tagHealthList = await screen.findAllByTestId("tag-health");
    const tagHerbsList = await screen.findAllByTestId("tag-herbs");
    fireEvent.click(tagHealthList[0]);
    fireEvent.click(tagHerbsList[0]);

    // Ensure selected tags appear
    await waitFor(() => {
      expect(screen.getByTestId("selected-tag-health")).toBeInTheDocument();
      expect(screen.getByTestId("selected-tag-herbs")).toBeInTheDocument();
    });

    // Click the X to remove "health" tag
    const removeHealthTag = await screen.findByTestId("clear-tag-health");
    fireEvent.click(removeHealthTag);

    // Ensure "health" is removed but "herbs" remains
    await waitFor(() => {
      expect(screen.queryByTestId("selected-tag-health")).toBeNull();
      expect(screen.getByTestId("selected-tag-herbs")).toBeInTheDocument();
    });

    // Ensure posts that have "herbs" are still visible
    expect(screen.getByText("Best teas for digestion?")).toBeInTheDocument();
    expect(screen.getByText("What type of herb is this?")).toBeInTheDocument();
    expect(screen.getByText("Local herbs for migraine")).toBeInTheDocument();

    // Click the X to remove "herbs" tag
    const removeHerbsTag = await screen.findByTestId("clear-tag-herbs");
    fireEvent.click(removeHerbsTag);

    // Ensure all selected tags are gone
    await waitFor(() => {
      expect(screen.queryByTestId("selected-tag-health")).toBeNull();
      expect(screen.queryByTestId("selected-tag-herbs")).toBeNull();
    });

    // Ensure all posts are now visible again
    expect(screen.getByText("What type of herb is this?")).toBeInTheDocument();
    expect(screen.getByText("Best teas for digestion?")).toBeInTheDocument();
    expect(screen.getByText("Local herbs for migraine")).toBeInTheDocument();
    expect(screen.getByText("Benefits of turmeric")).toBeInTheDocument();
  });
});
