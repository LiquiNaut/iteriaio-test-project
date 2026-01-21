import React, { useEffect, useState } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/react/dashboard";
import Tus from "@uppy/tus";
import { supabaseClient } from "../providers/supabase-client";

interface UppyUploaderProps {
  userId: string;
  onUploadComplete: (filePath: string, fileSize: number) => void;
}

export const UppyUploader: React.FC<UppyUploaderProps> = ({
  userId,
  onUploadComplete,
}) => {
  const [uppy] = useState(() => {
    const instance = new Uppy({
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: [".pdf", ".doc", ".docx"],
        maxFileSize: 50 * 1024 * 1024,
      },
      autoProceed: true,
      locale: {
        strings: {
          dropPasteFiles: "%{browse}",
          browseFiles: "Select a file",
          uploadingXFiles: {
            0: "Uploading %{smart_count} a file",
            1: "Uploading %{smart_count} files",
          },
          processingXFiles: {
            0: "Processing %{smart_count} a file",
            1: "Processing %{smart_count} files",
          },
        },
        pluralize: (n: number) => (n === 1 ? 0 : 1),
      },
    });

    instance.use(Tus, {
      id: "Tus",
      endpoint: `${
        import.meta.env.VITE_SUPABASE_URL
      }/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      chunkSize: 6 * 1024 * 1024,
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      allowedMetaFields: [
        "bucketName",
        "objectName",
        "contentType",
        "cacheControl",
      ],
      onBeforeRequest: async (req) => {
        const { data } = await supabaseClient.auth.getSession();
        const token = data.session?.access_token;

        if (!token) {
          console.error("Uppy: No token found in session!");
          throw new Error("Not authenticated");
        }

        req.setHeader("Authorization", `Bearer ${token}`);
        req.setHeader("apikey", import.meta.env.VITE_SUPABASE_ANON_KEY);
        req.setHeader("x-upsert", "true");
      },
    });

    return instance;
  });

  const sanitizeFileName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");
  };

  useEffect(() => {
    const handleComplete = (result: any) => {
      if (result.successful && result.successful.length > 0) {
        const file = result.successful[0];
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

        const finalObjectName = file.meta.objectName as string;
        const fullUrl = `${supabaseUrl}/storage/v1/object/public/document_storage/${finalObjectName}`;

        onUploadComplete(fullUrl, file.size);
      }
    };

    const handleFileAdded = (file: any) => {
      const cleanName = sanitizeFileName(file.name);

      uppy.setFileMeta(file.id, {
        bucketName: "document_storage",
        objectName: `${userId}/${cleanName}`,
        contentType: file.type,
      });
    };

    uppy.on("complete", handleComplete);
    uppy.on("file-added", handleFileAdded);

    return () => {
      uppy.off("complete", handleComplete);
      uppy.off("file-added", handleFileAdded);
    };
  }, [uppy, userId, onUploadComplete]);

  useEffect(() => {
    return () => {
      // @ts-expect-error - uppy.close is not in the type definition but might exist at runtime
      if (typeof uppy.close === "function") {
        // @ts-expect-error
        uppy.close();
      } else if (typeof uppy.cancelAll === "function") {
        uppy.cancelAll();
      }
    };
  }, [uppy]);

  return (
    <Dashboard
      uppy={uppy}
      height={300}
      width="100%"
      hideUploadButton={false}
      proudlyDisplayPoweredByUppy={false}
    />
  );
};
