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
  loading = false,
  className = '',
  width = null          // CSS value for overall width (e.g. '400px', '100%'); null = 320px default
}) => {
  const [activeSelector, setActiveSelector] = useState(null); // 'start' or 'end'
  const [popupShowing, setPopupShowing] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const popupId = useRef('qp-bh-popup-' + Math.random().toString(36).slice(2, 8)).current;
  const hoverTimeoutRef = useRef(null);
  const popupCloseTimerRef = useRef(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const startButtonRef = useRef(null);
  const endButtonRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const inputFocusedRef = useRef(false);    // ref copy for mouse-tracking interval
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

  // Clear filter when popup closes or switches
  useEffect(() => {
    setFilterText('');
  }, [activeSelector]);

  // Manage popup mount/unmount with exit animation delay
  useEffect(() => {
    if (activeSelector) {
      if (popupCloseTimerRef.current) {
        clearTimeout(popupCloseTimerRef.current);
        popupCloseTimerRef.current = null;
      }
      setPopupShowing(true);
    } else {
      popupCloseTimerRef.current = setTimeout(() => {
        setPopupShowing(false);
        popupCloseTimerRef.current = null;
      }, 150);
    }
    return () => {
      if (popupCloseTimerRef.current) clearTimeout(popupCloseTimerRef.current);
    };
  }, [activeSelector]);

  // Get first matching time slot for Enter key
  const getFirstMatch = useCallback(() => {
    if (!filterText.trim()) return null;
    const normalized = filterText.trim().toLowerCase();
    const currentMinTime = activeSelector === 'start' ? '06:00' : startTime;
    const currentMaxTime = activeSelector === 'end' ? '22:00' : endTime;
    const minHour = parseInt(currentMinTime.split(':')[0], 10);
    const minMinute = parseInt(currentMinTime.split(':')[1], 10);
    const maxHour = parseInt(currentMaxTime.split(':')[0], 10);
    const maxMinute = parseInt(currentMaxTime.split(':')[1], 10);
    const minutes = [0, 15, 30, 45];
    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let minute of minutes) {
        const t = hour * 60 + minute;
        if (t < minHour * 60 + minMinute || t > maxHour * 60 + maxMinute) continue;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const minuteStr = minute.toString().padStart(2, '0');
        const display = (minute === 0 ? `${hour12}${ampm}` : `${hour12}:${minuteStr}${ampm}`).toLowerCase();
        if (display.includes(normalized)) {
          return `${hour.toString().padStart(2, '0')}:${minuteStr}`;
        }
      }
    }
    return null;
  }, [filterText, activeSelector, startTime, endTime]);

  const handleTimeChange = (newTime) => {
    if (activeSelector === 'start') {
      onStartTimeChange(newTime);
    } else if (activeSelector === 'end') {
      onEndTimeChange(newTime);
    }
    // Auto-close after selection
    setActiveSelector(null);
    setFilterText('');
    // Blur the active input
    const activeInput = activeSelector === 'start' ? startInputRef.current : endInputRef.current;
    if (activeInput) activeInput.blur();
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

  // Scroll to selected item when popup opens
  useEffect(() => {
    if (!activeSelector) return;
    const timer = setTimeout(() => {
      if (!popupRef.current) return;
      const gridBody = popupRef.current.querySelector('.grid-body');
      const selected = gridBody && gridBody.querySelector('.time-slot.selected');
      if (!gridBody || !selected) return;
      const selectedRect = selected.getBoundingClientRect();
      const gridRect = gridBody.getBoundingClientRect();
      gridBody.scrollTop += selectedRect.top - gridRect.top - gridBody.clientHeight / 2 + selectedRect.height / 2;
    }, 20);
    return () => clearTimeout(timer);
  }, [activeSelector]);

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
    // Don't auto-close while an input is focused (user is typing)
    if (inputFocusedRef.current) return true;

    // Don't auto-close while a grid button has keyboard focus
    if (popupRef.current && popupRef.current.contains(document.activeElement)) return true;

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

  const highlightedValue = filterText.trim() ? getFirstMatch() : null;

  if (loading) {
    return (
      <div className={`business-hours-time-selector ${className}`} style={width ? { width } : undefined}>
        <div className="time-inputs-row">
          <div className="skeleton-trigger">
            <span className="skeleton-label">Start Time</span>
            <div className="skeleton-bar" />
          </div>
          <span className="time-separator">to</span>
          <div className="skeleton-trigger">
            <span className="skeleton-label">End Time</span>
            <div className="skeleton-bar" />
          </div>
        </div>
      </div>
    );
  }

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
      style={width ? { width } : undefined}
    >
      {/* Time input triggers */}
      <div className="time-inputs-row">
        <div
          ref={startButtonRef}
          className={`time-input-trigger ${activeSelector === 'start' ? 'active' : ''}`}
          onClick={() => handleButtonClick('start')}
          onMouseEnter={activeSelector === 'start' ? undefined : () => handleButtonMouseEnter('start')}
          role="combobox"
          aria-expanded={activeSelector === 'start'}
          aria-haspopup="listbox"
          aria-controls={popupShowing && activeSelector === 'start' ? popupId : undefined}
          tabIndex={0}
        >
          <div className="time-input-field">
            <span className="time-input-label">Start Time</span>
            <input
              ref={startInputRef}
              type="text"
              readOnly={isTouchDevice()}
              className="time-input-value"
              value={inputFocused && activeSelector === 'start'
                ? filterText
                : formatTime12Hour(startTime)}
              placeholder="Select start"
              tabIndex={-1}
              onClick={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
              onMouseDown={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
              onChange={!isTouchDevice() ? (e) => {
                setFilterText(e.target.value);
                if (!activeSelector) setActiveSelector('start');
              } : undefined}
              onFocus={!isTouchDevice() ? () => {
                inputFocusedRef.current = true;
                setInputFocused(true);
                if (activeSelector !== 'start') setActiveSelector('start');
              } : undefined}
              onBlur={!isTouchDevice() ? () => {
                inputFocusedRef.current = false;
                setInputFocused(false);
              } : undefined}
              onKeyDown={!isTouchDevice() ? (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const match = getFirstMatch();
                  if (match) handleTimeChange(match);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setFilterText('');
                  setActiveSelector(null);
                  if (startInputRef.current) startInputRef.current.blur();
                } else if (e.key === 'Tab') {
                  setActiveSelector(null);
                  setFilterText('');
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (activeSelector !== 'start') setActiveSelector('start');
                  setTimeout(() => {
                    if (popupRef.current) {
                      const btn = popupRef.current.querySelector('button.time-slot:not(:disabled):not(.unavailable)');
                      if (btn) btn.focus();
                    }
                  }, 0);
                }
              } : undefined}
            />
          </div>
          <span className="dropdown-arrow">&#9660;</span>
        </div>

        <span className="time-separator">to</span>

        <div
          ref={endButtonRef}
          className={`time-input-trigger ${activeSelector === 'end' ? 'active' : ''}`}
          onClick={() => handleButtonClick('end')}
          onMouseEnter={activeSelector === 'end' ? undefined : () => handleButtonMouseEnter('end')}
          role="combobox"
          aria-expanded={activeSelector === 'end'}
          aria-haspopup="listbox"
          aria-controls={popupShowing && activeSelector === 'end' ? popupId : undefined}
          tabIndex={0}
        >
          <div className="time-input-field">
            <span className="time-input-label">End Time</span>
            <input
              ref={endInputRef}
              type="text"
              readOnly={isTouchDevice()}
              className="time-input-value"
              value={inputFocused && activeSelector === 'end'
                ? filterText
                : formatTime12Hour(endTime)}
              placeholder="Select end"
              tabIndex={-1}
              onClick={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
              onMouseDown={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
              onChange={!isTouchDevice() ? (e) => {
                setFilterText(e.target.value);
                if (!activeSelector) setActiveSelector('end');
              } : undefined}
              onFocus={!isTouchDevice() ? () => {
                inputFocusedRef.current = true;
                setInputFocused(true);
                if (activeSelector !== 'end') setActiveSelector('end');
              } : undefined}
              onBlur={!isTouchDevice() ? () => {
                inputFocusedRef.current = false;
                setInputFocused(false);
              } : undefined}
              onKeyDown={!isTouchDevice() ? (e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const match = getFirstMatch();
                  if (match) handleTimeChange(match);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  setFilterText('');
                  setActiveSelector(null);
                  if (endInputRef.current) endInputRef.current.blur();
                } else if (e.key === 'Tab') {
                  setActiveSelector(null);
                  setFilterText('');
                } else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  if (activeSelector !== 'end') setActiveSelector('end');
                  setTimeout(() => {
                    if (popupRef.current) {
                      const btn = popupRef.current.querySelector('button.time-slot:not(:disabled):not(.unavailable)');
                      if (btn) btn.focus();
                    }
                  }, 0);
                }
              } : undefined}
            />
          </div>
          <span className="dropdown-arrow">&#9660;</span>
        </div>
      </div>

      {/* Grid time selector */}
      {popupShowing && (
        <>
          {/* Backdrop for tap-to-close (touch only; desktop uses mouse-tracking) */}
          {isTouchDevice() && (
            <div
              className={`selector-backdrop ${!activeSelector ? 'backdrop-closing' : ''}`}
              onClick={closeSelector}
            />
          )}
          <div
            id={popupId}
            ref={popupRef}
            className={`time-selector-popup ${!activeSelector ? 'popup-closing' : ''}`}
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
                filterText={filterText}
                highlightedValue={highlightedValue}
                onNavigateOut={() => {
                  const ref = activeSelector === 'start' ? startInputRef : endInputRef;
                  if (ref.current) ref.current.focus();
                }}
                onEscape={() => {
                  const ref = activeSelector === 'start' ? startInputRef : endInputRef;
                  setActiveSelector(null);
                  setFilterText('');
                  if (ref.current) ref.current.focus();
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessHoursTimeSelector;
