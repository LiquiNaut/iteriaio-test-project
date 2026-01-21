import { Create } from "@refinedev/mui";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  FormHelperText,
  Button,
  Paper,
} from "@mui/material";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity } from "@refinedev/core";
import { UppyUploader } from "../../hooks/useUploadDocument";

export const DocumentCreate = () => {
  const { data: user } = useGetIdentity();

  const {
    saveButtonProps,
    register,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  const filePathValue = watch("file_path");
  const nameValue = watch("name");

  return (
    <Create footerButtons={<></>} title="Upload a new document">
      <Paper elevation={0} sx={{ p: 4, bgcolor: "background.default" }}>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            maxWidth: 600,
          }}
        >
          <TextField
            {...register("name", { required: "Name is mandatory" })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
            label="Document Name"
            placeholder="e.g.: Invoice January 2024"
            slotProps={{
              inputLabel: {
                shrink: !!nameValue,
              },
            }}
            fullWidth
            variant="outlined"
          />

          <TextField
            {...register("document_type", {
              required: "Category is mandatory",
            })}
            error={!!errors.document_type}
            helperText={errors.document_type?.message as string}
            select
            label="Category"
            defaultValue=""
            fullWidth
            variant="outlined"
          >
            <MenuItem value="Invoice">Invoice</MenuItem>
            <MenuItem value="Phone_bill">Phone Bill</MenuItem>
            <MenuItem value="Refueling">Refueling</MenuItem>
            <MenuItem value="Bank_statement">Bank Statement</MenuItem>
          </TextField>

          <TextField
            {...register("document_date", {
              required: "Date of issue is mandatory",
            })}
            error={!!errors.document_date}
            helperText={errors.document_date?.message as string}
            label="Date of issue"
            type="date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            fullWidth
            variant="outlined"
          />

          <Box
            sx={{
              border: "2px dashed",
              borderColor: errors.file_path ? "error.main" : "#e0e0e0",
              p: 3,
              borderRadius: 2,
              bgcolor: "#444141",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#aaa7a7",
                bgcolor: "#837f7f",
              },
              // display: "flex",
              // flexDirection: "column",
              // alignItems: "center",
              // justifyContent: "center"
            }}
          >
            {user?.id ? (
              <UppyUploader
                userId={user.id}
                onUploadComplete={(path: string, size: number) => {
                  setValue("file_path", path, { shouldValidate: true });
                  setValue("file_size", size);

                  if (path) {
                    const fileNameWithExt = path.split("/").pop();

                    const cleanName =
                      fileNameWithExt?.replace(/\.[^/.]+$/, "") || "";

                    setValue("name", cleanName, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              />
            ) : (
              <Typography color="textSecondary">Loading user...</Typography>
            )}

            <input
              type="hidden"
              {...register("file_path", { required: "You must upload a file" })}
            />
            <input type="hidden" {...register("file_size")} />

            {errors.file_path && (
              <FormHelperText error sx={{ mt: 1.5 }}>
                {errors.file_path.message as string}
              </FormHelperText>
            )}

            {filePathValue && (
              <Typography
                color="success.main"
                variant="caption"
                sx={{ mt: 1.5, display: "block", fontWeight: 500 }}
              >
                File ready to save: {filePathValue}
              </Typography>
            )}
          </Box>

          <Button
            {...saveButtonProps}
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Save Document
          </Button>
        </Box>
      </Paper>
    </Create>
  );
};
