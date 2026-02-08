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
  selectedValue = null
}) => {
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
        <div className="grid-body">
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
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`time-slot ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleItemClick(item)}
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
  const hours = Object.keys(groupedSlots).map(Number).sort((a, b) => a - b);

  if (disabled) {
    return (
      <div className={`time-slot-grid disabled ${className}`}>
        <div className="disabled-message">Time selection unavailable</div>
      </div>
    );
  }

  return (
    <div className={`time-slot-grid ${className}`}>
      {/* Time slot grid - no headers, just the grid */}
      <div className="grid-body">
        {hours.map((hour, hourIndex) => {
          const availableMinutes = groupedSlots[hour];
          const allMinutes = [0, 15, 30, 45];
          const isEvenRow = hourIndex % 2 === 0;

          return (
            <div key={hour} className={`time-row ${isEvenRow ? 'even-row' : 'odd-row'}`}>
              {/* Time slot buttons - each contains the full time */}
              {allMinutes.map(minute => {
                const isAvailable = availableMinutes.includes(minute);
                const isSelected = isAvailable && isTimeSlotSelected(hour, minute);
                const timeDisplay = formatTime12(hour, minute);

                return (
                  <button
                    key={`${hour}:${minute}`}
                    type="button"
                    className={`time-slot ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                    onClick={() => isAvailable && handleTimeSlotClick(hour, minute)}
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
