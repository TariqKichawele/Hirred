import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, Navigate } from "react-router-dom";
import useFetch from "../hooks/usefetch";
import { createJob } from "../api/jobs";
import { BarLoader } from "react-spinners";
import { getCompanies } from "../api/companies";
import { useEffect } from "react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectItem 
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { State } from "country-state-city"; 
import AddCompanyDrawer from "../components/AddCompany";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
})

const PostJob = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    control
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema)
  })

  const { 
    fn: createJobFn, 
    isLoading: isCreatingJob, 
    error: errorCreateJob,
    data: jobData
  } = useFetch(createJob);

  const { 
    data: companies, 
    fn: getCompaniesFn,
    loading: isLoadingCompanies
  } = useFetch(getCompanies);

  const onSubmit = async (data) => {
    createJobFn({
      ...data,
      isOpen: true,
      recruiter_id: user.id
    })
  }

  useEffect(() => {
    if(jobData?.length > 0) {
      navigate("/jobs");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobData])

  useEffect(() => {
    if(isLoaded) {
      getCompaniesFn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  if(!isLoaded || isLoadingCompanies) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("US").map(({ name }) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddCompanyDrawer fetchCompanies={getCompaniesFn} />
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}

        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errors.errorCreateJob && (
          <p className="text-red-500">{errors?.errorCreateJob?.message}</p>
        )}
        {errorCreateJob?.message && (
          <p className="text-red-500">{errorCreateJob?.message}</p>
        )}
        {isCreatingJob && <BarLoader width={"100%"} color="#36d7b7" />}
        <Button type="submit" variant="blue" size="lg" className="mt-2" disabled={isCreatingJob}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export default PostJob