"use client";

import type { JobApplicationStatusList } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { fetchApplicationForCompanyJob } from "@/utils/ApisFunctions/JobsApi";
import Spinner from "@/components/ui/Spinner";
import { useGetUser } from "@/hooks/useGetUser";
import Link from "next/link";

export default function Page() {
  const { companyId } = useGetUser();
  const { data, isLoading } = useQuery({
    queryKey: ["ApplicantForCompanyJob"],
    queryFn: () => fetchApplicationForCompanyJob(companyId),
    enabled: !!companyId,
  });

  // fallback dummy data if API returns nothing
  const jobRequests: JobApplicationStatusList = data || [
    {
      status: true,
      statusAsText: "Approved",
      applicantForCompanyJob: [
        {
          requestID: 1,
          postedDate: "2025-04-24T10:00:00Z",
          jobTitle: "Frontend Developer",
        },
        {
          requestID: 2,
          postedDate: "2025-04-23T14:30:00Z",
          jobTitle: "Backend Developer",
        },
      ],
    },
    {
      status: false,
      statusAsText: "Rejected",
      applicantForCompanyJob: [
        {
          requestID: 3,
          postedDate: "2025-04-22T09:00:00Z",
          jobTitle: "UI/UX Designer",
        },
        {
          requestID: 4,
          postedDate: "2025-04-21T16:45:00Z",
          jobTitle: "QA Engineer",
        },
      ],
    },
    {
      status: null,
      statusAsText: "Pending",
      applicantForCompanyJob: [
        {
          requestID: 5,
          postedDate: "2025-04-25T11:15:00Z",
          jobTitle: "DevOps Engineer",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 h-full w-full bg-white rounded-lg border border-gray-200">
      <p className="text-gray-950 text-lg sm:text-xl font-medium">
        Manage Job offers
      </p>

      {isLoading ? (
        <Spinner />
      ) : (
        jobRequests.map((item) => (
          <div key={item.statusAsText} className="mb-4">
            {item.applicantForCompanyJob.length > 0 && (
              <>
                <p className="text-gray-950 text-lg sm:text-sm font-medium mb-2">
                  {item.statusAsText}
                </p>
                <ul className="flex flex-col gap-2">
                  {item.applicantForCompanyJob.map((j) => {
                    const borderColorClass =
                      item.status === true
                        ? "border-r-green-500"
                        : item.status === false
                        ? "border-r-red-500"
                        : "border-r-yellow-500";

                    const bgColorClass =
                      item.status === true
                        ? "bg-green-500"
                        : item.status === false
                        ? "bg-red-500"
                        : "bg-yellow-500";

                    return (
                      <li
                        key={j.requestID}
                        className={`
                      pl-2 sm:pl-4 bg-white flex items-center justify-between
                      rounded-lg shadow-lg
                      border-y border-l 
                      ${borderColorClass}
                    `}
                      >
                        <div className="flex flex-col gap-2 sm:gap-3 py-2 sm:py-0">
                          <Link
                            href={`/aplay/${j.requestID}`}
                            className="text-blue-700 font-medium text-xs sm:text-sm underline"
                          >
                            {j.jobTitle}
                          </Link>
                          <p className="text-[10px] sm:text-[12px] text-gray-600 font-normal">
                            Published on{" "}
                            {new Date(j.postedDate).toLocaleString()}
                          </p>
                        </div>
                        <div
                          className={`w-2 sm:w-4 h-16 sm:h-20 rounded-r-sm ${bgColorClass}`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
