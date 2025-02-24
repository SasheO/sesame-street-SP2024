import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DoctorPatientsPage from "../../components/Doctor_view/DoctorPatientsPage";

describe("DoctorPatientsPage", () => {
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
        <DoctorPatientsPage />
      </MemoryRouter>
    );

    // Click "Patient Requests" tab
    fireEvent.click(screen.getByText("Patient Requests"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();

    // Click "Current Patients" tab
    fireEvent.click(screen.getByText("Current Patients"));
    expect(screen.getByText("Patient One")).toBeInTheDocument();
    expect(screen.getByText("Patient Two")).toBeInTheDocument();
  });

  test("accepting a patient request moves them to Current Patients", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage />
      </MemoryRouter>
    );

    // Switch to patient requests
    fireEvent.click(screen.getByText("Patient Requests"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();

    // Accept the patient
    fireEvent.click(screen.getByText("Accept"));

    // Switch to current patients and check if patient is there
    fireEvent.click(screen.getByText("Current Patients"));
    expect(screen.getByText("Patient Three")).toBeInTheDocument();
  });

  test("denying a patient request removes them from the list", () => {
    render(
      <MemoryRouter>
        <DoctorPatientsPage />
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
});
