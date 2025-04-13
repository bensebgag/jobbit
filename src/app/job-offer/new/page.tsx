"use client"
import Container from "@/components/layout/Container";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/layout/Footer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skill } from "@/utils/types";
import { fetchSkills } from "@/utils/ApisFunctions/skillsGateogries";
import { useState } from "react";
import useFocus from "@/hooks/useFocus";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useForm, Controller } from "react-hook-form";
import api from "@/utils/api";

// Define types for job types and experience levels
type JobType = {
    id: number;
    name: string;
};

type JobExperience = {
    id: number;
    name: string;
};

// Define form data type
type JobFormData = {
    title: string;
    description: string;
    experience: number;
    jobType: number;
    companyID: number;
    skils: number[]; // Note: matching the API field name
};

// API functions to fetch job types and experience levels
const fetchJobTypes = async (): Promise<JobType[]> => {
    const response = await api.get('/api/jobs/GetAllJopTypes');
    return response.data;
};

const fetchJobExperiences = async (): Promise<JobExperience[]> => {
    const response = await api.get('/api/jobs/GetAllJobExperience');
    return response.data;
};

export default function Page() {
    // Form setup
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobFormData>({
        defaultValues: {
            title: "",
            description: "",
            experience: 0,
            jobType: 0,
            companyID: 1, // Replace with actual company ID
            skils: []
        }
    });

    // State for search and selection UI
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
    const { ref, handleFocus, isFocused } = useFocus();
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch job types, experience levels, and skills
    const { data: jobTypes, isLoading: isLoadingJobTypes } = useQuery<JobType[]>({
        queryKey: ['JobTypes'],
        queryFn: fetchJobTypes,
    });

    const { data: jobExperiences, isLoading: isLoadingExperiences } = useQuery<JobExperience[]>({
        queryKey: ['JobExperiences'],
        queryFn: fetchJobExperiences,
    });

    const { data: skills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
        queryKey: ['Skills'],
        queryFn: fetchSkills,
    });

    // Create job mutation
    const createJobMutation = useMutation({
        mutationFn: async (data: JobFormData) => {
            const response = await api.post('/api/jobs/AddJob', data);
            return response.data;
        },
        onSuccess: () => {
            console.log('Job created successfully!');
            // Reset form or redirect
        },
        onError: (error) => {
            console.error('Error creating job:', error);
        }
    });

    // Categories for the form
    const formCategories = [
        {
            title: "Experience",
            options: jobExperiences ||[
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
            formField: "experience"
        },
        {
            title: "Remote allowed",
            options: jobTypes ||[
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
            formField: "jobType"
        },
    ];

    // Fallback skills data
    const technologies = skills || [
        {
            skillID: 1,
            categoryName: 'Design',
            skillName: 'Adobe InDesign',
            iconUrl: '/icons/indesign.png',
        },
        // Other skills as fallback
    ];

    // Handle skill selection
    const handleSelect = (item: Skill) => {
        if (!selectedItems.some(selected => selected.skillID === item.skillID)) {
            const newSelectedItems = [...selectedItems, item];
            setSelectedItems(newSelectedItems);

            // Update form value with skill IDs
            setValue('skils', newSelectedItems.map(skill => skill.skillID));
        }
    };

    // Handle skill removal
    const handleRemove = (item: Skill) => {
        const updatedItems = selectedItems.filter(selected => selected.skillID !== item.skillID);
        setSelectedItems(updatedItems);

        // Update form value with remaining skill IDs
        setValue('skils', updatedItems.map(skill => skill.skillID));
    };

    // Filter skills based on search query
    const filteredItems = technologies.filter((item) =>
        item.skillName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Form submission handler
    const onSubmit = (data: JobFormData) => {
        console.log(data);
        createJobMutation.mutate(data);
    };

    return (
        <>
            <Navigation />
            <Container styleElement="h-full mt-20 mb-20">
                <p className="text-gray-950 font-medium mb-6 text-3xl">Create Job Offer</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 px-8 gap-4 bg-white rounded-sm border-1 border-gray-200 w-full">
                    <div className="flex flex-col gap-1">
                        <Label className="text-gray-950 font-medium text-lg">The title of the position</Label>
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
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Skills selection */}
                    <div ref={ref} className="w-full bg-white rounded-md mt-10">
                        <Label className="text-gray-950 font-medium text-lg mb-2 block">Skills Required</Label>
                        <div
                            className={`px-2 py-3 flex flex-wrap items-center gap-2 border-[1px] rounded-md ${
                                isFocused ? 'border-blue-500' : 'border-gray-200'
                            }`}
                        >
                            {/* tags for selected skills */}
                            {selectedItems.map((item) => (
                                <div
                                    key={item.skillID}
                                    className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-gray-200 rounded-full"
                                >
                                    <span>{item.skillName}</span>
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
                                className="flex-1 border-none outline-none min-w-[150px]"
                            />

                            {isFocused ? (
                                <ChevronUp
                                    onClick={handleFocus}
                                    className="w-6 h-6 text-gray-400 cursor-pointer"
                                />
                            ) : (
                                <ChevronDown
                                    onClick={handleFocus}
                                    className="w-6 h-6 text-gray-400 cursor-pointer"
                                />
                            )}
                        </div>

                        {isFocused && (
                            <div className="border-t">
                                <div className="max-h-[300px] overflow-y-auto">
                                    {isLoadingSkills ? (
                                        <Spinner />
                                    ) : (
                                        filteredItems.map((item) => (
                                            <div
                                                key={item.skillID}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                                onClick={() => handleSelect(item)}
                                            >
                                                <span className="text-sm">{item.skillName}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Job description */}
                    <div className="flex flex-col gap-2 px-20">
                        <p className="text-lg font-medium text-gray-950">Description</p>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: "Job description is required" }}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="border-1 border-gray-300 rounded-sm text-[12px] leading-normal text-gray-800 h-64"
                                />
                            )}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Dynamic radio button groups */}
                    <div className="flex items-center gap-64 self-center mt-10 border-b-1 border-gray-200 p-3">
                        {formCategories.map((category, index) => (
                            <div key={index} className="flex flex-col gap-2 self-start">
                                <p className="text-gray-950 font-medium text-2xl">{category.title}</p>
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
                                                            setValue(category.formField as "experience" | "jobType", option.id);
                                                        }}
                                                    />
                                                )}
                                            />
                                            <Label className="text-gray-800 text-lg">{option.name}</Label>
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
                        className="bg-blue-500 text-white font-medium text-sm uppercase self-end cursor-pointer hover:bg-blue-800"
                    >
                        {createJobMutation.isPending ? "Submitting..." : "validate"}
                    </Button>
                </form>
            </Container>
            <Footer />
        </>
    );
}