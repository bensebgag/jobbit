"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeJobAvailability,
  fetchJobsForCompany,
} from "@/utils/ApisFunctions/JobsApi";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobsForCompany } from "@/utils/types";
import Spinner from "@/components/ui/Spinner";
import { useGetUser } from "@/hooks/useGetUser";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Page() {
  const navigation = useRouter();
  const { companyId } = useGetUser();
  const queryCleint = useQueryClient();
  const { mutate: changeAvailabilityMutation } = useMutation({
    mutationKey: ["changeAvailability"],
    mutationFn: (params: { jobId: number; available: boolean }) =>
      changeJobAvailability(params.jobId, params.available),
    onSuccess: () => {
      toast.success("change avabilaty successfully");
      queryCleint.invalidateQueries({
        queryKey: ["jobsForCompany"],
      });
    },
  });
  console.log(companyId);
  const { data, isLoading } = useQuery({
    queryKey: ["jobsForCompany", companyId],
    queryFn: () => fetchJobsForCompany(companyId),
    enabled: !!companyId,
  });
  console.log(data);
  const [jobs, setJobs] = useState(data);

  const toggleAvailability = (jobToToggle: JobsForCompany) => {
    changeAvailabilityMutation({
      jobId: jobToToggle.jobID,
      available: !jobToToggle.available,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8 p-4 w-full h-full bg-white border-[1px] border-gray-300 rounded-tr-lg rounded-br-lg">
      <p className="text-gray-950 font-medium text-xl">
        Manage Jobs for Company
      </p>

      <Button
        onClick={() => navigation.push("/job-offer/new")}
        className="flex items-center gap-1 bg-green-800 self-end"
      >
        <Plus className="w-5 h-5 text-white" />
        <span className="text-sm text-white font-medium uppercase">
          Add Job Offer
        </span>
      </Button>

      <ul className="flex flex-col gap-4">
        {isLoading ? (
          <Spinner />
        ) : (
          data?.map((job) => (
            <li
              key={job.jobID}
              className="p-4 bg-white flex items-center justify-between border-[1px] border-gray-300 rounded-md shadow-md"
            >
              <div className="flex flex-col gap-2">
                <Link
                  className="text-blue-700 font-medium hover:text-blue-900"
                  href={`/job-offer/update/${job.jobID}`}
                >
                  {job.title}
                </Link>
                <p className="text-sm text-gray-600">
                  Published on {formatDate(job.postedDate)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    job.available ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {job.available ? "Active" : "Inactive"}
                </span>

                <div
                  onClick={() => toggleAvailability(job)}
                  className="relative inline-block w-12 h-6 cursor-pointer"
                >
                  <div
                    className={`w-full h-full rounded-full transition-colors duration-300 ease-in-out ${
                      job.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                      job.available ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
