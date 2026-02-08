import React from 'react';
import ReactDOM from 'react-dom/client';
import AppointmentTimeSelector from '../components/AppointmentTimeSelector';
import { timeSlotGridCSS, appointmentCSS } from './all-styles';

class QuickpickAppointment extends HTMLElement {
  static get observedAttributes() {
    return ['selected-time', 'selected-date', 'business-hours', 'disabled', 'popup-width'];
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

  _getProps() {
    const props = {};

    // selected-time → selectedTime
    const time = this.getAttribute('selected-time');
    if (time) props.selectedTime = time;

    // selected-date → selectedDate (ISO string → Date)
    const date = this.getAttribute('selected-date');
    if (date) {
      // Parse as local date (not UTC) by splitting the ISO string
      const parts = date.split('-').map(Number);
      props.selectedDate = new Date(parts[0], parts[1] - 1, parts[2]);
    }

    // business-hours → businessHours (JSON string → object)
    const bh = this.getAttribute('business-hours');
    if (bh) {
      try {
        props.businessHours = JSON.parse(bh);
      } catch (e) {
        console.warn('<quickpick-appointment>: invalid business-hours JSON', e);
      }
    }

    // disabled (boolean attribute)
    props.disabled = this.hasAttribute('disabled');

    // popup-width → popupWidth
    const pw = this.getAttribute('popup-width');
    if (pw) props.popupWidth = pw;

    // Callback: emit CustomEvent on time change
    props.onTimeChange = (time) => {
      this.dispatchEvent(new CustomEvent('time-change', {
        detail: { time },
        bubbles: true,
        composed: true, // crosses shadow boundary
      }));
    };

    return props;
  }

  _render() {
    if (!this._root) return;
    this._root.render(React.createElement(AppointmentTimeSelector, this._getProps()));
  }
}

export default QuickpickAppointment;
