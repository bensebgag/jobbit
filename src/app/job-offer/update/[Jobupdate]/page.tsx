"use client";
import Container from "@/components/layout/Container";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/layout/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Skill } from "@/utils/types";
import { fetchSkills } from "@/utils/ApisFunctions/skillsGateogries";
import { useState, useEffect } from "react";
import useFocus from "@/hooks/useFocus";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useForm, Controller } from "react-hook-form";
import api from "@/utils/api";
import { getJobById } from "@/utils/ApisFunctions/JobsApi";
import { useGetUser } from "@/hooks/useGetUser";
import { toast } from "react-hot-toast"; // Assuming you use toast for notifications

// Define types for job types and experience levels
type JobType = {
  id: number;
  name: string;
};

type JobExperience = {
  id: number;
  name: string;
};

// Updated JobById type to match API response
type JobById = {
  jobID: number;
  comapnyInfo: {
    companyID: number;
    wilayaInfo: {
      wilayaID: number;
      name: string;
    };
    name: string;
    description: string;
    logoPath: string;
    link: string;
    email: string;
    phone: string;
    isActive: boolean;
  };
  jobType: string;
  postedDate: string;
  experience: string;
  available: boolean;
  title: string;
  description: string;
  skills: Skill[]; // Updated to use your existing Skill type
};

// Define form data type
type JobUpdate = {
  jobID: number;
  companyID: number;
  title: string;
  jobType: number; // We'll need to convert from string to number
  experience: number; // We'll need to convert from string to number
  description: string;
  skills: number[];
};

// API functions to fetch job types and experience levels
const fetchJobTypes = async (): Promise<JobType[]> => {
  const response = await api.get("jobs/GetAllJopTypes");
  return response.data;
};

const fetchJobExperiences = async (): Promise<JobExperience[]> => {
  const response = await api.get("jobs/GetAllJobExperience");
  return response.data;
};

export default function Page({ params }: { params: { Jobupdate: string } }) {
  const { companyId } = useGetUser();

  // Fetch the job by ID
  const { data: jobById, isLoading } = useQuery<JobById>({
    queryKey: ["getJob", params.Jobupdate],
    queryFn: () => getJobById(+params.Jobupdate),
    enabled: !!params.Jobupdate, // Only run if jobId exists
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<JobUpdate>({
    defaultValues: {
      title: "",
      description: "",
      experience: 0,
      jobType: 0,
      companyID: companyId || 0,
      jobID: Number.parseInt(params.Jobupdate),
      skills: [],
    },
  });

  // State for search and selection UI
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { ref, handleFocus, isFocused } = useFocus();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch job types, experience levels, and skills
  const { data: jobTypes, isLoading: isLoadingJobTypes } = useQuery<JobType[]>({
    queryKey: ["JobTypes"],
    queryFn: () => fetchJobTypes(),
  });

  const { data: jobExperiences, isLoading: isLoadingExperiences } = useQuery<
    JobExperience[]
  >({
    queryKey: ["JobExperiences"],
    queryFn: () => fetchJobExperiences(),
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ["Skills"],
    queryFn: () => fetchSkills(),
  });

  // Helper function to find job type ID from name
  const findJobTypeId = (typeName: string): number => {
    if (!jobTypes) return 0;
    const jobType = jobTypes.find((type) => type.name === typeName);
    return jobType?.id || 0;
  };

  // Helper function to find experience ID from name
  const findExperienceId = (expName: string): number => {
    if (!jobExperiences) return 0;
    const exp = jobExperiences.find((exp) => exp.name === expName);
    return exp?.id || 0;
  };

  // Update job mutation
  const UpdateJobMutation = useMutation({
    mutationFn: async (data: JobUpdate) => {
      const response = await api.put("jobs/UpdateJob", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Job updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update job. Please try again.");
    },
  });

  // Populate form with existing job data when it loads
  useEffect(() => {
    if (jobById && jobTypes && jobExperiences) {
      console.log(jobById);
      setValue("title", jobById.title);
      setValue("description", jobById.description);
      setValue("companyID", companyId || jobById.comapnyInfo.companyID);
      setValue("jobID", jobById.jobID);

      // Convert string values to IDs for jobType and experience
      const jobTypeId = findJobTypeId(jobById.jobType);
      const experienceId = findExperienceId(jobById.experience);

      setValue("jobType", jobTypeId);
      setValue("experience", experienceId);

      // Set skills
      if (jobById.skills && Array.isArray(jobById.skills)) {
        setValue(
          "skills",
          jobById.skills.map((skill) => skill.skillID)
        );

        // Convert API skill format to the format used in the UI
        const formattedSkills = jobById.skills.map((skill) => ({
          skillID: skill.skillID,
          skillName: skill.name,
          categoryName: "", // We don't have this in the API response
          iconUrl: skill.iconUrl,
        }));

        setSelectedItems(formattedSkills);
      }
    }
  }, [jobById, jobTypes, jobExperiences, setValue, companyId]);

  // Categories for the form
  const formCategories = [
    {
      title: "Experience",
      options: jobExperiences || [],
      isLoading: isLoadingExperiences,
      formField: "experience",
    },
    {
      title: "Remote allowed",
      options: jobTypes || [],
      isLoading: isLoadingJobTypes,
      formField: "jobType",
    },
  ];

  const technologies = skills || [];

  const handleSelect = (item: Skill) => {
    if (!selectedItems.some((selected) => selected.skillID === item.skillID)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);

      setValue(
        "skills",
        newSelectedItems.map((skill) => skill.skillID)
      );
    }
  };

  const handleRemove = (item: any) => {
    const updatedItems = selectedItems.filter(
      (selected) => selected.skillID !== item.skillID
    );
    setSelectedItems(updatedItems);

    setValue(
      "skills",
      updatedItems.map((skill) => skill.skillID)
    );
  };

  const filteredItems = technologies.filter((item) =>
    (item.skillName || item.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Form submission handler
  const onSubmit = (data: JobUpdate) => {
    console.log(data);
    UpdateJobMutation.mutate(data);
  };

  return (
    <>
      <Navigation />
      <Container styleElement="h-full mt-10 md:mt-20 mb-10 md:mb-20">
        {jobById && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
            <p className="text-gray-950 font-medium text-xl sm:text-2xl md:text-3xl">
              Update Job Offer
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
              <span className="text-gray-600">
                Job ID: <span className="font-medium">{jobById.jobID}</span>
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-gray-600">
                Posted:{" "}
                <span className="font-medium">
                  {new Date(jobById.postedDate).toLocaleDateString()}
                </span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  jobById.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {jobById.available ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col py-4 sm:py-6 px-4 sm:px-6 md:px-8 gap-4 sm:gap-6 bg-white rounded-md border border-gray-200 shadow-sm w-full"
        >
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : (
            <>
              {/* Job Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-medium text-gray-800 mb-4">
                  Job Information
                </h2>

                {/* Company Information */}
                {jobById && (
                  <div className="bg-blue-50 rounded-md p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-blue-700 font-medium text-sm">
                        Company:
                      </span>
                      <span className="text-gray-800">
                        {jobById.comapnyInfo.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <span className="text-blue-700 font-medium text-sm">
                        Location:
                      </span>
                      <span className="text-gray-800">
                        {jobById.comapnyInfo.wilayaInfo.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="text-blue-700 font-medium text-sm">
                        Contact:
                      </span>
                      <span className="text-gray-800">
                        {jobById.comapnyInfo.email || "N/A"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Job Title */}
                <div className="flex flex-col gap-2 mb-4 sm:mb-6">
                  <Label className="text-gray-950 font-medium text-base sm:text-lg">
                    Job Title
                  </Label>
                  <Controller
                    name="title"
                    control={control}
                    rules={{ required: "Job title is required" }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        className="text-gray-950 font-medium text-sm"
                        placeholder="Example: Developer full Stack in Ruby on Rails and React"
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Job Description */}
                <div className="flex flex-col gap-2">
                  <Label className="text-gray-950 font-medium text-base sm:text-lg">
                    Job Description
                  </Label>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: "Job description is required" }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className="border border-gray-300 rounded-md text-xs sm:text-sm leading-normal text-gray-800 h-32 sm:h-40 p-3"
                        placeholder="Describe the job responsibilities, requirements, and any other details..."
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">
                  Skills Required
                </h2>

                <div ref={ref} className="w-full bg-white rounded-md">
                  <div
                    className={`px-3 py-3 flex flex-wrap items-center gap-2 border rounded-md ${
                      isFocused ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    {selectedItems.map((item) => (
                      <div
                        key={item.skillID}
                        className="flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 rounded-full"
                      >
                        <span>{item.skillName || item.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-blue-500 hover:text-blue-700 ml-1"
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    <input
                      onFocus={handleFocus}
                      placeholder="Search for skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 border-none outline-none min-w-[100px] text-xs sm:text-sm py-2"
                    />

                    {isFocused ? (
                      <ChevronUp
                        onClick={handleFocus}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    ) : (
                      <ChevronDown
                        onClick={handleFocus}
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                      />
                    )}
                  </div>

                  {isFocused && (
                    <div className="border border-t-0 rounded-b-md">
                      <div className="max-h-[200px] sm:max-h-[250px] overflow-y-auto">
                        {isLoadingSkills ? (
                          <div className="p-4 flex justify-center">
                            <Spinner />
                          </div>
                        ) : filteredItems.length > 0 ? (
                          filteredItems.map((item) => (
                            <div
                              key={item.skillID}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleSelect(item)}
                            >
                              <span className="text-xs sm:text-sm">
                                {item.skillName || item.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            No matching skills found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Type and Experience Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 pb-6">
                {formCategories.map((category, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    {category.isLoading ? (
                      <Spinner />
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {category.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center gap-2"
                          >
                            <Controller
                              name={
                                category.formField as "experience" | "jobType"
                              }
                              control={control}
                              render={({ field }) => (
                                <Input
                                  type="radio"
                                  id={`${category.formField}-${option.id}`}
                                  className="w-4 h-4 text-blue-600"
                                  checked={field.value === option.id}
                                  onChange={() => {
                                    setValue(
                                      category.formField as
                                        | "experience"
                                        | "jobType",
                                      option.id
                                    );
                                  }}
                                />
                              )}
                            />
                            <Label
                              htmlFor={`${category.formField}-${option.id}`}
                              className="text-gray-700 text-sm sm:text-md cursor-pointer"
                            >
                              {option.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || UpdateJobMutation.isPending}
                  className="bg-blue-600 text-white font-medium text-sm uppercase px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  {UpdateJobMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Updating...
                    </>
                  ) : (
                    "Update Job"
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Container>
      <Footer />
    </>
  );
}
