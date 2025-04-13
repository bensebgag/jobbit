"use client"
import Container from "@/components/layout/Container";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronUp, CircleUserRound, Mail, MoveRight, Phone} from "lucide-react";
import Step from "@/components/ui/Step";
import Image from "next/image";
import uploadImae from "@/../public/uploadFile.png"
import fileDocImage from "@/../public/Group 13985.png"
import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import gogoleIcon from "../../../public/Frame.png";
import Field from "@/components/ui/Field";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/layout/Footer";
import {useMutation, useQuery} from "@tanstack/react-query";
import {RegisterJobSeeker} from "@/utils/ApisFunctions/JobsApi";
import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import {dataForSubmitRegister, SkillsGategorie} from "@/utils/types";
import animationData from  "@/../public/Animation - 1743130347651.json";
import {useForm} from "react-hook-form";
import useFocus from "@/hooks/useFocus";
import {fetchSkillsGategories} from "@/utils/ApisFunctions/skillsGateogries";
import Spinner from "@/components/ui/Spinner";

const steps=[
 {descriptionStep:"Drop your cv",
  stepContent:Step1,
 },
{descriptionStep:"Personal Information",
stepContent:Step2
},
{descriptionStep:"Personal Experience",
stepContent:Step3,
},
 {descriptionStep:"Complete your registration",
 stepContent:Step4
 },
];

export  default  function Page(){
 const [CurrentStep, setCurrentStep] = useState(0);
 const [dataForSubmitRegister, setDataForSubmitRegister] = useState<dataForSubmitRegister>({
     Email:"",
     Password:"",
     Phone:"",
     FirstName:"",
     LastName:"",
     Gender:"",
     CV:"",
     Skils:null
 });

console.log(dataForSubmitRegister);

 function  handleClcikNext(){
     if (steps.length-1>CurrentStep)
     setCurrentStep(CurrentStep + 1);
 }

 function handleClcikBack(){
    if (CurrentStep>=1)
        setCurrentStep(CurrentStep - 1);

 }

    const StepComponent = steps[CurrentStep].stepContent;


    const mutation=useMutation({
        mutationFn:RegisterJobSeeker
    });

    useEffect(() => {
   if (dataForSubmitRegister.CV) handleClcikNext();
    },[dataForSubmitRegister.CV])

    return (
        <>
        <Navigation/>
        <Container styleElement={"flex h-full flex-col gap-4 p-10 bg-white"}>
            <Button className={"text-white text-lg font-bold  self-end bg-cyan-700"}>
                <p >ARE YOU A RECURITER?</p>
                <MoveRight className={"text-white"} />
            </Button>
        <div className={"border-[1px] border-gray-200 flex flex-col gap-4 rounded-sm p-6"}>
          <div className={"flex items-center  w-full  "}>
              {steps.map((step,idx) => (
                 <Step key={idx} CurrentStep={CurrentStep}  stepNumber={idx+1} descrptionStep={step.descriptionStep}/>
                  )
              )}
          </div>

           < StepComponent  handleClcikBack={handleClcikBack} handleClcikNext={handleClcikNext} SetData={setDataForSubmitRegister}/>


        </div>
        </Container>
            <Footer/>
 </>
    )
}

function  Step1({SetData,handleClcikNext,handleClcikBack}:{SetData:Dispatch<SetStateAction<dataForSubmitRegister>>, handleClcikNext?:()=>void,handleClcikBack?:()=>void}) {
   const [error,setError]=useState<null|string>(null);
    const ref = useRef<HTMLInputElement | null>(null);

    function handelClickInputFile() {
        ref.current?.click();
    }



    const onDrop = useCallback((acceptedFiles: File[],fileRejections:any) => {
        if(fileRejections.length>0){
          setError("Invalid file type")
            return;
        }
        setError(null);
        SetData((prev) => ({
            ...prev,
            CV: acceptedFiles[0],
        }));


    }, [SetData]);

    const { getRootProps, getInputProps} = useDropzone({

        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "application/msword": [".doc"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
    });


        return (
            <div className={"flex flex-col gap-6"}>
                <p className={"text-3xl font-bold text-gray-950"}>Import your CV:</p>
                <div onClick={handelClickInputFile}
                     className={"flex py-8 items-center justify-center border-2 border-dashed rounded-sm border-blue-600 hover:cursor-pointer"}>
                    <div {...getRootProps()} className={"flex flex-col gap-6 items-center justify-center "}>
                        <Image src={uploadImae} alt={"upload file icon "}/>
                        { error &&
                            <div className={"flex flex-col gap-3"}>
                            <Lottie   animationData={animationData} loop={true}/>
                             <p className={"text-lg text-red-500 font-medium text-center"}>{error}</p>
                            </div>
                        }
                        {
                            !error&&
                            <>
                            <div className={"flex items-center gap-2"}>
                                <Image src={fileDocImage} alt={"file icon"}/>
                                <Image src={fileDocImage} alt={"file icon"}/>
                                <Image src={fileDocImage} alt={"file icon"}/>

                            </div>
                            <p className={"text-gray-800 text-sm font-normal text-center"}>Drag and drop a file or click
                        here (.pdf,.doc,.docx) </p>
                           </>


                        }

                        <input {...getInputProps()} ref={ref} className={"hidden"} type={"file"}/>
                    </div>
                </div>
                <div className={"self-end flex gap-2 items-center"}>
                    <Button onClick={handleClcikBack} className={"text-gray-500 bg-white font-medium hover:cursor-pointer"}>BACK</Button>
                    <Button onClick={handleClcikNext}  className={"text-white bg-blue-500 font-medium hover:cursor-pointer"}>SKIP THIS STEP</Button>
                </div>
            </div>

        )
    }

    function Step2({SetData ,handleClcikBack,handleClcikNext}:{ SetData:Dispatch<SetStateAction<dataForSubmitRegister>>,handleClcikNext:()=>void,handleClcikBack?:()=>void}) {

   const {register,handleSubmit,formState:{errors}}= useForm({defaultValues:{
           FirstName: "",
           LastName: "",
           Email: "",
           Phone: "",
       }})


        const onSubmit = (data: any) => {
         console.log("test",data);
            SetData((prev) => ({ ...prev,...data }));
            handleClcikNext()
        };


        return (
            <>
                <p className={"text-3xl font-bold text-gray-950"}>Candidate Registration/Information</p>

                <Button
                    className={"bg-white border-[2px] border-gray-500 rounded-full text-gray-950 font-normal self-center hover:bg-blue-200 hover:text-gray-800 hover:cursor-pointer"}>
                    <p>Sign in with</p>
                    <Image src={gogoleIcon} alt={"gogle icon"}/>
                </Button>

                <div className={"flex-1 border-[1px] border-gray-200 my-4"}></div>

                <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-4 px-20 "}>
                    <Field label={"First Name"}
                           style={" gap-14"}
                           placeholder={"bensebgag"}
                           icon={<CircleUserRound/>}
                          register= {register("FirstName",{required:"First Name is required"})}
                    />
                    {errors.FirstName&&<p className={"text-lg font-medium text-red-500"}>{errors.FirstName.message}</p>}
                    <Field label={"Last Name"}
                           placeholder={"mohammed"}
                           style={" gap-14"}
                           icon={<CircleUserRound/>}
                           register={register("LastName", { required: "Last Name is required" })}
                    />
                   {errors.LastName&&<p className={"text-lg font-medium text-red-500"}>{errors.LastName.message}</p>}
                    <Field label={"Email Address"}
                           type={"email"}
                           placeholder={"bensebgag258@gamil.com"}
                           style={" gap-6"}
                           icon={<Mail/>}
                           register={register("Email", { required: "Email is required" })}
                    />
                    {errors.Email&&<p className={"text-lg font-medium text-red-500"}>{errors.Email.message}</p>}
                    <Field label={"Phone Number"}
                           placeholder={"0675680547"}
                           style={" gap-3"}
                           icon={<Phone/>}
                           register={register("Phone", { required: "Phone is required" })}
                    />
                    {errors.Phone&&<p className={"text-lg font-medium text-red-500"}>{errors.Phone.message}</p>}

                    <div className={"self-end flex gap-2 items-center"}>
                        <Button  onClick={handleClcikBack} className={"text-gray-500 bg-white font-medium hover:cursor-pointer"}>BACK</Button>
                        <Button type={"submit"}  className={"text-white bg-blue-500 font-medium hover:cursor-pointer"}>NEXt</Button>
                    </div>

                </form>
            </>
        )
    }

    function Step3({SetData ,handleClcikNext,handleClcikBack}:{ SetData:Dispatch<SetStateAction<dataForSubmitRegister>>,handleClcikNext:()=>void,handleClcikBack:()=>void}) {
     const {data ,isLoading}=useQuery({
         queryKey:['skillsGategory'],
         queryFn:fetchSkillsGategories

     })
    const fakeData = data|| [
       {
           skillID: 1,
           skillCategoryID: 101,
           name: "JavaScript",
           iconUrl: "https://example.com/icons/javascript.png"
       },
       {
           skillID: 2,
           skillCategoryID: 102,
           name: "Python",
           iconUrl: "https://example.com/icons/python.png"
       },
       {
           skillID: 3,
           skillCategoryID: 101,
           name: "React",
           iconUrl: "https://example.com/icons/react.png"
       },
       {
           skillID: 4,
           skillCategoryID: 103,
           name: "Node.js",
           iconUrl: "https://example.com/icons/nodejs.png"
       },
       {
           skillID: 5,
           skillCategoryID: 104,
           name: "C++",
           iconUrl: "https://example.com/icons/cpp.png"
       },
       {
           skillID: 6,
           skillCategoryID: 105,
           name: "Java",
           iconUrl: "https://example.com/icons/java.png"
       },
       {
           skillID: 7,
           skillCategoryID: 106,
           name: "Ruby",
           iconUrl: "https://example.com/icons/ruby.png"
       },
       {
           skillID: 8,
           skillCategoryID: 102,
           name: "Django",
           iconUrl: "https://example.com/icons/django.png"
       },
       {
           skillID: 9,
           skillCategoryID: 107,
           name: "Angular",
           iconUrl: "https://example.com/icons/angular.png"
       },
       {
           skillID: 10,
           skillCategoryID: 101,
           name: "TypeScript",
           iconUrl: "https://example.com/icons/typescript.png"
       }
   ]
        const { ref, handleFocus, isFocused } = useFocus();
        const [selectedItems, setSelectedItems] = useState<SkillsGategorie[]>([]);
        const [searchQuery, setSearchQuery] = useState("");

        const handleSelect = (item: SkillsGategorie) => {
            if (!selectedItems.includes(item)) {
                setSelectedItems((prev) => [...prev, item]);
            }

        };
        const handleRemove = (item: SkillsGategorie) => {
            setSelectedItems((prev) => prev.filter((i) => i !== item));
        };

        const filteredItems = fakeData.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const handelNext=()=>{
            SetData(prevState => ({
                ...prevState,
                Skils:selectedItems.at(0)
            }));
            handleClcikNext();
        }
        return (
            <div className={"flex flex-col gap-12"}>
                <p className={"text-3xl font-bold text-gray-950"}>Candidate Registration/Information</p>
                <div ref={ref} className=" w-80 bg-white rounded-md shadow-md mt-10">

                    <div

                        className={`px-2 py-3 flex flex-wrap items-center gap-2 border-[1px] rounded-md ${
                            isFocused ? "border-blue-500" : "border-gray-200"
                        }`}
                    >

                        { selectedItems.map((item, i) => (
                            <div key={i} className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-gray-200 rounded-full">
                                <span>{item.name}</span>
                                <button onClick={() => handleRemove(item)} className="text-gray-500 hover:text-gray-700">
                                    &times;
                                </button>
                            </div>
                        ))}

                        <input
                            onFocus={handleFocus}
                            placeholder="Technologies, languages, skills"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 border-none outline-none min-w-[150px]"
                        />

                        {isFocused ? (
                            <ChevronUp onClick={handleFocus} className="w-6 h-6 text-gray-400 cursor-pointer" />
                        ) : (
                            <ChevronDown onClick={handleFocus} className="w-6 h-6 text-gray-400 cursor-pointer" />
                        )}
                    </div>

                    {isFocused && (
                        <div className="border-t">
                            <div className="max-h-[300px] overflow-y-auto">
                                {
                                    isLoading?<Spinner/>:filteredItems.map((item:SkillsGategorie) => (
                                    <div
                                        key={item.skillID}
                                        className="flex  items-center gap-3 px-4 py-2  hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            handleSelect(item);

                                        }
                                        }

                                     >
                                        <span className="text-sm">{item.name}</span>
                                    </div>
                                ))
                                }

                            </div>
                        </div>
                    )}
                </div>

                <div className={"self-end flex gap-2 items-center"}>
                    <Button onClick={handleClcikBack} className={"text-gray-500 bg-white font-medium hover:cursor-pointer"}>BACK</Button>
                    <Button disabled={selectedItems.length===0} onClick={handelNext}  className={"text-white bg-blue-500 font-medium hover:cursor-pointer"}>Next</Button>
                </div>
            </div>
        )
    }

    function Step4({SetData}: Dispatch<SetStateAction<dataForSubmitRegister>>) {
        return (
            <div className={"flex items-center justify-center mt-20"}>
                <div className={"flex flex-col gap-2 p-3 rounded-lg bg-gray-300 "}>
                    <p className={"text-xl text-center text-gray-950 font-medium"}>you are now connected!</p>
                    <p className={"text-sm text-center text-gray-800 font-medium"}>Click on the link sent by email to
                        mmustafa.almadani@gmail.com,to confirm your registration and create a password </p>
                </div>
            </div>

        )
    }
