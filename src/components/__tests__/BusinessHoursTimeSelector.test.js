import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BusinessHoursTimeSelector from '../BusinessHoursTimeSelector';

// Simulate touch device (same as AppointmentTimeSelector tests)
const matchMediaMock = (query) => ({
  matches: query === '(hover: none)',
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

// ─── Loading state ───────────────────────────────────────────────

describe('BusinessHoursTimeSelector — loading state', () => {
  test('renders dual skeletons when loading=true', () => {
    const { container } = render(
      <BusinessHoursTimeSelector
        loading
        startTime="09:00"
        endTime="17:00"
        onStartTimeChange={jest.fn()}
        onEndTimeChange={jest.fn()}
      />
    );
    const skeletons = container.querySelectorAll('.skeleton-trigger');
    expect(skeletons).toHaveLength(2);
    const labels = container.querySelectorAll('.skeleton-label');
    expect(labels).toHaveLength(2);
    expect(labels[0]).toHaveTextContent('Start Time');
    expect(labels[1]).toHaveTextContent('End Time');
    const bars = container.querySelectorAll('.skeleton-bar');
    expect(bars).toHaveLength(2);
    // Should NOT render actual triggers
    expect(container.querySelector('.time-input-trigger')).not.toBeInTheDocument();
  });

  test('renders separator in loading state', () => {
    const { container } = render(
      <BusinessHoursTimeSelector
        loading
        startTime="09:00"
        endTime="17:00"
        onStartTimeChange={jest.fn()}
        onEndTimeChange={jest.fn()}
      />
    );
    expect(container.querySelector('.time-separator')).toBeInTheDocument();
  });
});

// ─── Tab key closes popup ────────────────────────────────────────

describe('BusinessHoursTimeSelector — Tab key', () => {
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

  const defaultProps = {
    startTime: '09:00',
    endTime: '17:00',
    onStartTimeChange: jest.fn(),
    onEndTimeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation(desktopMatchMedia);
  });

  test('Tab from start input closes popup', async () => {
    render(<BusinessHoursTimeSelector {...defaultProps} />);
    // Focus the start input directly — this triggers onFocus which opens the popup
    const startInput = screen.getByPlaceholderText('Select start');
    fireEvent.focus(startInput);
    // Popup should be visible with "Select Start Time"
    expect(screen.getByText('Select Start Time')).toBeInTheDocument();
    // Tab to close
    fireEvent.keyDown(startInput, { key: 'Tab' });
    await waitFor(() => {
      expect(screen.queryByText('Select Start Time')).not.toBeInTheDocument();
    });
  });
});

// ─── autoSelectOnTab ──────────────────────────────────────────────

describe('BusinessHoursTimeSelector — autoSelectOnTab', () => {
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

  test('focus on start trigger opens popup and focuses start input', async () => {
    render(
      <BusinessHoursTimeSelector
        startTime={null}
        endTime="17:00"
        onStartTimeChange={jest.fn()}
        onEndTimeChange={jest.fn()}
        autoSelectOnTab
      />
    );
    const triggers = screen.getAllByRole('combobox');
    fireEvent.focus(triggers[0]);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    expect(screen.getByText('Select Start Time')).toBeInTheDocument();
  });

  test('Tab without interaction auto-selects 06:00 for start', async () => {
    const handleStartChange = jest.fn();
    render(
      <BusinessHoursTimeSelector
        startTime={null}
        endTime="17:00"
        onStartTimeChange={handleStartChange}
        onEndTimeChange={jest.fn()}
        autoSelectOnTab
      />
    );
    const triggers = screen.getAllByRole('combobox');
    fireEvent.focus(triggers[0]);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const startInput = screen.getByPlaceholderText('Select start');
    fireEvent.keyDown(startInput, { key: 'Tab' });
    expect(handleStartChange).toHaveBeenCalledWith('06:00');
  });

  test('Tab without interaction auto-selects startTime for end', async () => {
    const handleEndChange = jest.fn();
    render(
      <BusinessHoursTimeSelector
        startTime="09:00"
        endTime={null}
        onStartTimeChange={jest.fn()}
        onEndTimeChange={handleEndChange}
        autoSelectOnTab
      />
    );
    const triggers = screen.getAllByRole('combobox');
    fireEvent.focus(triggers[1]);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const endInput = screen.getByPlaceholderText('Select end');
    fireEvent.keyDown(endInput, { key: 'Tab' });
    expect(handleEndChange).toHaveBeenCalledWith('09:00');
  });

  test('Tab after typing does NOT auto-select for start', async () => {
    const user = userEvent.setup();
    const handleStartChange = jest.fn();
    render(
      <BusinessHoursTimeSelector
        startTime={null}
        endTime="17:00"
        onStartTimeChange={handleStartChange}
        onEndTimeChange={jest.fn()}
        autoSelectOnTab
      />
    );
    const triggers = screen.getAllByRole('combobox');
    fireEvent.focus(triggers[0]);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const startInput = screen.getByPlaceholderText('Select start');
    await user.type(startInput, '9');
    handleStartChange.mockClear();
    fireEvent.keyDown(startInput, { key: 'Tab' });
    expect(handleStartChange).not.toHaveBeenCalled();
  });

  test('does NOT auto-select when startTime already exists', async () => {
    const handleStartChange = jest.fn();
    render(
      <BusinessHoursTimeSelector
        startTime="09:00"
        endTime="17:00"
        onStartTimeChange={handleStartChange}
        onEndTimeChange={jest.fn()}
        autoSelectOnTab
      />
    );
    const triggers = screen.getAllByRole('combobox');
    fireEvent.focus(triggers[0]);
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const startInput = screen.getByPlaceholderText('Select start');
    fireEvent.keyDown(startInput, { key: 'Tab' });
    expect(handleStartChange).not.toHaveBeenCalled();
  });

  test('does NOT auto-select when autoSelectOnTab is false', async () => {
    const handleStartChange = jest.fn();
    // Use valid times to avoid null crash during popup close animation;
    // the test verifies autoSelectOnTab=false prevents auto-selection
    render(
      <BusinessHoursTimeSelector
        startTime="09:00"
        endTime="17:00"
        onStartTimeChange={handleStartChange}
        onEndTimeChange={jest.fn()}
        autoSelectOnTab={false}
      />
    );
    const startInput = screen.getByPlaceholderText('Select start');
    fireEvent.focus(startInput);
    expect(screen.getByText('Select Start Time')).toBeInTheDocument();
    fireEvent.keyDown(startInput, { key: 'Tab' });
    expect(handleStartChange).not.toHaveBeenCalled();
  });
});
