import React from "react";
import {
  useDataGrid,
  EditButton,
  ShowButton,
  DeleteButton,
  List,
  DateField,
} from "@refinedev/mui";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";

export const DocumentList = () => {
  const { dataGridProps } = useDataGrid();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "name",
        headerName: "Názov dokumentu",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "document_date",
        headerName: "Dátum vystavenia",
        minWidth: 150,
        renderCell: function render({ value }) {
          return <DateField value={value} format="DD.MM.YYYY" />;
        },
      },
      {
        field: "document_type",
        headerName: "Typ",
        minWidth: 120,
        type: "singleSelect",
        valueOptions: ["Faktura", "Tankovanie", "Telefon", "Vypis"],
      },
      {
        field: "actions",
        headerName: "Akcie",
        renderCell: function render({ row }) {
          return (
            <Stack direction="row" spacing={1}>
              <EditButton size="small" hideText recordItemId={row.id} />
              <ShowButton size="small" hideText recordItemId={row.id} />
              <DeleteButton size="small" hideText recordItemId={row.id} />
            </Stack>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 180,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} columns={columns} autoHeight />
    </List>
  );
};
