import { useEffect, useState } from "react"
import useFetch from "../hooks/usefetch"
import { getJobs } from "../api/jobs"
import { useUser } from "@clerk/clerk-react"
import { BarLoader } from "react-spinners"
import JobCard from "../components/JobCard"
import { getCompanies } from "../api/companies"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectItem 
} from "@/components/ui/select"
import { State } from "country-state-city"

const JobListing = () => {
  const [ searchQuery, setSearchQuery ] = useState('')
  const [ location, setLocation ] = useState('')
  const [ company_id, setCompany_id ] = useState('')

  const { isLoaded, user } = useUser()

  const { 
    data: dataJobs, 
    loading: loadingJobs, 
    fn: fnJobs 
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery
  })

  const { 
    data: companies,  
    fn: fnCompanies 
  } = useFetch(getCompanies)

  useEffect(() => {
    if(isLoaded) {
      fnJobs()
    }
  }, [isLoaded, location, company_id, searchQuery])

  useEffect(() => {
    if(isLoaded) {
      fnCompanies()
    }
  }, [isLoaded])

  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)

    const query = formData.get('searchQuery')
    setSearchQuery(query)
  };

  const clearFilters = () => {}

  if(!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      <form className="h-14 flex flex-row w-full gap-2 items-center mb-3" onSubmit={handleSearch}>
        <Input 
          type="text"
          placeholder="Search by job title"
          name="searchQuery"
          className="h-full flex-1 px-4 text-md"
        />
        <Button className="h-full sm:w-28" variant="blue" type="submit">
          Search
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry("US").map(({ name }) => {
                return (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={company_id}
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name, id }) => {
                return (
                  <SelectItem key={name} value={id}>
                    {name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="sm:w-1/2"
          variant="destructive"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataJobs?.length ? (
            dataJobs.map((job) => {
              return <JobCard 
                key={job.id} 
                job={job} 
                savedInit={job.saved.length > 0} 
                isMyJob={job.recruiter_id === user.id}
              />
            })
          ) : (
            <span>No jobs found</span>
          )}
        </div>
      )}
    </div>
  )
}

export default JobListing