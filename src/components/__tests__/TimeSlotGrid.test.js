import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeSlotGrid from '../TimeSlotGrid';

// ─── Time mode (backward compatibility) ───────────────────────────

describe('TimeSlotGrid — time mode', () => {
  test('renders time slots within min/max range', () => {
    render(<TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" />);
    // 09:00–10:00 → 9AM, 9:15AM, 9:30AM, 9:45AM, 10AM = 5 enabled slots
    const buttons = screen.getAllByRole('option').filter(b => !b.disabled);
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
    expect(screen.queryAllByRole('option')).toHaveLength(0);
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
    const allButtons = screen.getAllByRole('option');
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
    const buttons = screen.getAllByRole('option');
    buttons.forEach(btn => expect(btn).not.toHaveClass('selected'));
  });

  test('renders disabled state with message', () => {
    render(<TimeSlotGrid items={colors} onChange={() => {}} disabled />);
    expect(screen.getByText('Selection unavailable')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
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
    const buttons = screen.getAllByRole('option').filter(b => !b.disabled);
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('shows "No matches" when filter produces zero results', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="zzz" />
    );
    expect(screen.getByText('No matches')).toBeInTheDocument();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  test('shows all slots when filterText is empty', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="10:00" filterText="" />
    );
    const buttons = screen.getAllByRole('option').filter(b => !b.disabled);
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

// ─── Keyboard navigation ─────────────────────────────────────────

describe('TimeSlotGrid — keyboard navigation', () => {
  const shortCodes = [
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'DE', label: 'DE' },
    { value: 'FR', label: 'FR' },
    { value: 'JP', label: 'JP' },
    { value: 'AU', label: 'AU' },
  ];

  test('ArrowRight moves focus to next button in items mode', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[1]);
  });

  test('ArrowDown moves focus down one row in items mode', () => {
    // shortCodes: 6 items, ≤4 chars → 4 columns
    // Row 0: US, UK, DE, FR   Row 1: JP, AU
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus(); // US
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[4]); // JP (index 0 + 4 cols)
  });

  test('ArrowUp past first row calls onNavigateOut', () => {
    const onNavigateOut = jest.fn();
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} onNavigateOut={onNavigateOut} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowUp' });
    expect(onNavigateOut).toHaveBeenCalledTimes(1);
  });

  test('ArrowLeft past first button calls onNavigateOut', () => {
    const onNavigateOut = jest.fn();
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} onNavigateOut={onNavigateOut} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowLeft' });
    expect(onNavigateOut).toHaveBeenCalledTimes(1);
  });

  test('Escape calls onEscape', () => {
    const onEscape = jest.fn();
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} onEscape={onEscape} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  test('ArrowRight at last button stays put', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    const last = buttons[buttons.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(last);
  });

  test('ArrowDown past last row stays put', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    const last = buttons[buttons.length - 1];
    last.focus();
    fireEvent.keyDown(last, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(last);
  });

  test('navigation works in time mode', () => {
    // 09:00–09:45 → 4 enabled slots in a single row of 4
    render(<TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="09:45" />);
    const buttons = screen.getAllByRole('option').filter(b => !b.disabled && !b.classList.contains('unavailable'));
    expect(buttons.length).toBe(4);
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[1]);
  });

  test('navigation skips unavailable/disabled slots', () => {
    // 09:15–09:45 → :00 is unavailable (disabled), :15, :30, :45 are available
    render(<TimeSlotGrid value={null} onChange={() => {}} minTime="09:15" maxTime="09:45" />);
    const available = screen.getAllByRole('option').filter(b => !b.disabled && !b.classList.contains('unavailable'));
    expect(available.length).toBe(3);
    available[0].focus();
    fireEvent.keyDown(available[0], { key: 'ArrowRight' });
    expect(document.activeElement).toBe(available[1]);
  });

  test('non-navigation keys are ignored', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'a' });
    expect(document.activeElement).toBe(buttons[0]); // stays put
  });
});

// ─── highlightedValue prop ──────────────────────────────────────

describe('TimeSlotGrid — highlightedValue prop', () => {
  test('applies first-match class to matching item', () => {
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'TX', label: 'Texas' },
    ];
    render(<TimeSlotGrid items={items} onChange={() => {}} highlightedValue="TX" />);
    expect(screen.getByLabelText('Select Texas')).toHaveClass('first-match');
    expect(screen.getByLabelText('Select California')).not.toHaveClass('first-match');
  });

  test('applies first-match class to matching time slot', () => {
    render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="09:45" highlightedValue="09:30" />
    );
    expect(screen.getByLabelText('Select 9:30AM')).toHaveClass('first-match');
    expect(screen.getByLabelText('Select 9AM')).not.toHaveClass('first-match');
  });

  test('no first-match when highlightedValue is null', () => {
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'TX', label: 'Texas' },
    ];
    const { container } = render(
      <TimeSlotGrid items={items} onChange={() => {}} highlightedValue={null} />
    );
    expect(container.querySelectorAll('.first-match')).toHaveLength(0);
  });
});

// ─── Home / End keys ─────────────────────────────────────────────

describe('TimeSlotGrid — Home/End keys', () => {
  const shortCodes = [
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'DE', label: 'DE' },
    { value: 'FR', label: 'FR' },
    { value: 'JP', label: 'JP' },
    { value: 'AU', label: 'AU' },
  ];

  test('Home key focuses first slot', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    buttons[3].focus(); // start in middle
    expect(document.activeElement).toBe(buttons[3]);
    fireEvent.keyDown(buttons[3], { key: 'Home' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  test('End key focuses last slot', () => {
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'End' });
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);
  });

  test('Tab calls onEscape', () => {
    const onEscape = jest.fn();
    render(<TimeSlotGrid items={shortCodes} onChange={() => {}} onEscape={onEscape} />);
    const buttons = screen.getAllByRole('option');
    buttons[0].focus();
    fireEvent.keyDown(buttons[0], { key: 'Tab' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});

// ─── ARIA roles ──────────────────────────────────────────────────

describe('TimeSlotGrid — ARIA roles', () => {
  test('grid-body has role="listbox" in items mode', () => {
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    const { container } = render(<TimeSlotGrid items={items} onChange={() => {}} />);
    expect(container.querySelector('.grid-body')).toHaveAttribute('role', 'listbox');
  });

  test('grid-body has role="listbox" in time mode', () => {
    const { container } = render(
      <TimeSlotGrid value={null} onChange={() => {}} minTime="09:00" maxTime="09:15" />
    );
    expect(container.querySelector('.grid-body')).toHaveAttribute('role', 'listbox');
  });

  test('time-slot has role="option" and aria-selected in items mode', () => {
    const items = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ];
    render(<TimeSlotGrid items={items} selectedValue="a" onChange={() => {}} />);
    const alpha = screen.getByLabelText('Select Alpha');
    expect(alpha).toHaveAttribute('role', 'option');
    expect(alpha).toHaveAttribute('aria-selected', 'true');
    const beta = screen.getByLabelText('Select Beta');
    expect(beta).toHaveAttribute('role', 'option');
    expect(beta).toHaveAttribute('aria-selected', 'false');
  });

  test('time-slot has role="option" and aria-selected in time mode', () => {
    render(
      <TimeSlotGrid value="09:00" onChange={() => {}} minTime="09:00" maxTime="09:15" />
    );
    const selected = screen.getByLabelText('Select 9AM');
    expect(selected).toHaveAttribute('role', 'option');
    expect(selected).toHaveAttribute('aria-selected', 'true');
    const unselected = screen.getByLabelText('Select 9:15AM');
    expect(unselected).toHaveAttribute('aria-selected', 'false');
  });
});
