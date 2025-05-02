import { render, screen, fireEvent } from '@testing-library/react';
import StoreCard from '../StoreCard';
import { truncateText } from '@/lib/utils';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}));

// Mock the Button component
jest.mock('../ui/Button', () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock the utils
jest.mock('@/lib/utils', () => ({
  truncateText: (text, limit) => text.length > limit ? `${text.substring(0, limit)}...` : text,
  formatPrice: (price) => price,
}));

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
    
    // Check that truncated text is rendered
    const expectedTruncatedText = truncateText(longDescription, 100);
    expect(screen.getByText(expectedTruncatedText)).toBeInTheDocument();
  });
}); 