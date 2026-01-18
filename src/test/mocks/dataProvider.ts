import { DataProvider, CreateParams, UpdateParams } from "@refinedev/core";

export const mockDataProvider = {
  getList: async () => ({
    data: [
      {
        id: 1,
        name: "Testovacia Zmluva",
        document_date: "2024-01-15",
        document_type: "Faktúra",
        file_path: "/files/testovacia_zmluva.pdf",
        created_at: "2024-01-18T10:00:00Z",
        updated_at: "2024-01-18T10:00:00Z",
      },
      {
        id: 2,
        name: "Tankovanie Shell",
        document_date: "2024-01-16",
        document_type: "Faktúra",
        file_path: "/files/tankovanie_shell.pdf",
        created_at: "2024-01-18T10:00:00Z",
        updated_at: "2024-01-18T10:00:00Z",
      },
    ],
    total: 2,
  }),
  getOne: async () => ({
    data: {
      id: 1,
      name: "Testovacia Zmluva",
      document_date: "2024-01-15",
      document_type: "Faktúra",
      file_path: "/files/testovacia_zmluva.pdf",
      created_at: "2024-01-18T10:00:00Z",
      updated_at: "2024-01-18T10:00:00Z",
    },
  }),
  create: async ({ variables }: CreateParams) => ({
    data: { id: 2, ...variables },
  }),
  update: async ({ variables }: UpdateParams) => ({
    data: { id: 1, ...variables },
  }),
  deleteOne: async () => ({
    data: {},
  }),
  getApiUrl: () => "https://api.fake",
} as unknown as DataProvider;
