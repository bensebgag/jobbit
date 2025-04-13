"use client"
import ProfileAvatar from "@/components/ui/ProfileAvataer";
import DocumentUpload from "@/components/ui/DocumentUpload";
import DynamicForm from "@/components/ui/DynamicForm";
import {useState} from "react";
import {UpdateJobSeeker} from "@/utils/types";

export default function Page(){
    const [dataUpdate, setDataUpdate] = useState<UpdateJobSeeker>();

 console.log(dataUpdate);
    return (
     <div className={"flex flex-col gap-8 w-full  p-8 border-[1px] border-gray-100 bg-white "}>
         <h1 className={"text-2xl font-medium text-gray-950 "}>Personal information</h1>
         <div className={"self-center mt-4"}>
             <ProfileAvatar setDataUpdate={setDataUpdate} />
         </div>
           <DocumentUpload setDataUpdate={setDataUpdate}/>
            <DynamicForm dataUpdate={dataUpdate} />
     </div>
    )
}