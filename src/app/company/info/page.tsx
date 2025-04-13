"use client"
import ProfileAvatar from "@/components/ui/ProfileAvataer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchWillaya } from "@/utils/ApisFunctions/wilayaies";
import { Wilaya, UpdateJobSeeker } from "@/utils/types";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import useFocus from "@/hooks/useFocus";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import CustomProfileAvatar from "@/components/ui/CustomProfileAvatar";

// Define the form values type
type FormValues = {
    CompanyID: number|null;
    Name: string;
    Email: string;
    Phone: string;
    Description: string;
    Link: string;
    WilayaID: number|null;
    Logo: string | null;
};

export default function Page() {
    // Set up react-hook-form
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            Name: "JobBitPlatform",
            Email: "jobbit.contact@gmail.com",
            Phone: "",
            Description: "",
            Link: "https://www.linkedin.com/in/mohammedabdelkrimguendouz30/",
            WilayaID: null,
            Logo: null
        }
    });
    const [selectedItems, setSelectedItems] = useState<Wilaya>();

    // Access form values
    const selectedWilaya = watch("WilayaID");
    const profileImage = watch("Logo");

    // Fetch wilaya data
    const { data, isLoading } = useQuery({
        queryKey: ["wilaya"],
        queryFn: fetchWillaya,
    });

    const fakeData =
        data || [
            { "wilayaID": 1, "name": "Adrar" },
            { "wilayaID": 2, "name": "Chlef" },
            { "wilayaID": 3, "name": "Laghouat" },
            { "wilayaID": 4, "name": "Oum El Bouaghi" },
            { "wilayaID": 5, "name": "Batna" },
            { "wilayaID": 6, "name": "Béjaïa" },
            { "wilayaID": 7, "name": "Biskra" },
            { "wilayaID": 8, "name": "Béchar" },
            { "wilayaID": 9, "name": "Blida" },
            { "wilayaID": 10, "name": "Bouira" }
        ];

    const [searchQuery, setSearchQuery] = useState("");

    const handleSelect = (item: Wilaya) => {
        setValue("WilayaID", item.wilayaID);
       setSelectedItems(item);
        setSearchQuery("");
    };

    const filteredItems = fakeData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const { ref, handleFocus, isFocused } = useFocus();

    const updateProfile = useMutation({
        mutationFn: async (data: FormValues) => {

            console.log("Submitting data:", data);
            return Promise.resolve({ success: true });
        },
        onSuccess: () => {
            console.log("Profile updated successfully!");
        }
    });

    const onSubmit = (data: FormValues) => {
        console.log("Submitting data:", data);
        updateProfile.mutate(data);
    };

    // Custom handler for profile image update
    const handleProfileImageUpdate = (imageUrl: string | null) => {
        setValue("Logo", imageUrl);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 w-full p-8 border-[1px] border-gray-100 bg-white">
            <h1 className="text-2xl font-medium text-gray-950">Personal information</h1>

            <div className="self-center mt-4">
                <CustomProfileAvatar
                    currentImage={profileImage}
                    onImageChange={handleProfileImageUpdate}
                />
            </div>

            <div className="flex flex-col gap-4 px-20">
                <Controller
                    name="Name"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />

                <Controller
                    name="Email"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />

                <Controller
                    name="Phone"
                    control={control}
                    render={({ field }) => <Input placeholder="Primary Phone Number" {...field} />}
                />
            </div>

            <div className="flex flex-col gap-2 px-20">
                <p className="text-lg font-medium text-gray-950">Description</p>
                <Controller
                    name="Description"
                    control={control}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            className="border-1 border-gray-300 rounded-sm text-[12px] leading-normal text-gray-800 h-64"
                        />
                    )}
                />
            </div>

            <div className="flex flex-col gap-3 px-20">
                <p className="text-gray-950 font-medium text-lg">Enterprise Information</p>

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

                <div ref={ref} className="w-full h-5 bg-white rounded-md self-end relative">
                    <div
                        className={`px-2 py-3 flex flex-wrap items-center gap-2 border rounded-md relative ${
                            isFocused ? "border-blue-500" : "border-gray-200"
                        }`}
                    >
                        <span>{selectedItems?.name}</span>

                        <input
                            onFocus={handleFocus}
                            placeholder={!selectedWilaya ? "Wilaya" : ''}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border-none outline-none min-w-[150px]"
                        />
                        {isFocused ? (
                            <ChevronUp className="w-6 h-6 text-gray-400 cursor-pointer" onClick={handleFocus} />
                        ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400 cursor-pointer" onClick={handleFocus} />
                        )}
                    </div>

                    {isFocused && (
                        <div className="border-t absolute right-0 z-10 w-full bg-white">
                            <div className="max-h-[300px] overflow-y-auto">
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    filteredItems.map((item: Wilaya) => (
                                        <div
                                            key={item.wilayaID}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <span className="text-sm">{item.name}</span>
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
                className="text-white text-sm font-medium uppercase bg-green-700 self-end"
                disabled={updateProfile.isPending}
            >
                {updateProfile.isPending ? "Saving..." : "Save"}
            </Button>
        </form>
    );
}
