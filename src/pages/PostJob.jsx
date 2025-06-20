import { getCompanies } from "@/api/apiCompanies";
import { addNewJob } from "@/api/apiJobs";
import AddCompany from "@/components/AddCompany";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  company_id: z.string().min(1, { message: "Select or Add a new company" }),
  location: z.string().min(1, { message: "Location is required" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

const PostJob = () => {
  const navigate = useNavigate();

  const { user, isLoaded } = useUser();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  const {
    loading: loadingCreateJob,
    error: errorCreateJob,
    fn: fnCreateJob,
    data: createJobData,
  } = useFetch(addNewJob);

  const onSubmit = async (data) => {
    try {
      await fnCreateJob({
        ...data,
        recruiter_id: user.id,
        isOpen: true,
      });
      navigate("/jobs"); // Navigate ONLY on success
    } catch (error) {
      console.error("Job creation failed:", error);
    }
  };

  if (!isLoaded || loadingCompanies) {
    return <BarLoader color="#ff7b00" width={"100%"} />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post A Job
      </h1>

      <form
        className="flex flex-col gap-4 p-4 pb-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input placeholder={"Job Title"} {...register("title")} />
        {errors.title && (
          <p className="text-orange-500">{errors.title.message}</p>
        )}
        <Textarea placeholder={"Description"} {...register("description")} />
        {errors.description && (
          <p className="text-orange-500">{errors.description.message}</p>
        )}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={"flex-1 w-full"}>
                  <SelectValue placeholder="Filter by Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("AU").map(({ name }) => {
                      return (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={"flex-1 w-full"}>
                  <SelectValue placeholder="Filter by Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => {
                      return (
                        <SelectItem key={name} value={id}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompany fetchCompanies={fnCompanies} />
        </div>

        {errors.location && (
          <p className="text-orange-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-orange-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={field.onChange}
              className="sm:text-lg"
            />
          )}
        />
        {errors.requirements && (
          <p className="text-orange-500">{errors.requirements.message}</p>
        )}
        {errorCreateJob && (
          <p className="text-orange-500">{errorCreateJob?.message}</p>
        )}
        {loadingCreateJob && <BarLoader color="#ff7b00" width={"100%"} />}
        <Button
          size="lg"
          className="bg-[#118ab2] hover:bg-[#0d6c8f] text-amber-50"
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default PostJob;
