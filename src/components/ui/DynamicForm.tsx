"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerDemo } from "@/components/ui/DatePickerDemo";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import type { UpdateJobSeekerType, Wilaya } from "@/utils/types";
import useFocus from "@/hooks/useFocus";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWillaya } from "@/utils/ApisFunctions/wilayaies";
import { fetchUser, UpdateJobSeeker } from "@/utils/ApisFunctions/JobsApi";
import { useGetUser } from "@/hooks/useGetUser";
import toast from "react-hot-toast";

interface Props {
  dataUpdate: UpdateJobSeekerType;
  userData: any; // Type this properly based on your user data structure
}

// Example forms configuration
const forms = [
  {
    sectionName: "Identity",
    dataForm: [
      { label: "First Name", type: "string", indetify: "FirstName" },
      { label: "Last Name", type: "string", indetify: "LastName" },
      { label: "Birthday", type: "string", indetify: "Birthday" },
    ],
  },
  {
    sectionName: "Contact Information",
    dataForm: [
      { label: "Email", type: "email", indetify: "Email" },
      { label: "Primary phone number", type: "string", indetify: "Phone" },
      { label: "Wilaya", type: "string", indetify: "Wilaya" },
    ],
  },
  {
    sectionName: "Links",
    dataForm: [
      { label: "Linked In", type: "string", indetify: "LinkedIn" },
      { label: "Github", type: "string", indetify: "Github" },
    ],
  },
];

export default function DynamicForm({ dataUpdate, userData }: Props) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const { ref, handleFocus, isFocused } = useFocus();
  const [datePicker, setDatePicker] = useState<Date | undefined>();
  const [selectedItems, setSelectedItems] = useState<Wilaya | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useGetUser();

  // Fetch wilaya data
  const { data, isLoading } = useQuery({
    queryKey: ["wilaya"],
    queryFn: fetchWillaya,
  });

  // Query for user data
  const { data: userData2 } = useQuery({
    queryKey: ["getUser", userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  // Update user profile mutation
  const { mutate } = useMutation({
    mutationKey: ["updateJobSeeker"],
    mutationFn: (data: FormData) => UpdateJobSeeker(data),
    onSuccess: async () => {
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["getUser", userId] });
      queryClient.invalidateQueries({ queryKey: ["imageUser", userId] });

      // Fetch the updated user data manually
      const updatedUserData = await fetchUser(userId);

      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      toast.success(" update successfull");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Populate form with user data when component mounts
  useEffect(() => {
    if (userData) {
      setValue("FirstName", userData.firstName);
      setValue("LastName", userData.lastName);
      setValue("Email", userData.email);
      setValue("Phone", userData.phone);
      setValue("LinkedIn", userData.linkProfileLinkden);
      setValue("Github", userData.linkProfileGithub);

      // Set date picker if dateOfBirth exists
      if (userData.dateOfBirth) {
        setDatePicker(new Date(userData.dateOfBirth));
      }

      // Set wilaya if wilayaInfo exists
      if (userData.wilayaInfo) {
        setSelectedItems(userData.wilayaInfo);
      }
    }
  }, [userData, setValue]);

  const fakeData = data || [
    { wilayaID: 1, name: "Adrar" },
    { wilayaID: 2, name: "Chlef" },
    { wilayaID: 3, name: "Laghouat" },
    { wilayaID: 4, name: "Oum El Bouaghi" },
    { wilayaID: 5, name: "Batna" },
    { wilayaID: 6, name: "Béjaïa" },
    { wilayaID: 7, name: "Biskra" },
    { wilayaID: 8, name: "Béchar" },
    { wilayaID: 9, name: "Blida" },
    { wilayaID: 10, name: "Bouira" },
    // ... additional fake items
  ];

  const handleSelect = (item: Wilaya) => {
    setSelectedItems(item);
    setSearchQuery(""); // Clear search when item is selected
  };

  const filteredItems = fakeData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("JobSeekerID", String(userId));
    formData.append("Email", data.Email);
    formData.append("Phone", data.Phone);
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append(
      "DateOfBirth",
      datePicker?.toISOString() ?? userData.dateOfBirth
    );
    formData.append("Gender", data.Gender || userData.gender || 1);
    formData.append("WilayaID", String(selectedItems?.wilayaID));

    if (dataUpdate?.ProfileImage) {
      formData.append("ProfileImage", dataUpdate.ProfileImage);
    }

    if (dataUpdate.CV) {
      formData.append("CV", dataUpdate.CV);
    }

    formData.append("LinkProfileLinkden", data.LinkedIn);
    formData.append("LinkProfileGithub", data.Github);

    if (userData?.skills) {
      formData.append("Skills", JSON.stringify(userData.skills));
    }

    mutate(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 sm:space-y-8 flex flex-col"
    >
      {forms.map((section, index) => (
        <div key={index} className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold">
            {section.sectionName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.dataForm.map((field, idx) => {
              if (field.label === "Wilaya") {
                return (
                  <div
                    key={idx}
                    ref={ref}
                    className="w-full sm:w-80 h-10 bg-white rounded-md self-end relative"
                  >
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
                        placeholder={!selectedItems ? "Wilaya" : ""}
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
                            filteredItems.map((item: Wilaya) => (
                              <div
                                key={item.wilayaID}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelect(item)}
                              >
                                <span className="text-xs sm:text-sm">
                                  {item.name}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (field.label === "Birthday")
                return (
                  <DatePickerDemo
                    key={field.label}
                    setDatePicker={setDatePicker}
                    defaultDate={
                      userData?.dateOfBirth
                        ? new Date(userData.dateOfBirth)
                        : undefined
                    }
                  />
                );

              return (
                <div key={idx} className="flex flex-col">
                  <Label
                    htmlFor={field.label}
                    className="text-xs sm:text-sm font-medium mb-1"
                  >
                    {field.label}
                  </Label>
                  <Input
                    id={field.label}
                    type={field.type === "string" ? "text" : field.type}
                    placeholder={field.label}
                    {...register(field.indetify)}
                    className="text-sm border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <Button className="self-end bg-blue-500 mt-4" type="submit">
        Save
      </Button>
    </form>
  );
}
