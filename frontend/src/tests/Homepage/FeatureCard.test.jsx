import React from 'react';
import { render, screen } from '@testing-library/react';
import { BiMap } from 'react-icons/bi';
import FeatureCard from '../../components/HomePage/HomePage_components/FeatureCard';

test('renders feature card with icon and label', () => {
  render(<FeatureCard Icon={BiMap} label="Healthcare near you" />);

  // Check for the label text
  const labelElement = screen.getByText(/Healthcare near you/i);
  expect(labelElement).toBeInTheDocument();

  // Check for the icon using aria-label
  const iconElement = screen.getByLabelText(/Icon for Healthcare near you/i);
  expect(iconElement).toBeInTheDocument();
});
