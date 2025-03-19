import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DoctorPatientsPage from "../../components/Doctor_view/DoctorPatientsPage";

jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { email: "testuser@example.com", displayName: "Test User" },
    loading: false,
  }),
}));

describe("DoctorPatientsPage", () => {
  let mockUpdateDoctorStatus;

  beforeEach(() => {
    mockUpdateDoctorStatus = jest.fn(); 
  });

  test("renders the page with correct elements", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Doctor's Patients")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search patients")).toBeInTheDocument();
    expect(screen.getByText("Current Patients")).toBeInTheDocument();
    expect(screen.getByText("Patient Requests")).toBeInTheDocument();
  });

  test("switches between Current Patients and Patient Requests tabs", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage updateDoctorStatus={mockUpdateDoctorStatus} />
      </MemoryRouter>
    );

    // Click "Patient Requests" tab
    fireEvent.click(screen.getByText("Patient Requests"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();
    expect(screen.queryByText("Patient One")).toBeNull();

    // Click "Current Patients" tab
    fireEvent.click(screen.getByText("Current Patients"));
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    expect(screen.getByText("Patient Two")).toBeInTheDocument();
    expect(screen.queryByText("Patient Three")).toBeNull();
  });

  test("accepting a patient request moves them to Current Patients", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage updateDoctorStatus={mockUpdateDoctorStatus} />
      </MemoryRouter>
    );

    // Switch to patient requests
    fireEvent.click(screen.getByText("Patient Requests"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();

    // Accept the patient
    fireEvent.click(screen.getAllByText("Accept")[0]);

    // Check that updateDoctorStatus was called correctly
    expect(mockUpdateDoctorStatus).toHaveBeenCalledWith(3, "accepted");

    // Switch to current patients and check if patient is there
    fireEvent.click(screen.getByText("Current Patients"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();
  });

  test("denying a patient request removes them from the list", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage updateDoctorStatus={mockUpdateDoctorStatus} />
      </MemoryRouter>
    );

    // Switch to patient requests
    fireEvent.click(screen.getByText("Patient Requests"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();

    // Deny the patient
    fireEvent.click(screen.getByText("Deny"));

    // Ensure patient is removed
    expect(screen.queryByText("Patient Three")).toBeNull();
  });

  test("search filters the displayed patients", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage/>
      </MemoryRouter>
    );

    // Ensure all current patients are visible
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    expect(screen.getByText("Patient Two")).toBeInTheDocument();

    // Search for "Patient One"
    fireEvent.change(screen.getByPlaceholderText("Search patients"), { target: { value: "Patient One" } });

    // Ensure only "Patient One" is visible
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    expect(screen.queryByText("Patient Two")).toBeNull();
  });

  test("clicking on a patient opens the patient details page", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage />
      </MemoryRouter>
    );

    // Click on "Patient One"
    fireEvent.click(screen.getByText("Patient One"));

    // Expect the details page to open
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    expect(screen.getByText("Edit Notes")).toBeInTheDocument();
  });
});
