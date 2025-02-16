import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationDetails from '../../components/Locations/Locations_components/LocationDetails';

const mockFacility = {
  name: "St. Mary’s Specialist Clinic",
  distance: "1.5 km",
  hours: "9 AM - 9 PM",
  rating: 5,
};

describe("LocationDetails Component", () => {
  test("renders facility details correctly", () => {
    render(<LocationDetails facility={mockFacility} onBack={() => {}} />);

    expect(screen.getByText("St. Mary’s Specialist Clinic")).toBeInTheDocument();
    expect(screen.getByText("1.5 km")).toBeInTheDocument();
    expect(screen.getByText("Hours: 9 AM - 9 PM")).toBeInTheDocument();
  });

  test("calls onBack when back button is clicked", () => {
    const onBackMock = jest.fn();
    render(<LocationDetails facility={mockFacility} onBack={onBackMock} />);

    fireEvent.click(screen.getByText("← Back"));
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });
});
