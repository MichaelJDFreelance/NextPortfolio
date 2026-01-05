import {Store} from "@tanstack/react-store";
import Fuse from 'fuse.js'
import {useQuery} from "@tanstack/react-query";

type Job = {
    "id": number,
    "company": string,
    "logo": string,
    "logoBackground": string,
    "position": string,
    "postedAt": string,
    "contract": string,
    "location": string,
    "website": string,
    "apply": string,
    "description": string,
    "requirements": { "content": string, "items": string[] },
    "role": { "content": string, "items": string[] }
}

const fetchJobs = async () => {
    const response = await fetch("/api/jobs");
    return response.json();
}

type SearchParams = { query?: string, location?:string, fullTime?: boolean }

export const searchStore = new Store<SearchParams>({})

function searchJobs(filteredData: Job[], query: string) {
    const fuse = new Fuse(filteredData, {
        keys: ['company', 'position', 'description'],
        threshold: 0.3,
    })

    const results = fuse.search(query)
    return results.map(result => result.item)
}

const jobIsFullTime = (job:Job) => job.contract==='Full Time'

const jobIsAtLocation = (location:string) => (job:Job) =>
    job.location.toLowerCase().startsWith(location.toLowerCase())

export const filterJobs = (filteredData:Job[], searchParams?:SearchParams) => {

    if (searchParams?.fullTime) filteredData = filteredData.filter(jobIsFullTime)

    if (searchParams?.location) filteredData = filteredData.filter(jobIsAtLocation(searchParams.location))

    if (searchParams?.query) filteredData = searchJobs(filteredData, searchParams.query)

    return filteredData
}

export const useJobs = () => {
    const { data:jobs, isLoading, isError } = useQuery({
        queryKey: ['jobs'],
        queryFn: fetchJobs
    });

    return { jobs, isLoading, isError }
}