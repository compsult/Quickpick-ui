import React, { useState } from 'react';
import {
  AppointmentTimeSelector,
  BusinessHoursTimeSelector,
} from '../components';
import './App.css';

// ─── Code snippet display helper ───────────────────────────────────
const CodeBlock = ({ code }) => (
  <pre className="code-block"><code>{code.trim()}</code></pre>
);

function App() {
  // State for each demo
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  // Sample business hours config
  const businessHours = {
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: true, start: '09:00', end: '17:00' },
    saturday: { enabled: true, start: '10:00', end: '14:00' },
    sunday: { enabled: false },
  };

  return (
    <div className="demo-app">
      <header className="demo-header">
        <h1>Quickpick UI</h1>
        <p>Fast, touch-friendly time pickers for React &amp; Next.js</p>
      </header>

      <main className="demo-sections">
        {/* ── 1. AppointmentTimeSelector ── */}
        <section className="demo-section">
          <h2>AppointmentTimeSelector</h2>
          <p className="description">
            Dropdown button that opens a time grid popup.
            Hover-to-open on desktop, tap-to-toggle on mobile.
            Auto-positions above/below based on viewport space.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                selectedTime={appointmentTime}
                onTimeChange={setAppointmentTime}
                selectedDate={new Date()}
                businessHours={businessHours}
              />
            </div>
            <div className="demo-info">
              <h3>Props</h3>
              <ul>
                <li><code>selectedTime</code> - Current time value (HH:MM)</li>
                <li><code>onTimeChange(time)</code> - Selection callback</li>
                <li><code>selectedDate</code> - Date object (determines business hours)</li>
                <li><code>businessHours</code> - Config object per weekday</li>
                <li><code>disabled</code> - Disable the selector</li>
                <li><code>className</code> - Additional CSS class</li>
              </ul>
              <h3>popupWidth prop</h3>
              <ul>
                <li><code>'match-button'</code> (default) — stretches to button width</li>
                <li><code>'auto'</code> — sizes to grid content</li>
                <li>CSS value (e.g. <code>'350px'</code>) — explicit width</li>
              </ul>
              <h3>Behavior</h3>
              <ul>
                <li>Desktop: hover to open, mouse-leave to close</li>
                <li>Mobile: tap button to open, tap backdrop to close</li>
                <li>Auto-closes after selecting a time</li>
                <li>Smart positioning avoids viewport edges</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{appointmentTime || 'none'}</strong>
              </div>
            </div>
          </div>

          <details className="code-details">
            <summary>React Booking Form Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { AppointmentTimeSelector } from 'quickpick-ui';

const BUSINESS_HOURS = {
  monday:    { enabled: true, start: '09:00', end: '17:00' },
  tuesday:   { enabled: true, start: '09:00', end: '17:00' },
  wednesday: { enabled: true, start: '09:00', end: '17:00' },
  thursday:  { enabled: true, start: '09:00', end: '17:00' },
  friday:    { enabled: true, start: '09:00', end: '17:00' },
  saturday:  { enabled: true, start: '10:00', end: '14:00' },
  sunday:    { enabled: false },
};

export default function BookingForm() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);

  const handleBook = async () => {
    const [h, m] = time.split(':');
    const dt = new Date(date);
    dt.setHours(Number(h), Number(m), 0, 0);

    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime: dt.toISOString() }),
    });
  };

  return (
    <div>
      <input
        type="date"
        value={date.toISOString().slice(0, 10)}
        onChange={(e) => setDate(new Date(e.target.value + 'T12:00'))}
      />
      <AppointmentTimeSelector
        selectedTime={time}
        onTimeChange={setTime}
        selectedDate={date}
        businessHours={BUSINESS_HOURS}
      />
      <button onClick={handleBook} disabled={!time}>
        Book Appointment
      </button>
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Inside a Modal Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { AppointmentTimeSelector } from 'quickpick-ui';

export default function EditAppointmentModal({ appointment, onSave, onClose }) {
  const [time, setTime] = useState(appointment.time);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Appointment</h2>

        <AppointmentTimeSelector
          selectedTime={time}
          onTimeChange={setTime}
          selectedDate={new Date(appointment.date)}
          businessHours={appointment.businessHours}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSave({ ...appointment, time })}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Next.js with Server-Side Business Hours</summary>
            <CodeBlock code={`
// pages/book/[tenant].js — loads business hours from API
import { useState } from 'react';
import { AppointmentTimeSelector } from 'quickpick-ui';

export async function getServerSideProps({ params }) {
  const res = await fetch(
    \`\${process.env.NEXT_PUBLIC_API_URL}/api/tenants/\${params.tenant}\`
  );
  const tenant = await res.json();
  return { props: { businessHours: tenant.business_hours } };
}

export default function BookPage({ businessHours }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);

  return (
    <main style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1>Book an Appointment</h1>
      <input
        type="date"
        onChange={(e) => setDate(new Date(e.target.value + 'T12:00'))}
      />
      <AppointmentTimeSelector
        selectedTime={time}
        onTimeChange={setTime}
        selectedDate={date}
        businessHours={businessHours}
      />
      {time && <p>Selected: {time}</p>}
    </main>
  );
}
            `} />
          </details>
        </section>

        {/* ── 2. BusinessHoursTimeSelector ── */}
        <section className="demo-section">
          <h2>BusinessHoursTimeSelector</h2>
          <p className="description">
            Dual start/end time selector for configuring business hours.
            Each button opens a time grid popup (6 AM - 10 PM range).
          </p>
          <div className="demo-row">
            <div className="demo-widget">
              <BusinessHoursTimeSelector
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
              />
            </div>
            <div className="demo-info">
              <h3>Props</h3>
              <ul>
                <li><code>startTime</code> - Opening time (HH:MM)</li>
                <li><code>endTime</code> - Closing time (HH:MM)</li>
                <li><code>onStartTimeChange(time)</code> - Start callback</li>
                <li><code>onEndTimeChange(time)</code> - End callback</li>
                <li><code>disabled</code> - Disable both selectors</li>
              </ul>
              <div className="selected-display">
                Hours: <strong>{startTime} - {endTime}</strong>
              </div>
            </div>
          </div>

          <details className="code-details">
            <summary>Admin Settings Form Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { BusinessHoursTimeSelector } from 'quickpick-ui';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function BusinessHoursSettings({ initialHours }) {
  const [hours, setHours] = useState(initialHours);

  const updateDay = (day, field, value) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const saveHours = async () => {
    await fetch('/api/tenants/my-tenant/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_hours: hours }),
    });
  };

  return (
    <div>
      <h2>Business Hours</h2>
      {DAYS.map(day => (
        <div key={day} style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={hours[day]?.enabled ?? false}
              onChange={(e) => updateDay(day, 'enabled', e.target.checked)}
            />
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </label>
          {hours[day]?.enabled && (
            <BusinessHoursTimeSelector
              startTime={hours[day].start || '09:00'}
              endTime={hours[day].end || '17:00'}
              onStartTimeChange={(t) => updateDay(day, 'start', t)}
              onEndTimeChange={(t) => updateDay(day, 'end', t)}
            />
          )}
        </div>
      ))}
      <button onClick={saveHours}>Save Hours</button>
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Next.js Admin Page with API Route</summary>
            <CodeBlock code={`
// pages/admin/hours.js
import { useState } from 'react';
import { BusinessHoursTimeSelector } from 'quickpick-ui';

export async function getServerSideProps({ req }) {
  const res = await fetch(
    \`\${process.env.NEXT_PUBLIC_API_URL}/api/tenants/my-tenant\`
  );
  const tenant = await res.json();
  return { props: { initialHours: tenant.business_hours } };
}

export default function AdminHoursPage({ initialHours }) {
  const [monday, setMonday] = useState(initialHours.monday);

  const save = async () => {
    await fetch('/api/tenants/my-tenant/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_hours: { ...initialHours, monday },
      }),
    });
    alert('Saved!');
  };

  return (
    <div>
      <h1>Monday Hours</h1>
      <BusinessHoursTimeSelector
        startTime={monday.start}
        endTime={monday.end}
        onStartTimeChange={(t) => setMonday(prev => ({ ...prev, start: t }))}
        onEndTimeChange={(t) => setMonday(prev => ({ ...prev, end: t }))}
        disabled={!monday.enabled}
      />
      <button onClick={save}>Save</button>
    </div>
  );
}
            `} />
          </details>
        </section>
      </main>
    </div>
  );
}

export default App;
