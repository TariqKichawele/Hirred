import { useUser } from "@clerk/clerk-react"
import useFetch from "@/hooks/usefetch"
import { getApplications } from "@/api/applications"
import { BarLoader } from "react-spinners"
import { useEffect } from "react"
import ApplicationCard from "@/components/ApplicationCard"

const CreatedApplications = () => {
    const { user } = useUser();

    const { 
        data: applications, 
        isLoading: isLoadingApplications, 
        fn: fnApplications 
    } = useFetch(getApplications, { user_id: user?.id })

    useEffect(() => {
        fnApplications();
    }, [])

    if(isLoadingApplications) {
        return <BarLoader width={"100%"} color="#36d7b7" />
    }
  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            isCandidate={true}
          />
        );
      })}
    </div>
  )
}

export default CreatedApplications