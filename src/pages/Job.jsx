import { getSingleJob, getUpdateHiringStatus } from "@/api/apiCompanies";
import ApplyJob from "@/components/ApplyJob";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Briefcase,
  DoorClosedIcon,
  DoorOpenIcon,
  MapPinIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const Job = () => {
  const { user, isLoaded } = useUser();
  const { id } = useParams();

  const {
    fn: fnJob,
    data: job,
    loading: loadingJobs,
  } = useFetch(getSingleJob, {
    job_id: id,
  });
  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(
    getUpdateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  if (!isLoaded || loadingJobs) {
    return <BarLoader color="#ff7b00" width={"100%"} />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 justify-between items-center md:flex-row">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} className="h-12" alt={job?.title} />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase />
          {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpenIcon />
              Open
            </>
          ) : (
            <>
              <DoorClosedIcon />
              Closed
            </>
          )}
        </div>
      </div>

      {loadingHiringStatus && <BarLoader color="#ff7b00" width={"100%"} />}

      {/* hiring status */}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              job?.isOpen
                ? "!bg-green-900 !text-white"
                : "!bg-orange-700 !text-white"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (job?.isOpen ? " (Open)" : " (Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown source={job?.requirements} className="sm:text-lg" />

      {job?.recruiter_id !== user?.id && (
        <ApplyJob
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}
    </div>
  );
};

export default Job;
