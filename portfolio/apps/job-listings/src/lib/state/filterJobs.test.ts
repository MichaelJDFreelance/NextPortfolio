import {filterJobs, filterStore, toggleFilterValue} from './filterStore';
import {beforeEach, describe, it, expect} from "vitest";
import {jobsFixture} from "@/lib/state/filterJobs.fixtures";

beforeEach(() => {
    filterStore.setState(s => ({
        ...s,
        filters: [],
    }));
});

describe('toggleFilterValue', () => {
    it('adds a filter when missing', () => {
        expect(toggleFilterValue([], 'Frontend'))
            .toEqual(['Frontend']);
    });

    it('removes a filter when present', () => {
        expect(toggleFilterValue(['Frontend'], 'Frontend'))
            .toEqual([]);
    });

    it('does not mutate the original array', () => {
        const filters = ['Frontend'];
        toggleFilterValue(filters, 'Backend');

        expect(filters).toEqual(['Frontend']);
    });
});

describe('filterJobs', () => {
    it('includes exactly all jobs with all of the specified tools', () => {
        expect(filterJobs(jobsFixture, ['React']).length)
            .toEqual(1);
    });

    it('returns an empty array if no results have all of the specified tools', () => {
        expect(filterJobs(jobsFixture, ['React', 'Vue']).length)
            .toEqual(0);
    });

    it('includes all jobs if no filters specified', () => {
        expect(filterJobs(jobsFixture, []).length)
            .toEqual(2);
    });
});