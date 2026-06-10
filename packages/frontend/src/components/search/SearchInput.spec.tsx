import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchInput, SearchResultGroup } from './SearchInput';

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

const mockGroups: SearchResultGroup[] = [
  {
    label: 'Restaurants',
    items: [
      {
        type: 'restaurant',
        name: 'The Blue Door',
        href: '/restaurants/blue-door',
      },
    ],
  },
  {
    label: 'Chef',
    items: [
      { type: 'chef', name: 'Gordon Ramsay', href: '/chefs/gordon-ramsay' },
    ],
  },
  {
    label: 'Dishes',
    items: [
      { type: 'dish', name: 'Truffle Pasta', href: '/dishes/truffle-pasta' },
    ],
  },
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

  it('shows dropdown with results and category headers when onSearch returns groups', () => {
    render(<SearchInput onSearch={() => mockGroups} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'blue' },
    });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('The Blue Door')).toBeInTheDocument();
    expect(screen.getByText('Gordon Ramsay')).toBeInTheDocument();
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Chef')).toBeInTheDocument();
  });

  it('hides dropdown when input is cleared', () => {
    render(<SearchInput onSearch={() => mockGroups} />);
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'blue' },
    });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('highlights next item on ArrowDown', () => {
    render(<SearchInput onSearch={() => mockGroups} />);
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
    render(<SearchInput onSearch={() => mockGroups} />);
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

  it('does not autoFocus the input by default', () => {
    render(<SearchInput />);
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('autofocus');
  });

  it('applies className without trailing space when className is undefined', () => {
    const { container } = render(<SearchInput />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).not.toMatch(/ $/);
  });

  it('resets active index when the query changes', () => {
    render(<SearchInput onSearch={() => mockGroups} />);
    const input = screen.getByRole('searchbox');

    // Navigate to second item
    fireEvent.change(input, { target: { value: 'b' } });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Change the query — active index must reset to -1
    fireEvent.change(input, { target: { value: 'bl' } });
    const options = screen.getAllByRole('option');
    options.forEach((opt) =>
      expect(opt).toHaveAttribute('aria-selected', 'false'),
    );
  });

  it('closes the dropdown when clicking outside the component', () => {
    render(
      <div>
        <SearchInput onSearch={() => mockGroups} />
        <button>outside</button>
      </div>,
    );
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'b' },
    });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
