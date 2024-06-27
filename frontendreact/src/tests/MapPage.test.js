import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapPage from '../pages/MapPage';

describe('MapPage', () => {
    beforeEach(() => {
        render(<MapPage />);
    });

    it('renders without crashing', () => {});

    it('renders the header text', () => {
        const headerElement = screen.getByRole('heading', { name: /map Page/i });
        expect(headerElement).toBeInTheDocument();
    });

    it('renders the paragraph text', () => {
        const paragraphElement = screen.getByText(/This is the map page/i);
        expect(paragraphElement).toBeInTheDocument();
    });
});
