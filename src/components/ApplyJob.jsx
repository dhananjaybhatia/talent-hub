import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/useFetch";
import { applyToJob } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0" })
    .int(),
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    message: "Education is required",
  }),
  resume: z
    .any()
    .refine((file) => file?.length > 0, {
      message: "Please attach your resume",
    })
    .refine(
      (file) =>
        file?.[0] &&
        (file[0].type === "application/pdf" ||
          file[0].type === "application/msword"),
      { message: "Only PDF or Word documents are allowed" }
    ),
});

const ApplyJob = ({ job, user, fetchJob, applied = false }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingApply,
    error: errorApply,
    fn: fnApply,
  } = useFetch(applyToJob);

  if (!job?.isOpen || applied) {
    return (
      <Button size="lg" disabled className="bg-[#ef476f] text-amber-50">
        {job?.isOpen ? "Applied" : "Hiring Closed"}
      </Button>
    );
  }

  const onSubmit = (data) => {
    fnApply({
      ...data,
      job_id: job.id,
      candidate_id: user.id,
      name: user.fullName,
      status: "applied",
      resume: data.resume[0],
    }).then(() => {
      fetchJob();
      reset();
    });
  };

  return (
    <Drawer open={applied ? false : undefined}>
      <DrawerTrigger asChild>
        <Button
          size="lg"
          className="bg-[#118ab2] hover:bg-[#0d6c8f] text-amber-50"
        >
          Apply
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Apply for {job?.title} at {job?.company?.name}
          </DrawerTitle>
          <DrawerDescription className={"text-xs"}>
            Please fill the form below
          </DrawerDescription>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4 pb-0"
        >
          <Input
            {...register("experience", { valueAsNumber: true })}
            type="number"
            min="0"
            placeholder="Years of Experience"
            className={"flex-1 p-2"}
          />
          {errors.experience && (
            <p className="text-orange-500">{errors.experience.message}</p>
          )}
          <Input
            {...register("skills")}
            type="text"
            placeholder="Skills (Comma Separated)"
            className={"flex-1 p-2"}
          />
          {errors.skills && (
            <p className="text-orange-500">{errors.skills.message}</p>
          )}
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup onValueChange={field.onChange} {...field}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Intermediate" id="Intermediate" />
                  <Label htmlFor="Intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Graduate" id="Graduate" />
                  <Label htmlFor="Graduate">Graduate</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="Post Graduate" id="Post-Graduate" />
                  <Label htmlFor="Post-Graduate">Post Graduate</Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.education && (
            <p className="text-orange-500">{errors.education.message}</p>
          )}

          <Input
            {...register("resume")}
            type="file"
            accept=".pdf, .doc, .docx"
            className={"flex-1 p-1 text-gray-600"}
          />
          {errors.resume && (
            <p className="text-orange-500">{errors.resume.message}</p>
          )}
          {errorApply?.message && (
            <p className="text-orange-500">{errorApply?.message}</p>
          )}
          {loadingApply && <BarLoader color="#ff7b00" width={"100%"} />}
          <Button
            type="submit"
            className="bg-[#118ab2] hover:bg-[#0d6c8f] text-amber-50"
          >
            Apply
          </Button>
        </form>
        <DrawerFooter>
          <DrawerClose>
            <Button className="bg-[#ef476f] hover:bg-[#d93a5d] text-amber-50 w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ApplyJob;
