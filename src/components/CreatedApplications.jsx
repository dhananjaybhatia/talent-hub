import { getApplications } from "@/api/apiApplication";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationCard from "./ApplicationCard";

const CreatedApplications = () => {
  const { user, isLoaded } = useUser();

  const {
    loading: loadingGetApplications,
    fn: fnGetApplications,
    data: dataGetApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnGetApplications();
  }, []);

  if (!isLoaded || loadingGetApplications) {
    return <BarLoader color="#ff7b00" width={"100%"} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {dataGetApplications?.map((app) => {
        return <ApplicationCard key={app.id} app={app} isCandidate />;
      })}
    </div>
  );
};

export default CreatedApplications;
