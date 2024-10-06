/* eslint-disable react/prop-types */
import { Boxes, Download, Briefcase, GraduationCap } from "lucide-react"
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Select, SelectItem, SelectValue, SelectTrigger, SelectContent } from "./ui/select";
import useFetch from "@/hooks/usefetch";
import { updateApplicationStatus } from "@/api/applications";
import { BarLoader } from "react-spinners";

const ApplicationCard = ({ application, isCandidate = false }) => {

    const handleDownload = () => {
        console.log("Downloading");
    }

    const { 
        fn: updateApplicationStatusFn, 
        isLoading: isUpdatingApplicationStatus,
    } = useFetch(updateApplicationStatus, {
        job_id: application?.job_id
    })

    const handleStatusChange = (status) => {
        updateApplicationStatusFn(status);
    }

  return (
    <Card className="mt-5">
        {isUpdatingApplicationStatus && <BarLoader width={"100%"} color="#36d7b7"/>}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {isCandidate 
                    ? `${application?.job?.title} at ${application?.job?.company?.name}`
                    : application?.name
                }
                <Download 
                    size={8}
                    className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
                    onClick={handleDownload}
                />
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col md:flex-row justify-between">
                <div className="flex gap-2 items-center">
                    <Briefcase size={15} /> 
                    {application?.experience} years of experience
                </div>
                <div className="flex gap-2 items-center">
                    <GraduationCap size={15} /> 
                    {application?.education}
                </div>
                <div className="flex gap-2 items-center">
                    <Boxes size={15} />
                    Skills: {application?.skills}
                </div>
            </div>
            <hr />
        </CardContent>
        <CardFooter className="flex justify-between">
            <span>{new Date(application?.created_at).toLocaleDateString()}</span>
            {isCandidate ? (
                <span className="font-bold capitalize">
                    Status: {application?.status}
                </span>
            ) : (
                <Select
                    onValueChange={handleStatusChange}
                    defaultValue={application?.status}
                >
                    <SelectTrigger className="w-52">
                        <SelectValue placeholder="Application Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="hired">Hired</SelectItem>
                    </SelectContent>
                </Select>
            )}
        </CardFooter>
    </Card>
  )
}

export default ApplicationCard