"use client";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  CircleUserRound,
  Mail,
  MoveRight,
  Phone,
  QrCode,
} from "lucide-react";
import Step from "@/components/ui/Step";
import Image from "next/image";
import uploadImae from "@/../public/uploadFile.png";
import fileDocImage from "@/../public/Group 13985.png";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Field from "@/components/ui/Field";
import Navigation from "@/components/ui/Navigation";
import Footer from "@/components/layout/Footer";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  RegisterCompany,
  RegisterJobSeeker,
} from "@/utils/ApisFunctions/JobsApi";
import { useDropzone } from "react-dropzone";
import Lottie from "lottie-react";
import {
  dataForSubmitRegister,
  dataForSubmitRegisterCompany,
  Skill,
  Wilaya,
} from "@/utils/types";
import { useRouter } from "next/navigation";
import animationData from "@/../public/Animation - 1743130347651.json";
import { useForm } from "react-hook-form";
import useFocus from "@/hooks/useFocus";
import { fetchSkills } from "@/utils/ApisFunctions/skillsGateogries";
import Spinner from "@/components/ui/Spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchWillaya } from "@/utils/ApisFunctions/wilayaies";
import FieldPassword from "@/components/ui/FieldPssword";
import toast from "react-hot-toast";

export default function Page() {
  const [CurrentStep, setCurrentStep] = useState(0);

  const [IsUser, setIsUser] = useState(true);
  const [
    dataForSubmitRegisterForJobSeeker,
    setDataForSubmitRegisterForJobSeeker,
  ] = useState<dataForSubmitRegister>({
    Email: "",
    Password: "",
    Phone: "",
    FirstName: "",
    LastName: "",
    Gender: "",
    CV: null,
    Skils: null,
  });
  const [dataForSubmitRegisterForCompany, setDataForSubmitRegisterForCompany] =
    useState<dataForSubmitRegisterCompany>({
      wilayaID: null,
      email: "",
      password: "",
      phone: "",
      name: "",
      link: "",
    });

  function handleClcikNext() {
    if (steps.length - 1 > CurrentStep) setCurrentStep(CurrentStep + 1);
  }

  function handleClcikBack() {
    if (CurrentStep >= 1) setCurrentStep(CurrentStep - 1);
  }

  const allSteps = [
    {
      descriptionStep: IsUser ? "Drop your cv" : "General Information ",
      stepContent: Step1,
    },
    {
      descriptionStep: IsUser ? "Personal Information" : "About the company",
      stepContent: Step2,
    },
    { descriptionStep: "Personal Experience", stepContent: Step3 },
    { descriptionStep: "Complete your registration", stepContent: Step4 },
  ];
  const steps = IsUser
    ? allSteps
    : allSteps.filter((step) => step.descriptionStep !== "Personal Experience");

  const StepComponent = steps[CurrentStep].stepContent;

  useEffect(() => {
    if (dataForSubmitRegisterForJobSeeker.CV) handleClcikNext();
  }, [dataForSubmitRegisterForJobSeeker.CV]);

  function handleChangeRole() {
    setIsUser((prv) => !prv);
    setCurrentStep(0);
  }
  return (
    <>
      <Navigation />
      <Container
        styleElement={"flex h-full flex-col gap-4 p-4 md:p-10 bg-white"}
      >
        <Button
          onClick={handleChangeRole}
          className={
            "text-white text-sm md:text-lg font-bold self-end bg-cyan-700"
          }
        >
          <p className="hidden sm:block">
            {!IsUser ? "Loking for job" : "ARE YOU A RECURITER?"}
          </p>
          <p className="sm:hidden">{!IsUser ? "Job Seeker" : "Recruiter"}</p>
          <MoveRight className={"text-white ml-2"} />
        </Button>
        <div
          className={
            "border-[1px] border-gray-200 flex flex-col gap-4 rounded-sm p-3 md:p-6"
          }
        >
          <div className={"flex flex-wrap md:flex-nowrap items-center w-full"}>
            {steps.map((step, idx) => (
              <Step
                key={idx}
                CurrentStep={CurrentStep}
                stepNumber={idx + 1}
                descrptionStep={step.descriptionStep}
              />
            ))}
          </div>

          <StepComponent
            IsUser={IsUser}
            handleClcikBack={handleClcikBack}
            handleClcikNext={handleClcikNext}
            SetData={setDataForSubmitRegisterForJobSeeker}
            setDataForCompany={setDataForSubmitRegisterForCompany}
            dataForSubmitRegisterForJobSeeker={
              dataForSubmitRegisterForJobSeeker
            }
            dataForSubmitRegisterForCompany={dataForSubmitRegisterForCompany}
          />
        </div>
      </Container>
      <Footer />
    </>
  );
}

function Step1({
  SetData,
  handleClcikNext,
  setDataForCompany,
  handleClcikBack,
  IsUser,
}: {
  SetData: Dispatch<SetStateAction<dataForSubmitRegister>>;
  handleClcikNext?: () => void;
  handleClcikBack?: () => void;
  IsUser: boolean;
  setDataForCompany: Dispatch<SetStateAction<dataForSubmitRegisterCompany>>;
}) {
  const [error, setError] = useState<null | string>(null);
  const ref = useRef<HTMLInputElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });
  function onSubmit(data: any) {
    setDataForCompany((pre) => ({ ...pre, ...data }));
    handleClcikNext();
  }

  function handelClickInputFile() {
    ref.current?.click();
  }

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any) => {
      if (fileRejections.length > 0) {
        setError("Invalid file type");
        return;
      }
      setError(null);
      SetData((prev) => ({
        ...prev,
        CV: acceptedFiles[0],
      }));
    },
    [SetData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
  });

  if (IsUser)
    return (
      <div className={"flex flex-col gap-6"}>
        <p className={"text-xl md:text-3xl font-bold text-gray-950"}>
          Import your CV:
        </p>
        <div
          onClick={handelClickInputFile}
          className={
            "flex py-4 md:py-8 items-center justify-center border-2 border-dashed rounded-sm border-blue-600 hover:cursor-pointer"
          }
        >
          <div
            {...getRootProps()}
            className={
              "flex flex-col gap-4 md:gap-6 items-center justify-center p-2 md:p-4"
            }
          >
            <Image
              src={uploadImae}
              alt={"upload file icon "}
              className="w-16 md:w-auto"
            />
            {error && (
              <div className={"flex flex-col gap-3"}>
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="h-20 md:h-auto"
                />
                <p
                  className={
                    "text-base md:text-lg text-red-500 font-medium text-center"
                  }
                >
                  {error}
                </p>
              </div>
            )}
            {!error && (
              <>
                <div className={"flex items-center gap-2"}>
                  <Image
                    src={fileDocImage}
                    alt={"file icon"}
                    className="w-6 md:w-auto"
                  />
                  <Image
                    src={fileDocImage}
                    alt={"file icon"}
                    className="w-6 md:w-auto"
                  />
                  <Image
                    src={fileDocImage}
                    alt={"file icon"}
                    className="w-6 md:w-auto"
                  />
                </div>
                <p
                  className={
                    "text-gray-800 text-xs md:text-sm font-normal text-center"
                  }
                >
                  Drag and drop a file or click here (.pdf,.doc,.docx){" "}
                </p>
              </>
            )}

            <input
              {...getInputProps()}
              ref={ref}
              className={"hidden"}
              type={"file"}
            />
          </div>
        </div>
        <div className={"self-end flex gap-2 items-center"}>
          <Button
            onClick={handleClcikBack}
            className={
              "text-xs md:text-base text-gray-500 bg-white font-medium hover:cursor-pointer"
            }
          >
            BACK
          </Button>
          <Button
            onClick={handleClcikNext}
            className={
              "text-xs md:text-base text-white bg-blue-500 font-medium hover:cursor-pointer"
            }
          >
            SKIP THIS STEP
          </Button>
        </div>
      </div>
    );
  if (!IsUser)
    return (
      <div className={"flex flex-col gap-3 my-6 md:my-10"}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex flex-col gap-4 md:gap-6"}
        >
          <Field
            label={"Company Name"}
            placeholder={"nameExample"}
            icon={<QrCode />}
            register={register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-red-600 text-xs ml-40">{errors.name.message}</p>
          )}
          <Field
            label={"Email Address"}
            style={"gap-4 md:gap-8"}
            type={"email"}
            placeholder={"eample8@gamil.com"}
            icon={<Mail />}
            register={register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-600 text-xs ml-40">{errors.email.message}</p>
          )}
          <Field
            label={"Phone Number"}
            style={"gap-3 md:gap-6"}
            placeholder={"07*******"}
            icon={<Phone />}
            register={register("phone", { required: "Phone is required" })}
          />
          {errors.phone && (
            <p className="text-red-600 text-xs ml-40">{errors.phone.message}</p>
          )}

          <div className={"self-end flex gap-2 items-center"}>
            <Button
              onClick={handleClcikBack}
              className={
                "text-xs md:text-base text-gray-500 bg-white font-medium hover:cursor-pointer"
              }
            >
              BACK
            </Button>
            <Button
              type={"submit"}
              className={
                "text-xs md:text-base text-white bg-blue-500 font-medium hover:cursor-pointer"
              }
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    );
}

function Step2({
  SetData,
  handleClcikBack,
  handleClcikNext,
  IsUser,
  setDataForCompany,
}: {
  SetData: Dispatch<SetStateAction<dataForSubmitRegister>>;
  handleClcikNext: () => void;
  handleClcikBack?: () => void;
  IsUser: boolean;
  setDataForCompany: Dispatch<SetStateAction<dataForSubmitRegisterCompany>>;
}) {
  const [selectedItems, setSelectedItems] = useState<Wilaya>();
  const { ref, handleFocus, isFocused } = useFocus();
  const { data, isLoading } = useQuery({
    queryKey: ["wilaya"],
    queryFn: fetchWillaya,
  });

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
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Phone: "",
    },
  });

  const { register: registerForCompany, handleSubmit: handelSubmitForCompany } =
    useForm({
      defaultValues: {
        link: "",
        wilayaID: null,
      },
    });

  const onSubmit = (data: any) => {
    SetData((prev) => ({ ...prev, ...data }));
    handleClcikNext();
  };

  const onSubmitForComapany = (data: any) => {
    setDataForCompany((pre) => ({
      ...pre,
      ...data,
      wilayaID: selectedItems?.wilayaID,
    }));
    handleClcikNext();
  };

  if (IsUser)
    return (
      <>
        <p className={"text-xl md:text-3xl font-bold text-gray-950"}>
          Candidate Registration/Information
        </p>

        <div
          className={"flex-1 border-[1px] border-gray-200 my-2 md:my-4"}
        ></div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={"flex flex-col gap-4 px-4 md:px-20"}
        >
          <Field
            label={"First Name"}
            style={"gap-6 md:gap-14"}
            placeholder={"exmpleFirt"}
            icon={<CircleUserRound />}
            register={register("FirstName", {
              required: "First Name is required",
            })}
          />
          {errors.FirstName && (
            <p className="text-red-600 text-xs ml-40">
              {errors.FirstName.message}
            </p>
          )}
          <Field
            label={"Last Name"}
            placeholder={"exampleName"}
            style={"gap-6 md:gap-14"}
            icon={<CircleUserRound />}
            register={register("LastName", {
              required: "Last Name is required",
            })}
          />
          {errors.LastName && (
            <p className="text-red-600 text-xs ml-40">
              {errors.LastName.message}
            </p>
          )}
          <Field
            label={"Email Address"}
            type={"email"}
            placeholder={"emxample@gamil.com"}
            style={"gap-3 md:gap-6"}
            icon={<Mail />}
            register={register("Email", { required: "Email is required" })}
          />
          {errors.Email && (
            <p className="text-red-600 text-xs ml-40">{errors.Email.message}</p>
          )}
          <Field
            label={"Phone Number"}
            placeholder={"06*******"}
            style={"gap-2 md:gap-5"}
            icon={<Phone />}
            register={register("Phone", { required: "Phone is required" })}
          />
          {errors.Phone && (
            <p className="text-red-600 text-xs ml-40">{errors.Phone.message}</p>
          )}

          <div className={"self-end flex gap-2 items-center"}>
            <Button
              onClick={handleClcikBack}
              className={
                "text-xs md:text-base text-gray-500 bg-white font-medium hover:cursor-pointer"
              }
            >
              BACK
            </Button>
            <Button
              type={"submit"}
              className={
                "text-xs md:text-base text-white bg-blue-500 font-medium hover:cursor-pointer"
              }
            >
              NEXT
            </Button>
          </div>
        </form>
      </>
    );
  if (!IsUser) {
    return (
      <form
        onSubmit={handelSubmitForCompany(onSubmitForComapany)}
        className={"flex flex-col gap-4 md:gap-8 my-6 md:my-8"}
      >
        <div className={"flex flex-col gap-3 md:gap-6"}>
          <Label>Website or LinkedIn/facebook</Label>
          <Input
            placeholder={"https://your/website.com"}
            {...registerForCompany("link", { required: "link is required" })}
          />
        </div>
        <div
          ref={ref}
          className="w-full md:w-80 h-10 bg-white rounded-md self-start relative"
        >
          <div
            className={`px-2 py-3 flex flex-wrap items-center gap-2 border rounded-md relative ${
              isFocused ? "border-blue-500" : "border-gray-200"
            }`}
          >
            <span>{selectedItems?.name}</span>

            <input
              onFocus={handleFocus}
              placeholder={!selectedItems ? "Wilaya" : ""}
              className="flex-1 border-none outline-none min-w-[100px] md:min-w-[150px]"
            />
            {isFocused ? (
              <ChevronUp
                className="w-6 h-6 text-gray-400 cursor-pointer"
                onClick={handleFocus}
              />
            ) : (
              <ChevronDown
                className="w-6 h-6 text-gray-400 cursor-pointer"
                onClick={handleFocus}
              />
            )}
          </div>
          {isFocused && (
            <div className="border-t absolute right-0 z-10 w-full bg-white">
              <div className="max-h-[200px] md:max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <Spinner />
                ) : (
                  fakeData.map((item: Wilaya) => (
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
        <div className={"self-end flex gap-2 items-center"}>
          <Button
            onClick={handleClcikBack}
            className={
              "text-xs md:text-base text-gray-500 bg-white font-medium hover:cursor-pointer"
            }
          >
            BACK
          </Button>
          <Button
            type={"submit"}
            className={
              "text-xs md:text-base text-white bg-blue-500 font-medium hover:cursor-pointer"
            }
          >
            NEXT
          </Button>
        </div>
      </form>
    );
  }
}

function Step3({
  SetData,
  handleClcikNext,
  handleClcikBack,
}: {
  SetData: Dispatch<SetStateAction<dataForSubmitRegister>>;
  handleClcikNext: () => void;
  handleClcikBack: () => void;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["skillsGategory"],
    queryFn: fetchSkills,
  });
  const fakeData = data;
  const { ref, handleFocus, isFocused } = useFocus();
  const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (item: Skill) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems((prev) => [...prev, item]);
    }
  };
  const handleRemove = (item: Skill) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  const filteredItems = fakeData?.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handelNext = () => {
    SetData((prevState) => ({
      ...prevState,
      Skils: selectedItems.map((item) => item.skillID),
    }));
    handleClcikNext();
  };
  return (
    <div className={"flex flex-col gap-6 md:gap-12"}>
      <p className={"text-xl md:text-3xl font-bold text-gray-950"}>
        Candidate Registration/Information
      </p>
      <div
        ref={ref}
        className="w-full md:w-80 bg-white rounded-md shadow-md mt-4 md:mt-10"
      >
        <div
          className={`px-2 py-3 flex flex-wrap items-center gap-2 border-[1px] rounded-md ${
            isFocused ? "border-blue-500" : "border-gray-200"
          }`}
        >
          {selectedItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm font-medium bg-gray-200 rounded-full"
            >
              <span>{item.name}</span>
              <button
                onClick={() => handleRemove(item)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          ))}

          <input
            onFocus={handleFocus}
            placeholder="Technologies, languages, skills"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none outline-none min-w-[100px] md:min-w-[150px] text-sm md:text-base"
          />

          {isFocused ? (
            <ChevronUp
              onClick={handleFocus}
              className="w-4 h-4 md:w-6 md:h-6 text-gray-400 cursor-pointer"
            />
          ) : (
            <ChevronDown
              onClick={handleFocus}
              className="w-4 h-4 md:w-6 md:h-6 text-gray-400 cursor-pointer"
            />
          )}
        </div>

        {isFocused && (
          <div className="border-t">
            <div className="max-h-[200px] md:max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <Spinner />
              ) : (
                filteredItems.map((item: Skill) => (
                  <div
                    key={item.skillID}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      handleSelect(item);
                    }}
                  >
                    <span className="text-xs md:text-sm">{item.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className={"self-end flex gap-2 items-center"}>
        <Button
          onClick={handleClcikBack}
          className={
            "text-xs md:text-base text-gray-500 bg-white font-medium hover:cursor-pointer"
          }
        >
          BACK
        </Button>
        <Button
          disabled={selectedItems.length === 0}
          onClick={handelNext}
          className={
            "text-xs md:text-base text-white bg-blue-500 font-medium hover:cursor-pointer"
          }
        >
          NEXT
        </Button>
      </div>
    </div>
  );
}

function Step4({
  IsUser,
  dataForSubmitRegisterForCompany,
  dataForSubmitRegisterForJobSeeker,
}: {
  IsUser: boolean;
  dataForSubmitRegisterForCompany: dataForSubmitRegisterCompany;
  dataForSubmitRegisterForJobSeeker: dataForSubmitRegister;
}) {
  type FormData = {
    Password: string;
    confirmPassword: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      Password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const { mutate: RegisterJobSeekerMutation } = useMutation({
    mutationFn: (data: FormData) => RegisterJobSeeker(data),
    onSuccess: (user) => {
      reset();
      toast.success("seucces register");
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
      console.error(err);
    },
  });

  const { mutate: RegisterCompanyMutation } = useMutation({
    mutationFn: (data: dataForSubmitRegisterCompany) => RegisterCompany(data),
    onSuccess: (user) => {
      reset();
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("seucces register");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function onSubmit(data: any) {
    if (IsUser) {
      const formData = new FormData();

      formData.append("Email", dataForSubmitRegisterForJobSeeker.Email);
      formData.append("Password", data.Password);
      formData.append("Phone", dataForSubmitRegisterForJobSeeker.Phone);
      formData.append("FirstName", dataForSubmitRegisterForJobSeeker.FirstName);
      formData.append("LastName", dataForSubmitRegisterForJobSeeker.LastName);
      // Gender should be a string when appending to FormData

      if (dataForSubmitRegisterForJobSeeker.CV) {
        formData.append("CV", dataForSubmitRegisterForJobSeeker.CV);
      }

      if (dataForSubmitRegisterForJobSeeker.Skils) {
        dataForSubmitRegisterForJobSeeker.Skils.forEach((skill: number) => {
          formData.append("Skils", skill.toString());
        });
      }

      // Log FormData contents

      // Submit only ONCE, after logging
      RegisterJobSeekerMutation(formData);
    } else {
      const updatedCompanyData = {
        ...dataForSubmitRegisterForCompany,
        password: data.Password,
      };

      console.log("Sending to Company API:", updatedCompanyData);
      RegisterCompanyMutation(updatedCompanyData);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-4 md:gap-6 justify-center mt-6 md:mt-20"}
    >
      <FieldPassword
        {...register("Password", {
          required: "New password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        placeholder="Enter new password"
      />

      <FieldPassword
        {...register("confirmPassword", {
          required: "Please confirm your new password",
          validate: (val) =>
            val === watch("Password") || "Passwords do not match",
        })}
        placeholder="Confirm new password"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-xs md:text-sm">
          {errors.confirmPassword.message}
        </p>
      )}

      <Button
        className="self-end bg-blue-500 text-xs md:text-base"
        type="submit"
      >
        save
      </Button>
    </form>
  );
}
