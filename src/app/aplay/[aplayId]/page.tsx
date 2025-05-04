"use client";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";
import Image from "next/image";
import Navigation from "@/components/ui/Navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCv,
  fetchProfileImage,
  getJobRequest,
  updateStatusJobRequest,
} from "@/utils/ApisFunctions/JobsApi";
import Spinner from "@/components/ui/Spinner";
import { formatDate } from "@/utils/helper";
import { use } from "react";

export interface Wilaya {
  wilayaID: number;
  name: string;
}

export interface Skill {
  skillID: number;
  skillCategoryID: number;
  name: string;
  iconUrl: string;
}

export interface JobSeeker {
  jobSeekerID: number;
  wilayaInfo: Wilaya;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  profilePicturePath: string;
  cvFilePath: string;
  linkProfileLinkden: string;
  linkProfileGithub: string;
  email: string;
  phone: string;
  isActive: boolean;
  skills: Skill[];
}

export interface Company {
  companyID: number;
  wilayaInfo: Wilaya;
  name: string;
  description: string;
  logoPath: string;
  link: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export interface Job {
  jobID: number;
  comapnyInfo: Company;
  jobType: string;
  postedDate: string;
  experience: string;
  available: boolean;
  title: string;
  description: string;
  skills: Skill[];
}

export interface JobRequest {
  requestID: number;
  jobSeekerInfo: JobSeeker;
  jobInfo: Job;
  date: string;
  status: boolean;
}

export default function JobRequestPage({
  params,
}: {
  params: Promise<{ aplayId: number }>;
}) {
  // Unwrap params promise
  const unwrappedParams = use(params);
  const aplayId = unwrappedParams.aplayId;
  const queryClient = useQueryClient();
  const { data: jobRequest, isLoading } = useQuery<JobRequest>({
    queryKey: ["jobRequest", aplayId],
    queryFn: () => getJobRequest(aplayId),
  });

  const { data: ProfileImae, isLoading: isFetchImage } = useQuery({
    queryKey: ["imageUser", jobRequest?.jobSeekerInfo.jobSeekerID],
    queryFn: () => fetchProfileImage(jobRequest?.jobSeekerInfo.jobSeekerID),
    enabled: !!jobRequest?.jobSeekerInfo.jobSeekerID,
  });

  const { data: fechCv, isLoading: isFetchCv } = useQuery({
    queryKey: ["getCv"],
    queryFn: () => fetchCv(jobRequest?.jobSeekerInfo.jobSeekerID),
    enabled: !!jobRequest?.jobSeekerInfo.jobSeekerID,
  });
  const { mutate: updateStatusMutaion, isPending } = useMutation({
    mutationFn: (status: boolean) => updateStatusJobRequest(aplayId, status),
    onSuccess: (res) => {
      toast.success(res.message || "updated successfully");
      queryClient.invalidateQueries({ queryKey: ["ApplicantForCompanyJob"] });
    },
    onError: (err) => {
      toast.error(err.message || "ther is smothing wrong");
    },
  });

  const handleClickRequest = (status: boolean) => {
    updateStatusMutaion(status);
  };
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center w-full">
            <Spinner />
          </div>
        ) : (
          jobRequest && (
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-white">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Job Request</h1>
                    <div className="flex items-center">
                      <span className="ml-4 text-sm">
                        {formatDate(jobRequest.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Job Seeker Information */}
                  <div className="space-y-6">
                    {/* Profile */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                        <Image
                          src={!isFetchImage ? ProfileImae : ""}
                          alt={`${jobRequest.jobSeekerInfo.firstName} ${jobRequest.jobSeekerInfo.lastName}`}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {jobRequest.jobSeekerInfo.firstName}{" "}
                          {jobRequest.jobSeekerInfo.lastName}
                        </h2>
                        <p className="text-gray-600">
                          {jobRequest.jobSeekerInfo.wilayaInfo.name}
                        </p>
                        <div className="mt-2 flex space-x-3">
                          <a
                            href={jobRequest.jobSeekerInfo.linkProfileLinkden}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                          <a
                            href={jobRequest.jobSeekerInfo.linkProfileGithub}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            GitHub
                          </a>
                          <div
                            onClick={() => {
                              if (fechCv && !isFetchCv)
                                window.open(fechCv?.blob, "_blank");
                            }}
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:cursor-pointer"
                          >
                            View CV
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <p className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0..."
                            />
                          </svg>
                          {jobRequest.jobSeekerInfo.email}
                        </p>
                        <p className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0..."
                            />
                          </svg>
                          {jobRequest.jobSeekerInfo.phone}
                        </p>
                      </div>
                    </div>

                    {/* Personal Details & Skills */}
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Personal Details
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Birth Date</p>
                          <p>
                            {formatDate(jobRequest.jobSeekerInfo.dateOfBirth)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Gender</p>
                          <p>{jobRequest.jobSeekerInfo.gender}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {jobRequest.jobSeekerInfo.skills.map((skill) => (
                          <div
                            key={skill.skillID}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center"
                          >
                            <Image
                              src={skill.iconUrl}
                              alt={skill.name}
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded overflow-hidden bg-gray-200">
                        <Image
                          src={jobRequest.jobInfo.comapnyInfo.logoPath}
                          alt={jobRequest.jobInfo.comapnyInfo.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">
                          {jobRequest.jobInfo.title}
                        </h2>
                        <p className="text-gray-600">
                          {jobRequest.jobInfo.comapnyInfo.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {jobRequest.jobInfo.comapnyInfo.wilayaInfo.name} •{" "}
                          {jobRequest.jobInfo.jobType} •{" "}
                          {jobRequest.jobInfo.experience}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Posted: {formatDate(jobRequest.jobInfo.postedDate)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Job Description
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {jobRequest.jobInfo.description}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {jobRequest.jobInfo.skills.map((skill) => (
                          <div
                            key={skill.skillID}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full flex items-center"
                          >
                            <Image
                              src={skill.iconUrl}
                              alt={skill.name}
                              width={16}
                              height={16}
                              className="mr-1"
                            />
                            {skill.name}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Company Information
                      </h3>
                      <p className="text-gray-700 mb-2">
                        {jobRequest.jobInfo.comapnyInfo.description}
                      </p>
                      <p className="flex items-center text-gray-500">
                        Email:{" "}
                        <a
                          href={`mailto:${jobRequest.jobInfo.comapnyInfo.email}`}
                          className="ml-1 text-blue-600 hover:underline"
                        >
                          {jobRequest.jobInfo.comapnyInfo.email}
                        </a>
                      </p>
                      <p className="flex items-center text-gray-500">
                        Phone:{" "}
                        <span className="ml-1">
                          {jobRequest.jobInfo.comapnyInfo.phone}
                        </span>
                      </p>
                      <p className="flex items-center text-gray-500">
                        Website:{" "}
                        <a
                          href={jobRequest.jobInfo.comapnyInfo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 text-blue-600 hover:underline"
                        >
                          {jobRequest.jobInfo.comapnyInfo.link}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-4">
                  <button
                    disabled={isPending}
                    onClick={() => handleClickRequest(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    {isPending ? "proscess" : "Reject "}
                  </button>
                  <button
                    onClick={() => handleClickRequest(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {isPending ? "process" : "Accept"}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
      <Footer />
    </>
  );
}
