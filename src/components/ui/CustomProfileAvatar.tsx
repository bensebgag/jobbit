"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchLogoCompany } from "@/utils/ApisFunctions/JobsApi";
import { useQuery } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function CustomProfileAvatar({
  idUser,
  setLogoComapny,
}: {
  idUser: number | undefined;
  setLogoComapny: Dispatch<SetStateAction<File | undefined>>;
}) {
  const [image, setImage] = useState<string | null>(null);
  const { data: imageProfile } = useQuery({
    queryKey: ["LogoCompany", idUser],
    queryFn: () => fetchLogoCompany(idUser),
    enabled: !!idUser,
  });

  useEffect(() => {
    if (imageProfile) {
      setImage(imageProfile);
    }
  }, [imageProfile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setLogoComapny(file);
    }
  };

  return (
    <div className="relative w-24 h-24">
      <Avatar className="w-24 h-24 border-2 border-white">
        {image ? (
          <AvatarImage src={image} alt="Profile Picture" />
        ) : (
          <AvatarFallback className="text-lg bg-gray-300 text-white">
            AA
          </AvatarFallback>
        )}
      </Avatar>

      <label
        htmlFor="file-upload"
        className="absolute bottom-0 right-0 bg-gray-800 p-1 rounded-full cursor-pointer"
      >
        <Camera className="w-5 h-5 text-white" />
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
