import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchBar from '../../components/HomePage/HomePage_components/SearchBar';

test('renders search bar with icons and input field', () => {
    render(<SearchBar />);
  
    // Check for the search input field
    const inputElement = screen.getByPlaceholderText(/Find a simple remedy/i);
    expect(inputElement).toBeInTheDocument();
  
    // Check for the search icon using aria-label
    const searchIcon = screen.getByLabelText(/Search icon/i);
    expect(searchIcon).toBeInTheDocument();
  
    // Check for the microphone icon using aria-label
    const micIcon = screen.getByLabelText(/Microphone icon/i);
    expect(micIcon).toBeInTheDocument();
  });