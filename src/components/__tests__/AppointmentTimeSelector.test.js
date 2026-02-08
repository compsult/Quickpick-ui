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

  test('renders placeholder in input when no time selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    expect(screen.getByPlaceholderText('Select Monday time')).toBeInTheDocument();
  });

  test('renders formatted time in input when selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedTime="14:30" />);
    expect(screen.getByDisplayValue('2:30 PM')).toBeInTheDocument();
  });

  test('opens popup grid on click', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('combobox'));
    // Grid should be visible with time slots
    expect(screen.getByText('9AM')).toBeInTheDocument();
  });

  test('closes popup after selecting a time', async () => {
    const user = userEvent.setup({});
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...defaultProps} onTimeChange={handleChange} />);
    // Open popup
    await user.click(screen.getByRole('combobox'));
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

  test('trigger gets active class when popup is open', async () => {
    const user = userEvent.setup({});
    const { container } = render(<AppointmentTimeSelector {...defaultProps} />);
    const trigger = container.querySelector('.time-selector-trigger');
    expect(trigger).not.toHaveClass('active');
    await user.click(trigger);
    expect(container.querySelector('.time-selector-trigger')).toHaveClass('active');
  });

  test('input is readonly', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    const input = screen.getByPlaceholderText('Select Monday time');
    expect(input).toHaveAttribute('readonly');
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

  test('renders placeholder in input when no value selected', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    expect(screen.getByPlaceholderText('Choose a state')).toBeInTheDocument();
  });

  test('renders default placeholder when none provided', () => {
    render(<AppointmentTimeSelector items={items} onTimeChange={jest.fn()} />);
    expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
  });

  test('renders selected item label in input', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedValue="NY" />);
    expect(screen.getByDisplayValue('New York')).toBeInTheDocument();
  });

  test('falls back to value string if not found in items', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedValue="ZZ" />);
    expect(screen.getByDisplayValue('ZZ')).toBeInTheDocument();
  });

  test('opens popup showing items on click', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByText('California')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('Texas')).toBeInTheDocument();
  });

  test('calls onTimeChange with {value, label} on item click', async () => {
    const user = userEvent.setup({});
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...defaultProps} onTimeChange={handleChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Texas'));
    expect(handleChange).toHaveBeenCalledWith({ value: 'TX', label: 'Texas' });
  });

  test('closes popup after item selection', async () => {
    const user = userEvent.setup({});
    render(<AppointmentTimeSelector {...defaultProps} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('California'));
    // Popup should close
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  test('passes columns prop through to grid', async () => {
    const user = userEvent.setup({});
    const { container } = render(
      <AppointmentTimeSelector {...defaultProps} columns={3} />
    );
    await user.click(screen.getByRole('combobox'));
    const row = container.querySelector('.time-row');
    expect(row.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  test('input has empty value when no selection', () => {
    render(<AppointmentTimeSelector {...defaultProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    expect(input.value).toBe('');
  });

  test('input has selected value when selection made', () => {
    render(<AppointmentTimeSelector {...defaultProps} selectedValue="CA" />);
    const input = screen.getByDisplayValue('California');
    expect(input.value).toBe('California');
  });
});

// ─── Label prop ──────────────────────────────────────────────────

describe('AppointmentTimeSelector — label prop', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders label text above input in time mode', () => {
    render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
        label="Appointment Time"
      />
    );
    expect(screen.getByText('Appointment Time')).toBeInTheDocument();
    expect(screen.getByText('Appointment Time').className).toBe('time-selector-label');
  });

  test('renders label text above input in items mode', () => {
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'NY', label: 'New York' },
    ];
    render(
      <AppointmentTimeSelector
        items={items}
        onTimeChange={jest.fn()}
        placeholder="Choose a state"
        label="US State"
      />
    );
    expect(screen.getByText('US State')).toBeInTheDocument();
    expect(screen.getByText('US State').className).toBe('time-selector-label');
  });

  test('does not render label when prop is not provided', () => {
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    expect(container.querySelector('.time-selector-label')).not.toBeInTheDocument();
  });

  test('label is inside the field wrapper', () => {
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
        label="Test Label"
      />
    );
    const field = container.querySelector('.time-selector-field');
    expect(field).toBeInTheDocument();
    expect(field.querySelector('.time-selector-label')).toBeInTheDocument();
    expect(field.querySelector('.time-selector-input')).toBeInTheDocument();
  });
});
