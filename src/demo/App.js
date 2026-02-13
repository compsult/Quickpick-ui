import React, { useState } from 'react';
import {
  AppointmentTimeSelector,
  BusinessHoursTimeSelector,
} from '../components';
import './App.css';

const formatTime12Hour = (time24) => {
  if (!time24) return '';
  const [hour, minute] = time24.split(':').map(Number);
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const minuteStr = minute.toString().padStart(2, '0');
  return minute === 0 ? `${hour12} ${ampm}` : `${hour12}:${minuteStr} ${ampm}`;
};

// ─── Code snippet display helper ───────────────────────────────────
const CodeBlock = ({ code }) => (
  <pre className="code-block"><code>{code.trim()}</code></pre>
);

function App() {
  // State for each demo
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  // Vanilla JS demo state
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedVanillaColor, setSelectedVanillaColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedVanillaState, setSelectedVanillaState] = useState(null);

  // Generic data items
  const usStates = [
    { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  ];

  const colors = [
    'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet',
    'Black', 'White', 'Gray', 'Pink', 'Brown',
  ].map(c => ({ value: c, label: c }));

  const serviceTypes = [
    { value: 'PT', label: 'Physical Therapy' },
    { value: 'MT', label: 'Massage Therapy' },
    { value: 'AC', label: 'Acupuncture' },
    { value: 'CL', label: 'Life Coaching' },
    { value: 'PS', label: 'Psychoanalysis' },
    { value: 'WC', label: 'Wellness Coaching' },
  ];

  // Vanilla JS demo data (mirrors the code snippets in section 6)
  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ].map(m => ({ value: m, label: m }));

  const vanillaColors = [
    'Red','Orange','Yellow','Green','Blue','Indigo','Violet',
  ].map(c => ({ value: c, label: c }));

  const sizes = [
    'Small','Medium','Large','X-Large',
  ].map(s => ({ value: s, label: s }));

  const vanillaStates = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
  ];

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
        <p>Fast, touch-friendly time pickers for React &amp; Next.js — type to filter on desktop, tab-through to auto-fill</p>
      </header>

      <main className="demo-sections">
        {/* ── 1. Vanilla JS / Web Component Usage ── */}
        <section className="demo-section">
          <h2>Vanilla JS / Web Component</h2>
          <p className="description">
            Drop-in usage without React. Include the script, call <code>Quickpick()</code> on any input.
            The live previews below show exactly what each snippet renders.
            All widgets below have <code>autoSelectOnTab</code> enabled — try tabbing through them to auto-fill each field with its first option.
          </p>

          {/* 1a. Months — simplest possible */}
          <h3 style={{ marginTop: 24, marginBottom: 4 }}>1. Months (plain string array)</h3>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={months}
                selectedValue={selectedMonth}
                onTimeChange={(item) => setSelectedMonth(item.value)}
                label="Month"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedMonth || 'none'}</strong>
              </div>
            </div>
          </div>
          <details className="code-details">
            <summary>Code</summary>
            <CodeBlock code={`
<script src="quickpick.min.js"></script>
<input id="months" />

<script>
  var Data = ["January","February","March","April","May","June",
              "July","August","September","October","November","December"];

  Quickpick('#months', Data);
</script>
            `} />
          </details>

          {/* 1b. Colors — with options */}
          <h3 style={{ marginTop: 24, marginBottom: 4 }}>2. Colors (with options)</h3>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={vanillaColors}
                selectedValue={selectedVanillaColor}
                onTimeChange={(item) => setSelectedVanillaColor(item.value)}
                placeholder="Pick a color"
                label="Favorite Color"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedVanillaColor || 'none'}</strong>
              </div>
            </div>
          </div>
          <details className="code-details">
            <summary>Code</summary>
            <CodeBlock code={`
Quickpick('#colors', {
  data: ["Red","Orange","Yellow","Green","Blue","Indigo","Violet"],
  placeholder: "Pick a color",
  label: "Favorite Color",
  onChange: function(item) {
    console.log(item.value, item.label);
  }
});
            `} />
          </details>

          {/* 1c. States — value:label CSV pairs */}
          <h3 style={{ marginTop: 24, marginBottom: 4 }}>3. States (value:label pairs via CSV)</h3>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={vanillaStates}
                selectedValue={selectedVanillaState}
                onTimeChange={(item) => setSelectedVanillaState(item.value)}
                placeholder="Choose a state"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedVanillaState ? vanillaStates.find(s => s.value === selectedVanillaState)?.label + ' (' + selectedVanillaState + ')' : 'none'}</strong>
              </div>
            </div>
          </div>
          <details className="code-details">
            <summary>Code</summary>
            <CodeBlock code={`
Quickpick('#states', {
  data: "CA:California,NY:New York,TX:Texas,FL:Florida,IL:Illinois",
  placeholder: "Choose a state"
});
            `} />
          </details>

          {/* 1d. Pre-selected value */}
          <h3 style={{ marginTop: 24, marginBottom: 4 }}>4. Pre-selected value (tab-through preserves it)</h3>
          <p className="description" style={{ marginBottom: 8 }}>
            When a value is already set, tabbing through leaves it unchanged — the existing selection stays in the input.
            This means pre-populated forms can be tabbed through without accidentally overwriting known-good data.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={sizes}
                selectedValue={selectedSize}
                onTimeChange={(item) => setSelectedSize(item.value)}
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedSize || 'none'}</strong>
              </div>
            </div>
          </div>
          <details className="code-details">
            <summary>Code</summary>
            <CodeBlock code={`
Quickpick('#preselect', {
  data: ["Small","Medium","Large","X-Large"],
  value: "Medium"
});
            `} />
          </details>

          {/* All Options reference */}
          <details className="code-details" style={{ marginTop: 24 }}>
            <summary>All Options Reference</summary>
            <CodeBlock code={`
var handle = Quickpick('#el', {
  data: ["A","B","C"],    // string array, {value,label} array, or CSV string
  placeholder: "Pick one",
  label: "My Label",
  columns: 3,
  width: "400px",
  value: "B",             // pre-selected value
  autoSelectOnTab: true,  // tab-through auto-selects first item
  onChange: function(item) { console.log(item); }
});

// Programmatic access
handle.el;          // the <quickpick-appointment> element
handle.destroy();   // remove widget, restore original input
            `} />
          </details>
        </section>

        {/* ── 2. AppointmentTimeSelector ── */}
        <section className="demo-section">
          <h2>AppointmentTimeSelector</h2>
          <p className="description">
            Dropdown button that opens a time grid popup.
            Hover-to-open on desktop, tap-to-toggle on mobile.
            On desktop, type in the input to filter visible time slots — Enter selects the first match, Escape closes.
            Auto-positions above/below based on viewport space.
            With <code>autoSelectOnTab</code>, tabbing in opens the picker and tabbing out auto-selects the earliest time — ideal for forms where the default slot is usually correct.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                selectedTime={appointmentTime}
                onTimeChange={setAppointmentTime}
                selectedDate={new Date()}
                businessHours={businessHours}
                label="Appointment Time"
                autoSelectOnTab
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
                <li><code>autoSelectOnTab</code> - Auto-select first option on tab-through</li>
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
                <li>Desktop: type in the input to filter options — Enter selects first match, Escape closes</li>
                <li>Mobile: tap button to open, tap backdrop to close (input stays read-only)</li>
                <li>Auto-closes after selecting a time</li>
                <li>Tab-through: with <code>autoSelectOnTab</code>, tab in opens, tab out auto-selects first option</li>
                <li>Smart positioning avoids viewport edges</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{appointmentTime ? formatTime12Hour(appointmentTime) : 'none'}</strong>
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

        {/* ── 2. Generic Data — US States ── */}
        <section className="demo-section">
          <h2>Generic Data — US States</h2>
          <p className="description">
            The same popup grid used as a generic select list.
            Pass an <code>items</code> array instead of business hours.
            Adaptive columns: long labels → 2 cols.
            On desktop, type to filter — try typing "new" to find New Hampshire, New Jersey, New Mexico, and New York.
            Tab-through auto-selects the first item in the list (Alabama) — useful when the order of items reflects the most common choice.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={usStates}
                selectedValue={selectedState}
                onTimeChange={(item) => setSelectedState(item.value)}
                placeholder="Choose a state"
                label="US State"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <h3>Items Mode Props</h3>
              <ul>
                <li><code>items</code> - Array of &#123;value, label&#125;</li>
                <li><code>selectedValue</code> - Currently selected value</li>
                <li><code>onTimeChange(item)</code> - Fires with &#123;value, label&#125;</li>
                <li><code>placeholder</code> - Button placeholder text</li>
                <li><code>columns</code> - Override auto column count</li>
              </ul>
              <div className="selected-display">
                Selected: <strong>{selectedState ? usStates.find(s => s.value === selectedState)?.label : 'none'}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Generic Data — Colors (short labels) ── */}
        <section className="demo-section">
          <h2>Generic Data — Colors</h2>
          <p className="description">
            Short labels auto-select 3 columns. Value equals label for simple lists.
            Type to filter on desktop.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={colors}
                selectedValue={selectedColor}
                onTimeChange={(item) => setSelectedColor(item.value)}
                placeholder="Choose a color"
                label="Favorite Color"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedColor || 'none'}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Generic Data — Service Types (value:label) ── */}
        <section className="demo-section">
          <h2>Generic Data — Service Types</h2>
          <p className="description">
            Value/label pairs with longer labels → 2 columns.
            Type to filter on desktop.
          </p>
          <div className="demo-row">
            <div className="demo-widget" style={{ minHeight: '60px' }}>
              <AppointmentTimeSelector
                items={serviceTypes}
                selectedValue={selectedService}
                onTimeChange={(item) => setSelectedService(item.value)}
                placeholder="Choose a service"
                label="Service Type"
                autoSelectOnTab
              />
            </div>
            <div className="demo-info">
              <div className="selected-display">
                Selected: <strong>{selectedService ? serviceTypes.find(s => s.value === selectedService)?.label : 'none'}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. Loading State ── */}
        <section className="demo-section">
          <h2>Loading State</h2>
          <p className="description">
            Pass <code>loading=true</code> while fetching data. Shows a shimmer placeholder matching each selector's shape.
          </p>
          <div className="demo-row">
            <div className="demo-widget">
              <AppointmentTimeSelector loading label="Loading..." />
            </div>
            <div className="demo-widget">
              <BusinessHoursTimeSelector loading />
            </div>
          </div>
        </section>

        {/* ── 6. BusinessHoursTimeSelector ── */}
        <section className="demo-section">
          <h2>BusinessHoursTimeSelector</h2>
          <p className="description">
            Dual start/end time selector for configuring business hours.
            Each button opens a time grid popup (6 AM - 10 PM range).
            On desktop, type in either input to filter times — try typing "2p" to jump to 2 PM.
            With <code>autoSelectOnTab</code>, tabbing through auto-fills start (6 AM) and end (matching start) when empty — existing values are never overwritten.
          </p>
          <div className="demo-row">
            <div className="demo-widget">
              <BusinessHoursTimeSelector
                startTime={startTime}
                endTime={endTime}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
                autoSelectOnTab
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
                <li><code>autoSelectOnTab</code> - Auto-select first option on tab-through</li>
              </ul>
              <div className="selected-display">
                Hours: <strong>{formatTime12Hour(startTime)} - {formatTime12Hour(endTime)}</strong>
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
