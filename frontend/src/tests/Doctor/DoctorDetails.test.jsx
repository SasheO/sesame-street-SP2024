import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DoctorDetails from "../../components/Doctors/Doctors_components/DoctorDetails";

describe("DoctorDetails", () => {
  let mockDoctor;
  let mockOnBack;
  let mockOnDoctorRequest;

  beforeEach(() => {
    mockOnBack = jest.fn();
    mockOnDoctorRequest = jest.fn();
    mockDoctor = {
      id: 1,
      name: "Dr. Alice",
      hospital: "General Hospital",
      specialty: "Cardiology",
      bio: "Experienced cardiologist",
      requested: false,
      accepted: false,
      image: "/doctor-alice.jpg"
    };
  });

  test("renders doctor details correctly", () => {
    render(<DoctorDetails doctor={mockDoctor} onBack={mockOnBack} onDoctorRequest={mockOnDoctorRequest} />);

    expect(screen.getByText("Dr. Alice")).toBeInTheDocument();
    expect(screen.getByText("General Hospital")).toBeInTheDocument();
    expect(screen.getByText("Cardiology")).toBeInTheDocument();
    expect(screen.getByText("Experienced cardiologist")).toBeInTheDocument();
    expect(screen.getByText("Request Doctor")).toBeInTheDocument();
  });

  test("calls onBack when back button is clicked", () => {
    render(<DoctorDetails doctor={mockDoctor} onBack={mockOnBack} onDoctorRequest={mockOnDoctorRequest} />);

    const backIcon = screen.getByTestId("back-icon"); 
    fireEvent.click(backIcon);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test("submits doctor request", () => {
    render(<DoctorDetails doctor={mockDoctor} onBack={mockOnBack} onDoctorRequest={mockOnDoctorRequest} />);

    fireEvent.click(screen.getByText("Request Doctor"));

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your phone number"), { target: { value: "123-456-7890" } });
    fireEvent.change(screen.getByPlaceholderText("Enter your health condition(s)"), { target: { value: "High blood pressure" } });
    fireEvent.change(screen.getByPlaceholderText("Describe your symptoms"), { target: { value: "Frequent dizziness and headaches" } });
    fireEvent.click(screen.getByText("Submit Request"));

    expect(mockOnDoctorRequest).toHaveBeenCalledWith({
      id: 1,
      name: "John Doe",
      condition: "High blood pressure",
      alertLevel: "Low",
      type: "requests",
      image: "/doctor-alice.jpg",
    });
  });
});
