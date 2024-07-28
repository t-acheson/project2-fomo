// TimeLock.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TimeLock from '../components/TimeLock';

// Mock component to wrap
const MockComponent = () => <div>Mock Component</div>;

// Mock the Navigate component from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Navigate: jest.fn(() => null), // Return null to simulate Navigate
}));

describe('TimeLock HOC', () => {
    const originalDate = Date;
    const originalAlert = window.alert;

    beforeEach(() => {
        jest.clearAllMocks();
        window.alert = jest.fn(); // Mock alert
    });

    afterEach(() => {
        global.Date = originalDate;
        window.alert = originalAlert; // Restore alert
    });

    it('should render the wrapped component outside restricted hours', () => {
        // Mock Date to return a time outside restricted hours
        global.Date = class extends Date {
            getHours() {
                return 19;
            }
        };

        const WrappedComponent = TimeLock(MockComponent);

        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        expect(screen.getByText('Mock Component')).toBeInTheDocument();
    });

    it('should redirect during restricted hours', () => {
        // Mock Date to return a time within restricted hours
        global.Date = class extends Date {
            getHours() {
                return 10;
            }
        };

        const WrappedComponent = TimeLock(MockComponent);

        render(
            <MemoryRouter>
                <WrappedComponent />
            </MemoryRouter>
        );

        // Check if Navigate component is rendered
        const { Navigate } = require('react-router-dom');
        expect(Navigate).toHaveBeenCalled();
    });
});