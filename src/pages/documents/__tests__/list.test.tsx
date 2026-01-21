import { screen } from "@testing-library/react";
import { renderWithRefine } from "../../../test/renderWithRefine";
import { DocumentList } from "../list";
import { describe, it, expect, vi } from "vitest";
import { mockDataProvider } from "../../../test/mocks/dataProvider";

describe("DocumentList", () => {
  it("renders without crashing", async () => {
    renderWithRefine(<DocumentList />);
    expect(await screen.findByText(/Name of the /i)).toBeInTheDocument();
  });

  it("renders list data obtained from mocked dataProvider", async () => {
    const customDataProvider = {
      ...mockDataProvider,
      getList: vi.fn().mockImplementation(mockDataProvider.getList),
    };

    renderWithRefine(<DocumentList />, {
      dataProvider: customDataProvider,
    });

    expect(await screen.findByText("Testovacia Zmluva")).toBeInTheDocument();
    expect(await screen.findByText("Tankovanie Shell")).toBeInTheDocument();
    expect(await screen.findByText("Invoice")).toBeInTheDocument();
    expect(await screen.findByText("Refueling")).toBeInTheDocument(); 
    expect(await screen.findByText("15.01.2024")).toBeInTheDocument();
    expect(await screen.findByText("16.01.2024")).toBeInTheDocument();
  });
});
