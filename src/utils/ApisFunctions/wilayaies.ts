import api from "@/utils/api";

export const fetchWillaya=async()=>{
    try {
        const res=await api.get("Wilayas/GetAllWilayas");
        return res.data;
    } catch (err){
        throw err;
    }
}