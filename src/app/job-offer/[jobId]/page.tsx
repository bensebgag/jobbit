"use client"
import Container from "@/components/layout/Container";
import {Button} from "@/components/ui/button";
import Navigation from "@/components/ui/Navigation";
import Image from "next/image";
import {ChevronRight, MapPin} from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import api from "@/utils/api";


const jobT = {
    jobID: 12345,
    companyInfo: {
        companyID: 6789,
        wilayaInfo: {
            wilayaID: 16,
            name: "Alger"
        },
        name: "Tech Solutions",
        description: "A leading software development company specializing in AI and cloud computing.",
        logoPath: "/images/company_logo.png",
        link: "https://www.techsolutions.com",
        email: "contact@techsolutions.com",
        phone: "+213 555 123 456",
        isActive: true
    },
    jobType: "remote",
    postedDate: "2025-03-17T10:30:00Z",
    jobExperience: "development",
    available: true,
    title: "Software Engineer",
    description: "We are looking for a skilled software engineer to join our team and work on innovative projects.",
    skills: [
        {
            skillID: 101,
            skillCategoryID: 5,
            name: "JavaScript",
            iconUrl: "/icons/javascript.png"
        },
        {
            skillID: 102,
            skillCategoryID: 5,
            name: "React",
            iconUrl: "/icons/react.png"
        }
    ]
};

export  default function Page ({params}: {params: {jobId:number}} ) {
    const { data: jobData, isLoading } = useQuery({
         queryKey:["job", params.jobId],
         queryFn:async () => {
            const res = await api.get(`jobs/${params.jobId}`);
            return res.data;
        }
        })


    const job=jobData||jobT;


 if (isLoading) return <p>Loding ...</p>


    return(
        <>
        <Navigation/>
        <Container styleElement={"flex item-center gap-4 mt-20"}>
         <div  className={"flex-2"}>
           <h1 className={"text-3xl font-medium text-gray-950"}>
               {job.title}
           </h1>
             <p className={"text-right text-gray-950 font-normal text-base"}>{job.postedDate}</p>
           <div className={"flex flex-col gap-4 border-[1px] border-t-gray-100 border-x-0 border-b-0  p-2"}>
               <div className={"flex items-center flex-wrap gap-4"}>
                  <span className={"px-4 py-1 text-white font-normal text-sm  bg-gray-500 rounded-3xl"}>{job.jobType}</span>
                 <span className={"px-4 py-1 text-white font-normal text-sm  bg-green-500 rounded-3xl"}>{job.jobExperience}</span>
               </div>
              <div className={"flex items-center flex-wrap gap-4"}>
                  {job.skills.map(skill => (
                      <span key={skill.skillID} className={"py-1 px-5 rounded-3xl text-sm font-normal text-gray-950 bg-yellow-200" }>
                         <Image width={4} height={4}  src={skill.iconUrl} alt={skill.name}/>
                        {skill.name}
                      </span>)
                  )}

             <span className={"py-1 px-5 rounded-3xl text-sm font-normal text-gray-950 bg-yellow-200" }>Python </span>
              </div>
             <div className={"border-[1px] p-2 border-t-gray-100 border-y-gray-200 border-b-gray-200"}>
                 <p className={"text-base text-gray-800 font-normal leading-normal"}>
                     {job.description}
                 </p>
           </div>

            </div>

         </div>
            <div className={"flex flex-col flex-1 self-center  py-4 px-8 border-[1px] border-gray-100 rounded-sm "}>
                  <div className={"flex flex-col justify-center "}>
                  <Image width={20} height={20} src={job.companyInfo.logoPath} alt={job.companyInfo.name}/>
                   <p className={"text-2xl font-normal text-center text-gray-800 underline uppercase"}>{job.companyInfo.name}</p>
                     <div className={"flex items-center justify-between"}>
                        <p className={"text-sm flex itmes-cneter font-normal text-gray-800"}>
                            <MapPin  className={"w-4 h-4"}/>
                            <span>{job.companyInfo.wilayaInfo.name}</span>
                        </p>
                         <div className={"text-green-600 p-2 flex items-center gap-2 font-normal hover:bg-green-50 hover:cursor-pointer hover:rounded-sm"}>
                             <ChevronRight className={"w-4 h-4"} />
                              <a className={"uppercase text-sm"} href={job.companyInfo.link} >website</a>
                         </div>
                     </div>
                  </div>
               <div className={"flex-1 border-[1px] border-gray-200 my-4 " }></div>
               <Button className={"bg-blue-500  text-lg text-white font-normal"}>POSTULER</Button>
            </div>
       </Container>
    </>
    )
}