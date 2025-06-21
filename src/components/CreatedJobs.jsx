import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingGetMyJobs,
    fn: fnGetMyJobs,
    data: dataGetMyJobs,
  } = useFetch(getMyJobs, {
    recruiter_id: user.id,
  });

  useEffect(() => {
    fnGetMyJobs();
  }, []);

  if (!isLoaded || loadingGetMyJobs) {
    return <BarLoader color="#ff7b00" width={"100%"} />;
  }

  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataGetMyJobs?.length ? (
          dataGetMyJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                isMyJob
                onJobSaved={fnGetMyJobs}
              />
            );
          })
        ) : (
          <div>No Jobs Found</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
