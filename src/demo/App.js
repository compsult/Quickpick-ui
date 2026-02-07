import React, { useState } from 'react';
import {
  TimeSlotGrid,
  GridTimeSelector,
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
  const [gridTime, setGridTime] = useState(null);
  const [gridSelectorTime, setGridSelectorTime] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [compactTime, setCompactTime] = useState(null);
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
        <h1>Time Select Widget</h1>
        <p>Extracted from BookingAddOn&trade; calendar system</p>
      </header>

      <main className="demo-sections">
        {/* ── 1. TimeSlotGrid ── */}
        <section className="demo-section">
          <h2>TimeSlotGrid</h2>
          <p className="description">
            Core grid component. Displays 15-minute time slots grouped by hour with zebra striping.
            Configurable min/max time range.
          </p>
          <div className="demo-row">
            <div className="demo-widget">
              <TimeSlotGrid
                value={gridTime}
                onChange={setGridTime}
                minTime="09:00"
                maxTime="17:00"
              />
            </div>
            <div className="demo-info">
              <h3>Props</h3>
              <ul>
                <li><code>value</code> - Selected time (HH:MM format)</li>
                <li><code>onChange(time)</code> - Callback when time selected</li>
                <li><code>minTime</code> - Earliest slot (default: "08:00")</li>
                <li><code>maxTime</code> - Latest slot (default: "17:00")</li>
                <li><code>disabled</code> - Disable the grid</li>
                <li><code>className</code> - Additional CSS class</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{gridTime || 'none'}</strong>
              </div>
            </div>
          </div>

          <details className="code-details">
            <summary>React Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { TimeSlotGrid } from './components';

export default function PickTime() {
  const [time, setTime] = useState(null);

  return (
    <div>
      <h3>Pick a time</h3>
      <TimeSlotGrid
        value={time}
        onChange={setTime}
        minTime="09:00"
        maxTime="17:00"
      />
      {time && <p>You picked: {time}</p>}
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Next.js Page Example</summary>
            <CodeBlock code={`
// pages/schedule.js  (Pages Router)
import { useState } from 'react';
import { TimeSlotGrid } from '../components/TimeSlotGrid';

export default function SchedulePage() {
  const [time, setTime] = useState(null);

  const handleSubmit = async () => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time }),
    });
    const data = await res.json();
    alert('Booked at ' + data.time);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <h1>Schedule Appointment</h1>
      <TimeSlotGrid
        value={time}
        onChange={setTime}
        minTime="08:00"
        maxTime="18:00"
      />
      <button onClick={handleSubmit} disabled={!time}>
        Book {time || '...'}
      </button>
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Next.js App Router Example</summary>
            <CodeBlock code={`
// app/schedule/page.jsx  (App Router — must be client component)
'use client';

import { useState } from 'react';
import { TimeSlotGrid } from '@/components/TimeSlotGrid';

export default function SchedulePage() {
  const [time, setTime] = useState(null);

  return (
    <main>
      <h1>Choose a Time</h1>
      <TimeSlotGrid
        value={time}
        onChange={setTime}
        minTime="09:00"
        maxTime="17:00"
      />
      <p>Selected: {time ?? 'none'}</p>
    </main>
  );
}
            `} />
          </details>
        </section>

        {/* ── 2. GridTimeSelector ── */}
        <section className="demo-section">
          <h2>GridTimeSelector</h2>
          <p className="description">
            Alternative layout with hour labels on the left and minute columns across the top.
            Shows selected time below the grid.
          </p>
          <div className="demo-row">
            <div className="demo-widget">
              <GridTimeSelector
                value={gridSelectorTime}
                onChange={setGridSelectorTime}
                minTime="08:00"
                maxTime="18:00"
              />
            </div>
            <div className="demo-info">
              <h3>Props</h3>
              <ul>
                <li><code>value</code> - Selected time (HH:MM format)</li>
                <li><code>onChange(time)</code> - Callback when time selected</li>
                <li><code>minTime</code> - Earliest slot (default: "06:00")</li>
                <li><code>maxTime</code> - Latest slot (default: "22:00")</li>
                <li><code>disabled</code> - Disable the grid</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{gridSelectorTime || 'none'}</strong>
              </div>
            </div>
          </div>

          <details className="code-details">
            <summary>React Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { GridTimeSelector } from './components';

export default function MeetingTimePicker() {
  const [time, setTime] = useState(null);

  return (
    <div>
      <label>Meeting time:</label>
      <GridTimeSelector
        value={time}
        onChange={setTime}
        minTime="08:00"
        maxTime="20:00"
      />
    </div>
  );
}
            `} />
          </details>

          <details className="code-details">
            <summary>Next.js Form Example</summary>
            <CodeBlock code={`
// pages/new-event.js
import { useState } from 'react';
import { GridTimeSelector } from '../components/GridTimeSelector';

export default function NewEvent() {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, time }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
      />
      <GridTimeSelector
        value={time}
        onChange={setTime}
        minTime="06:00"
        maxTime="22:00"
      />
      <button type="submit" disabled={!title || !time}>
        Create Event
      </button>
    </form>
  );
}
            `} />
          </details>
        </section>

        {/* ── 3. AppointmentTimeSelector — Full ── */}
        <section className="demo-section">
          <h2>AppointmentTimeSelector (Full/Inline)</h2>
          <p className="description">
            Wraps TimeSlotGrid with a header showing the current selection.
            Respects business hours based on selected date.
          </p>
          <div className="demo-row">
            <div className="demo-widget">
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
                <li><code>selectedTime</code> - Current time value</li>
                <li><code>onTimeChange(time)</code> - Selection callback</li>
                <li><code>selectedDate</code> - Date object (determines business hours)</li>
                <li><code>businessHours</code> - Config object per weekday</li>
                <li><code>compact</code> - false for inline (default)</li>
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
import { AppointmentTimeSelector } from './components';

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
    // Combine date + time into ISO string
    const [h, m] = time.split(':');
    const dt = new Date(date);
    dt.setHours(Number(h), Number(m), 0, 0);

    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startTime: dt.toISOString(),
      }),
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
            <summary>Next.js with Server-Side Business Hours</summary>
            <CodeBlock code={`
// pages/book/[tenant].js — loads business hours from API
import { useState } from 'react';
import { AppointmentTimeSelector } from '../../components/AppointmentTimeSelector';

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

        {/* ── 4. AppointmentTimeSelector — Compact ── */}
        <section className="demo-section">
          <h2>AppointmentTimeSelector (Compact/Popup)</h2>
          <p className="description">
            Compact dropdown button that opens a popup with the time grid.
            Hover-to-open on desktop, tap-to-toggle on mobile.
            Auto-positions above/below based on viewport space.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                selectedTime={compactTime}
                onTimeChange={setCompactTime}
                selectedDate={new Date()}
                businessHours={businessHours}
                compact
              />
            </div>
            <div className="demo-info">
              <h3>Behavior</h3>
              <ul>
                <li>Desktop: hover to open, mouse-leave to close</li>
                <li>Mobile: tap button to open, tap backdrop to close</li>
                <li>Auto-closes after selecting a time</li>
                <li>Smart positioning avoids viewport edges</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{compactTime || 'none'}</strong>
              </div>
            </div>
          </div>

          <details className="code-details">
            <summary>Inside a Modal Example</summary>
            <CodeBlock code={`
import { useState } from 'react';
import { AppointmentTimeSelector } from './components';

export default function EditAppointmentModal({ appointment, onSave, onClose }) {
  const [time, setTime] = useState(appointment.time);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Appointment</h2>

        {/* Compact mode is ideal inside modals — saves space */}
        <AppointmentTimeSelector
          selectedTime={time}
          onTimeChange={setTime}
          selectedDate={new Date(appointment.date)}
          businessHours={appointment.businessHours}
          compact
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
            <summary>Next.js App Router Client Component</summary>
            <CodeBlock code={`
// app/reschedule/[token]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { AppointmentTimeSelector } from '@/components/AppointmentTimeSelector';

export default function ReschedulePage({ params }) {
  const [appt, setAppt] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    fetch(\`/api/manage/\${params.token}\`)
      .then(r => r.json())
      .then(setAppt);
  }, [params.token]);

  const handleReschedule = async () => {
    const [h, m] = time.split(':');
    const dt = new Date(appt.date);
    dt.setHours(Number(h), Number(m), 0, 0);

    await fetch(\`/api/manage/\${params.token}/reschedule\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newStartTime: dt.toISOString() }),
    });
  };

  if (!appt) return <p>Loading...</p>;

  return (
    <main>
      <h1>Reschedule Appointment</h1>
      <AppointmentTimeSelector
        selectedTime={time}
        onTimeChange={setTime}
        selectedDate={new Date(appt.date)}
        businessHours={appt.businessHours}
        compact
      />
      <button onClick={handleReschedule} disabled={!time}>
        Confirm New Time
      </button>
    </main>
  );
}
            `} />
          </details>
        </section>

        {/* ── 5. BusinessHoursTimeSelector ── */}
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
import { BusinessHoursTimeSelector } from './components';

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
import { BusinessHoursTimeSelector } from '../../components/BusinessHoursTimeSelector';

export async function getServerSideProps({ req }) {
  // Fetch current hours from your API
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

// pages/api/tenants/[id]/settings.js  (API route)
const { pool } = require('../../../../lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { id } = req.query;
  const { business_hours } = req.body;

  await pool.query(
    'UPDATE tenant_settings SET business_hours = $1 WHERE tenant_id = $2',
    [JSON.stringify(business_hours), id]
  );

  res.json({ success: true });
};
            `} />
          </details>
        </section>
      </main>
    </div>
  );
}

export default App;
