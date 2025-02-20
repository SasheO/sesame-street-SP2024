import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SearchResults from "../../components/HomePage/HomePage_Components/SearchResults";

// ✅ Properly Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SearchResults Component", () => {
  test("renders search results page correctly", () => {
    render(
      <MemoryRouter>
        <SearchResults />
      </MemoryRouter>
    );

    expect(screen.getByText(/Search Results for/i)).toBeInTheDocument();
  });

  test("displays articles matching the search query", () => {
    render(
      <MemoryRouter initialEntries={["/search-results?q=water"]}>
        <SearchResults />
      </MemoryRouter>
    );

    expect(screen.getByText("The Benefits of Drinking More Water")).toBeInTheDocument();
  });

  test("shows 'No results found' for unmatched queries", () => {
    render(
      <MemoryRouter initialEntries={["/search-results?q=xyz123"]}>
        <SearchResults />
      </MemoryRouter>
    );

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  test("navigates back when back button is clicked", () => {
    render(
      <MemoryRouter>
        <SearchResults />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("← Back"));
    
    // ✅ Ensure mockNavigate is correctly called
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
