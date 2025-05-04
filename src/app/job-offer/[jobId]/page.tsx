"use client";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/Navigation";
import Image from "next/image";
import { ChevronRight, MapPin } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import Spinner from "@/components/ui/Spinner";
import { use } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { ApplayForJob } from "@/utils/ApisFunctions/JobsApi";
import { formatDate } from "@/utils/helper";
import Footer from "@/components/layout/Footer";
import toast from "react-hot-toast";

export default function Page({ params }: { params: { jobId: number } }) {
  // Get user data
  const { user, userId } = useGetUser();

  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const jobId = unwrappedParams.jobId;

  const { data: jobData, isLoading } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await api.get(`jobs/GetJobByID/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
  });

  // Setup mutation for job application
  const { mutate, isPending } = useMutation({
    mutationFn: () => ApplayForJob({ jobID: jobId, jobSeekerID: userId }),
    onSuccess: () => {
      toast.success("applayed successfuly");
    },
  });

  // Handle case where data is not available yet after loading

  const job = {
    ...jobData,
    companyInfo: jobData?.comapnyInfo,
    jobExperience: jobData?.experience,
  };

  const isJobSeeker = user && user.role === "JobSeeker";

  return (
    <>
      <Navigation />

      <Container styleElement="flex flex-col md:flex-row gap-4 mt-10 md:mt-20 min-h-screen pb-10">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-20">
            <Spinner />
          </div>
        ) : (
          <>
            <div className="flex-1 order-2 md:order-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-950">
                {job.title}
              </h1>
              <p className="text-right text-gray-950 font-normal text-sm sm:text-base">
                {formatDate(job.postedDate)}
              </p>
              <div className="flex flex-col gap-4 border-t border-gray-100 p-2 mt-4">
                <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                  <span className="px-3 sm:px-4 py-1 text-white font-normal text-xs sm:text-sm bg-gray-500 rounded-3xl">
                    {job.jobType}
                  </span>
                  <span className="px-3 sm:px-4 py-1 text-white font-normal text-xs sm:text-sm bg-green-500 rounded-3xl">
                    {job.jobExperience}
                  </span>
                </div>

                <div className="flex items-center flex-wrap gap-2 sm:gap-4">
                  {job.skills?.map((skill) => (
                    <span
                      key={skill.skillID}
                      className="py-1 sm:py-2 px-3 sm:px-5 flex gap-2 rounded-3xl text-xs sm:text-sm font-normal text-gray-950 bg-yellow-200"
                    >
                      {skill.iconUrl && (
                        <Image
                          width={20}
                          height={20}
                          className="rounded-full hidden sm:block"
                          src={skill.iconUrl || "/placeholder.svg"}
                          alt={skill.name}
                        />
                      )}
                      {skill.name}
                    </span>
                  ))}
                </div>

                <div className="border-t border-b border-gray-200 py-4 mt-2">
                  <p className="text-sm sm:text-base text-gray-800 font-normal leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>

            {job.companyInfo && (
              <div className="flex flex-col flex-none w-full md:w-72 lg:w-96 order-1 md:order-2 self-start py-4 px-4 sm:px-8 border border-gray-100 rounded-sm bg-white shadow-sm">
                <div className="flex flex-col justify-center">
                  {job.companyInfo.logoPath && (
                    <Image
                      width={150}
                      height={150}
                      className="self-center object-contain h-24 w-auto"
                      src={job.companyInfo.logoPath || "/placeholder.svg"}
                      alt={job.companyInfo.name || "Company logo"}
                    />
                  )}
                  <p className="text-xl sm:text-2xl font-normal text-center text-gray-800 underline uppercase mt-2">
                    {job.companyInfo.name}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
                    {job.companyInfo.wilayaInfo && (
                      <p className="text-sm flex items-center font-normal text-gray-800">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.companyInfo.wilayaInfo.name}</span>
                      </p>
                    )}
                    {job.companyInfo.link && (
                      <div className="text-green-600 py-1 flex items-center gap-1 font-normal hover:bg-green-50 hover:cursor-pointer hover:rounded-sm">
                        <ChevronRight className="w-4 h-4" />
                        <a
                          className="uppercase text-xs sm:text-sm"
                          href={job.companyInfo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          website
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 border-t border-gray-200 my-4"></div>

                {isJobSeeker && (
                  <Button
                    onClick={() => mutate()}
                    disabled={isPending}
                    className="bg-blue-500 text-base sm:text-lg text-white font-normal w-full"
                  >
                    {isPending ? "SUBMITTING..." : "POSTULER"}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}
