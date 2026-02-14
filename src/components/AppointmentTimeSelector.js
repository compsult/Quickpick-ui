import React, { useState, useRef, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import TimeSlotGrid from './TimeSlotGrid';
import './AppointmentTimeSelector.css';

// Detect touch device - true if primary input is touch (no hover)
const isTouchDevice = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const AppointmentTimeSelector = ({
  selectedTime,
  onTimeChange,
  selectedDate,
  businessHours,
  disabled = false,
  loading = false,
  className = '',
  popupWidth = 'auto',  // 'auto' | 'match-button' | CSS value (e.g. '350px')
  width = null,         // CSS value for trigger+popup width (e.g. '400px', '100%'); null = match popup
  items = null,
  selectedValue = null,
  placeholder = null,
  columns = null,
  label = null,
  autoSelectOnTab = false
}) => {
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [popupShowing, setPopupShowing] = useState(false);
  const popupId = useRef('qp-popup-' + Math.random().toString(36).slice(2, 8)).current;
  const hoverTimeoutRef = useRef(null);
  const popupCloseTimerRef = useRef(null);
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);
  const interactedRef = useRef(false);       // tracks user typing/navigating for autoSelectOnTab
  const tabbingOutRef = useRef(false);       // prevents trigger onFocus from re-opening during tab-out
  const inputFocusedRef = useRef(false);    // ref copy for mouse-tracking interval
  const mouseTrackingIntervalRef = useRef(null);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  // Build default position based on popupWidth mode
  const getDefaultPosition = useCallback(() => {
    const base = { top: '100%', left: '0', transform: 'none' };
    if (popupWidth === 'match-button') {
      base.right = '0'; // stretch to button width
    } else if (popupWidth !== 'auto') {
      base.width = popupWidth; // explicit CSS value
    }
    return base;
  }, [popupWidth]);
  const [popupPosition, setPopupPosition] = useState(getDefaultPosition);

  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':').map(Number);
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const minuteStr = minute.toString().padStart(2, '0');
    return minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${minuteStr} ${ampm}`;
  };

  // Get business hours for the selected date
  const getBusinessHoursForDate = () => {
    if (!selectedDate || !businessHours) {
      return { minTime: '08:00', maxTime: '17:00' };
    }

    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const dayConfig = businessHours[dayOfWeek];

    if (!dayConfig || !dayConfig.enabled) {
      return { minTime: '08:00', maxTime: '17:00' };
    }

    return {
      minTime: dayConfig.start || '08:00',
      maxTime: dayConfig.end || '17:00'
    };
  };

  const { minTime, maxTime } = getBusinessHoursForDate();

  const isItemsMode = items && items.length > 0;
  const hasValue = isItemsMode ? !!selectedValue : !!selectedTime;

  const handleClear = (e) => {
    e.stopPropagation();
    onTimeChange(isItemsMode ? { value: null, label: null } : null);
  };

  // Clear filter when popup closes
  useEffect(() => {
    if (!isGridOpen) {
      setFilterText('');
    }
  }, [isGridOpen]);

  // Manage popup mount/unmount with exit animation delay
  useEffect(() => {
    if (isGridOpen) {
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
  }, [isGridOpen]);

  // Get filtered items for items mode
  const getFilteredItems = useCallback(() => {
    if (!isItemsMode || !filterText.trim()) return items;
    const normalized = filterText.trim().toLowerCase();
    return items.filter(item => item.label.toLowerCase().includes(normalized));
  }, [isItemsMode, items, filterText]);

  // Get first matching result for Enter key
  const getFirstMatch = useCallback(() => {
    if (isItemsMode) {
      const filtered = getFilteredItems();
      return filtered.length > 0 ? filtered[0] : null;
    }
    // Time mode: find first slot matching filter
    if (!filterText.trim()) return null;
    const normalized = filterText.trim().toLowerCase();
    const minHour = minTime.split(':').map(Number)[0];
    const minMinute = minTime.split(':').map(Number)[1];
    const maxHour = maxTime.split(':').map(Number)[0];
    const maxMinute = maxTime.split(':').map(Number)[1];
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
  }, [isItemsMode, getFilteredItems, filterText, minTime, maxTime]);

  const handleTimeSelect = (newTime) => {
    onTimeChange(newTime);
    // Auto-close after selection
    setIsGridOpen(false);
    setFilterText('');
    // Blur input after selection
    if (inputRef.current) inputRef.current.blur();
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const calculatePopupPosition = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Popup dimensions (approximate)
    const popupHeight = 400; // max-height from CSS
    const estimatedPopupWidth = popupWidth === 'match-button'
      ? containerRect.width
      : popupWidth !== 'auto' ? parseInt(popupWidth, 10) || 340 : 340;

    let position = getDefaultPosition();

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

    // Check horizontal positioning (skip for match-button mode since it stretches)
    if (popupWidth !== 'match-button') {
      const spaceRight = viewportWidth - containerRect.left;

      if (containerRect.left + estimatedPopupWidth > viewportWidth) {
        if (spaceRight < estimatedPopupWidth) {
          // Align to right edge of button instead of left
          position.left = 'auto';
          position.right = '0';
        } else {
          const overflow = (containerRect.left + estimatedPopupWidth) - viewportWidth;
          position.transform = `translateX(-${overflow + 10}px)`;
        }
      }
    }

    setPopupPosition(position);
  }, [popupWidth, getDefaultPosition]);


  // Calculate position when popup becomes active
  useEffect(() => {
    if (isGridOpen) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        calculatePopupPosition();
      }, 10);
    }
  }, [isGridOpen, calculatePopupPosition]);

  // Scroll to selected item when popup opens
  useEffect(() => {
    if (!isGridOpen) return;
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
  }, [isGridOpen]);

  // Recalculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isGridOpen) {
        calculatePopupPosition();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isGridOpen, calculatePopupPosition]);


  // Click handler for touch devices (and works as fallback on desktop)
  const handleButtonClick = () => {
    setIsGridOpen(prev => !prev);
  };

  // Hover open for desktop only
  const handleButtonMouseEnter = () => {
    if (isTouchDevice()) return;

    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Show picker if not already open
    if (!isGridOpen) {
      setIsGridOpen(true);
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

  const handleBackdropClose = () => {
    setIsGridOpen(false);
  };

  const isMouseOverRelevantArea = useCallback((mouseX, mouseY) => {
    // Don't auto-close while the input is focused (user is typing)
    if (inputFocusedRef.current) return true;

    // Don't auto-close while a grid button has keyboard focus
    if (popupRef.current && popupRef.current.contains(document.activeElement)) return true;

    const button = buttonRef.current;
    const popup = popupRef.current;

    if (!button) return false;

    // Check if mouse is over the button
    const buttonRect = button.getBoundingClientRect();
    const isOverButton = mouseX >= buttonRect.left && mouseX <= buttonRect.right &&
                        mouseY >= buttonRect.top && mouseY <= buttonRect.bottom;

    if (isOverButton) return true;

    // Check if mouse is over the popup
    if (popup) {
      const popupRect = popup.getBoundingClientRect();
      const isOverPopup = mouseX >= popupRect.left && mouseX <= popupRect.right &&
                         mouseY >= popupRect.top && mouseY <= popupRect.bottom;
      if (isOverPopup) return true;
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
        setIsGridOpen(false);
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

    if (isGridOpen) {
      startMouseTracking();
    } else {
      stopMouseTracking();
    }
  }, [isGridOpen, startMouseTracking, stopMouseTracking]);

  const highlightedValue = filterText.trim()
    ? (isItemsMode ? getFilteredItems()[0]?.value ?? null : getFirstMatch())
    : null;

  if (loading) {
    return (
      <div className={`appointment-time-selector ${className}`} style={width ? { width } : undefined}>
        <div className="skeleton-trigger">
          {label && <span className="skeleton-label">{label}</span>}
          <div className="skeleton-bar" />
        </div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className={`appointment-time-selector disabled ${className}`}>
        <span className="disabled-text">Time selection unavailable</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`appointment-time-selector ${className}`}
      style={width ? { width } : undefined}
    >
      <div
        ref={buttonRef}
        className={`time-selector-trigger ${isGridOpen ? 'active' : ''}`}
        onClick={handleButtonClick}
        onMouseEnter={isGridOpen ? undefined : handleButtonMouseEnter}
        onFocus={autoSelectOnTab && !isTouchDevice() ? () => {
          if (!isGridOpen && !tabbingOutRef.current) {
            interactedRef.current = false;
            setIsGridOpen(true);
            setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 0);
          }
        } : undefined}
        role="combobox"
        aria-expanded={isGridOpen}
        aria-haspopup="listbox"
        aria-controls={popupShowing ? popupId : undefined}
        tabIndex={0}
      >
        <div className="time-selector-field">
          {label && <span className="time-selector-label">{label}</span>}
          <input
            ref={inputRef}
            type="text"
            readOnly={isTouchDevice()}
            className="time-selector-input"
            value={inputFocused
              ? filterText
              : isItemsMode
                ? (selectedValue
                  ? (items.find(i => i.value === selectedValue) || {}).label || selectedValue
                  : '')
                : (selectedTime ? formatTime12Hour(selectedTime) : '')}
            placeholder={placeholder
              || (isItemsMode
                ? (isTouchDevice() ? 'Select an option' : 'Type to search or select')
                : `${isTouchDevice() ? 'Select' : 'Type to search or select'}${selectedDate ? ' ' + selectedDate.toLocaleDateString('en-US', { weekday: 'long' }) : ''} time`)}
            tabIndex={-1}
            onClick={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
            onMouseDown={!isTouchDevice() ? (e) => e.stopPropagation() : undefined}
            onChange={!isTouchDevice() ? (e) => {
              interactedRef.current = true;
              setFilterText(e.target.value);
              if (!isGridOpen) setIsGridOpen(true);
            } : undefined}
            onFocus={!isTouchDevice() ? () => {
              inputFocusedRef.current = true;
              setInputFocused(true);
              if (!isGridOpen) setIsGridOpen(true);
            } : undefined}
            onBlur={!isTouchDevice() ? () => {
              inputFocusedRef.current = false;
              setInputFocused(false);
            } : undefined}
            onKeyDown={!isTouchDevice() ? (e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const match = getFirstMatch();
                if (match) handleTimeSelect(match);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setFilterText('');
                setIsGridOpen(false);
                if (inputRef.current) inputRef.current.blur();
              } else if (e.key === 'Tab') {
                if (autoSelectOnTab && !interactedRef.current && !hasValue) {
                  if (isItemsMode) {
                    if (items.length > 0) onTimeChange(items[0]);
                  } else {
                    onTimeChange(minTime);
                  }
                }
                // Close popup synchronously so it's removed from the DOM
                // before the browser's default Tab navigation runs.
                // Without this, the popup's presence causes Tab to jump to body.
                flushSync(() => {
                  setIsGridOpen(false);
                  setPopupShowing(false);
                  setFilterText('');
                });
                // Flag to prevent trigger's onFocus from re-opening the grid
                // when shadow DOM tab navigation wraps from input back to trigger.
                tabbingOutRef.current = true;
                setTimeout(() => { tabbingOutRef.current = false; }, 100);
              } else if (e.key === 'ArrowDown') {
                interactedRef.current = true;
                e.preventDefault();
                if (!isGridOpen) setIsGridOpen(true);
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
        {hasValue && !inputFocused && (
          <span className="clear-btn" onClick={handleClear}>×</span>
        )}
        <span className="dropdown-arrow">&#9660;</span>
      </div>

      {popupShowing && (
        <>
          {/* Backdrop for tap-to-close (touch only; desktop uses mouse-tracking) */}
          {isTouchDevice() && (
            <div
              className={`selector-backdrop ${!isGridOpen ? 'backdrop-closing' : ''}`}
              onClick={handleBackdropClose}
            />
          )}
          <div
            id={popupId}
            ref={popupRef}
            className={`time-grid-popup ${!isGridOpen ? 'popup-closing' : ''} ${(width || popupWidth !== 'auto') ? 'popup-stretch' : 'popup-auto'}`}
            onMouseEnter={handlePopupMouseEnter}
            style={{
              position: 'absolute',
              top: popupPosition.top,
              bottom: popupPosition.bottom,
              left: popupPosition.left,
              right: popupPosition.right,
              width: width ? '100%' : popupPosition.width,
              transform: popupPosition.transform
            }}
          >
            <div className="popup-scroll-area">
              {isItemsMode && getFilteredItems().length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                  No matches
                </div>
              ) : (
                <TimeSlotGrid
                  value={selectedTime}
                  onChange={handleTimeSelect}
                  minTime={minTime}
                  maxTime={maxTime}
                  showHeader={false}
                  className="appointment-grid"
                  items={isItemsMode ? getFilteredItems() : items}
                  columns={columns}
                  selectedValue={selectedValue}
                  filterText={isItemsMode ? '' : filterText}
                  highlightedValue={highlightedValue}
                  onNavigateOut={() => {
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  onEscape={() => {
                    setIsGridOpen(false);
                    setFilterText('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentTimeSelector;
