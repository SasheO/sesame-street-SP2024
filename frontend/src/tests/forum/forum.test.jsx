import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ✅ Import MemoryRouter
import Forum from "../../components/Forum/Forum";
import React from "react";

describe("Forum Page", () => {
  test("renders forum page correctly", () => {
    render(
      <MemoryRouter>  {/* ✅ Wrap Forum in a MemoryRouter */}
        <Forum />
      </MemoryRouter>
    );

    expect(screen.getByText(/Community forum/i)).toBeInTheDocument();
  });
});
