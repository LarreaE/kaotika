import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import Welcome from '@/pages/welcome';
import '@testing-library/jest-dom';
import mockRouter from 'next-router-mock';

// Mock de next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock del enrutador
jest.mock('next/router', () => require('next-router-mock'));

describe('Welcome Component', () => {
  const mockSignOut = jest.fn();

  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: 'Mortimer' } },
    });
    mockRouter.setCurrentUrl('/');
  });

  it('should render the welcome message with the session user name', () => {
    render(<Welcome />);
    expect(
      screen.getByText(/Welcome to Legends of Kaotika, Mortimer/i)
    ).toBeInTheDocument();
  });

  it('should display the modal when the "Yes, I want to do it" button is clicked', () => {
    render(<Welcome />);
    const openModalButton = screen.getByText(/Yes, I want to do it/i);
    fireEvent.click(openModalButton);

    expect(screen.getByText(/Selecting an epic name/i)).toBeInTheDocument();
  });

  it('should update the name in sessionStorage and close the modal on saving', async () => {
    render(<Welcome />);
    const openModalButton = screen.getByText(/Yes, I want to do it/i);
    fireEvent.click(openModalButton);

    const input = screen.getByPlaceholderText(/Enter your epic name/i);
    fireEvent.change(input, { target: { value: 'Mortimer el Mentor' } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(sessionStorage.getItem('nickname')).toBe('Mortimer el Mentor');
      expect(screen.queryByText(/Selecting an epic name/i)).not.toBeInTheDocument();
    });
  });

  it('should navigate to the /player route when "Continue" button is clicked', () => {
    render(<Welcome />);
    const continueButton = screen.getByText(/Continue/i);
    fireEvent.click(continueButton);

    expect(mockRouter).toMatchObject({ pathname: '/player' });
  });

  it('should call signOut when the "Cancel" button is clicked', async () => {
    const { signOut } = require('next-auth/react');
    render(<Welcome />);

    const cancelButton = screen.getByText(/Cancel/i);
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/' });
    });
  });
});