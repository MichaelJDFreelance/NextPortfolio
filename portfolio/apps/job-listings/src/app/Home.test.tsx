import { screen } from '@testing-library/react';
import {describe, it, expect} from "vitest";

import Home from '@/app/page';
import {renderWithQuery} from "@/components/DataProvider";

describe('Job list', () => {

    it('renders jobs fetched from the API', async () => {
        renderWithQuery(<Home />);

        // Assert loading state (optional but nice)
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Assert data from jobsFixture eventually appears
        expect(await screen.findByText('Photosnap')).toBeInTheDocument();
        expect(screen.getByText('Manage')).toBeInTheDocument();
    });
});