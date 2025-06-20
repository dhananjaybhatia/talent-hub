import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { updateApplicationStatus } from "@/api/apiApplication";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const ApplicationCard = ({ app, isCandidate = false }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = app?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: app.job_id,
    }
  );

  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };

  return (
    <Card>
      {" "}
      {loadingHiringStatus && <BarLoader color="#ff7b00" width={"100%"} />}}
      <CardHeader>
        <CardTitle className={"flex justify-between font-bold items-center"}>
          {isCandidate
            ? `${app?.job?.title} at ${app?.job?.company?.name}`
            : app?.name}
          <Download
            onClick={handleDownload}
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-col gap-4 flex-1"}>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={15} /> {app?.experience} years of
            experience
          </div>
          <div className="flex items-center gap-2">
            <School size={15} /> {app?.education}
          </div>
          <div className="flex items-center gap-2">
            <Boxes size={15} /> {app?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className={"flex justify-between"}>
        <span>
          {new Date(app?.created_at).toLocaleString("en-AU", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        {isCandidate ? (
          <span className="capitalize font-semibold text-yellow-100">
            Status: {app?.status}
          </span>
        ) : (
          <Select onValueChange={handleStatusChange} defaultValue={app.status}>
            <SelectTrigger className={"w-52"}>
              <SelectValue placeholder={"Application Status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
