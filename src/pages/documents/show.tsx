import { Show, TextFieldComponent, DateField } from "@refinedev/mui";
import {
  Typography,
  Stack,
  Box,
  Paper,
  CircularProgress,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useParams } from "react-router";
import { dataProvider } from "../../providers/data";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type DocumentRecord = {
  name?: string;
  document_type?: string;
  document_date?: string;
  file_url?: string;
  file_path?: string;
  [key: string]: unknown;
};

export const DocumentShow = () => {
  const params = useParams();
  const id = params?.id;

  const [record, setRecord] = useState<DocumentRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isError = !!error;

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scale, setScale] = useState<number>(1);

  const fileUrl = record?.file_url ?? record?.file_path;
  const resolvedFileUrl = fileUrl
    ? fileUrl.startsWith("http")
      ? fileUrl
      : `${
          import.meta.env.VITE_SUPABASE_URL
        }/storage/v1/object/public/document_storage/${fileUrl.replace(
          /^\//,
          "",
        )}`
    : undefined;

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    dataProvider
      .getOne({ resource: "documents", id })
      .then((response) => {
        const incoming = response?.data as Record<string, unknown> | undefined;
        if (!incoming) {
          setRecord(null);
          return;
        }

        const normalized: DocumentRecord = {
          ...incoming,
          id:
            typeof incoming.id === "string"
              ? incoming.id
              : incoming.id !== undefined
              ? String(incoming.id)
              : undefined,
        };

        setRecord(normalized);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err : new Error("Failed to load document"),
        );
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    setPdfLoading(!!resolvedFileUrl);
  }, [resolvedFileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setPdfLoading(false);
  }

  if (isLoading) {
    return (
      <Show isLoading={true}>
        <CircularProgress />
      </Show>
    );
  }

  if (isError) {
    const message = error?.message ?? "Unknown error";
    return (
      <Show>
        <Typography color="error">Error loading document: {message}</Typography>
      </Show>
    );
  }

  if (!record) {
    return (
      <Show>
        <Typography color="warning">No document found.</Typography>
      </Show>
    );
  }

  return (
    <Show isLoading={isLoading}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Name
          </Typography>
          <TextFieldComponent value={record?.name ?? ""} />
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold">
            Document Type
          </Typography>
          <TextFieldComponent value={record?.document_type ?? ""} />
        </Box>

        <Box>
          <Typography variant="body1" fontWeight="bold">
            Document Date
          </Typography>
          <DateField
            value={record?.document_date ?? ""}
            format="DD. MM. YYYY"
          />
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Document Preview
          </Typography>

          {/* Zoomin, out */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setScale((prev) => Math.max(prev - 0.2, 0.5))}
                disabled={scale <= 0.5}
              >
                <ZoomOutIcon />
              </Button>
              <Button disabled>{Math.round(scale * 100)}%</Button>
              <Button
                onClick={() => setScale((prev) => Math.min(prev + 0.2, 3))}
                disabled={scale >= 3}
              >
                <ZoomInIcon />
              </Button>
            </ButtonGroup>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "#f5f5f5",
              minHeight: "600px",
              overflow: "auto",
            }}
          >
            {resolvedFileUrl ? (
              <Box sx={{ position: "relative" }}>
                {pdfLoading && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 1,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                <Document
                  file={resolvedFileUrl as string}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <Box sx={{ p: 2 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 1 }}>Loading PDF...</Typography>
                    </Box>
                  }
                  error={
                    <Typography color="error">
                      Failed to load PDF. Please check the file URL.
                    </Typography>
                  }
                >
                  {Array.from(new Array(numPages || 0), (_, index) => (
                    <Box
                      key={`page_${index + 1}`}
                      sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                    >
                      <Page
                        pageNumber={index + 1}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        scale={scale}
                      />
                    </Box>
                  ))}
                </Document>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No PDF file attached.{" "}
                {fileUrl === undefined
                  ? "(missing file_path / file_url)"
                  : "(could not resolve URL)"}
              </Typography>
            )}
          </Paper>
        </Box>
      </Stack>
    </Show>
  );
};
