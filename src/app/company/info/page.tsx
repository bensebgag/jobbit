"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWillaya } from "@/utils/ApisFunctions/wilayaies";
import type { Wilaya } from "@/utils/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import useFocus from "@/hooks/useFocus";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomProfileAvatar from "@/components/ui/CustomProfileAvatar";
import { useGetUser } from "@/hooks/useGetUser";
import { updateCompany } from "@/utils/ApisFunctions/JobsApi";
import toast from "react-hot-toast";

// Define the form values type
type FormValues = {
  CompanyID: number | null;
  Name: string;
  Email: string;
  Phone: string;
  Description: string;
  Link: string;
  WilayaID: number;
  Logo: File | null;
};

export default function Page() {
  const { companyId, user } = useGetUser();
  const [LogoCompany, setLogoComapny] = useState<File>();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (user) {
      setValue("Name", user?.allCompanyInfo?.name);
      setValue("Description", user?.allCompanyInfo?.description);
      setValue("Email", user?.allCompanyInfo?.email);
      setValue("Phone", user?.allCompanyInfo?.phone);
      setValue("Link", user?.allCompanyInfo?.link);
      setValue("WilayaID", user?.allComapnyInfo?.wilayaInfo?.wilayaID);
    }
  }, [user, setValue]);

  const [selectedItems, setSelectedItems] = useState<Wilaya>();
  // Access form values
  const selectedWilaya = watch("WilayaID");

  // Fetch wilaya data
  const { data, isLoading } = useQuery({
    queryKey: ["wilaya"],
    queryFn: fetchWillaya,
  });

  const fakeData = data;

  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (item: Wilaya) => {
    setValue("WilayaID", item.wilayaID);
    setSelectedItems(item);
    setSearchQuery("");
  };

  const filteredItems = fakeData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { ref, handleFocus, isFocused } = useFocus();

  const updateProfile = useMutation({
    mutationFn: (data: FormData) => updateCompany(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: () => {
      toast.error("there is something wrong");
    },
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("Email", data.Email);
    formData.append("Phone", data.Phone);
    formData.append("Name", data.Name);
    formData.append("Description", data.Description);
    formData.append("Link", data.Link);
    if (LogoCompany) {
      formData.append("Logo", LogoCompany);
    }
    formData.append("WilayaID", String(data.WilayaID));
    formData.append("CompanyID", String(companyId));

    updateProfile.mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 sm:gap-8 w-full p-4 sm:p-6 md:p-8 border-[1px] border-gray-100 bg-white"
    >
      <h1 className="text-xl sm:text-2xl font-medium text-gray-950">
        Personal information
      </h1>

      <div className="self-center mt-2 sm:mt-4">
        <CustomProfileAvatar
          idUser={companyId}
          setLogoComapny={setLogoComapny}
        />
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-10 md:px-20">
        <div className="space-y-1">
          <Label className="text-sm">Company Name</Label>
          <Controller
            name="Name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Email</Label>
          <Controller
            name="Email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">Phone</Label>
          <Controller
            name="Phone"
            control={control}
            render={({ field }) => (
              <Input placeholder="Primary Phone Number" {...field} />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 sm:px-10 md:px-20">
        <p className="text-base sm:text-lg font-medium text-gray-950">
          Description
        </p>
        <Controller
          name="Description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="border-1 p-4 border-gray-300 rounded-sm text-[12px] leading-normal text-gray-800 h-40 sm:h-64"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 sm:px-10 md:px-20">
        <p className="text-gray-950 font-medium text-base sm:text-lg">
          Enterprise Information
        </p>

        <div className="flex flex-col gap-1">
          <Label className="text-[12px] text-gray-800 font-normal">
            Website
          </Label>
          <Controller
            name="Link"
            control={control}
            render={({ field }) => (
              <Input className="text-sm text-gray-950" {...field} />
            )}
          />
        </div>

        <div
          ref={ref}
          className="w-full bg-white rounded-md self-end relative mt-2"
        >
          <Label className="text-[12px] text-gray-800 font-normal mb-1 block">
            Location
          </Label>
          <div
            className={`px-2 py-3 flex flex-wrap items-center gap-2 border rounded-md relative ${
              isFocused ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <span className="text-sm truncate max-w-[150px]">
              {selectedItems?.name}
            </span>

            <input
              onFocus={handleFocus}
              placeholder={!selectedWilaya ? "Wilaya" : ""}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none outline-none min-w-[100px] text-sm"
            />
            {isFocused ? (
              <ChevronUp
                className="w-5 h-5 text-gray-400 cursor-pointer flex-shrink-0"
                onClick={handleFocus}
              />
            ) : (
              <ChevronDown
                className="w-5 h-5 text-gray-400 cursor-pointer flex-shrink-0"
                onClick={handleFocus}
              />
            )}
          </div>

          {isFocused && (
            <div className="border-t absolute right-0 z-10 w-full bg-white">
              <div className="max-h-[200px] sm:max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <Spinner />
                ) : (
                  filteredItems?.map((item: Wilaya) => (
                    <div
                      key={item.wilayaID}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelect(item)}
                    >
                      <span className="text-xs sm:text-sm">{item.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="text-white text-sm font-medium uppercase bg-green-700 self-end mt-4"
        disabled={updateProfile.isPending}
      >
        {updateProfile.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
