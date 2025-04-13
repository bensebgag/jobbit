"use client";

import { useForm } from "react-hook-form";
import { useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {DatePickerDemo} from "@/components/ui/DatePickerDemo";
import { ChevronDown, ChevronUp } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { UpdateJobSeekerType, Wilaya} from "@/utils/types";
import useFocus from "@/hooks/useFocus";
import { useQuery,useMutation,} from "@tanstack/react-query";
import {fetchWillaya} from "@/utils/ApisFunctions/wilayaies";
import { UpdateJobSeeker} from "@/utils/ApisFunctions/JobsApi";

interface  Props {
    dataUpdate: UpdateJobSeekerType | undefined
}
// Example forms configuration
const forms = [
    {
        sectionName: "Identity",
        dataForm: [
            { label: "First Name", type: "string",indetify:"FirstName" },
            { label: "Last Name", type: "string",indetify:"LastName" },
            { label: "Birthday", type: "string",indetify:"Birthday" },
        ],
    },
    {
        sectionName: "Contact Information",
        dataForm: [
            { label: "Email", type: "email" ,indetify:"Email" },
            { label: "Primary phone number", type: "string" ,indetify:"Phone" },
            { label: "Address", type: "string" ,indetify:"Address" },
            { label: "Wilaya", type: "string" ,indetify:"Wilaya" },
        ],
    },
    {
        sectionName: "Links",
        dataForm: [
            { label: "Linked In", type: "string" ,indetify:"LinkedIn" },
            { label: "Github", type: "string",indetify:"Github" },
        ],
    },
];

export default function DynamicForm({dataUpdate}: Props) {
    const { register, handleSubmit } = useForm();
    const { ref, handleFocus, isFocused } = useFocus();
    const [datePicker, setDatePicker] = useState<Date>();
    const [selectedItems, setSelectedItems] = useState<Wilaya>();
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["wilaya"],
        queryFn:fetchWillaya,
    });

    const mutation=useMutation(UpdateJobSeeker);


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
            // ... additional fake items
        ];

    const handleSelect = (item: Wilaya) => {
            setSelectedItems(item);
    };



    const filteredItems = fakeData.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onSubmit = (data:any) => {
      console.log(data ,selectedItems?.wilayaID,datePicker);

        mutation.mutate({
              FirstName:data.firstName,
              LastName:data.lastName,
              DateOfBrith:datePicker,
              LinkProfileLinkden:data.LinkedIn,
              LinkProfileGithub:data.Github,
              Phone:data.Phone,
              WilayaID:selectedItems?.wilayaID,
              CV:dataUpdate?.CV,
              ProfileImage:dataUpdate?.ProfileImage,
              Skills:dataUpdate?.Skills

        })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
            {forms.map((section, index) => (
                <div key={index} className="space-y-4">
                    <h2 className="text-lg font-semibold">{section.sectionName}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.dataForm.map((field, idx) => {
                            if (field.label === "Wilaya") {
                                return (
                                    <div key={idx} ref={ref} className="w-80 h-10 bg-white rounded-md self-end relative ">
                                        <div
                                            className={`px-2 py-3 flex flex-wrap items-center gap-2 border rounded-md relative ${
                                                isFocused ? "border-blue-500" : "border-gray-200"
                                            }`}
                                        >
                                                    <span>{selectedItems?.name}</span>

                                            <input
                                                onFocus={handleFocus}
                                                placeholder={!selectedItems?"Wilaya":''}
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
                                            <div className="border-t absolute right-0  z-10 w-full bg-white  ">
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {isLoading ? (
                                                        <Spinner />
                                                    ) : (
                                                        filteredItems.map((item:Wilaya) => (
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
                                );
                            }

                            if(field.label==="Birthday") return(<DatePickerDemo setDatePicker={setDatePicker} key={field.label}/>);

                            return (
                                <div key={idx} className="flex flex-col">
                                    <Label htmlFor={field.label} className="text-sm font-medium">
                                        {field.label}
                                    </Label>
                                    <Input
                                        id={field.label}
                                        type={field.type === "string" ? "text" : field.type}
                                        placeholder={field.label}
                                        {...register(field.indetify)}
                                        className="mt-1 border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <Button className="self-end bg-blue-500" type="submit">
                Save
            </Button>
        </form>
    );
}
