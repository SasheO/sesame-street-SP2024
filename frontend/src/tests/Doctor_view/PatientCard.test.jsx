import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PatientCard from "../../components/Doctor_view/PatientCard";

describe("PatientCard", () => {
  const mockPatient = {
    id: 1,
    name: "Test Patient",
    condition: "Test Condition",
    alertLevel: "⚠️",
    image: "/images/patient1.jpg",
  };

  test("renders patient card correctly", () => {
    render(<PatientCard patient={mockPatient} onClick={() => {}} />);
    expect(screen.getByText("Test Patient")).toBeInTheDocument();
    expect(screen.getByText("Test Condition")).toBeInTheDocument();
  });

  test("calls onAccept function when Accept button is clicked", () => {
    const onAcceptMock = jest.fn();
    render(<PatientCard patient={mockPatient} onAccept={onAcceptMock} onDeny={() => {}} />);

    fireEvent.click(screen.getByText("Accept"));
    expect(onAcceptMock).toHaveBeenCalledTimes(1);
  });

  test("calls onDeny function when Deny button is clicked", () => {
    const onDenyMock = jest.fn();
    render(<PatientCard patient={mockPatient} onAccept={() => {}} onDeny={onDenyMock} />);

    fireEvent.click(screen.getByText("Deny"));
    expect(onDenyMock).toHaveBeenCalledTimes(1);
  });
});
