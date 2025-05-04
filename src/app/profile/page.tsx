"use client";
import ProfileAvatar from "@/components/ui/ProfileAvataer";
import DynamicForm from "@/components/ui/DynamicForm";
import { useState } from "react";
import type { UpdateJobSeekerType } from "@/utils/types";
import { useGetUser } from "@/hooks/useGetUser";

export default function Page() {
  const [dataUpdate, setDataUpdate] = useState<UpdateJobSeekerType>({});
  const { user, userId } = useGetUser();

  return (
    <div className="flex flex-col gap-8 w-full h-full p-4 sm:p-6 md:p-8 border-[1px] border-gray-100 bg-white">
      <h1 className="text-xl sm:text-2xl font-medium text-gray-950">
        Personal information
      </h1>
      <div className="self-center mt-2 sm:mt-4">
        <ProfileAvatar
          setDataUpdate={setDataUpdate}
          userId={userId}
          firstName={user?.allJobSeekerInfo?.firstName}
          lastName={user?.allJobSeekerInfo?.lastName}
        />
      </div>
      {user?.allJobSeekerInfo && (
        <DynamicForm dataUpdate={dataUpdate} userData={user.allJobSeekerInfo} />
      )}
    </div>
  );
}
