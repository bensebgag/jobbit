import api from "@/utils/api";

export  const fetchExpertise=async()=>{
    try {
        const res=await api.get("jobs/GetExpertise");
        return res.data;
    }catch (err){
        throw err;
    }

}