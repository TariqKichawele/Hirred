import { useUser } from "@clerk/clerk-react"
import useFetch from "@/hooks/usefetch"
import { getMyJobs } from "@/api/jobs"
import { BarLoader } from "react-spinners"
import { useEffect } from "react"
import JobCard from "@/components/JobCard"

const CreatedJobs = () => {
    const { user } = useUser();

    const { 
        data: createdJobs, 
        isLoading: isLoadingJobs, 
        fn: fnCreatedJobs
    } = useFetch(getMyJobs, { 
        recruiter_id: user?.id 
    })

    useEffect(() => {
        fnCreatedJobs();
    }, []);
    
  return (
    <div>
      {isLoadingJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {createdJobs?.length ? (
            createdJobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>
  )
}

export default CreatedJobs