// Aggregates all component CSS as strings for Shadow DOM injection.
// We inline the CSS here so Rollup doesn't need a CSS plugin — the styles
// live inside the shadow root and never leak to the host page.

export const timeSlotGridCSS = `/* Time Slot Grid Styles - Matching the JPG Layout */
.time-slot-grid {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-height: 400px;
  width: 100%;
  min-width: 320px;
  max-width: 450px;
}

.time-slot-grid.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.disabled-message {
  padding: 40px 20px;
  text-align: center;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
}

.grid-body {
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.time-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(75px, 1fr));
  gap: 2px;
  transition: all 0.1s ease;
}

.time-row.even-row {
  background: #f8fffe;
}

.time-row.odd-row {
  background: white;
}

.time-row:hover {
  background: #f0fdfa !important;
}

.time-slot {
  padding: 10px 6px;
  border: 1px solid #e5e7eb;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: center;
  line-height: 1.2;
  min-height: 38px;
  min-width: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  margin: 1px;
  white-space: nowrap;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 150, 136, 0.2);
}

.time-slot:hover:not(:disabled) {
  background: #e0f7fa;
  color: #00695c;
  border-color: #4db6ac;
}

.time-slot:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  z-index: 1;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.time-slot:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
}

.time-slot.selected {
  background: #b2dfdb;
  color: #004d40;
  font-weight: 600;
  border-color: #26a69a;
  box-shadow: inset 0 1px 3px rgba(0, 77, 64, 0.2);
}

.time-slot.selected:hover {
  background: #80cbc4;
  color: #00251a;
}

.time-slot.first-match {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1e40af;
}

.time-slot.unavailable {
  background: transparent;
  color: transparent;
  cursor: not-allowed;
  border-color: transparent;
}

.time-slot:disabled {
  cursor: not-allowed;
}

.scroll-indicator {
  padding: 6px;
  text-align: center;
  font-size: 10px;
  color: #6b7280;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-style: italic;
}

.grid-body::-webkit-scrollbar {
  width: 6px;
}

.grid-body::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.grid-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.grid-body::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@media (max-width: 768px) {
  .time-slot-grid {
    max-width: 100%;
    min-width: 300px;
  }
  .time-row {
    grid-template-columns: repeat(4, minmax(70px, 1fr));
  }
  .time-slot {
    padding: 8px 2px;
    font-size: 13px;
    min-height: 32px;
    min-width: 70px;
  }
}

@media (max-width: 480px) {
  .time-slot-grid {
    min-width: 100%;
    max-width: 100%;
  }
  .time-row {
    grid-template-columns: repeat(3, 1fr);
  }
  .time-slot {
    font-size: 16px;
    min-height: 48px;
    min-width: 48px;
    padding: 12px 8px;
  }
  .grid-body {
    max-height: 300px;
  }
}

@media (prefers-contrast: high) {
  .time-slot {
    border: 2px solid #999;
  }
  .time-slot.selected {
    border: 3px solid #000;
  }
}

@media (prefers-reduced-motion: reduce) {
  .time-slot,
  .time-row {
    transition: none;
  }
}

.time-slot-grid.dense {
  max-height: 300px;
}

.time-slot-grid.dense .time-slot {
  min-height: 24px;
  padding: 4px 1px;
  font-size: 9px;
}`;

export const appointmentCSS = `/* Appointment Time Selector Styles */
.appointment-time-selector {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  position: relative;
  display: inline-block;
  width: 320px;
}

.appointment-time-selector.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.disabled-text {
  padding: 8px 12px;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: inline-block;
}

/* Trigger — underlined input with tappable area */
.time-selector-trigger {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  cursor: pointer;
  width: 100%;
  padding: 8px 12px 6px;
  background: #f8fafc;
  border-radius: 6px 6px 0 0;
  transition: background 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
}

.time-selector-trigger:hover {
  background: #f1f5f9;
}

.time-selector-trigger.active {
  background: #eff6ff;
}

/* Disable mouse events on children to prevent interference */
.time-selector-trigger * {
  pointer-events: none;
}

/* Desktop: re-enable pointer-events on the input so it is typeable */
@media (hover: hover) {
  .time-selector-trigger .time-selector-input {
    pointer-events: auto;
    cursor: text;
  }
}

/* Field wrapper — stacks label above input */
.time-selector-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* Persistent label above the input */
.time-selector-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 2px;
  transition: color 0.2s ease;
  line-height: 1;
}

.time-selector-trigger.active .time-selector-label {
  color: #3b82f6;
}

/* The readonly text input */
.time-selector-input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #cbd5e1;
  background: transparent;
  padding: 6px 0;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  color: #1f2937;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 0;
}

.time-selector-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.time-selector-trigger:hover .time-selector-input {
  border-bottom-color: #3b82f6;
}

.time-selector-trigger.active .time-selector-input {
  border-bottom-color: #3b82f6;
}

.time-selector-trigger:focus {
  outline: none;
}

.time-selector-trigger:focus .time-selector-input {
  border-bottom-color: #3b82f6;
}

.time-selector-trigger:focus .time-selector-label {
  color: #3b82f6;
}

/* Clear button */
.clear-btn {
  font-size: 16px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 2px 6px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.15s ease;
  pointer-events: auto;
}

.clear-btn:hover {
  color: #ef4444;
}

/* Dropdown arrow */
.dropdown-arrow {
  font-size: 12px;
  color: #94a3b8;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  padding-bottom: 8px;
}

.time-selector-trigger.active .dropdown-arrow {
  transform: rotate(180deg);
  color: #3b82f6;
}

.time-selector-trigger:hover .dropdown-arrow {
  color: #3b82f6;
}

/* Popup entrance/exit keyframes */
@keyframes qp-popup-enter {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes qp-popup-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-6px); }
}

@keyframes qp-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes qp-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

/* Time grid popup — outer shell with border/shadow, clips content */
.time-grid-popup {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
  min-width: 100%;
  animation: qp-popup-enter 150ms ease;
}

.time-grid-popup.popup-closing {
  animation: qp-popup-exit 150ms ease forwards;
  pointer-events: none;
}

.popup-scroll-area {
  max-height: 400px;
  overflow: hidden;
}

.time-grid-popup .time-slot-grid {
  width: auto;
  min-width: 320px;
  max-width: 450px;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.time-grid-popup .scroll-indicator {
  display: none;
}

.time-grid-popup.popup-auto .time-slot-grid {
  width: auto;
  min-width: 320px;
  max-width: 450px;
}

.time-grid-popup.popup-stretch .time-slot-grid {
  min-width: 0;
  max-width: 100%;
  width: 100%;
}

.time-grid-popup.popup-stretch .time-row {
  grid-template-columns: repeat(4, 1fr);
}

.time-grid-popup.popup-stretch .time-slot {
  min-width: 0;
}

/* Sticky header */
.appointment-time-selector .popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 8px 8px 0 0;
  color: white;
  position: sticky;
  top: 0;
  z-index: 2;
}

.appointment-time-selector .popup-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Backdrop */
.selector-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 999;
  touch-action: manipulation;
  animation: qp-fade-in 150ms ease;
}

.selector-backdrop.backdrop-closing {
  animation: qp-fade-out 150ms ease forwards;
  pointer-events: none;
}

@media (hover: none) {
  .selector-backdrop {
    background: rgba(0, 0, 0, 0.15);
  }
  .time-selector-trigger {
    background: #f1f5f9;
    padding: 10px 14px 8px;
  }
}

@media (max-width: 768px) {
  .time-grid-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: 90vw;
    max-width: 350px;
    min-width: 0;
    margin-top: 0;
  }
  .appointment-time-selector {
    width: 100%;
  }
  .dropdown-arrow {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .time-grid-popup {
    width: 95vw;
    max-width: none;
  }
  .time-selector-trigger {
    padding: 10px 14px 8px;
  }
  .time-selector-input {
    font-size: 16px;
    padding: 8px 0;
    min-height: 44px;
  }
  .dropdown-arrow {
    font-size: 16px;
  }
  .time-selector-label {
    font-size: 13px;
  }
  .popup-header {
    padding: 14px 16px;
  }
}

/* Skeleton loading state */
@keyframes qp-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

.appointment-time-selector .skeleton-trigger {
  padding: 8px 12px 6px;
  background: #f8fafc;
  border-radius: 6px 6px 0 0;
}

.appointment-time-selector .skeleton-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 2px;
}

.appointment-time-selector .skeleton-bar {
  height: 28px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 400px 100%;
  animation: qp-shimmer 1.5s ease infinite;
  border-bottom: 2px solid #e2e8f0;
}

@media (prefers-reduced-motion: reduce) {
  .time-grid-popup,
  .time-grid-popup.popup-closing,
  .selector-backdrop,
  .selector-backdrop.backdrop-closing {
    animation: none;
  }

  .appointment-time-selector .skeleton-bar {
    animation: none;
  }
}`;

export const businessHoursCSS = `/* Business Hours Time Selector Styles */
.business-hours-time-selector {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 8px 0;
  display: inline-block;
  width: 320px;
}

.business-hours-time-selector.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.unavailable-text {
  padding: 8px 12px;
  color: #6b7280;
  font-style: italic;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  display: inline-block;
}

.time-inputs-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.time-separator {
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  padding-bottom: 10px;
}

.time-input-trigger {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  padding: 8px 12px 6px;
  background: #f8fafc;
  border-radius: 6px 6px 0 0;
  transition: background 0.2s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
}

.time-input-trigger:hover {
  background: #f1f5f9;
}

.time-input-trigger.active {
  background: #eef2ff;
}

.time-input-trigger * {
  pointer-events: none;
}

/* Desktop: re-enable pointer-events on the input so it is typeable */
@media (hover: hover) {
  .time-input-trigger .time-input-value {
    pointer-events: auto;
    cursor: text;
  }
}

.time-input-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.time-input-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 2px;
  transition: color 0.2s ease;
  line-height: 1;
}

.time-input-trigger.active .time-input-label {
  color: #667eea;
}

.time-input-value {
  width: 100%;
  border: none;
  border-bottom: 2px solid #cbd5e1;
  background: transparent;
  padding: 6px 0;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  color: #1f2937;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
  min-width: 0;
}

.time-input-value::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.time-input-trigger:hover .time-input-value {
  border-bottom-color: #667eea;
}

.time-input-trigger.active .time-input-value {
  border-bottom-color: #667eea;
}

.time-input-trigger:focus {
  outline: none;
}

.time-input-trigger:focus .time-input-value {
  border-bottom-color: #667eea;
}

.time-input-trigger:focus .time-input-label {
  color: #667eea;
}

.business-hours-time-selector .dropdown-arrow {
  font-size: 12px;
  color: #94a3b8;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  padding-bottom: 8px;
}

.time-input-trigger.active .dropdown-arrow {
  transform: rotate(180deg);
  color: #667eea;
}

.time-input-trigger:hover .dropdown-arrow {
  color: #667eea;
}

@keyframes qp-popup-enter {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes qp-popup-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-6px); }
}

@keyframes qp-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes qp-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}

.time-selector-popup {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  max-height: 420px;
  overflow: hidden;
  min-width: 100%;
  animation: qp-popup-enter 150ms ease;
}

.time-selector-popup.popup-closing {
  animation: qp-popup-exit 150ms ease forwards;
  pointer-events: none;
}

.time-selector-popup .popup-scroll-area {
  max-height: 420px;
  overflow: hidden;
}

.time-selector-popup .time-slot-grid {
  width: auto;
  min-width: 320px;
  max-width: 450px;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.time-selector-popup .scroll-indicator {
  display: none;
}

.business-hours-time-selector .popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px 8px 0 0;
  color: white;
  position: sticky;
  top: 0;
  z-index: 2;
}

.business-hours-time-selector .popup-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: white;
  flex: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.business-hours-time-selector .selector-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 999;
  touch-action: manipulation;
  animation: qp-fade-in 150ms ease;
}

.business-hours-time-selector .selector-backdrop.backdrop-closing {
  animation: qp-fade-out 150ms ease forwards;
  pointer-events: none;
}

@media (hover: none) {
  .business-hours-time-selector .selector-backdrop {
    background: rgba(0, 0, 0, 0.15);
  }
  .time-input-trigger {
    background: #f1f5f9;
    padding: 10px 14px 8px;
  }
}

@media (max-width: 768px) {
  .time-selector-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    right: auto;
    transform: translate(-50%, -50%);
    width: 90vw;
    min-width: 0;
    max-width: 420px;
    margin-top: 0;
  }
  .business-hours-time-selector {
    width: 100%;
  }
  .time-inputs-row {
    gap: 8px;
  }
  .business-hours-time-selector .dropdown-arrow {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .time-inputs-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .time-separator {
    display: none;
  }
  .time-input-trigger {
    padding: 10px 14px 8px;
  }
  .time-input-value {
    font-size: 16px;
    padding: 8px 0;
    min-height: 44px;
  }
  .business-hours-time-selector .dropdown-arrow {
    font-size: 16px;
  }
  .time-input-label {
    font-size: 13px;
  }
  .time-selector-popup {
    width: 95vw;
    min-width: 300px;
    max-width: 350px;
  }
}

/* Skeleton loading state */
@keyframes qp-shimmer {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}

.business-hours-time-selector .skeleton-trigger {
  flex: 1;
  padding: 8px 12px 6px;
  background: #f8fafc;
  border-radius: 6px 6px 0 0;
}

.business-hours-time-selector .skeleton-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
  margin-bottom: 2px;
}

.business-hours-time-selector .skeleton-bar {
  height: 28px;
  border-radius: 4px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 400px 100%;
  animation: qp-shimmer 1.5s ease infinite;
  border-bottom: 2px solid #e2e8f0;
}

@media (prefers-reduced-motion: reduce) {
  .time-selector-popup,
  .time-selector-popup.popup-closing,
  .business-hours-time-selector .selector-backdrop,
  .business-hours-time-selector .selector-backdrop.backdrop-closing {
    animation: none;
  }

  .business-hours-time-selector .skeleton-bar {
    animation: none;
  }
}`;
