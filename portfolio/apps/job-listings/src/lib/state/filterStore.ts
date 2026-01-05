import {Store} from "@tanstack/react-store";

export const  fetchJobs = async () => {
    const response = await fetch(`/api/jobs`);
    return response.json();
}

export const filterStore = new Store([] as string[]);

export function toggleFilterValue(
    filters: string[],
    filter: string
) {
    return filters.includes(filter)
        ? filters.filter(f => f !== filter)
        : [...filters, filter];
}

export const filterJobs = (jobs: any[], filters: string[]) =>
    jobs.filter(job => filters.every(filter => job.tools.includes(filter)));

export const toggleFilter = (filter: string) =>
    filterStore.setState(s => ({
        ...s,
        filters: toggleFilterValue(s, filter),
    }));
