import React from 'react';
import { render } from '@testing-library/react';
import MapPage from '../pages/MapPage';

describe('MapPage', () => {
    it('renders without crashing', () => {
        render(<MapPage />);
    });
});