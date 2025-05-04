"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchJobsApplay } from "@/utils/ApisFunctions/JobsApi";
import type { JobApplication } from "@/utils/types";
import { useGetUser } from "@/hooks/useGetUser";
import { formatDate } from "@/utils/helper";

export default function Page() {
  const { userId } = useGetUser();
  const { data } = useQuery<JobApplication[]>({
    queryKey: ["applyJobs"],
    queryFn: () => fetchJobsApplay(userId),
  });

  const applications = data || [
    {
      jobSeekerID: 1,
      jobID: 2,
      jobOffer: "Senior Frontend Developer",
      company: "SIG Service",
      appliedOn: "17 March 2025",
      status: null,
    },
  ];

  return (
    <div
      className={
        "bg-white p-3 sm:p-4 w-full h-full border-[1px] border-gray-100 rounded-lg flex flex-col gap-4"
      }
    >
      <p className={"text-lg sm:text-xl font-bold text-gray-950"}>
        Manage applications
      </p>
      <div className="overflow-x-auto">
        <Table
          className={"border-[1px] border-gray-200 rounded-xl min-w-[600px]"}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Job offer</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied on</TableHead>
              <TableHead className="text-center">status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className={"text-gray-800 text-[12px]"}>
            {applications.map((application, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <p className={"text-gray-800 text-[12px]"}>
                    {application.jobOffer}
                  </p>
                </TableCell>
                <TableCell>{application.company}</TableCell>
                <TableCell>{formatDate(application.appliedOn)}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`px-2 sm:px-4 py-1 text-white text-xs rounded-4xl ${
                      application.status === true && "bg-green-400"
                    } ${application.status === false && "bg-red-400"} ${
                      application.status === null && "bg-gray-500"
                    }`}
                  >
                    {(application.status === true && "accept") ||
                      (application.status === false && "reject") ||
                      "appending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
