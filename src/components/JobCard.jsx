/* eslint-disable react/prop-types */
import { useUser } from "@clerk/clerk-react"
import { Heart, Trash2Icon } from "lucide-react";
import { Card,CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { MapPinIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { saveJob, deleteJob } from "../api/jobs";
import useFetch from "../hooks/usefetch";
import { useState, useEffect } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({ 
    job, 
    isMyJob=false, 
    savedInit=false, 
    onJobSaved=()=>{} 
}) => {
    const { user } = useUser();
    const [ saved, setSaved ] = useState(savedInit);

    const { 
        loading: loadingSaved, 
        fn: fnSaved,
        data: savedJob
    } = useFetch(saveJob, { alreadySaved: saved });

    const { 
        fn: fnDeleteJob, 
        loading: loadingDeleteJob,
        data: deletedJob
    } = useFetch(deleteJob, { 
        job_id: job.id 
    })


    const handleSaveJob = async () => {
        await fnSaved({
            user_id: user.id,
            job_id: job.id
        });
        onJobSaved();
    }

    const handleDeleteJob = async () => {
        await fnDeleteJob();
        onJobSaved();
    }

    useEffect(() => {
        if(savedJob !== undefined) {
            setSaved(savedJob?.length > 0);
        }
    }, [savedJob])

    useEffect(() => {
        if(deletedJob) {
            window.location.reload();
        }
    }, [deletedJob])

  return (
    <Card className="flex flex-col">
        {loadingDeleteJob && (
            <BarLoader width={"100%"} color="#36d7b7" />
        )}
        <CardHeader>
            <CardTitle className="flex justify-between font-bold">
                {job.title}

                {isMyJob && (
                    <Trash2Icon 
                        fill="red"
                        size={18}
                        className="text-red-300 cursor-pointer"
                        onClick={handleDeleteJob}
                    />
                )}
            </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 flex-1">
            <div className="flex justify-between">
                {job.company && (
                    <img src={job.company.logo_url} alt={job.company.name} className="h-6" />
                )}
                <div className="flex gap-2 items-center">
                    <MapPinIcon size={15} /> {job.location}
                </div>
            </div>
            <hr />
            {job.description.substring(0, 100)}
        </CardContent>
        <CardFooter className="flex gap-2">
            <Link to={`/job/${job.id}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                    More Details
                </Button>
            </Link>

            {!isMyJob && (
                <Button variant="outline" onClick={handleSaveJob} className="w-15" disabled={loadingSaved}>
                    {saved ? <Heart size={20} stroke="red" fill="red" /> : <Heart size={20} /> }
                </Button>
            )}
        </CardFooter>
    </Card>
  )
}

export default JobCard