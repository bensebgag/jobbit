import api from "@/utils/api";
import {
  AuthCompanyResponse,
  AuthJobSeekerResponse,
  dataForSubmitRegisterCompany,
  Job,
  JobApplicationStatusList,
  JobDetails,
  JobsForCompany,
  Login,
  postSkillsForJob,
} from "@/utils/types";
import { Eraser } from "lucide-react";
export async function fetchJobs() {
  const res = await api.get("jobs/GetAllJobs");
  return res.data;
}
export const fetchJobsTypes = async () => {
  try {
    const res = await api.get("jobs/GetAllJopTypes");
    return res.data;
  } catch (err) {
    throw err;
  }
};
export async function fetchFilteredJobs(filters: {
  wilayaIDs?: number[];
  skillIDs?: number[];
  jobTypeIDs?: number[];
  jobExperienceIDs?: number[];
}): Promise<JobDetails[]> {
  try {
    const response = await api.post(`jobs/FilterJobs`, filters, {});

    return response.data;
  } catch (error) {
    console.error("Error fetching filtered jobs:", error);
    throw error;
  }
}

export const getAllFilterJobs = async () => {
  try {
    const res = await api.get("jobs/GetAllItemFilterJobs");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const RegisterJobSeeker = async (data: FormData) => {
  try {
    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }
    const res = await api.post("Auth/RegisterJobSeeker", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (err.response) {
      console.error("API Error Response Data:", err.response.data);
    } else {
      console.error("Error:", err);
    }
    throw err;
  }
};

export const LoginJobSeeker = async (
  data: Login
): Promise<AuthJobSeekerResponse> => {
  try {
    const res = await api.post("Auth/LogInJobSeeker", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};
export const LoginCompany = async (
  data: Login
): Promise<AuthCompanyResponse> => {
  try {
    const res = await api.post("Auth/LogInCompany", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const RegisterCompany = async (data: dataForSubmitRegisterCompany) => {
  try {
    const res = await api.post("Auth/RegisterCompany", data);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const UpdateJobSeeker = async (data: FormData) => {
  try {
    const res = await api.put("JobSeekers/UpdateJobSeeker", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
export const fetchJobsApplay = async (JobSeekerID: number | undefined) => {
  try {
    const res = await api.get(
      `JobSeekers/GetAllJobSeekerApplications/${JobSeekerID}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const PostSkillsForJob = async (
  skills: number[],
  id: number | undefined
) => {
  try {
    const res = await api.post(`JobSeekers/AddSkillsForJobSeeker/${id}`, {
      skills: skills,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
export const RemoveSkillForJob = async (
  userId: number | undefined,
  skillId: number | undefined
) => {
  try {
    const res = await api.delete(
      `JobSeekers/DeleteSkillForJobSeeker/${userId},${skillId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const fetchApplicationForCompanyJob = async (
  idCompany: number | undefined
): Promise<JobApplicationStatusList> => {
  try {
    if (!idCompany) throw new Error("Company ID is required");
    const res = await api.get(
      `Companies/GetAllApplicantsForCompanyJob/${idCompany}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const fetchJobsForCompany = async (
  idCompany: number | undefined
): Promise<JobsForCompany[]> => {
  try {
    const res = await api.get(`jobs/GetAllJobsForCompany/${idCompany}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const changeJobAvailability = async (
  jobID: number,
  available: boolean
): Promise<void> => {
  try {
    console.log(jobID, available);
    await api.put(`jobs/ChangeAvailityJob/${jobID},${available}`);
  } catch (error) {
    throw error;
  }
};

export const getJobById = async (id: number): Promise<Job> => {
  try {
    const res = await api.get(`jobs/GetJobByID/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateCompany = async (data: FormData) => {
  try {
    const res = await api.put("Companies/UpdateCompany", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const fetchCv = async (id: number | undefined) => {
  try {
    const response = await api.get(`JobSeekers/GetCV/${id}`, {
      responseType: "blob", // This is crucial for binary data
    });

    // Create a blob URL for the PDF
    const file = new Blob([response.data], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    // Get filename from Content-Disposition header or use a default
    const contentDisposition = response.headers["content-disposition"];
    let filename = "resume.pdf";
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    return {
      blob: fileURL,
      name: filename,
    };
  } catch (err) {
    throw err;
  }
};

export const fetchProfileImage = async (id: number | undefined) => {
  try {
    if (!id) return null;

    const response = await api.get(`JobSeekers/GetProfilePicture/${id}`, {
      responseType: "blob", // This is crucial for binary data
    });

    if (response.data && response.data.size > 0) {
      const contentType = response.headers["content-type"] || "image/jpeg";
      const file = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(file);
      return fileURL;
    }
    return null;
  } catch (err) {
    console.error("Error fetching profile image:", err);
    return null;
  }
};
export const fetchLogoCompany = async (id: number | undefined) => {
  try {
    if (!id) return null;

    const response = await api.get(`Companies/GetLogoCompany/${id}`, {
      responseType: "blob", // This is crucial for binary data
    });

    if (response.data && response.data.size > 0) {
      const contentType = response.headers["content-type"] || "image/jpeg";
      const file = new Blob([response.data], { type: contentType });
      const fileURL = URL.createObjectURL(file);
      return fileURL;
    }
    return null;
  } catch (err) {
    console.error("Error fetching profile image:", err);
    return null;
  }
};
export const fetchUser = async (id: number | undefined) => {
  try {
    const res = await api.get(`Auth/GetJobSeekerByIDWithTokenAndRole/${id}`);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const ApplayForJob = async (data: {
  jobID: number;
  jobSeekerID: number;
}) => {
  try {
    const res = api.post(`jobs/ApplayForJob`, data);

    return res;
  } catch (err) {
    throw err;
  }
};

export const getJobRequest = async (id: number | undefined) => {
  try {
    const res = await api.get(`Requests/GetRequestByID/${id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const updateStatusJobRequest = async (
  requestId: number | undefined,
  status: boolean
): Promise<any> => {
  if (requestId == null) {
    throw new Error("requestId is required");
  }

  const { data } = await api.put(
    `jobs/UpdateStatusRequestJob/${requestId},${status}`
  );
  return data;
};
