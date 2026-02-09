import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
