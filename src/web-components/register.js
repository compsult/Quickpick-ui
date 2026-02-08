import QuickpickAppointment from './quickpick-appointment';
import QuickpickHours from './quickpick-hours';

// Register custom elements (safe to call multiple times — no-ops if already defined)
if (!customElements.get('quickpick-appointment')) {
  customElements.define('quickpick-appointment', QuickpickAppointment);
}

if (!customElements.get('quickpick-hours')) {
  customElements.define('quickpick-hours', QuickpickHours);
}

export { QuickpickAppointment, QuickpickHours };
