"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FieldPassword from "@/components/ui/FieldPssword";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";
import { useGetUser } from "@/hooks/useGetUser";

type FormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  id: number;
}) => {
  const res = await api.put("JobSeekers/ChangeJobSeekerPassowrd", {
    currrentPassword: data.currentPassword,
    newPassword: data.newPassword,
    id: data.id,
  });
  return res.data;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const { userId } = useGetUser();
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        id: userId,
      }),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ ...data, id: userId });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white h-full p-4 flex flex-col gap-3 border-[1px] border-gray-200 rounded-lg w-full"
    >
      <p className="text-xl font-bold text-gray-950">Change your password</p>

      {mutation.isSuccess && (
        <div className="bg-green-50 text-green-700 p-2 rounded border border-green-200">
          Password changed successfully!
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50 text-red-700 p-2 rounded border border-red-200">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Failed to change password"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldPassword
            {...register("currentPassword", {
              required: "Current password is required",
            })}
            placeholder="Enter your Password"
            disabled={mutation.isPending}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <FieldPassword
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            placeholder="Enter new password"
            disabled={mutation.isPending}
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <FieldPassword
            {...register("confirmPassword", {
              required: "Please confirm your new password",
              validate: (val) =>
                val === watch("newPassword") || "Passwords do not match",
            })}
            placeholder="Confirm new password"
            disabled={mutation.isPending}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button
        className="self-end bg-blue-500 mt-4"
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
