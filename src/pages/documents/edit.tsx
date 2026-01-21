import { Edit } from "@refinedev/mui";
import { Box, TextField, MenuItem } from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useEffect } from "react";

export const DocumentEdit = () => {
  const {
    saveButtonProps,
    refineCore: { query },
    register,
    formState: { errors },
    reset,
  } = useForm();

  const documentsData = query?.data?.data;

  useEffect(() => {
    if (documentsData) {
      reset(documentsData);
    }
  }, [documentsData, query?.dataUpdatedAt, reset]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        autoComplete="off"
      >
        <TextField
          {...register("name", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.name}
          helperText={(errors as any)?.name?.message}
          margin="normal"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="text"
          label="Name"
          name="name"
        />
        <TextField
          {...register("document_type", {
            required: "This field is required",
          })}
          defaultValue={documentsData?.document_type || ""}
          error={!!(errors as any)?.document_type}
          helperText={(errors as any)?.document_type?.message}
          margin="normal"
          fullWidth
          select
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          label="Document Type"
          name="document_type"
        >
          <MenuItem value="Invoice">Invoice</MenuItem>
          <MenuItem value="Refueling">Refueling</MenuItem>
          <MenuItem value="Phone_bill">Phone bill</MenuItem>
          <MenuItem value="Bank_statement">Bank statement</MenuItem>
        </TextField>
        <TextField
          {...register("document_date", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.document_date}
          helperText={(errors as any)?.document_date?.message}
          margin="normal"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          type="date"
          label="Document Date"
          name="document_date"
        />
      </Box>
    </Edit>
  );
};
