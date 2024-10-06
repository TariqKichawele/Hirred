import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useFetch from "../hooks/usefetch";
import { getJob, updateJobStatus } from "../api/jobs";
import { BarLoader }from "react-spinners";
import { useEffect } from "react";
import { MapPinIcon, Briefcase, DoorOpen, DoorClosed } from "lucide-react";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "../components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import ApplyJobDrawer from "../components/ApplyJob";
import ApplicationCard from "../components/ApplicationCard";

const Job = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  
  const { 
    data: job,  
    fn: fnJob 
  } = useFetch(getJob, { 
    job_id: id 
  })

  const { 
    fn: fnUpdateJobStatus, 
  } = useFetch(updateJobStatus, { job_id: id })

  useEffect(() => {
    if(isLoaded) {
      fnJob()
    }
  }, [isLoaded])

  if(!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnUpdateJobStatus(isOpen).then(() => fnJob())
  };

  console.log(job?.applications);
  
  
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse ga-6 md:flex-row justify-between items-center">
        <h1>{job?.title}</h1>
        <img src={job?.company?.logo_url} alt={job?.company?.name} className="h-12" />
      </div>

      <div className="flex justify-between flex-col sm:flex-row items-center gap-2">
        <div className="flex gap-2">
          <MapPinIcon />
          <span>{job?.location}</span>
        </div>
        <div className="flex gap-2">
          <Briefcase /> {job?.applications?.length} {job?.applications?.length === 1 ? 'Applicant' : 'Applicants'}
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
            <SelectValue
              placeholder={
                "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
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

      <MDEditor.Markdown 
        source={job?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer 
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user?.id)}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {job?.applications?.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  )
}

export default Job