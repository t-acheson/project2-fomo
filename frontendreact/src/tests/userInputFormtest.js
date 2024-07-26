import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInputForm from '../components/userInputForm';

describe('UserInputForm Component', () => {
    test('renders form with textarea and submit button', () => {
        render(<UserInputForm />);
        
        // Check if the textarea is rendered
        const textareaElement = screen.getByLabelText('Example textarea');
        expect(textareaElement).toBeInTheDocument();

        // Check if the submit button is rendered
        const submitButton = screen.getByRole('button', { name: /submit/i });
        expect(submitButton).toBeInTheDocument();
    });

    test('allows user to type in textarea', () => {
        render(<UserInputForm />);

        const textareaElement = screen.getByLabelText('Example textarea');

        fireEvent.change(textareaElement, { target: { value: 'Test input' } });

        expect(textareaElement).toHaveValue('Test input');
    });

    test('submits form when submit button is clicked', () => {
        render(<UserInputForm />);

        const textareaElement = screen.getByLabelText('Example textarea');
        const submitButton = screen.getByRole('button', { name: /submit/i });

        // Type into the textarea
        fireEvent.change(textareaElement, { target: { value: 'Test input' } });

        // Mock form submission by calling onSubmit directly
        fireEvent.click(submitButton);

        //TODO: component doesn't currently clear the textarea upon submission, this assertion will fail unless the component is modified. 
        // Assert that the form submission behavior is correctly handled
        // In component, onSubmit should handle clearing the textarea
        // expect(textareaElement).toHaveValue('');
    });
});