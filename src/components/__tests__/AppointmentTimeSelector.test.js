import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppointmentTimeSelector from '../AppointmentTimeSelector';

// Simulate touch device so that:
// 1. Hover handler (mouseEnter) is skipped — prevents userEvent.click()
//    from opening via hover then immediately toggling closed via click
// 2. Mouse-tracking interval is skipped — prevents auto-close in jsdom
//    where mouse position is always (0,0)
const matchMediaMock = (query) => ({
  matches: query === '(hover: none)',   // touch device → true
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation(matchMediaMock);
});

// ─── Time mode (backward compatibility) ───────────────────────────

describe('AppointmentTimeSelector — time mode', () => {
  const defaultProps = {
    selectedTime: null,
    onTimeChange: jest.fn(),
    selectedDate: new Date(2026, 1, 9), // Monday
    businessHours: {
      monday: { enabled: true, start: '09:00', end: '10:00' },
    },
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders placeholder with day name when no time selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    expect(screen.getByText('Select Monday time')).toBeInTheDocument();
  });

  test('renders formatted time when selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedTime="14:30" />);
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
  });

  test('opens popup grid on button click', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('button'));
    // Grid should be visible with time slots
    expect(screen.getByText('9AM')).toBeInTheDocument();
  });

  test('closes popup after selecting a time', async () => {
    const user = userEvent.setup({});
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...defaultProps} onTimeChange={handleChange} />);
    // Open popup
    await user.click(screen.getByRole('button', { name: /select/i }));
    // Click a time slot
    await user.click(screen.getByLabelText('Select 9AM'));
    expect(handleChange).toHaveBeenCalledWith('09:00');
    // Popup should be closed — no more time slots visible
    expect(screen.queryByLabelText('Select 9AM')).not.toBeInTheDocument();
  });

  test('renders disabled state', () => {
    render(<AppointmentTimeSelector {...defaultProps} disabled />);
    expect(screen.getByText('Time selection unavailable')).toBeInTheDocument();
  });

  test('renders dropdown arrow', () => {
    const { container } = render(<AppointmentTimeSelector {...defaultProps} />);
    expect(container.querySelector('.dropdown-arrow')).toBeInTheDocument();
  });

  test('button gets active class when popup is open', async () => {
    const user = userEvent.setup({});
    const { container } = render(<AppointmentTimeSelector {...defaultProps} />);
    const button = container.querySelector('.time-selector-button');
    expect(button).not.toHaveClass('active');
    await user.click(button);
    expect(container.querySelector('.time-selector-button')).toHaveClass('active');
  });
});

// ─── Items mode (generic data) ────────────────────────────────────

describe('AppointmentTimeSelector — items mode', () => {
  const items = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
  ];

  const defaultProps = {
    items,
    selectedValue: null,
    onTimeChange: jest.fn(),
    placeholder: 'Choose a state',
  };

  beforeEach(() => jest.clearAllMocks());

  test('renders placeholder when no value selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    expect(screen.getByText('Choose a state')).toBeInTheDocument();
  });

  test('renders default placeholder when none provided', () => {
    render(<AppointmentTimeSelector items={items} onTimeChange={jest.fn()} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('renders selected item label on button', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedValue="NY" />);
    expect(screen.getByText('New York')).toBeInTheDocument();
  });

  test('falls back to value string if not found in items', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedValue="ZZ" />);
    expect(screen.getByText('ZZ')).toBeInTheDocument();
  });

  test('opens popup showing items on click', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Texas')).toBeInTheDocument();
  });

  test('calls onTimeChange with {value, label} on item click', async () => {
    const user = userEvent.setup({});
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...defaultProps} onTimeChange={handleChange} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('Texas'));
    expect(handleChange).toHaveBeenCalledWith({ value: 'TX', label: 'Texas' });
  });

  test('closes popup after item selection', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('button'));
    await user.click(screen.getByText('California'));
    // Popup should close
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  test('passes columns prop through to grid', async () => {
    const user = userEvent.setup({});
    const { container } = render(
      <AppointmentTimeSelector {...defaultProps} columns={3} />
    );
    await user.click(screen.getByRole('button'));
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  test('button shows placeholder style when no value selected', () => {
    const { container } = render(<AppointmentTimeSelector {...defaultProps} />);
    expect(container.querySelector('.time-value')).toHaveClass('placeholder');
  });

  test('button does not show placeholder style when value selected', () => {
    const { container } = render(
      <AppointmentTimeSelector {...defaultProps} selectedValue="CA" />
    );
    expect(container.querySelector('.time-value')).not.toHaveClass('placeholder');
  });
});
