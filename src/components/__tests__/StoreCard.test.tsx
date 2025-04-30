import { render, screen, fireEvent } from '@testing-library/react';
import StoreCard from '../StoreCard';

const mockStore = {
  id: '1',
  name: '테스트 가게',
  description: '테스트 설명입니다.',
  imageUrl: '/test-image.jpg',
  price: '10,000원',
};

describe('StoreCard', () => {
  it('renders store information correctly', () => {
    render(<StoreCard store={mockStore} />);

    expect(screen.getByText(mockStore.name)).toBeInTheDocument();
    expect(screen.getByText(mockStore.description)).toBeInTheDocument();
    expect(screen.getByText(mockStore.price)).toBeInTheDocument();
    expect(screen.getByAltText(`${mockStore.name} 이미지`)).toBeInTheDocument();
  });

  it('calls onSelect when select button is clicked', () => {
    const handleSelect = jest.fn();
    render(<StoreCard store={mockStore} onSelect={handleSelect} />);

    const selectButton = screen.getByRole('button', { name: /선택/i });
    fireEvent.click(selectButton);

    expect(handleSelect).toHaveBeenCalledWith(mockStore);
  });

  it('truncates long descriptions', () => {
    const longDescription = 'a'.repeat(200);
    const storeWithLongDescription = {
      ...mockStore,
      description: longDescription,
    };

    render(<StoreCard store={storeWithLongDescription} />);
    const description = screen.getByText(/a{100}\.\.\./);
    expect(description).toBeInTheDocument();
  });
}); 