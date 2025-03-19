import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DoctorsPage from "../../components/Doctors/DoctorsPage";

describe("DoctorsPage", () => {
  let mockOnDoctorRequest;
  let mockDoctors;

  beforeEach(() => {
    mockOnDoctorRequest = jest.fn();
    mockDoctors = [
      { id: 1, name: "Dr. Alice", hospital: "General Hospital", specialty: "Cardiology", requested: false },
      { id: 2, name: "Dr. Bob", hospital: "City Hospital", specialty: "Dermatology", requested: true },
    ];
  });

  test("renders the DoctorsPage with search bar and filter buttons", () => {
    render(
      <MemoryRouter>
        <DoctorsPage onDoctorRequest={mockOnDoctorRequest} doctors={mockDoctors} />
      </MemoryRouter>
    );

    expect(screen.getByText("Carelink")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Have a doctor in mind?")).toBeInTheDocument();
    expect(screen.getByText("Available Doctors")).toBeInTheDocument();
    expect(screen.getByText("Requested Doctors")).toBeInTheDocument();
  });

  test("displays only available doctors by default", () => {
    render(
      <MemoryRouter>
        <DoctorsPage onDoctorRequest={mockOnDoctorRequest} doctors={mockDoctors} />
      </MemoryRouter>
    );

    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Bob")).toBeNull();
  });

  test("switches to requested doctors when clicking 'Requested Doctors'", () => {
    render(
      <MemoryRouter>
        <DoctorsPage onDoctorRequest={mockOnDoctorRequest} doctors={mockDoctors} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Requested Doctors"));

    expect(screen.getByText("Dr. Bob")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Alice")).toBeNull();
  });

  test("filters doctors based on search input", () => {
    render(
      <MemoryRouter>
        <DoctorsPage onDoctorRequest={mockOnDoctorRequest} doctors={mockDoctors} />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Have a doctor in mind?");
    fireEvent.change(searchInput, { target: { value: "Alice" } });

    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Bob")).toBeNull();
  });

  test("selecting a doctor opens DoctorDetails page", () => {
    render(
      <MemoryRouter>
        <DoctorsPage onDoctorRequest={mockOnDoctorRequest} doctors={mockDoctors} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Dr. Alice"));

    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.getByText("Request Doctor")).toBeInTheDocument();
  });
});
