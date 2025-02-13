import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationCard from '../../components/Locations/Locations_components/LocationCard';

const mockFacility = {
  id: 1,
  name: "Children’s National Hospital",
  image: "hospital.jpg",
  distance: "2 km",
  hours: "24 hrs",
  rating: 4,
};

describe("LocationCard Component", () => {
  test("renders facility details correctly", () => {
    render(<LocationCard facility={mockFacility} onClick={() => {}} />);

    expect(screen.getByText("Children’s National Hospital")).toBeInTheDocument();
    expect(screen.getByText("2 km")).toBeInTheDocument();
    expect(screen.getByText("Hours: 24 hrs")).toBeInTheDocument();
    expect(screen.getByAltText("Children’s National Hospital")).toBeInTheDocument();
  });

  test("triggers onClick when clicked", () => {
    const onClickMock = jest.fn();
    render(<LocationCard facility={mockFacility} onClick={onClickMock} />);

    fireEvent.click(screen.getByText("Children’s National Hospital"));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
