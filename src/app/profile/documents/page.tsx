"use client";

import { useDropzone } from "react-dropzone";
import { ArrowDownToLine, Pencil, UploadCloud } from "lucide-react";
import { useCallback } from "react";
import Image from "next/image";
import pdfIcon from "@/../public/pdf.png";
import api from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/useGetUser";
import { fetchCv } from "@/utils/ApisFunctions/JobsApi";

type CVUploadResponse = {
  message: string;
  cvUrl: string;
};

type UploadCVPayload = {
  id: number;
  file: File;
};

const uploadCV = async ({
  id,
  file,
}: UploadCVPayload): Promise<CVUploadResponse> => {
  const formData = new FormData();
  formData.append("cvFile", file);
  const resp = await api.put(`/JobSeekers/UploadJobSeekerCV/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return resp.data;
};

export default function Page() {
  const { userId } = useGetUser();
  const queryClient = useQueryClient();
  const { data: CV, isLoading: isFetchCv } = useQuery({
    queryKey: ["getCv"],
    queryFn: () => fetchCv(userId),
    enabled: !!userId,
  });

  const { mutate, isPending, isSuccess, isError, error } = useMutation<
    CVUploadResponse,
    Error,
    UploadCVPayload
  >({
    mutationFn: uploadCV,

    onSuccess: (data) => {
      console.log("CV URL:", data.cvUrl);
      queryClient.invalidateQueries({
        queryKey: ["getCv"],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length === 0) return;
      const file = accepted[0];

      mutate({ id: userId, file });
    },
    [mutate, userId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  return (
    <div className="p-4 sm:p-6 border rounded-lg bg-white shadow w-full h-full">
      <h2 className="text-lg font-semibold mb-4">Documents</h2>

      {CV && !isFetchCv && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2 gap-2">
          <div className="flex items-center gap-1">
            <Image width={32} height={32} src={pdfIcon} alt="PDF icon" />

            <p className="text-blue-500 text-[12px] font-medium truncate max-w-[200px] sm:max-w-none">
              {CV.name}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <Pencil
              className="text-green-500 w-8 h-8 p-2 cursor-pointer hover:bg-green-100 rounded-full"
              onClick={() => {}}
            />
            <ArrowDownToLine
              className="text-gray-500 w-7 h-7 p-1 cursor-pointer hover:bg-gray-100 rounded-full"
              onClick={() => {
                if (CV) window.open(CV.blob, "_blank");
              }}
            />
          </div>
        </div>
      )}

      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={`mt-4 border-2 border-dashed rounded-lg p-4 sm:p-6 text-center ${
          isPending
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-gray-50"
        }`}
        {...(isPending ? { onClick: (e) => e.preventDefault() } : {})}
      >
        <input {...getInputProps()} disabled={isPending} />
        <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-gray-500" />
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {isDragActive
            ? "Drop the file here…"
            : "Drag & drop a file or click here (.pdf, .doc, .docx)"}
        </p>
      </div>

      {/* Feedback */}
      {isPending && <p className="mt-2 text-blue-500 text-sm">Uploading…</p>}
      {isSuccess && (
        <p className="mt-2 text-green-500 text-sm">Upload successful!</p>
      )}
      {isError && (
        <p className="mt-2 text-red-500 text-sm">
          Error: {error?.message || "Upload failed"}
        </p>
      )}
    </div>
  );
}
