"use client";

import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {UpdateJobSeeker} from "@/utils/types";
interface  Props {
    setDataUpdate:  Dispatch<SetStateAction<UpdateJobSeeker | undefined>>;
}
export default function DocumentUpload({setDataUpdate}: Props) {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
        setDataUpdate(prevState => ({...prevState,CV:acceptedFiles[0]}))
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
    });

    return (
        <div className="p-6 border rounded-lg bg-white shadow w-full">

            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Documents</h2>
                <a href="#" className="text-blue-600 text-sm font-medium">SEE MY DOCUMENTS +1</a>
            </div>


            <div
                {...getRootProps()}
                className="mt-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 mx-auto text-gray-500" />
                <p className="text-gray-600 mt-2">
                    {isDragActive ? "Drop the file here..." : "Drag and drop a file or click here (.pdf, .doc, .docx)"}
                </p>
            </div>


            {files.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium">Uploaded Files:</h3>
                    <ul className="mt-2 space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="text-gray-700 text-sm">{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
