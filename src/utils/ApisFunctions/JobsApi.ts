import api from "@/utils/api";
import {dataForSubmitRegister, postSkillsForJob, UpdateJobSeekerType} from "@/utils/types";
export async function fetchJobs() {
    const res = await api.get("jobs/GetAllJobs");
    return res.data;
}
export  const fetchJobsTypes=async()=>{
    try{
      const res=await api.get("jobs/GetAllJopTypes");
       return res.data;
    }catch (err){
       throw err;
    }

}
export async function fetchFilteredJobs(filters: {
    wilayaIDs?: number[];
    skillIDs?: number[];
    jobTypeIDs?: number[];
    jobExperienceIDs?: number[];
}) {
    try {
        const response = await api.post(`jobs/FilterJobs`, filters, {

        });

        return response.data;
    } catch (error) {
        console.error("Error fetching filtered jobs:", error);
        throw error;
    }
}


export const getAllFilterJobs=async()=>{
    try{
    const res=await api.get("jobs/GetAllItemFilterJobs");
    return res.data;
    }catch(err){
        throw err;
    }
}

export const RegisterJobSeeker=async(data:dataForSubmitRegister)=>{
    try {
       const res=await api.post("Auth/RegisterJobSeeker",data);
       return res.data;
    }catch (err){
        throw err;
    }
}

export  const UpdateJobSeeker=async (data:UpdateJobSeekerType)=>{
   try {
      const res=await api.post("JobSeekers/UpdateJobSeeker",data)
       return res.data;
   }catch (err){
       throw err;
   }
}
export  const fetchJobsApplay=async (
   JobSeekerID:number
)=>{
   try {
      const res=await api.get(`JobSeekers/GetAllJobSeekerApplications/:${ JobSeekerID }`);
      return res.data;
   }catch (err){
       throw err;
   }
}

export const PostSkillsForJob=async (skills:postSkillsForJob[])=>{
   try {
      const res=await api.post(`JobSeekers/AddSkillsForJobSeeker`,skills);
      return res.data;
   }catch (err){
       throw err;
   }
}