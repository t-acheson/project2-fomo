// Imports
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/footer';

// Start of Footer test
test('renders footer with copyright info', () => {
    const { getByText } = render(<Footer />);

    // Check if the footer contains the correct text
    const copyrightText = getByText(/© 2024 Copyright. All Rights Reserved./i);
    expect(copyrightText).toBeInTheDocument();
});
// End of Footer test
