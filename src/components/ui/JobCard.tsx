import { JobDetails } from "@/utils/types";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Item {
  image: string;
  title: string;
  siklsImages: string[];
  location: string;
  jobId: number;
  nameCampny: string;
  item: JobDetails;
  date: Date;
}

export default function JobCard({
  image,
  title,
  siklsImages,
  location,
  nameCampny,
  jobId,
  item,
  date,
}: Item) {
  const isValidUrl = (url: string) => url.startsWith("http");

  return (
    <Link
      href={`/job-offer/${jobId}`}
      className="group flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 justify-between bg-white rounded-xl shadow-lg shadow-gray-400 transform transition-all duration-200 ease-in-out hover:scale-105 hover:bg-blue-600 hover:cursor-pointer"
    >
      <div className="flex items-center gap-1 sm:gap-2 justify-end flex-wrap">
        {siklsImages.map((img, idx) => (
          <div
            key={idx}
            className="bg-gray-200 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transform transition-colors duration-200 ease-in-out group-hover:bg-blue-500"
          >
            <Image
              src={img}
              width={24}
              height={24}
              className="w-4 h-4 sm:w-6 sm:h-6 rounded-full"
              alt={img}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Image
          src={isValidUrl(image) ? image : "/placeholder.png"}
          width={96}
          height={96}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-md object-cover"
          alt={title}
        />
        <div className="flex flex-col gap-1">
          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-900 group-hover:text-white line-clamp-2">
            {title}
          </p>
          <p className="text-sm sm:text-base md:text-lg font-normal text-gray-800 group-hover:text-white line-clamp-1">
            {nameCampny}
          </p>
          <p className="flex items-center gap-1 text-xs sm:text-sm font-bold text-gray-700 group-hover:text-white">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>{location}</span>
          </p>
        </div>
      </div>
      <p className="text-xs sm:text-sm font-medium text-gray-600 self-end group-hover:text-white">
        {date.toString()}
      </p>
    </Link>
  );
}
