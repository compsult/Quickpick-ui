import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
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
    // Popup should be closed — no more time slots visible (waits for exit animation)
    await waitFor(() => {
      expect(screen.queryByLabelText('Select 9AM')).not.toBeInTheDocument();
    });
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

  test('input is readonly on touch device', () => {
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
    // Popup should close (waits for exit animation)
    await waitFor(() => {
      expect(screen.queryByText('New York')).not.toBeInTheDocument();
    });
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

// ─── Desktop combobox (typeable input with filtering) ────────────

describe('AppointmentTimeSelector — desktop combobox', () => {
  // Desktop mock: (hover: none) → false, (hover: hover) → true
  const desktopMatchMedia = (query) => ({
    matches: query === '(hover: hover)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  const timeProps = {
    selectedTime: null,
    onTimeChange: jest.fn(),
    selectedDate: new Date(2026, 1, 9), // Monday
    businessHours: {
      monday: { enabled: true, start: '09:00', end: '10:00' },
    },
  };

  const items = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
  ];

  const itemsProps = {
    items,
    selectedValue: null,
    onTimeChange: jest.fn(),
    placeholder: 'Choose a state',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(desktopMatchMedia);
  });

  test('shows searchable placeholder hint on desktop for time mode', () => {
    render(<AppointmentTimeSelector {...timeProps} />);
    expect(screen.getByPlaceholderText('Type to search or select Monday time')).toBeInTheDocument();
  });

  test('shows searchable placeholder hint on desktop for items mode', () => {
    render(<AppointmentTimeSelector items={items} onTimeChange={jest.fn()} />);
    expect(screen.getByPlaceholderText('Type to search or select')).toBeInTheDocument();
  });

  test('input is editable on desktop (no readonly)', () => {
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    expect(input).not.toHaveAttribute('readonly');
  });

  test('typing in input opens popup and filters items', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'tex');
    // Popup should be open with only Texas showing
    expect(screen.getByText('Texas')).toBeInTheDocument();
    expect(screen.queryByText('California')).not.toBeInTheDocument();
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  test('typing in time mode filters time slots', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    await user.type(input, '9:3');
    // Should show 9:30AM but not 9AM, 9:15AM, 9:45AM
    expect(screen.getByText('9:30AM')).toBeInTheDocument();
    expect(screen.queryByText('9AM')).not.toBeInTheDocument();
  });

  test('Enter key selects first filtered match in items mode', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...itemsProps} onTimeChange={handleChange} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'tex');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith({ value: 'TX', label: 'Texas' });
  });

  test('Enter key selects first filtered match in time mode', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...timeProps} onTimeChange={handleChange} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    await user.type(input, '9:3');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith('09:30');
  });

  test('Escape key closes popup and clears filter', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'cal');
    expect(screen.getByText('California')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    // Popup should close (waits for exit animation)
    await waitFor(() => {
      expect(screen.queryByText('California')).not.toBeInTheDocument();
    });
  });

  test('filter text clears when popup closes via selection', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'tex');
    await user.click(screen.getByText('Texas'));
    // After selection, popup closes and filter is cleared
    // Input should not show filter text
    expect(input.value).not.toBe('tex');
  });

  test('shows "No matches" when filter produces zero results in items mode', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'zzz');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  test('shows "No matches" when filter produces zero results in time mode', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    await user.type(input, 'zzz');
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  test('ArrowDown from input focuses first grid button in time mode', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    // Popup should be open
    expect(screen.getByText('9AM')).toBeInTheDocument();
    // ArrowDown from input → focus first grid button
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // setTimeout(0) is used — flush it
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const firstBtn = screen.getByLabelText('Select 9AM');
    expect(document.activeElement).toBe(firstBtn);
  });

  test('ArrowDown from input focuses first item in items mode', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    expect(screen.getByText('California')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const firstBtn = screen.getByLabelText('Select California');
    expect(document.activeElement).toBe(firstBtn);
  });

  test('ArrowUp from first grid row returns focus to input', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    // Move into grid
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const firstBtn = screen.getByLabelText('Select 9AM');
    expect(document.activeElement).toBe(firstBtn);
    // ArrowUp from first row → back to input
    fireEvent.keyDown(firstBtn, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(input);
  });

  test('Escape from grid closes popup and refocuses input', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    // Move into grid
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const firstBtn = screen.getByLabelText('Select 9AM');
    expect(document.activeElement).toBe(firstBtn);
    // Escape → popup closes, focus returns to input
    fireEvent.keyDown(firstBtn, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByLabelText('Select 9AM')).not.toBeInTheDocument();
    });
    expect(document.activeElement).toBe(input);
  });

  test('ArrowDown works with filtered results', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...itemsProps} />);
    const input = screen.getByPlaceholderText('Choose a state');
    await user.click(input);
    await user.type(input, 'tex');
    expect(screen.getByText('Texas')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    expect(document.activeElement).toBe(screen.getByLabelText('Select Texas'));
  });

  test('Enter on focused grid button selects the time', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...timeProps} onTimeChange={handleChange} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const firstBtn = screen.getByLabelText('Select 9AM');
    expect(document.activeElement).toBe(firstBtn);
    // Native click via Enter/Space on focused button
    await user.click(firstBtn);
    expect(handleChange).toHaveBeenCalledWith('09:00');
  });
});

// ─── Clear button ─────────────────────────────────────────────────

describe('AppointmentTimeSelector — clear button', () => {
  beforeEach(() => jest.clearAllMocks());

  test('clear button visible when item value is selected', () => {
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'TX', label: 'Texas' },
    ];
    const { container } = render(
      <AppointmentTimeSelector items={items} selectedValue="CA" onTimeChange={jest.fn()} />
    );
    expect(container.querySelector('.clear-btn')).toBeInTheDocument();
  });

  test('clear button visible when time is selected', () => {
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime="09:30"
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    expect(container.querySelector('.clear-btn')).toBeInTheDocument();
  });

  test('clear button hidden when no value selected', () => {
    const items = [
      { value: 'CA', label: 'California' },
    ];
    const { container } = render(
      <AppointmentTimeSelector items={items} selectedValue={null} onTimeChange={jest.fn()} />
    );
    expect(container.querySelector('.clear-btn')).not.toBeInTheDocument();
  });

  test('clear button hidden when no time selected', () => {
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    expect(container.querySelector('.clear-btn')).not.toBeInTheDocument();
  });

  test('clicking clear calls onTimeChange with null for items mode', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'TX', label: 'Texas' },
    ];
    const { container } = render(
      <AppointmentTimeSelector items={items} selectedValue="CA" onTimeChange={handleChange} />
    );
    await user.click(container.querySelector('.clear-btn'));
    expect(handleChange).toHaveBeenCalledWith({ value: null, label: null });
  });

  test('clicking clear calls onTimeChange with null for time mode', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime="09:30"
        onTimeChange={handleChange}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    await user.click(container.querySelector('.clear-btn'));
    expect(handleChange).toHaveBeenCalledWith(null);
  });

  test('clicking clear does NOT open popup', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'TX', label: 'Texas' },
    ];
    const { container } = render(
      <AppointmentTimeSelector items={items} selectedValue="CA" onTimeChange={jest.fn()} />
    );
    await user.click(container.querySelector('.clear-btn'));
    // Popup should not be open (wait for any pending animation)
    await waitFor(() => {
      expect(screen.queryByText('California')).not.toBeInTheDocument();
    });
  });
});

// ─── First match highlight ────────────────────────────────────────

describe('AppointmentTimeSelector — first match highlight', () => {
  // Desktop mock
  const desktopMatchMedia = (query) => ({
    matches: query === '(hover: hover)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(desktopMatchMedia);
  });

  test('first match highlighted while filtering in items mode', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'NY', label: 'New York' },
      { value: 'TX', label: 'Texas' },
    ];
    render(
      <AppointmentTimeSelector items={items} selectedValue={null} onTimeChange={jest.fn()} placeholder="Choose" />
    );
    const input = screen.getByPlaceholderText('Choose');
    await user.click(input);
    await user.type(input, 'tex');
    // Texas should have first-match class
    const texasBtn = screen.getByLabelText('Select Texas');
    expect(texasBtn).toHaveClass('first-match');
  });

  test('first match highlighted while filtering in time mode', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    await user.type(input, '9:3');
    // 9:30AM should have first-match class
    const slot930 = screen.getByLabelText('Select 9:30AM');
    expect(slot930).toHaveClass('first-match');
  });

  test('no highlight when filter is empty', async () => {
    const user = userEvent.setup();
    const items = [
      { value: 'CA', label: 'California' },
      { value: 'NY', label: 'New York' },
    ];
    const { container } = render(
      <AppointmentTimeSelector items={items} selectedValue={null} onTimeChange={jest.fn()} placeholder="Choose" />
    );
    const input = screen.getByPlaceholderText('Choose');
    await user.click(input);
    // No filter text — no first-match
    const buttons = container.querySelectorAll('.first-match');
    expect(buttons).toHaveLength(0);
  });
});

// ─── Loading / skeleton state ────────────────────────────────────

describe('AppointmentTimeSelector — loading state', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders skeleton when loading=true', () => {
    const { container } = render(
      <AppointmentTimeSelector loading onTimeChange={jest.fn()} />
    );
    expect(container.querySelector('.skeleton-trigger')).toBeInTheDocument();
    expect(container.querySelector('.skeleton-bar')).toBeInTheDocument();
    // Should NOT render the normal trigger
    expect(container.querySelector('.time-selector-trigger')).not.toBeInTheDocument();
  });

  test('renders skeleton label when loading with label prop', () => {
    render(<AppointmentTimeSelector loading label="Test Label" onTimeChange={jest.fn()} />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('skeleton-label');
  });

  test('does not render skeleton label when loading without label', () => {
    const { container } = render(
      <AppointmentTimeSelector loading onTimeChange={jest.fn()} />
    );
    expect(container.querySelector('.skeleton-label')).not.toBeInTheDocument();
  });
});

// ─── Tab key closes popup ────────────────────────────────────────

describe('AppointmentTimeSelector — Tab key', () => {
  const desktopMatchMedia = (query) => ({
    matches: query === '(hover: hover)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  const timeProps = {
    selectedTime: null,
    onTimeChange: jest.fn(),
    selectedDate: new Date(2026, 1, 9),
    businessHours: {
      monday: { enabled: true, start: '09:00', end: '10:00' },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(desktopMatchMedia);
  });

  test('Tab from input closes popup', async () => {
    const user = userEvent.setup();
    render(<AppointmentTimeSelector {...timeProps} />);
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    expect(screen.getByText('9AM')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Tab' });
    await waitFor(() => {
      expect(screen.queryByText('9AM')).not.toBeInTheDocument();
    });
  });
});

// ─── ARIA attributes ─────────────────────────────────────────────

describe('AppointmentTimeSelector — ARIA attributes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('trigger has aria-haspopup="listbox"', () => {
    render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  test('trigger has aria-controls when popup is open', async () => {
    const user = userEvent.setup();
    render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    const trigger = screen.getByRole('combobox');
    // Before open — no aria-controls
    expect(trigger).not.toHaveAttribute('aria-controls');
    await user.click(trigger);
    // After open — has aria-controls matching popup id
    const controlsId = trigger.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(controlsId).toMatch(/^qp-popup-/);
  });

  test('popup has matching id', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AppointmentTimeSelector
        selectedTime={null}
        onTimeChange={jest.fn()}
        selectedDate={new Date(2026, 1, 9)}
        businessHours={{ monday: { enabled: true, start: '09:00', end: '10:00' } }}
      />
    );
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    const controlsId = trigger.getAttribute('aria-controls');
    const popup = container.querySelector(`#${controlsId}`);
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveClass('time-grid-popup');
  });
});

// ─── autoSelectOnTab ──────────────────────────────────────────────

describe('AppointmentTimeSelector — autoSelectOnTab', () => {
  // Desktop mock
  const desktopMatchMedia = (query) => ({
    matches: query === '(hover: hover)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });

  const timeProps = {
    selectedTime: null,
    onTimeChange: jest.fn(),
    selectedDate: new Date(2026, 1, 9), // Monday
    businessHours: {
      monday: { enabled: true, start: '09:00', end: '10:00' },
    },
    autoSelectOnTab: true,
  };

  const items = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
  ];

  const itemsProps = {
    items,
    selectedValue: null,
    onTimeChange: jest.fn(),
    placeholder: 'Choose a state',
    autoSelectOnTab: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(desktopMatchMedia);
  });

  test('focus on trigger opens popup and focuses input', async () => {
    render(<AppointmentTimeSelector {...timeProps} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    // Popup should be open
    expect(screen.getByText('9AM')).toBeInTheDocument();
  });

  test('Tab without interaction auto-selects minTime in time mode', async () => {
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...timeProps} onTimeChange={handleChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const input = screen.getByPlaceholderText(/Monday time/);
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).toHaveBeenCalledWith('09:00');
  });

  test('Tab without interaction auto-selects first item in items mode', async () => {
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...itemsProps} onTimeChange={handleChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const input = screen.getByPlaceholderText('Choose a state');
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).toHaveBeenCalledWith({ value: 'CA', label: 'California' });
  });

  test('Tab after typing does NOT auto-select', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...itemsProps} onTimeChange={handleChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const input = screen.getByPlaceholderText('Choose a state');
    await user.type(input, 'tex');
    handleChange.mockClear();
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('Tab after ArrowDown does NOT auto-select', async () => {
    const handleChange = jest.fn();
    render(<AppointmentTimeSelector {...timeProps} onTimeChange={handleChange} />);
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const input = screen.getByPlaceholderText(/Monday time/);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    handleChange.mockClear();
    // Tab from the grid button
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('does NOT auto-select when value already exists', async () => {
    const handleChange = jest.fn();
    render(
      <AppointmentTimeSelector {...timeProps} selectedTime="09:30" onTimeChange={handleChange} />
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    // When input is focused, it shows filterText (empty), not the display value
    const input = screen.getByPlaceholderText(/Monday time/);
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('does NOT auto-select when autoSelectOnTab is false', async () => {
    const handleChange = jest.fn();
    render(
      <AppointmentTimeSelector {...timeProps} autoSelectOnTab={false} onTimeChange={handleChange} />
    );
    // Open popup via click (trigger onFocus won't fire autoSelect behavior)
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/Monday time/);
    await user.click(input);
    expect(screen.getByText('9AM')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('does NOT auto-select when selectedValue already exists in items mode', async () => {
    const handleChange = jest.fn();
    render(
      <AppointmentTimeSelector {...itemsProps} selectedValue="TX" onTimeChange={handleChange} />
    );
    const trigger = screen.getByRole('combobox');
    fireEvent.focus(trigger);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    // When input is focused, it shows filterText (empty), not the display value
    const input = screen.getByPlaceholderText('Choose a state');
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(handleChange).not.toHaveBeenCalled();
  });
});
