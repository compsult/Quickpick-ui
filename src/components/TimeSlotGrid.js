import React from 'react';
import './TimeSlotGrid.css';

const TimeSlotGrid = ({
  value,
  onChange,
  minTime = '08:00',
  maxTime = '17:00',
  disabled = false,
  className = '',
  showHeader = true,
  items = null,
  columns = null,
  selectedValue = null,
  filterText = '',
  highlightedValue = null,
  onNavigateOut = null,
  onEscape = null
}) => {
  // Arrow key navigation handler for grid buttons
  const handleGridKeyDown = (e) => {
    const key = e.key;
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Home', 'End', 'Tab'].includes(key)) return;

    if (key === 'Tab') {
      // Let natural tab navigation proceed, but close the popup
      if (onEscape) onEscape();
      return;
    }

    e.preventDefault();

    if (key === 'Escape') {
      if (onEscape) onEscape();
      return;
    }

    const gridBody = e.target.closest('.grid-body');
    if (!gridBody) return;
    const buttons = Array.from(gridBody.querySelectorAll('button.time-slot:not(:disabled):not(.unavailable)'));
    const currentIndex = buttons.indexOf(e.target);
    if (currentIndex === -1) return;

    if (key === 'Home') {
      buttons[0].focus();
      return;
    }
    if (key === 'End') {
      buttons[buttons.length - 1].focus();
      return;
    }

    const colCount = parseInt(gridBody.dataset.colCount, 10) || 4;
    let nextIndex;
    if (key === 'ArrowRight') nextIndex = currentIndex + 1;
    else if (key === 'ArrowLeft') nextIndex = currentIndex - 1;
    else if (key === 'ArrowDown') nextIndex = currentIndex + colCount;
    else if (key === 'ArrowUp') nextIndex = currentIndex - colCount;

    if (nextIndex < 0) {
      if (onNavigateOut) onNavigateOut();
      return;
    }
    if (nextIndex >= buttons.length) return; // stay put
    buttons[nextIndex].focus();
  };
  // --- Generic items mode ---
  if (items && items.length > 0) {
    const maxLabelLen = items.reduce((max, item) => Math.max(max, item.label.length), 0);
    const colCount = columns || (maxLabelLen <= 4 ? 4 : maxLabelLen <= 8 ? 3 : 2);

    // Chunk items into rows
    const rows = [];
    for (let i = 0; i < items.length; i += colCount) {
      rows.push(items.slice(i, i + colCount));
    }

    const handleItemClick = (item) => {
      if (disabled) return;
      onChange(item);
    };

    if (disabled) {
      return (
        <div className={`time-slot-grid disabled ${className}`}>
          <div className="disabled-message">Selection unavailable</div>
        </div>
      );
    }

    return (
      <div className={`time-slot-grid ${className}`}>
        <div className="grid-body" role="listbox" data-col-count={colCount}>
          {rows.map((row, rowIndex) => {
            const isEvenRow = rowIndex % 2 === 0;
            return (
              <div
                key={rowIndex}
                className={`time-row ${isEvenRow ? 'even-row' : 'odd-row'}`}
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
              >
                {row.map((item) => {
                  const isSelected = selectedValue === item.value;
                  const isHighlighted = highlightedValue === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`time-slot ${isSelected ? 'selected' : ''} ${isHighlighted ? 'first-match' : ''}`}
                      onClick={() => handleItemClick(item)}
                      onKeyDown={handleGridKeyDown}
                      title={item.label}
                      aria-label={`Select ${item.label}`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="scroll-indicator">
          <span>Scroll for more</span>
        </div>
      </div>
    );
  }

  // --- Time slots mode (existing behavior) ---

  // Parse time string to get hour and minute
  const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
  };

  // Format time to 24-hour string format
  const formatTime24 = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Format time for display (12-hour format) - compact for grid display
  const formatTime12 = (hour, minute) => {
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const minuteStr = minute.toString().padStart(2, '0');
    // More compact format to fit AM/PM on same line, remove leading zero and space
    return minute === 0 ? `${hour12}${ampm}` : `${hour12}:${minuteStr}${ampm}`;
  };

  // Generate all time slots within the range
  const generateTimeSlots = () => {
    const minHour = parseTime(minTime).hour;
    const minMinute = parseTime(minTime).minute;
    const maxHour = parseTime(maxTime).hour;
    const maxMinute = parseTime(maxTime).minute;

    const slots = [];
    const minutes = [0, 15, 30, 45];

    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute of minutes) {
        const timeInMinutes = hour * 60 + minute;
        const minTimeInMinutes = minHour * 60 + minMinute;
        const maxTimeInMinutes = maxHour * 60 + maxMinute;

        // Only include times within the specified range
        if (timeInMinutes >= minTimeInMinutes && timeInMinutes <= maxTimeInMinutes) {
          slots.push({ hour, minute });
        }
      }
    }

    return slots;
  };

  // Group time slots by hour for row-based display
  const groupSlotsByHour = () => {
    const slots = generateTimeSlots();
    const grouped = {};

    slots.forEach(({ hour, minute }) => {
      if (!grouped[hour]) {
        grouped[hour] = [];
      }
      grouped[hour].push(minute);
    });

    return grouped;
  };

  // Check if a time slot is selected
  const isTimeSlotSelected = (hour, minute) => {
    const timeValue = formatTime24(hour, minute);
    return value === timeValue;
  };

  // Handle time slot selection
  const handleTimeSlotClick = (hour, minute) => {
    if (disabled) return;

    const timeValue = formatTime24(hour, minute);
    onChange(timeValue);
  };

  const groupedSlots = groupSlotsByHour();
  let hours = Object.keys(groupedSlots).map(Number).sort((a, b) => a - b);

  // Filter time slots by filterText when provided
  const normalizedFilter = filterText.trim().toLowerCase();
  let filteredGroupedSlots = groupedSlots;
  if (normalizedFilter) {
    filteredGroupedSlots = {};
    hours.forEach(hour => {
      const matchingMinutes = groupedSlots[hour].filter(minute => {
        const display = formatTime12(hour, minute).toLowerCase();
        return display.includes(normalizedFilter);
      });
      if (matchingMinutes.length > 0) {
        filteredGroupedSlots[hour] = matchingMinutes;
      }
    });
    hours = Object.keys(filteredGroupedSlots).map(Number).sort((a, b) => a - b);
  }

  if (disabled) {
    return (
      <div className={`time-slot-grid disabled ${className}`}>
        <div className="disabled-message">Time selection unavailable</div>
      </div>
    );
  }

  if (normalizedFilter && hours.length === 0) {
    return (
      <div className={`time-slot-grid ${className}`}>
        <div className="grid-body">
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            No matches
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`time-slot-grid ${className}`}>
      {/* Time slot grid - no headers, just the grid */}
      <div className="grid-body" role="listbox" data-col-count="4">
        {hours.map((hour, hourIndex) => {
          const availableMinutes = filteredGroupedSlots[hour];
          const allMinutes = normalizedFilter ? availableMinutes : [0, 15, 30, 45];
          const isEvenRow = hourIndex % 2 === 0;

          return (
            <div key={hour} className={`time-row ${isEvenRow ? 'even-row' : 'odd-row'}`}>
              {/* Time slot buttons - each contains the full time */}
              {allMinutes.map(minute => {
                const isAvailable = availableMinutes.includes(minute);
                const isSelected = isAvailable && isTimeSlotSelected(hour, minute);
                const isHighlighted = isAvailable && highlightedValue === formatTime24(hour, minute);
                const timeDisplay = formatTime12(hour, minute);

                return (
                  <button
                    key={`${hour}:${minute}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`time-slot ${isSelected ? 'selected' : ''} ${isHighlighted ? 'first-match' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                    onClick={() => isAvailable && handleTimeSlotClick(hour, minute)}
                    onKeyDown={handleGridKeyDown}
                    disabled={!isAvailable}
                    title={isAvailable ? timeDisplay : 'Time not available'}
                    aria-label={isAvailable ? `Select ${timeDisplay}` : 'Time not available'}
                  >
                    {isAvailable ? timeDisplay : ''}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span>Scroll for more times</span>
      </div>
    </div>
  );
};

export default TimeSlotGrid;
