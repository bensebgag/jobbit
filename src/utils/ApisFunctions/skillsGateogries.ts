import api from "@/utils/api";

export const fetchSkillsGategories=async()=>{
    try {
        const res=await api.get("SkillCategories/GetAllSkillCategories");
        return res.data;
    } catch (err){
        throw err;
    }
}

export  const fetchSkills=async()=>{
    try {
       const res=await api.get("Skills/GetAllSkills");
       return res.data;
    }catch(err){
        throw err;
    }

}