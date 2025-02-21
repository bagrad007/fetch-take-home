import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BreedFilter from '../BreedFilter';

describe('BreedFilter', () => {
  const mockBreeds = ['Labrador', 'Poodle', 'Beagle'];
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders breed options correctly', async () => {
    render(
      <BreedFilter
        breeds={mockBreeds}
        selectedBreeds={[]}
        onSelect={mockOnSelect}
      />,
    );

    const input = screen.getByRole('combobox', { name: /filter breeds/i });
    await userEvent.click(input);

    await waitFor(() => {
      mockBreeds.forEach((breed) => {
        expect(screen.getByRole('option', { name: breed })).toBeInTheDocument();
      });
    });
  });

  it('handles breed selection', async () => {
    render(
      <BreedFilter
        breeds={mockBreeds}
        selectedBreeds={[]}
        onSelect={mockOnSelect}
      />,
    );

    const input = screen.getByRole('combobox', { name: /filter breeds/i });
    await userEvent.click(input);

    const option = await screen.findByRole('option', { name: 'Labrador' });
    await userEvent.click(option);

    expect(mockOnSelect).toHaveBeenCalledWith(['Labrador']);
  });

  it('handles deselection of breeds', async () => {
    render(
      <BreedFilter
        breeds={mockBreeds}
        selectedBreeds={['Labrador']}
        onSelect={mockOnSelect}
      />,
    );

    const input = screen.getByRole('combobox', { name: /filter breeds/i });
    await userEvent.click(input);

    const option = await screen.findByRole('option', { name: 'Labrador' });
    await userEvent.click(option);

    expect(mockOnSelect).toHaveBeenCalledWith([]);
  });
});
