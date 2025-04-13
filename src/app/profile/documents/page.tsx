'use client';

import { useDropzone } from 'react-dropzone';
import { ArrowDownToLine, Pencil, Trash, UploadCloud } from 'lucide-react';
import { useCallback, useState } from 'react';
import Image from 'next/image';
import pdfIcon from '@/../public/PdfIcon.png';
import api from '@/utils/api';
import { useMutation } from '@tanstack/react-query';

type CVUploadResponse = {
    message: string;
    cvUrl: string;
};

type UploadCVPayload = {
    id: number;
    file: File;
};

const uploadCV = async ({ id, file }: UploadCVPayload): Promise<CVUploadResponse> => {
    const formData = new FormData();
    formData.append('cvFile', file);

    const resp = await api.put(
        `/JobSeekers/UploadJobSeekerCV/${id}`,
        formData
    );
    return resp.data;
};

export default function Page() {
    const [files, setFiles] = useState<File[]>([]);

    // Fixed mutation with proper typing
    const { mutate, isPending, isSuccess, isError, data, error } =
        useMutation<CVUploadResponse, Error, UploadCVPayload>({
            mutationFn: uploadCV,
            onSuccess: (data) => {
                console.log('CV URL:', data.cvUrl);
            },
        });

    const onDrop = useCallback(
        (accepted: File[]) => {
            if (accepted.length === 0) return;
            const file = accepted[0];
            setFiles([file]);
            mutate({ id: 1, file }); // replace `1` with your dynamic jobSeekerId
        },
        [mutate]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
    });

    return (
        <div className="p-6 border rounded-lg bg-white shadow w-full">
            <h2 className="text-lg font-semibold">Documents</h2>

            {/* Show uploaded file if present */}
            {files.length > 0 && (
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-1">
                        <Image src={pdfIcon} alt="PDF icon" className="w-8 h-8" />
                        <p className="text-blue-500 text-[12px] font-medium">{files[0].name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Pencil
                            className="text-green-500 w-8 h-8 p-2 cursor-pointer hover:bg-green-100 rounded-full"
                            onClick={() => {
                                /* maybe rename or replace */
                            }}
                        />
                        {/* Fixed download button */}
                        <ArrowDownToLine
                            className="text-gray-500 w-7 h-7 p-1 cursor-pointer hover:bg-gray-100 rounded-full"
                            onClick={() => {
                                if (data?.cvUrl) window.open(data.cvUrl, '_blank');
                            }}
                        />
                        <Trash
                            className="text-gray-500 w-7 h-7 p-1 cursor-pointer hover:bg-gray-100 rounded-full"
                            onClick={() => {
                                setFiles([]);
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Dropzone area */}
            <div
                {...getRootProps()}
                className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center ${
                    isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'
                }`}
                {...(isPending ? { onClick: (e) => e.preventDefault() } : {})}
            >
                <input {...getInputProps()} disabled={isPending} />
                <UploadCloud className="w-10 h-10 mx-auto text-gray-500" />
                <p className="text-gray-600 mt-2">
                    {isDragActive
                        ? 'Drop the file here…'
                        : 'Drag & drop a file or click here (.pdf, .doc, .docx)'}
                </p>
            </div>

            {/* Feedback */}
            {isPending && <p className="mt-2 text-blue-500">Uploading…</p>}
            {isSuccess && <p className="mt-2 text-green-500">Upload successful!</p>}
            {isError && <p className="mt-2 text-red-500">Error: {error?.message || 'Upload failed'}</p>}
        </div>
    );
}