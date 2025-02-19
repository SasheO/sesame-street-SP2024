import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../../components/shared/SearchBar';

describe("SearchBar Component", () => {
    test("renders search bar with input field and icons", () => {
        const placeholderText = "Find a simple remedy"; // Correct placeholder
        render(<SearchBar placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        expect(inputElement).toBeInTheDocument();

        const searchIcon = screen.getByLabelText(/Search icon/i);
        expect(searchIcon).toBeInTheDocument();

        const micIcon = screen.getByLabelText(/Microphone icon/i);
        expect(micIcon).toBeInTheDocument();
    });

    test("calls onSearch when search icon is clicked", () => {
        const placeholderText = "Find a simple remedy";
        const onSearchMock = jest.fn();
        render(<SearchBar onSearch={onSearchMock} placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        const searchIcon = screen.getByLabelText(/Search icon/i);

        fireEvent.change(inputElement, { target: { value: "herbs" } }); // Ensure input is set
        fireEvent.click(searchIcon);

        expect(onSearchMock).toHaveBeenCalledWith("herbs");
    });

    test("updates input value when typing", () => {
        const placeholderText = "Find a simple remedy";
        render(<SearchBar placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        fireEvent.change(inputElement, { target: { value: "migraine" } });

        expect(inputElement.value).toBe("migraine");
    });

    test("calls onSearch when Enter key is pressed", () => {
        const placeholderText = "Find a simple remedy";
        const onSearchMock = jest.fn();
        render(<SearchBar onSearch={onSearchMock} placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        fireEvent.change(inputElement, { target: { value: "migraine" } });
        fireEvent.keyDown(inputElement, { key: "Enter", code: "Enter" });

        expect(onSearchMock).toHaveBeenCalledWith("migraine");
    });

    test("calls onSearch automatically when typing if autoSearch is enabled", () => {
        const placeholderText = "Find a simple remedy";
        const onSearchMock = jest.fn();
        render(<SearchBar onSearch={onSearchMock} autoSearch={true} placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        fireEvent.change(inputElement, { target: { value: "tea" } });

        expect(onSearchMock).toHaveBeenCalledWith("tea");
    });

    test("clears input and resets search when clear button is clicked", () => {
        const placeholderText = "Find a simple remedy";
        const onSearchMock = jest.fn();
        render(<SearchBar onSearch={onSearchMock} initialValue="digestion" placeholder={placeholderText} />);

        const inputElement = screen.getByPlaceholderText(placeholderText);
        expect(inputElement.value).toBe("digestion");

        const clearButton = screen.getByLabelText(/Clear search/i);
        fireEvent.click(clearButton);

        expect(inputElement.value).toBe(""); // Input should be cleared
        expect(onSearchMock).toHaveBeenCalledWith(""); // onSearch should be called with an empty string
    });

    test("does not show clear button when input is empty", () => {
        const placeholderText = "Find a simple remedy";
        render(<SearchBar placeholder={placeholderText} />);
        
        const clearButton = screen.queryByLabelText(/Clear search/i);
        expect(clearButton).toBeNull(); // Clear button should not be rendered initially
    });

    test("shows clear button when input is not empty", () => {
        const placeholderText = "Find a simple remedy";
        render(<SearchBar initialValue="turmeric" placeholder={placeholderText} />);

        const clearButton = screen.getByLabelText(/Clear search/i);
        expect(clearButton).toBeInTheDocument();
    });
});
