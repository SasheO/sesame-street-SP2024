import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../../components/HomePage/HomePage_components/SearchBar";

describe("SearchBar Component", () => {
  test("renders the search bar", () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  test("updates value when typing", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "diabetes" } });
    expect(input.value).toBe("diabetes");
  });

  test("shows clear button when typing", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "flu symptoms" } });

    const clearButton = screen.getByTestId("clear-button");
    expect(clearButton).toBeInTheDocument();
  });

  test("clears search input when clicking clear button", () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search/i);
    const clearButton = screen.getByTestId("clear-button");

    fireEvent.change(input, { target: { value: "COVID-19" } });
    fireEvent.click(clearButton);
    expect(input.value).toBe("");
  });

  test("calls search function when submitting", () => {
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "exercise benefits" } });
    fireEvent

