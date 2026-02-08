import React from 'react';
import ReactDOM from 'react-dom/client';
import AppointmentTimeSelector from '../components/AppointmentTimeSelector';
import { timeSlotGridCSS, appointmentCSS } from './all-styles';

class QuickpickAppointment extends HTMLElement {
  static get observedAttributes() {
    return ['selected-time', 'selected-date', 'business-hours', 'disabled', 'popup-width', 'width', 'data', 'selected-value', 'placeholder', 'columns', 'label'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._root = null;
    this._mountPoint = null;
  }

  connectedCallback() {
    // Inject scoped CSS
    const style = document.createElement('style');
    style.textContent = timeSlotGridCSS + '\n' + appointmentCSS;
    this._shadow.appendChild(style);

    // Create mount point for React
    this._mountPoint = document.createElement('div');
    this._shadow.appendChild(this._mountPoint);

    // Mount React
    this._root = ReactDOM.createRoot(this._mountPoint);
    this._render();
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }

  attributeChangedCallback() {
    this._render();
  }

  // Parse the `data` attribute into [{value, label}] items array
  static _parseData(raw) {
    if (!raw || !raw.trim()) return null;
    raw = raw.trim();

    // Try JSON first
    if (raw[0] === '[') {
      try {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr) || arr.length === 0) return null;
        // Array of objects with value/label
        if (typeof arr[0] === 'object' && arr[0] !== null) {
          return arr.map(obj => ({
            value: String(obj.value ?? obj.label ?? ''),
            label: String(obj.label ?? obj.value ?? '')
          }));
        }
        // Array of strings
        return arr.map(s => ({ value: String(s), label: String(s) }));
      } catch (e) {
        console.warn('<quickpick-appointment>: invalid data JSON', e);
        return null;
      }
    }

    // CSV: split by comma, detect value:label pairs
    return raw.split(',').map(entry => {
      entry = entry.trim();
      if (!entry) return null;
      const colonIdx = entry.indexOf(':');
      if (colonIdx > 0) {
        return { value: entry.slice(0, colonIdx).trim(), label: entry.slice(colonIdx + 1).trim() };
      }
      return { value: entry, label: entry };
    }).filter(Boolean);
  }

  _getProps() {
    const props = {};

    // Parse generic data attribute
    const dataAttr = this.getAttribute('data');
    const items = QuickpickAppointment._parseData(dataAttr);

    if (items) {
      // --- Items mode ---
      props.items = items;

      const sv = this.getAttribute('selected-value');
      if (sv) props.selectedValue = sv;

      const ph = this.getAttribute('placeholder');
      if (ph) props.placeholder = ph;

      const cols = this.getAttribute('columns');
      if (cols) props.columns = parseInt(cols, 10) || null;

      // Callback: emit item-change on selection
      props.onTimeChange = (item) => {
        this.dispatchEvent(new CustomEvent('item-change', {
          detail: { value: item.value, label: item.label },
          bubbles: true,
          composed: true,
        }));
      };
    } else {
      // --- Time mode (existing behavior) ---
      const time = this.getAttribute('selected-time');
      if (time) props.selectedTime = time;

      const date = this.getAttribute('selected-date');
      if (date) {
        const parts = date.split('-').map(Number);
        props.selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
      }

      const bh = this.getAttribute('business-hours');
      if (bh) {
        try {
          props.businessHours = JSON.parse(bh);
        } catch (e) {
          console.warn('<quickpick-appointment>: invalid business-hours JSON', e);
        }
      }

      const pw = this.getAttribute('popup-width');
      if (pw) props.popupWidth = pw;

      // Callback: emit time-change on selection
      props.onTimeChange = (time) => {
        this.dispatchEvent(new CustomEvent('time-change', {
          detail: { time },
          bubbles: true,
          composed: true,
        }));
      };
    }

    // disabled (boolean attribute — applies to both modes)
    props.disabled = this.hasAttribute('disabled');

    // label (applies to both modes)
    const lbl = this.getAttribute('label');
    if (lbl) props.label = lbl;

    // width (applies to both modes)
    const w = this.getAttribute('width');
    if (w) props.width = w;

    // popup-width applies to both modes
    if (!items) {
      // Already handled above for time mode
    } else {
      const pw = this.getAttribute('popup-width');
      if (pw) props.popupWidth = pw;
    }

    return props;
  }

  _render() {
    if (!this._root) return;
    this._root.render(React.createElement(AppointmentTimeSelector, this._getProps()));
  }
}

export default QuickpickAppointment;
