import React from 'react';
import './GridTimeSelector.css';

const GridTimeSelector = ({
  value,
  onChange,
  minTime = '06:00',
  maxTime = '22:00',
  disabled = false,
  className = ''
}) => {
  // Parse time string to get hour and minute
  const parseTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':').map(Number);
    return { hour, minute };
  };

  // Format time to 24-hour string format
  const formatTime24 = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  // Format time for display (12-hour format)
  const formatTime12 = (hour, minute) => {
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const minuteStr = minute.toString().padStart(2, '0');
    return minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${minuteStr} ${ampm}`;
  };

  // Generate hour range based on min/max times
  const generateHours = () => {
    const minHour = parseTime(minTime).hour;
    const maxHour = parseTime(maxTime).hour;
    const hours = [];

    for (let h = minHour; h <= maxHour; h++) {
      hours.push(h);
    }
    return hours;
  };

  // Check if a time slot should be available
  const isTimeSlotAvailable = (hour, minute) => {
    const timeValue = formatTime24(hour, minute);
    return timeValue >= minTime && timeValue <= maxTime;
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
    if (isTimeSlotAvailable(hour, minute)) {
      onChange(timeValue);
    }
  };

  const hours = generateHours();
  const minutes = [0, 15, 30, 45]; // Quarter-hour increments

  if (disabled) {
    return (
      <div className={`grid-time-selector disabled ${className}`}>
        <div className="disabled-message">Time selection unavailable</div>
      </div>
    );
  }

  return (
    <div className={`grid-time-selector ${className}`}>
      <div className="time-grid">
        {/* Hour labels column */}
        <div className="hour-labels">
          <div className="header-spacer"></div>
          {hours.map(hour => (
            <div key={hour} className="hour-label">
              {formatTime12(hour, 0)}
            </div>
          ))}
        </div>

        {/* Minute columns */}
        <div className="minute-columns">
          {/* Minute headers */}
          <div className="minute-headers">
            {minutes.map(minute => (
              <div key={minute} className="minute-header">
                :{minute.toString().padStart(2, '0')}
              </div>
            ))}
          </div>

          {/* Time slot grid */}
          <div className="time-slots">
            {hours.map(hour => (
              <div key={hour} className="hour-row">
                {minutes.map(minute => {
                  const available = isTimeSlotAvailable(hour, minute);
                  const selected = isTimeSlotSelected(hour, minute);

                  return (
                    <button
                      key={`${hour}:${minute}`}
                      className={`time-slot ${selected ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                      onClick={() => handleTimeSlotClick(hour, minute)}
                      disabled={!available}
                      title={formatTime12(hour, minute)}
                      aria-label={`Select ${formatTime12(hour, minute)}`}
                    >
                      {minute === 0 ? '' : minute.toString().padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected time display */}
      {value && (
        <div className="selected-time">
          Selected: <strong>{formatTime12(...Object.values(parseTime(value)))}</strong>
        </div>
      )}
    </div>
  );
};

export default GridTimeSelector;
