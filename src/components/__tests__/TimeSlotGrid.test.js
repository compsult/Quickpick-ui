import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSlotGrid from '../TimeSlotGrid';

// ─── Time mode (backward compatibility) ───────────────────────────

describe('TimeSlotGrid — time mode', () => {
  test('renders time slots within min/max range', () => {
    render(<TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" />);
    // 09:00–10:00 → 9AM, 9:15AM, 9:30AM, 9:45AM, 10AM = 5 enabled slots
    const buttons = screen.getAllByRole('button').filter(b => !b.disabled);
    expect(buttons).toHaveLength(5);
    expect(buttons[0]).toHaveTextContent('9AM');
    expect(buttons[4]).toHaveTextContent('10AM');
  });

  test('highlights the selected time', () => {
    render(<TimeSlotGrid value="09:30" onChange={() => {}} minTime="09:00" maxTime="10:00" />);
    const selected = screen.getByLabelText('Select 9:30AM');
    expect(selected).toHaveClass('selected');
  });

  test('calls onChange with 24h time string on click', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TimeSlotGrid value={null} onChange={handleChange} minTime="14:00" maxTime="14:00" />);
    await user.click(screen.getByLabelText('Select 2PM'));
    expect(handleChange).toHaveBeenCalledWith('14:00');
  });

  test('renders disabled state with message', () => {
    render(<TimeSlotGrid value={null} onChange={() => {}} disabled />);
    expect(screen.getByText('Time selection unavailable')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TimeSlotGrid value={null} onChange={handleChange} minTime="09:00" maxTime="09:00" disabled />);
    // disabled mode renders a message, no buttons to click
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('renders unavailable slots for gaps in the hour', () => {
    // minTime 09:30 → 9:00 and 9:15 are unavailable
    render(<TimeSlotGrid value={null} onChange={() => {}} minTime="09:30" maxTime="09:45" />);
    const allButtons = screen.getAllByRole('button');
    const unavailable = allButtons.filter(b => b.classList.contains('unavailable'));
    expect(unavailable.length).toBe(2); // :00 and :15
  });

  test('applies custom className', () => {
    const { container } = render(
      <TimeSlotGrid value={null} onChange={() => {}} className="my-custom" />
    );
    expect(container.querySelector('.time-slot-grid')).toHaveClass('my-custom');
  });

  test('renders scroll indicator', () => {
    render(<TimeSlotGrid value={null} onChange={() => {}} />);
    expect(screen.getByText('Scroll for more times')).toBeInTheDocument();
  });
});

// ─── Items mode (generic data) ────────────────────────────────────

describe('TimeSlotGrid — items mode', () => {
  const colors = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
  ];

  const states = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
  ];

  const shortCodes = [
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'DE', label: 'DE' },
    { value: 'FR', label: 'FR' },
    { value: 'JP', label: 'JP' },
  ];

  test('renders all items as buttons', () => {
    render(<TimeSlotGrid items={colors} onChange={() => {}} />);
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  test('calls onChange with {value, label} object on click', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TimeSlotGrid items={colors} onChange={handleChange} />);
    await user.click(screen.getByText('Blue'));
    expect(handleChange).toHaveBeenCalledWith({ value: 'blue', label: 'Blue' });
  });

  test('highlights selected item via selectedValue', () => {
    render(<TimeSlotGrid items={colors} selectedValue="green" onChange={() => {}} />);
    expect(screen.getByText('Green').closest('button')).toHaveClass('selected');
    expect(screen.getByText('Red').closest('button')).not.toHaveClass('selected');
  });

  test('does not highlight when selectedValue does not match', () => {
    render(<TimeSlotGrid items={colors} selectedValue="purple" onChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => expect(btn).not.toHaveClass('selected'));
  });

  test('renders disabled state with message', () => {
    render(<TimeSlotGrid items={colors} onChange={() => {}} disabled />);
    expect(screen.getByText('Selection unavailable')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('does not fire onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<TimeSlotGrid items={colors} onChange={handleChange} disabled />);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Adaptive columns
  test('uses 4 columns for short labels (≤4 chars)', () => {
    const { container } = render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(4, minmax(0, 1fr))');
  });

  test('uses 3 columns for medium labels (≤8 chars)', () => {
    const mediumItems = [
      { value: 'a', label: 'Medium' },
      { value: 'b', label: 'Labels' },
      { value: 'c', label: 'Here' },
    ];
    const { container } = render(<TimeSlotGrid items={mediumItems} onChange={() => {}} />);
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  test('uses 2 columns for long labels (>8 chars)', () => {
    const { container } = render(<TimeSlotGrid items={states} onChange={() => {}} />);
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
  });

  test('respects explicit columns prop override', () => {
    const { container } = render(<TimeSlotGrid items={states} columns={3} onChange={() => {}} />);
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  test('chunks items into correct number of rows', () => {
    // 5 items with 2 columns → 3 rows
    const { container } = render(<TimeSlotGrid items={states} onChange={() => {}} />);
    const rows = container.querySelectorAll('.time-row');
    expect(rows).toHaveLength(3);
  });

  test('applies zebra striping to rows', () => {
    const { container } = render(<TimeSlotGrid items={states} onChange={() => {}} />);
    const rows = container.querySelectorAll('.time-row');
    expect(rows[0]).toHaveClass('even-row');
    expect(rows[1]).toHaveClass('odd-row');
    expect(rows[2]).toHaveClass('even-row');
  });

  test('sets aria-label on item buttons', () => {
    render(<TimeSlotGrid items={colors} onChange={() => {}} />);
    expect(screen.getByLabelText('Select Red')).toBeInTheDocument();
    expect(screen.getByLabelText('Select Blue')).toBeInTheDocument();
  });

  test('renders scroll indicator', () => {
    render(<TimeSlotGrid items={colors} onChange={() => {}} />);
    expect(screen.getByText('Scroll for more')).toBeInTheDocument();
  });

  test('falls back to time mode when items is null', () => {
    render(<TimeSlotGrid items={null} value={null} onChange={() => {}} minTime="09:00" maxTime="09:00" />);
    expect(screen.getByText('9AM')).toBeInTheDocument();
  });

  test('falls back to time mode when items is empty array', () => {
    render(<TimeSlotGrid items={[]} value={null} onChange={() => {}} minTime="09:00" maxTime="09:00" />);
    expect(screen.getByText('9AM')).toBeInTheDocument();
  });
});

// ─── filterText prop (time mode filtering) ──────────────────────

describe('TimeSlotGrid — filterText prop', () => {
  test('filters time slots by display text', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="9:30" />
    );
    expect(screen.getByText('9:30AM')).toBeInTheDocument();
    expect(screen.queryByText('9AM')).not.toBeInTheDocument();
    expect(screen.queryByText('9:15AM')).not.toBeInTheDocument();
    expect(screen.queryByText('9:45AM')).not.toBeInTheDocument();
  });

  test('filters case-insensitively', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="am" />
    );
    // All time slots contain "AM", so all should still be visible
    const buttons = screen.getAllByRole('button').filter(b => !b.disabled);
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('shows "No matches" when filter produces zero results', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="zzz" />
    );
    expect(screen.getByText('No matches')).toBeInTheDocument();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('shows all slots when filterText is empty', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="" />
    );
    const buttons = screen.getAllByRole('button').filter(b => !b.disabled);
    expect(buttons).toHaveLength(5); // 9:00, 9:15, 9:30, 9:45, 10:00
  });

  test('filterText does not affect items mode', () => {
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    render(<TimeSlotGrid items={items} onChange={() => {}} filterText="zzz" />);
    // Items mode ignores filterText — all items shown
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });
});
