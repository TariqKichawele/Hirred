import { useUser } from "@clerk/clerk-react"
import useFetch from "@/hooks/usefetch"
import { getSavedJobs } from "@/api/jobs"
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobCard from "@/components/JobCard"

const SavedJobs = () => {
  const { isLoaded } = useUser();

  const { 
    data: savedJobs, 
    isLoading: isLoadingSavedJobs, 
    fn: fnSavedJobs 
  } = useFetch(getSavedJobs)

  useEffect(() => {
    if(isLoaded) {
      fnSavedJobs();
    }
  }, [isLoaded])

  if(isLoadingSavedJobs || !isLoaded) {
    return <BarLoader width={"100%"} color="#36d7b7" />
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs?.length > 0 ? (
            savedJobs?.map((saved) => {
              return (
                <JobCard
                  key={saved.id}
                  job={saved?.job}
                  onJobAction={fnSavedJobs}
                  savedInit={true}
                />
                );
              })
            ) : (
          <div className="text-white">No Saved Jobs 👀</div>
        )}
      </div>
    </div>
  )
}

export default SavedJobs