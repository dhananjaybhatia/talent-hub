import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    fn: fnSavedJobs,
    error: errorSavedJobs,
    data: dataSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded]);

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader color="#ff7b00" width={"100%"} />;
  }

  return (
    <div>
      {" "}
      <div className="gradient-title text-center font-extrabold sm:text-7xl text-6xl pb-8">
        <h1>Saved Jobs</h1>
      </div>
      {loadingSavedJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataSavedJobs?.length ? (
            dataSavedJobs.map((savedJob) => {
              return (
                <JobCard
                  key={savedJob.id}
                  job={savedJob?.job}
                  savedInitial={true}
                  onJobSaved={fnSavedJobs}
                />
              );
            })
          ) : (
            <div className="">No Saved Jobs Found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
