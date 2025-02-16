import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationsPage from '../../components/Locations/LocationsPage';
import DummyLocations from '../../components/Locations/DummyLocations.json';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: jest.fn(() => ({ pathname: "/" })),
}));

describe("LocationsPage Component", () => {
  test("renders the header and search bar", () => {
    render(<LocationsPage />);
    
    expect(screen.getByText("Carelink")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Hospitals near me")).toBeInTheDocument();
  });

  test("renders a list of facilities", () => {
    render(<LocationsPage />);
    
    DummyLocations.forEach((facility) => {
      expect(screen.getByText(facility.name)).toBeInTheDocument();
    });
  });

  test("navigates to facility details when clicked", () => {
    render(<LocationsPage />);
  
    const firstFacility = DummyLocations[0];
  
    // Click on the first facility
    fireEvent.click(screen.getByText(firstFacility.name));
  
    // Instead of `waitFor()`, just check directly
    expect(screen.getByText(new RegExp(`Hours:\\s*${firstFacility.hours}`, "i"))).toBeInTheDocument();
  });
  
  test("returns to locations list when back button is clicked", () => {
    render(<LocationsPage />);
    
    fireEvent.click(screen.getByText(DummyLocations[0].name));
    fireEvent.click(screen.getByText("← Back"));
    
    DummyLocations.forEach((facility) => {
      expect(screen.getByText(facility.name)).toBeInTheDocument();
    });
  });
});
