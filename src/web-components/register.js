import QuickpickAppointment from './quickpick-appointment';
import QuickpickHours from './quickpick-hours';

// Register custom elements (safe to call multiple times — no-ops if already defined)
if (!customElements.get('quickpick-appointment')) {
  customElements.define('quickpick-appointment', QuickpickAppointment);
}

if (!customElements.get('quickpick-hours')) {
  customElements.define('quickpick-hours', QuickpickHours);
}

/**
 * Factory function — jQuery-style one-liner API.
 *
 *   Quickpick('#myInput', ["Jan","Feb","Mar"]);
 *
 *   Quickpick('#myInput', {
 *     data: ["Jan","Feb","Mar"],
 *     placeholder: "Pick a month",
 *     label: "Month",
 *     columns: 3,
 *     width: "400px",
 *     value: "Mar",
 *     onChange: function(item) { console.log(item); }
 *   });
 *
 * Returns a handle: { el, destroy() }
 */
function Quickpick(target, options) {
  // Resolve target element
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error('Quickpick: target not found — ' + target);

  // Normalize: plain array shorthand → options object
  const opts = Array.isArray(options) ? { data: options } : (options || {});

  // Build the web component
  const qp = document.createElement('quickpick-appointment');

  // data — accept array of strings, array of {value,label}, or CSV string
  if (opts.data) {
    if (Array.isArray(opts.data)) {
      qp.setAttribute('data', JSON.stringify(opts.data));
    } else {
      qp.setAttribute('data', String(opts.data));
    }
  }

  if (opts.placeholder) qp.setAttribute('placeholder', opts.placeholder);
  if (opts.label) qp.setAttribute('label', opts.label);
  if (opts.columns) qp.setAttribute('columns', String(opts.columns));
  if (opts.width) qp.setAttribute('width', opts.width);
  if (opts.popupWidth) qp.setAttribute('popup-width', opts.popupWidth);
  if (opts.disabled) qp.setAttribute('disabled', '');
  if (opts.value) qp.setAttribute('selected-value', opts.value);

  // Time-mode props
  if (opts.selectedTime) qp.setAttribute('selected-time', opts.selectedTime);
  if (opts.selectedDate) qp.setAttribute('selected-date', opts.selectedDate);
  if (opts.businessHours) qp.setAttribute('business-hours', JSON.stringify(opts.businessHours));

  // Wire up events: sync value back to original input + call onChange
  const handler = (e) => {
    const detail = e.detail;
    // Items mode → detail has {value, label}; time mode → detail has {time}
    if (detail.value !== undefined) {
      el.value = detail.value;
      qp.setAttribute('selected-value', detail.value);
    } else if (detail.time !== undefined) {
      el.value = detail.time;
      qp.setAttribute('selected-time', detail.time);
    }
    if (opts.onChange) opts.onChange(detail);
  };
  qp.addEventListener('item-change', handler);
  qp.addEventListener('time-change', handler);

  // Insert the widget and hide the original element
  el.style.display = 'none';
  el.parentNode.insertBefore(qp, el.nextSibling);

  return {
    el: qp,
    destroy() {
      qp.removeEventListener('item-change', handler);
      qp.removeEventListener('time-change', handler);
      qp.remove();
      el.style.display = '';
    }
  };
}

// Attach sub-references for advanced usage
Quickpick.Appointment = QuickpickAppointment;
Quickpick.Hours = QuickpickHours;

export default Quickpick;
