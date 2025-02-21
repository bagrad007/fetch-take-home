import { render, screen, fireEvent } from '@testing-library/react';
import { DogCardProps } from '../../types';
import DogCard from '../DogCard';

const mockDog = {
  id: '123',
  name: 'Buddy',
  breed: 'Labrador',
  age: 3,
  zip_code: '12345',
  img: 'test-image.jpg',
};

describe('DogCard', () => {
  const mockHandleFavorite = jest.fn();

  type TestDogCardProps = DogCardProps & {
    location?: string;
  };

  const renderDogCard = (props: TestDogCardProps) =>
    render(<DogCard {...props} />);

  it('renders dog information correctly', () => {
    renderDogCard({
      dog: mockDog,
      isFavorite: false,
      onFavoriteToggle: mockHandleFavorite,
      location: 'Test City',
    });

    expect(screen.getByText(mockDog.name)).toBeInTheDocument();
    expect(screen.getByText(`Breed: ${mockDog.breed}`)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockDog.age}`)).toBeInTheDocument();
    expect(screen.getByText('Location: Test City')).toBeInTheDocument();
  });

  it('handles favorite toggle', () => {
    renderDogCard({
      dog: mockDog,
      isFavorite: false,
      onFavoriteToggle: mockHandleFavorite,
    });

    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    fireEvent.click(favoriteButton);
    expect(mockHandleFavorite).toHaveBeenCalledWith(mockDog.id);
  });

  it('displays fallback image when image loading fails', () => {
    const mockErrorDog = { ...mockDog, img: 'broken-image.jpg' };
    renderDogCard({
      dog: mockErrorDog,
      isFavorite: false,
      onFavoriteToggle: mockHandleFavorite,
    });

    const imgElement = screen.getByAltText(mockErrorDog.name);
    fireEvent.error(imgElement);

    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('No+Image+Available'),
    );
  });
});
