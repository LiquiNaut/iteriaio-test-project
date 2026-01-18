import { screen } from "@testing-library/react";
import { renderWithRefine } from "../../../test/renderWithRefine";
import { DocumentList } from "../list";
import { describe, it, expect, vi } from "vitest";
import { mockDataProvider } from "../../../test/mocks/dataProvider";

describe("DocumentList", () => {
  it("renders without crashing", async () => {
    renderWithRefine(<DocumentList />);
    expect(await screen.findByText(/Názov dokumentu/i)).toBeInTheDocument();
  });

  it("renders list data obtained from mocked dataProvider", async () => {
    const mockDocuments = [
      {
        id: 1,
        name: "Faktura za internet",
        document_date: "2023-05-20",
        document_type: "Faktúra",
      },
      {
        id: 2,
        name: "Tankovanie Shell",
        document_date: "2023-05-21",
        document_type: "Tankovanie",
      },
    ];

    const customDataProvider = {
      ...mockDataProvider,
      getList: vi.fn().mockResolvedValue({
        data: mockDocuments,
        total: 2,
      }),
    };

    renderWithRefine(<DocumentList />, {
      dataProvider: customDataProvider,
    });

    expect(await screen.findByText("Faktura za internet")).toBeInTheDocument();
    expect(await screen.findByText("Tankovanie Shell")).toBeInTheDocument();

    expect(await screen.findByText("20.05.2023")).toBeInTheDocument();
    expect(await screen.findByText("21.05.2023")).toBeInTheDocument();
  });
});
