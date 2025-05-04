"use client";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import type { UpdateJobSeekerType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import { fetchProfileImage } from "@/utils/ApisFunctions/JobsApi";

interface Props {
  setDataUpdate: Dispatch<SetStateAction<UpdateJobSeekerType | undefined>>;
  profileImage?: string;
  userId?: number;
  firstName?: string;
  lastName?: string;
}

export default function ProfileAvatar({
  setDataUpdate,
  profileImage,
  userId,
  firstName,
  lastName,
}: Props) {
  const [image, setImage] = useState<string | null>(null);

  // Query for fetching profile image
  const { data: imageProfile, isLoading: isFetchImageUser } = useQuery({
    queryKey: ["imageUser", userId],
    queryFn: () => fetchProfileImage(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (imageProfile) {
      setImage(imageProfile);
    }
  }, [imageProfile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Create object URL for preview

      const imageUrl = URL.createObjectURL(file);
      console.log("imgeUrl", imageUrl);
      setImage(imageUrl);
      // Update parent state with the actual file
      setDataUpdate((prevState) => ({ ...prevState, ProfileImage: file }));
    }
  };

  // Get initials from user name for avatar fallback
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "JS"; // JobSeeker default
  };

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24">
      <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-white">
        {image ? (
          <AvatarImage
            src={image || "/placeholder.svg"}
            alt="Profile Picture"
          />
        ) : (
          <AvatarFallback className="text-base sm:text-lg bg-gray-300 text-white">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>

      <label
        htmlFor="file-upload"
        className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer"
      >
        <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
}
