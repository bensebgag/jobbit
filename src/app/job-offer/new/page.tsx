"use client";
import Container from "@/components/layout/Container";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/layout/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Skill } from "@/utils/types";
import { fetchSkills } from "@/utils/ApisFunctions/skillsGateogries";
import { useState } from "react";
import useFocus from "@/hooks/useFocus";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useForm, Controller } from "react-hook-form";
import api from "@/utils/api";
import { useGetUser } from "@/hooks/useGetUser";
import toast from "react-hot-toast";

// Define types for job types and experience levels
type JobType = {
  id: number;
  name: string;
};

type JobExperience = {
  id: number;
  name: string;
};

type JobFormData = {
  title: string;
  description: string;
  experience: number;
  jobType: number;
  companyID: number;
  skills: number[]; // Note: matching the API field name
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

export default function Page() {
  // Form setup
  const { companyId } = useGetUser();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    defaultValues: {
      title: "",
      description: "",
      experience: 0,
      jobType: 0,
      companyID: companyId, // Replace with actual company ID
      skills: [],
    },
  });

  // State for search and selection UI
  const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
  const { ref, handleFocus, isFocused } = useFocus();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch job types, experience levels, and skills
  const { data: jobTypes, isLoading: isLoadingJobTypes } = useQuery<JobType[]>({
    queryKey: ["JobTypes"],
    queryFn: fetchJobTypes,
  });

  const { data: jobExperiences, isLoading: isLoadingExperiences } = useQuery<
    JobExperience[]
  >({
    queryKey: ["JobExperiences"],
    queryFn: fetchJobExperiences,
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ["Skills"],
    queryFn: fetchSkills,
  });

  const queryClient = useQueryClient();
  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const response = await api.post(`jobs/AddJob`, data);
      return response.data;
    },
    onSuccess: (res) => {
      console.log("Job created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["jobsForCompany", companyId],
      });
      queryClient.invalidateQueries({ queryKey: ["jobsFilter"] });
      toast.success("sucess added new job");
      console.log(res);
      // Reset form or redirect
    },
    onError: (error) => {
      console.error("Error creating job:", error);
    },
  });

  // Categories for the form
  const formCategories = [
    {
      title: "Experience",
      options: jobExperiences || [
        {
          id: 1,
          name: "No Experience",
        },
        {
          id: 2,
          name: "Less than 1 year",
        },
        {
          id: 3,
          name: "1-2 years",
        },
        {
          id: 4,
          name: "3-5 years",
        },
        {
          id: 5,
          name: "6-10 years",
        },
        {
          id: 6,
          name: "More than 10 years",
        },
      ],
      isLoading: isLoadingExperiences,
      formField: "experience",
    },
    {
      title: "Remote allowed",
      options: jobTypes || [
        {
          id: 1,
          name: "Remote Work",
        },
        {
          id: 2,
          name: "Full-Time",
        },
        {
          id: 3,
          name: "Part-Time",
        },
        {
          id: 4,
          name: "Freelance",
        },
        {
          id: 5,
          name: "Contract",
        },
        {
          id: 6,
          name: "Internship",
        },
        {
          id: 7,
          name: "Temporary",
        },
      ],
      isLoading: isLoadingJobTypes,
      formField: "jobType",
    },
  ];

  // Fallback skills data
  const technologies = skills;

  // Handle skill selection
  const handleSelect = (item: Skill) => {
    if (!selectedItems.some((selected) => selected.skillID === item.skillID)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);

      // Update form value with skill IDs
      setValue(
        "skills",
        newSelectedItems.map((skill) => skill.skillID)
      );
    }
  };

  // Handle skill removal
  const handleRemove = (item: Skill) => {
    const updatedItems = selectedItems.filter(
      (selected) => selected.skillID !== item.skillID
    );
    setSelectedItems(updatedItems);

    // Update form value with remaining skill IDs
    setValue(
      "skills",
      updatedItems.map((skill) => skill.skillID)
    );
  };

  // Filter skills based on search query
  const filteredItems = technologies?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form submission handler
  const onSubmit = (data: JobFormData) => {
    console.log(data);
    createJobMutation.mutate({ ...data, companyID: companyId });
  };

  return (
    <>
      <Navigation />
      <Container styleElement="h-full mt-10 md:mt-20 mb-10 md:mb-20">
        <p className="text-gray-950 font-medium mb-4 md:mb-6 text-xl sm:text-2xl md:text-3xl">
          Create Job Offer
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col py-4 px-4 sm:px-6 md:px-8 gap-4 bg-white rounded-sm border border-gray-200 w-full"
        >
          <div className="flex flex-col gap-1">
            <Label className="text-gray-950 font-medium text-base sm:text-lg">
              The title of the position
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
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Skills selection */}
          <div ref={ref} className="w-full bg-white rounded-md mt-6 md:mt-10">
            <Label className="text-gray-950 font-medium text-base sm:text-lg mb-2 block">
              Skills Required
            </Label>
            <div
              className={`px-2 py-3 flex flex-wrap items-center gap-2 border rounded-md ${
                isFocused ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {/* tags for selected skills */}
              {selectedItems.map((item) => (
                <div
                  key={item.skillID}
                  className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm font-medium bg-gray-200 rounded-full"
                >
                  <span>{item.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
              ))}

              <input
                onFocus={handleFocus}
                placeholder="Technologies, languages, skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none min-w-[100px] text-sm"
              />

              {isFocused ? (
                <ChevronUp
                  onClick={handleFocus}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 cursor-pointer"
                />
              ) : (
                <ChevronDown
                  onClick={handleFocus}
                  className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 cursor-pointer"
                />
              )}
            </div>

            {isFocused && (
              <div className="border-t">
                <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto">
                  {isLoadingSkills ? (
                    <Spinner />
                  ) : (
                    filteredItems?.map((item) => (
                      <div
                        key={item.skillID}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelect(item)}
                      >
                        <span className="text-xs sm:text-sm">{item.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Job description */}
          <div className="flex flex-col gap-2 px-0 sm:px-10 md:px-20">
            <p className="text-base sm:text-lg font-medium text-gray-950">
              Description
            </p>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Job description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="border border-gray-300 rounded-sm text-xs sm:text-sm leading-normal text-gray-800 h-40 sm:h-64 p-3"
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Dynamic radio button groups */}
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16 lg:gap-64 mt-6 md:mt-10 border-b border-gray-200 p-3">
            {formCategories.map((category, index) => (
              <div key={index} className="flex flex-col gap-2 self-start">
                <p className="text-gray-950 font-medium text-lg sm:text-xl md:text-2xl">
                  {category.title}
                </p>
                {category.isLoading ? (
                  <Spinner />
                ) : (
                  category.options.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Controller
                        name={category.formField as "experience" | "jobType"}
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="radio"
                            className="bg-green-300 w-3 h-3"
                            checked={field.value === option.id}
                            onChange={() => {
                              setValue(
                                category.formField as "experience" | "jobType",
                                option.id
                              );
                            }}
                          />
                        )}
                      />
                      <Label className="text-gray-800 text-sm sm:text-base md:text-lg">
                        {option.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            disabled={createJobMutation.isPending}
            className="bg-blue-500 text-white font-medium text-sm uppercase self-end cursor-pointer hover:bg-blue-800 mt-4"
          >
            {createJobMutation.isPending ? "Submitting..." : "validate"}
          </Button>
        </form>
      </Container>
      <Footer />
    </>
  );
}
