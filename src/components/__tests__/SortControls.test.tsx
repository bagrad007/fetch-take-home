import { fireEvent, render, screen } from '@testing-library/react';
import { SortControlsProps } from '../../types';
import SortControls from '../SortControls';

describe('SortControls', () => {
  const mockOnSortChange = jest.fn();

  type TestSortControlsProps = SortControlsProps & {
    sortField: string;
    sortDirection: 'asc' | 'desc';
  };

  const renderSortControls = (props: TestSortControlsProps) => {
    render(<SortControls {...props} />);
  };

  it('renders sort controls correctly', () => {
    renderSortControls({
      sortField: 'breed',
      sortDirection: 'asc',
      onSortChange: mockOnSortChange,
    });

    expect(screen.getByText('Sort: breed')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles sort field change', () => {
    renderSortControls({
      sortField: 'breed',
      sortDirection: 'asc',
      onSortChange: mockOnSortChange,
    });

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement); // Open the dropdown
    const ageOption = screen.getByRole('option', { name: 'Age' });
    fireEvent.click(ageOption);

    expect(mockOnSortChange).toHaveBeenCalledWith('age', 'asc');
  });

  it('handles sort direction change', () => {
    renderSortControls({
      sortField: 'breed',
      sortDirection: 'asc',
      onSortChange: mockOnSortChange,
    });

    const sortDirectionButton = screen.getByRole('button');
    fireEvent.click(sortDirectionButton);

    expect(mockOnSortChange).toHaveBeenCalledWith('breed', 'desc');
  });
});
