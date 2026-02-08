import React from 'react';
import ReactDOM from 'react-dom/client';
import BusinessHoursTimeSelector from '../components/BusinessHoursTimeSelector';
import { timeSlotGridCSS, businessHoursCSS } from './all-styles';

class QuickpickHours extends HTMLElement {
  static get observedAttributes() {
    return ['start-time', 'end-time', 'disabled', 'width'];
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
    style.textContent = timeSlotGridCSS + '\n' + businessHoursCSS;
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

    // start-time → startTime
    const st = this.getAttribute('start-time');
    if (st) props.startTime = st;

    // end-time → endTime
    const et = this.getAttribute('end-time');
    if (et) props.endTime = et;

    // disabled (boolean attribute)
    props.disabled = this.hasAttribute('disabled');

    // width
    const w = this.getAttribute('width');
    if (w) props.width = w;

    // Callbacks: emit CustomEvents
    props.onStartTimeChange = (time) => {
      this.dispatchEvent(new CustomEvent('start-time-change', {
        detail: { time },
        bubbles: true,
        composed: true,
      }));
    };

    props.onEndTimeChange = (time) => {
      this.dispatchEvent(new CustomEvent('end-time-change', {
        detail: { time },
        bubbles: true,
        composed: true,
      }));
    };

    return props;
  }

  _render() {
    if (!this._root) return;
    this._root.render(React.createElement(BusinessHoursTimeSelector, this._getProps()));
  }
}

export default QuickpickHours;
