import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  DateField,
  CreateButton,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import Tooltip from "@mui/material/Tooltip";
import prettyBytes from "pretty-bytes";

export const DocumentList = () => {
  const { dataGridProps } = useDataGrid();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Name of the document",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "document_date",
        headerName: "Date of Issue",
        minWidth: 150,
        align: "center",
        headerAlign: "center",
        renderCell: function render({ value }) {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <DateField value={value} format="DD.MM.YYYY" />
            </Box>
          );
        },
      },
      {
        field: "document_type",
        headerName: "Type of Document",
        minWidth: 120,
        type: "singleSelect",
        valueOptions: ["Invoice", "Refueling", "Phone_bill", "Bank_statement"],
      },
      {
        field: "file_size",
        headerName: "File Size",
        minWidth: 100,
        renderCell: ({ value }) => (value ? prettyBytes(value) : "-"),
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: function render({ row }) {
          return (
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ justifyContent: "center" }}
            >
              {row.file_path && (
                <Tooltip title="Download Document">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      window.open(row.file_path, "_blank");
                    }}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              <EditButton size="small" hideText recordItemId={row.id} />
              <ShowButton size="small" hideText recordItemId={row.id} />
              <DeleteButton size="small" hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 140,
      },
    ],
    [],
  );

  return (
    <List headerButtons={<CreateButton>Upload a document</CreateButton>}>
      <Box sx={{ height: "calc(100vh - 200px)", width: "100%" }}>
        <DataGrid
          {...dataGridProps}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </Box>
    </List>
  );
};
