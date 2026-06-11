import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput, SearchResult } from './SearchInput';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const mockResults: SearchResult[] = [
  { type: 'restaurant', name: 'The Blue Door', href: '/restaurants/blue-door' },
  { type: 'chef', name: 'Gordon Ramsay', href: '/chefs/gordon-ramsay' },
  { type: 'dish', name: 'Truffle Pasta', href: '/dishes/truffle-pasta' },
];

describe('SearchInput', () => {
  it('renders the search input', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<SearchInput />);
    expect(
      screen.getByPlaceholderText('Search for restaurant cuisine, chef'),
    ).toBeInTheDocument();
  });

  it('renders icon on the left by default', () => {
    const { container } = render(<SearchInput />);
    const wrapper = container.firstChild as HTMLElement;
    const icon = wrapper.querySelector('span');
    const input = wrapper.querySelector('input');
    expect(wrapper.children[0]).toBe(icon);
    expect(wrapper.children[1]).toBe(input);
  });

  it('renders icon on the right when iconPosition=right', () => {
    const { container } = render(<SearchInput iconPosition="right" />);
    const wrapper = container.firstChild as HTMLElement;
    const input = wrapper.querySelector('input');
    const icon = wrapper.querySelector('span');
    expect(wrapper.children[0]).toBe(input);
    expect(wrapper.children[1]).toBe(icon);
  });

  it('does not show dropdown when no results', () => {
    render(<SearchInput />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('shows dropdown when onSearch returns results', () => {
    render(<SearchInput onSearch={() => mockResults} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'blue' },
    });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('The Blue Door')).toBeInTheDocument();
    expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument();
  });

  it('hides dropdown when input is cleared', () => {
    render(<SearchInput onSearch={() => mockResults} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'blue' },
    });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('highlights next item on ArrowDown', () => {
    render(<SearchInput onSearch={() => mockResults} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'b' },
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowDown' });
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('wraps to last item on ArrowUp from first', () => {
    render(<SearchInput onSearch={() => mockResults} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'b' },
    });
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'ArrowUp' });
    const options = screen.getAllByRole('option');
    expect(options[options.length - 1]).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('applies className without trailing space when className is undefined', () => {
    const { container } = render(<SearchInput />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/ $/);
  });
});
