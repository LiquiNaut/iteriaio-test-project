import { DataProvider } from "@refinedev/core";

export const mockDataProvider = {
  getList: async () => ({
    data: [],
    total: 0,
  }),
  getOne: async () => ({
    data: { id: 1 },
  }),
  create: async () => ({
    data: { id: 1 },
  }),
  update: async () => ({
    data: { id: 1 },
  }),
  deleteOne: async () => ({
    data: {},
  }),
  getApiUrl: () => "https://api.fake",
} as unknown as DataProvider;
