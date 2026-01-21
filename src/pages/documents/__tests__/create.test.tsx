import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRefine } from "../../../test/renderWithRefine";
import { DocumentCreate } from "../create";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../../hooks/useUploadDocument", () => ({
  UppyUploader: ({ onUploadComplete }: any) => (
    <div data-testid="uppy-uploader">
      <button onClick={() => onUploadComplete("userId/test-file.pdf", 1024)}>
        Mock Upload
      </button>
    </div>
  ),
}));

vi.mock("@refinedev/core", async () => {
  const actual = await vi.importActual("@refinedev/core");
  return {
    ...actual,
    useGetIdentity: () => ({
      data: { id: "test-user-id" },
      isLoading: false,
      error: null,
    }),
  };
});

describe("DocumentCreate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", async () => {
    renderWithRefine(<DocumentCreate />);
    expect(await screen.findByText(/Upload a new document/i),).toBeInTheDocument();
  });

  it("renders all form fields", async () => {
    renderWithRefine(<DocumentCreate />);
    expect(await screen.findByLabelText(/Document Name/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Category/i)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Date of issue/i)).toBeInTheDocument();
  });

  it("renders category options", async () => {
    renderWithRefine(<DocumentCreate />);
    const categoryField = await screen.findByLabelText(/Category/i);
    expect(categoryField).toBeInTheDocument();
    await userEvent.click(categoryField);
    expect(await screen.findByRole("option", { name: /Invoice/i }),).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: /Phone Bill/i }),).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: /Refueling/i }),).toBeInTheDocument();
    expect(await screen.findByRole("option", { name: /Bank Statement/i }),).toBeInTheDocument();
  });

  it("renders save button", async () => {
    renderWithRefine(<DocumentCreate />);
    expect(
      await screen.findByRole("button", { name: /Save Document/i }),
    ).toBeInTheDocument();
  });

  it("renders uppy uploader component", async () => {
    renderWithRefine(<DocumentCreate />);
    expect(await screen.findByTestId("uppy-uploader")).toBeInTheDocument();
  });

  it("displays file success message after upload", async () => {
    renderWithRefine(<DocumentCreate />);
    const uploadButton = await screen.findByRole("button", {
      name: /Mock Upload/i,
    });
    await userEvent.click(uploadButton);
    expect(await screen.findByText(/File ready to save:/i)).toBeInTheDocument();
  });
});
