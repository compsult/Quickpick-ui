import React, { useState, useRef, useEffect, useCallback } from 'react';
import TimeSlotGrid from './TimeSlotGrid';
import './BusinessHoursTimeSelector.css';

// Detect touch device - true if primary input is touch (no hover)
const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const BusinessHoursTimeSelector = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  disabled = false,
  className = ''
}) => {
  const [activeSelector, setActiveSelector] = useState(null); // 'start' or 'end'
  const hoverTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const startButtonRef = useRef(null);
  const endButtonRef = useRef(null);
  const mouseTrackingIntervalRef = useRef(null);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const [popupPosition, setPopupPosition] = useState({ top: '100%', left: '0', transform: 'none' });

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':').map(Number);
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const minuteStr = minute.toString().padStart(2, '0');
    return minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${minuteStr} ${ampm}`;
  };

  const handleTimeChange = (newTime) => {
    if (activeSelector === 'start') {
      onStartTimeChange(newTime);
    } else if (activeSelector === 'end') {
      onEndTimeChange(newTime);
    }
    // Auto-close after selection
    setActiveSelector(null);
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const closeSelector = () => {
    setActiveSelector(null);
  };

  const calculatePopupPosition = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Popup dimensions (approximate)
    const popupHeight = 400; // max-height from CSS
    const popupWidth = 340; // min-width from CSS

    let position = {
      top: '100%',
      left: '0',
      transform: 'none'
    };

    // Check if popup would extend below viewport
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    if (spaceBelow < popupHeight && spaceAbove > popupHeight) {
      // Show above the container with overlap
      position.top = 'auto';
      position.bottom = 'calc(100% - 4px)'; // 4px overlap
    } else {
      // Show below the container (default) with overlap
      position.top = 'calc(100% - 4px)'; // 4px overlap
    }

    // Check horizontal positioning
    const spaceRight = viewportWidth - containerRect.left;
    const spaceLeft = containerRect.right;

    if (spaceRight < popupWidth && spaceLeft > popupWidth) {
      // Align to right edge
      position.left = 'auto';
      position.right = '0';
    } else if (containerRect.left + popupWidth > viewportWidth) {
      // Center or adjust to fit
      const overflow = (containerRect.left + popupWidth) - viewportWidth;
      position.transform = `translateX(-${overflow + 10}px)`;
    }

    setPopupPosition(position);
  }, []);


  // Calculate position when popup becomes active
  useEffect(() => {
    if (activeSelector) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        calculatePopupPosition();
      }, 10);
    }
  }, [activeSelector, calculatePopupPosition]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeSelector) {
        calculatePopupPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSelector, calculatePopupPosition]);


  // Click handler for touch devices (and works as fallback on desktop)
  const handleButtonClick = (selectorType) => {
    // Toggle: if already active, close; otherwise open
    setActiveSelector(prev => prev === selectorType ? null : selectorType);
  };

  // Hover open for desktop only
  const handleButtonMouseEnter = (selectorType) => {
    if (isTouchDevice()) return;

    // Kill any existing mouse tracking so it can't race and reset us
    stopMouseTracking();

    // Clear any pending switch timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (activeSelector === null) {
      // Nothing open yet — open immediately
      setActiveSelector(selectorType);
    } else if (activeSelector !== selectorType) {
      // Switching between buttons — short delay to prevent accidental context switch
      hoverTimeoutRef.current = setTimeout(() => {
        hoverTimeoutRef.current = null;
        setActiveSelector(selectorType);
      }, 150);
    }
  };

  const handlePopupMouseEnter = () => {
    if (isTouchDevice()) return;

    // Clear any pending hide timeout when entering popup
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const isMouseOverRelevantArea = useCallback((mouseX, mouseY) => {
    const popup = popupRef.current;

    // Check BOTH buttons — moving between them should not close the popup
    const buttons = [startButtonRef.current, endButtonRef.current];
    for (const btn of buttons) {
      if (!btn) continue;
      const rect = btn.getBoundingClientRect();
      if (mouseX >= rect.left && mouseX <= rect.right &&
          mouseY >= rect.top && mouseY <= rect.bottom) {
        return true;
      }
    }

    // Check if mouse is over the popup
    if (popup) {
      const popupRect = popup.getBoundingClientRect();
      if (mouseX >= popupRect.left && mouseX <= popupRect.right &&
          mouseY >= popupRect.top && mouseY <= popupRect.bottom) {
        return true;
      }
    }

    return false;
  }, []);

  const stopMouseTracking = useCallback(() => {
    if (mouseTrackingIntervalRef.current) {
      clearInterval(mouseTrackingIntervalRef.current);
      mouseTrackingIntervalRef.current = null;
    }
  }, []);

  const startMouseTracking = useCallback(() => {
    // Skip mouse tracking on touch devices
    if (isTouchDevice()) return;

    if (mouseTrackingIntervalRef.current) {
      clearInterval(mouseTrackingIntervalRef.current);
    }

    mouseTrackingIntervalRef.current = setInterval(() => {
      const { x, y } = lastMousePositionRef.current;
      if (!isMouseOverRelevantArea(x, y)) {
        setActiveSelector(null);
        stopMouseTracking();
      }
    }, 100); // Check every 100ms
  }, [isMouseOverRelevantArea, stopMouseTracking]);

  const handleGlobalMouseMove = (event) => {
    lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
  };

  // Set up global mouse tracking when component mounts (desktop only)
  useEffect(() => {
    if (isTouchDevice()) return;

    document.addEventListener('mousemove', handleGlobalMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      stopMouseTracking();
    };
  }, [stopMouseTracking]);

  // Start/stop mouse tracking when popup opens/closes (desktop only)
  useEffect(() => {
    if (isTouchDevice()) return;

    if (activeSelector) {
      startMouseTracking();
    } else {
      stopMouseTracking();
    }
  }, [activeSelector, startMouseTracking, stopMouseTracking]);

  if (disabled) {
    return (
      <div className={`business-hours-time-selector disabled ${className}`}>
        <span className="unavailable-text">Unavailable</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`business-hours-time-selector ${className}`}
    >
      {/* Time input buttons */}
      <div className="time-inputs-row">
        <button
          ref={startButtonRef}
          type="button"
          className={`time-input-button ${activeSelector === 'start' ? 'active' : ''}`}
          onClick={() => handleButtonClick('start')}
          onMouseEnter={activeSelector === 'start' ? undefined : () => handleButtonMouseEnter('start')}
        >
          <span className="time-value">{formatTime12Hour(startTime) || 'Select Start'}</span>
        </button>

        <button
          ref={endButtonRef}
          type="button"
          className={`time-input-button ${activeSelector === 'end' ? 'active' : ''}`}
          onClick={() => handleButtonClick('end')}
          onMouseEnter={activeSelector === 'end' ? undefined : () => handleButtonMouseEnter('end')}
        >
          <span className="time-value">{formatTime12Hour(endTime) || 'Select End'}</span>
        </button>
      </div>

      {/* Grid time selector */}
      {activeSelector && (
        <div
          ref={popupRef}
          className="time-selector-popup"
          onMouseEnter={handlePopupMouseEnter}
          style={{
            position: 'absolute',
            top: popupPosition.top,
            bottom: popupPosition.bottom,
            left: popupPosition.left,
            right: popupPosition.right,
            marginTop: popupPosition.marginTop,
            marginBottom: popupPosition.marginBottom,
            transform: popupPosition.transform
          }}
        >
          <div className="popup-scroll-area">
            <div className="popup-header">
              <h4>Select {activeSelector === 'start' ? 'Start' : 'End'} Time</h4>
            </div>

            <TimeSlotGrid
              value={activeSelector === 'start' ? startTime : endTime}
              onChange={handleTimeChange}
              minTime={activeSelector === 'start' ? '06:00' : startTime}
              maxTime={activeSelector === 'end' ? '22:00' : endTime}
              showHeader={false}
            />
          </div>
        </div>
      )}

      {/* Backdrop to close popup — touch devices only; desktop uses mouse tracking */}
      {activeSelector && isTouchDevice() && (
        <div
          className="selector-backdrop"
          onClick={closeSelector}
        />
      )}
    </div>
  );
};

export default BusinessHoursTimeSelector;
