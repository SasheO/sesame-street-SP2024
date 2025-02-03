import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchBar from '../../components/shared/SearchBar';

test('renders search bar with input field and icons', () => {
    const placeholderText = "Find a simple remedy";
    render(<SearchBar placeholder={placeholderText} />);
  
    // Check for the search input field
    const inputElement = screen.getByPlaceholderText(placeholderText);
    expect(inputElement).toBeInTheDocument();
  
    // Check for the search icon
    const searchIcon = screen.getByLabelText(/Search icon/i);
    expect(searchIcon).toBeInTheDocument();
  
    // Check for the microphone icon
    const micIcon = screen.getByLabelText(/Microphone icon/i);
    expect(micIcon).toBeInTheDocument();
});

test('renders search bar with a different placeholder', () => {
    const placeholderText = "Search for anything";
    render(<SearchBar placeholder={placeholderText} />);
  
    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();
});
