import { screen, waitFor } from "@testing-library/react";
import { renderWithRefine } from "../../../test/renderWithRefine";
import { DocumentShow } from "../show";
import { describe, it, expect, vi, beforeEach } from "vitest";
const getOneMock = vi.fn();

vi.mock("../../../providers/data", () => ({
  dataProvider: {
    getOne: (...args: any[]) => getOneMock(...args),
  },
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return { ...actual, useParams: () => ({ id: "1" }) };
});

vi.mock("react-pdf", () => ({
  Document: ({ children }: any) => <div>PDF Loaded {children}</div>,
  Page: ({ pageNumber }: any) => <div>Page {pageNumber}</div>,
  pdfjs: { GlobalWorkerOptions: {} },
}));

describe("DocumentShow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getOneMock.mockReset();
  });

  it("display document details (name + type)", async () => {
    getOneMock.mockResolvedValue({
      data: {
        id: "1",
        name: "Moja Faktura",
        document_type: "Invoice",
        document_date: "2024-01-15",
        file_path: "test.pdf",
      },
    });

    renderWithRefine(<DocumentShow />);

    expect(await screen.findByText("Moja Faktura")).toBeInTheDocument();
    expect(await screen.findByText("Invoice")).toBeInTheDocument();
  });

  it("displays PDF section if we have a file", async () => {
    getOneMock.mockResolvedValue({
      data: { id: "1", name: "Test", file_path: "faktura.pdf" },
    });

    renderWithRefine(<DocumentShow />);
    await waitFor(() => {
      expect(screen.getByText(/Document Preview/i)).toBeInTheDocument();
      expect(screen.getByText(/PDF Loaded/i)).toBeInTheDocument();
    });
  });

  it("displays message if file is missing", async () => {
    getOneMock.mockResolvedValue({
      data: {
        id: "1",
        name: "Test",
        file_path: undefined,
        file_url: undefined,
      },
    });

    renderWithRefine(<DocumentShow />);
    expect(
      await screen.findByText((content) =>
        content.toLowerCase().includes("no pdf file attached"),
      ),
    ).toBeInTheDocument();
  });

  it("displays error on failed fetch", async () => {
    getOneMock.mockRejectedValue(new Error("Network error"));

    renderWithRefine(<DocumentShow />);
    expect(
      await screen.findByText(/Error loading document/i),
    ).toBeInTheDocument();
  });
});
