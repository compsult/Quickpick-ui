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

.time-selector-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  min-width: 320px;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.2);
}

.time-selector-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), transparent);
  transition: left 0.5s ease;
}

.time-selector-button * {
  pointer-events: none;
}

.time-selector-button:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.time-selector-button:hover::before {
  left: 100%;
}

.time-selector-button.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: #1d4ed8;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.time-selector-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.time-label {
  font-weight: 500;
  color: #374151;
  position: relative;
  z-index: 1;
}

.time-selector-button.active .time-label {
  color: rgba(255, 255, 255, 0.85);
}

.appointment-time-selector .time-value {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.appointment-time-selector .time-value.placeholder {
  color: #4b5563;
  font-weight: 500;
}

.time-selector-button.active .time-value {
  color: white;
}

.time-selector-button.active .time-value.placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.dropdown-arrow {
  font-size: 12px;
  color: #6b7280;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 1;
}

.time-selector-button.active .dropdown-arrow {
  transform: rotate(180deg);
  color: rgba(255, 255, 255, 0.85);
}

.time-grid-popup {
  position: absolute;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
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

.selector-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.05);
  z-index: 999;
  touch-action: manipulation;
}

@media (hover: none) {
  .selector-backdrop {
    background: rgba(0, 0, 0, 0.15);
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
    margin-top: 0;
  }
  .time-selector-button {
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .time-grid-popup {
    width: 95vw;
    max-width: none;
  }
  .time-selector-button {
    font-size: 16px;
    padding: 14px 12px;
    min-height: 48px;
    min-width: 100%;
  }
  .popup-header {
    padding: 14px 16px;
  }
}

.time-selector-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}`;

export const businessHoursCSS = `/* Business Hours Time Selector Styles */
.business-hours-time-selector {
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  margin: 8px 0;
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
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.time-input-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  pointer-events: auto;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(102, 126, 234, 0.2);
}

.time-input-button * {
  pointer-events: none;
}

.time-input-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.5s ease;
}

.time-input-button:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.time-input-button:hover::before {
  left: 100%;
}

.time-input-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #5a67d8;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.business-hours-time-selector .time-value {
  font-size: 14px;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.time-selector-popup {
  position: absolute;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(102, 126, 234, 0.1);
  z-index: 1000;
  max-height: 420px;
  overflow: hidden;
  animation: popupSlideIn 0.25s ease-out;
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
  padding: 16px 20px;
  border-bottom: 2px solid #e2e8f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
  color: white;
  position: sticky;
  top: 0;
  z-index: 2;
}

.business-hours-time-selector .popup-header h4 {
  margin: 0;
  font-size: 18px;
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
  background: rgba(0, 0, 0, 0.1);
  z-index: 999;
  touch-action: manipulation;
}

@media (hover: none) {
  .business-hours-time-selector .selector-backdrop {
    background: rgba(0, 0, 0, 0.2);
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
    min-width: 320px;
    max-width: 420px;
    margin-top: 0;
  }
  .time-inputs-row {
    gap: 8px;
  }
  .time-input-button {
    min-width: 70px;
    padding: 6px 10px;
  }
  .business-hours-time-selector .time-value {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .time-inputs-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .time-input-button {
    flex-direction: row;
    justify-content: center;
    min-width: auto;
    min-height: 48px;
    font-size: 16px;
  }
  .time-selector-popup {
    width: 95vw;
    min-width: 300px;
    max-width: 350px;
  }
}

.time-input-button:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.time-input-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
}`;
