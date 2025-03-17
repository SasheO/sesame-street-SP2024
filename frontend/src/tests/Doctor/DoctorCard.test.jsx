import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DoctorCard from "../../components/Doctors/Doctors_components/DoctorCard";

describe("DoctorCard", () => {
  let mockDoctor;
  let mockOnClick;

  beforeEach(() => {
    mockOnClick = jest.fn();
    mockDoctor = {
      id: 1,
      name: "Dr. Alice",
      hospital: "General Hospital",
      specialty: "Cardiology",
      patients: "10",
      rating: 4,
      image: "/doctor-alice.jpg"
    };
  });

  test("renders doctor details correctly", () => {
    render(<DoctorCard doctor={mockDoctor} onClick={mockOnClick} />);

    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.getByText("General Hospital")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Hours: 10")).toBeInTheDocument();
  });

  test("calls onClick when doctor card is clicked", () => {
    render(<DoctorCard doctor={mockDoctor} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText("Dr. Alice"));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
