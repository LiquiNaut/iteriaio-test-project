import { screen } from "@testing-library/react";
import { renderWithRefine } from "../../../test/renderWithRefine";
import { DocumentEdit } from "../edit";
import { describe, it, expect, vi, beforeEach } from "vitest";
// import { mockDataProvider } from "../../../test/mocks/dataProvider";

describe("DocumentEdit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    renderWithRefine(<DocumentEdit />);

    // Čakáme na prvé pole (Name, nie všetky elementy s "Name")
    const nameFields = await screen.findAllByLabelText(/^Name$/i);
    expect(nameFields.length).toBeGreaterThan(0);
  });

  it("renders all form fields", async () => {
    renderWithRefine(<DocumentEdit />);

    const nameFields = await screen.findAllByLabelText(/^Name$/i);
    expect(nameFields.length).toBeGreaterThan(0);

    const typeFields = await screen.findAllByLabelText(/Document Type/i);
    expect(typeFields.length).toBeGreaterThan(0);

    const dateFields = await screen.findAllByLabelText(/Document Date/i);
    expect(dateFields.length).toBeGreaterThan(0);
  });

  it("renders document type select field", async () => {
    renderWithRefine(<DocumentEdit />);

    // Skontrolujeme, že existuje select pole pre typ dokumentu
    const typeField = await screen.findAllByLabelText(/Document Type/i);
    expect(typeField.length).toBeGreaterThan(0);
  });

  it("renders save button", async () => {
    renderWithRefine(<DocumentEdit />);

    const saveButton = await screen.findByRole("button", { name: /Save/i });
    expect(saveButton).toBeInTheDocument();
  });

  it("renders form structure", async () => {
    const { container } = renderWithRefine(<DocumentEdit />);

    // Skontrolujeme, že existuje formulár
    const form = container.querySelector("form");
    expect(form).toBeInTheDocument();

    // Skontrolujeme počet vstupných polí
    const inputs = container.querySelectorAll("input, select, textarea");
    expect(inputs.length).toBeGreaterThan(0);
  });
});
