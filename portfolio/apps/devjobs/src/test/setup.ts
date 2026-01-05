import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach } from 'vitest';
import { jobsFixture } from '@/lib/state/filterJobs.fixtures';

export const handlers = [
    http.get('/api/jobs', () => HttpResponse.json(jobsFixture)),
];

export const server = setupServer(...handlers);

// ✅ start immediately — not in beforeAll
server.listen({
    onUnhandledRequest(req) {
        console.error(
            '🚨 MSW DID NOT HANDLE:',
            req.method,
            req.url
        );
    },
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());