import { DataProvider, CreateParams, UpdateParams } from "@refinedev/core";

const SUPABASE_URL = "https://tpgqssmuqrdldflhlfld.supabase.co";
const STORAGE_BUCKET = "document_storage";

const generateFileUrl = (id: string, fileName: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${id}/${fileName}`;

export const mockDataProvider = {
  getList: async () => ({
    data: [
      {
        id: "1",
        name: "Testovacia Zmluva",
        document_date: "2024-01-15",
        document_type: "Invoice",
        file_path: generateFileUrl("85c5acb4-67d0-4f73-b1c1-89986c8c65e0", "CV_ENG.pdf"),
        created_at: "2024-01-18T10:00:00Z",
        updated_at: "2024-01-18T10:00:00Z",
        file_size: 204800,
      },
      {
        id: "2",
        name: "Tankovanie Shell",
        document_date: "2024-01-16",
        document_type: "Refueling",
        file_path: generateFileUrl("85c5acb4-67d0-4f73-b1c1-89986c8c65e1", "tankovanie_shell.pdf"),
        created_at: "2024-01-18T10:00:00Z",
        updated_at: "2024-01-18T10:00:00Z",
        file_size: 102400,
      },
    ],
    total: 2,
  }),
  getOne: async () => ({
    data: {
      id: "1",
      name: "Testovacia Zmluva",
      document_date: "2024-01-15",
      document_type: "Invoice",
      file_path: generateFileUrl("85c5acb4-67d0-4f73-b1c1-89986c8c65e0", "CV_ENG.pdf"),
      created_at: "2024-01-18T10:00:00Z",
      updated_at: "2024-01-18T10:00:00Z",
      file_size: 204800,  
    },
  }),
  create: async ({ variables }: CreateParams) => ({
    data: { id: "3", ...variables },
  }),
  update: async ({ variables }: UpdateParams) => ({
    data: { id: "1", ...variables },
  }),
  deleteOne: async () => ({
    data: {},
  }),
  getApiUrl: () => "https://api.fake",
} as unknown as DataProvider;
