"use client"
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useRouter} from "next/navigation";
import {JobRequest} from "@/utils/types";


export  default  function Page(){
    const navigation=useRouter();
     const jobRequests: JobRequest[] = [
        {
            requestID: 1,
            companyID: 101,
            jobID: 2001,
            jobSeekerID: 3001,
            firstName: "Ali",
            lastName: "Benali",
            wilayaName: "Algiers",
            dateOfBirth: "1995-03-14T00:00:00Z",
            gender: 0,
            linkProfileLinkden: "https://linkedin.com/in/alibenali",
            linkProfileGithub: "https://github.com/alibenali",
            requestDate: "2024-12-10T15:30:00Z",
        },
        {
            requestID: 2,
            companyID: 102,
            jobID: 2002,
            jobSeekerID: 3002,
            firstName: "Sara",
            lastName: "Khellaf",
            wilayaName: "Oran",
            dateOfBirth: "1993-06-20T00:00:00Z",
            gender: 1,
            linkProfileLinkden: "https://linkedin.com/in/sarakhellaf",
            linkProfileGithub: "https://github.com/sarakhellaf",
            requestDate: "2025-01-05T10:15:00Z",
        },
        {
            requestID: 3,
            companyID: 103,
            jobID: 2003,
            jobSeekerID: 3003,
            firstName: "Yacine",
            lastName: "Bouaziz",
            wilayaName: "Constantine",
            dateOfBirth: "1990-11-01T00:00:00Z",
            gender: 0,
            linkProfileLinkden: "https://linkedin.com/in/yacinebouaziz",
            linkProfileGithub: "https://github.com/yacinebouaziz",
            requestDate: "2025-03-18T08:45:00Z",
        },
    ];
    return (
        <div className={"flex flex-col gap-4 p-4 w-full bg-white rounded-lg border-[1px] border-gray-200 "}>
            <p className={"text-gray-950 text-xl font-medium"}>Mange Job offers</p>

           <Button onClick={()=>navigation.push("/job-offer/new")} className={"flex items-center gap-1 bg-green-800 self-end"}>
               <Plus className={"w-5 h-5 text-white"}/>
               <span className={"text-sm text-white font-medium uppercase"}>add job offer</span>
           </Button>
            <p className={"text-gray-950 text-lg font-medium"}>Pending job offers</p>
            <ul  >
                {jobRequests.map((item) => (
               <li key={item.jobSeekerID} className={"pl-4 bg-white flex items-center justify-between rounded-sm shadow-lg border-r-yellow-300 border-6 border-y-1 border-l-1"}>
                    <div className={"flex flex-col gap-3"}>
                      <a className={"text-blue-700 font-medium text-sm underline "} href={item.requestID}>JKHKIG</a>
                      <p className={"text-[12px] text-gray-600 font-normal "}>Published on 20 March 2025</p>
                    </div>
                    <div className={"w-4 h-20 bg-yellow-300"}>

                    </div>

                </li>
                ))}

            </ul>
        </div>
    )
 }