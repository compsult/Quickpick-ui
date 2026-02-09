# Quickpick UI

Fast, touch-friendly picker for React and vanilla JS. Type to filter on desktop, tap to select on mobile.

Works as a time picker, generic select list, or business hours editor.

## Install

### Vanilla JS (no build step)

```html
<script src="quickpick.min.js"></script>
<input id="picker" />

<script>
  Quickpick('#picker', ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']);
</script>
```

### React

```bash
# Copy src/components/ into your project, then:
import { AppointmentTimeSelector, BusinessHoursTimeSelector } from './components';
```

## Usage

### Vanilla JS

```js
// Simple array
Quickpick('#el', ['Red', 'Green', 'Blue']);

// With options
Quickpick('#el', {
  data: ['Red', 'Green', 'Blue'],
  placeholder: 'Pick a color',
  label: 'Favorite Color',
  columns: 3,
  width: '400px',
  value: 'Green',
  onChange: function(item) { console.log(item.value, item.label); }
});

// Value:label CSV string
Quickpick('#el', {
  data: 'CA:California,NY:New York,TX:Texas'
});

// Programmatic access
var handle = Quickpick('#el', ['A', 'B', 'C']);
handle.el;        // the web component element
handle.destroy(); // remove widget, restore original input
```

### React — Time Picker

```jsx
import { AppointmentTimeSelector } from './components';

<AppointmentTimeSelector
  selectedTime={time}
  onTimeChange={setTime}
  selectedDate={new Date()}
  businessHours={{
    monday:    { enabled: true, start: '09:00', end: '17:00' },
    tuesday:   { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday:  { enabled: true, start: '09:00', end: '17:00' },
    friday:    { enabled: true, start: '09:00', end: '17:00' },
    saturday:  { enabled: true, start: '10:00', end: '14:00' },
    sunday:    { enabled: false },
  }}
  label="Appointment Time"
/>
```

### React — Generic Select

```jsx
<AppointmentTimeSelector
  items={[
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
  ]}
  selectedValue={selected}
  onTimeChange={(item) => setSelected(item.value)}
  placeholder="Choose a state"
  label="US State"
/>
```

### React — Business Hours

```jsx
import { BusinessHoursTimeSelector } from './components';

<BusinessHoursTimeSelector
  startTime="09:00"
  endTime="17:00"
  onStartTimeChange={setStart}
  onEndTimeChange={setEnd}
/>
```

### Loading State

Both selectors accept a `loading` prop that renders a shimmer skeleton:

```jsx
<AppointmentTimeSelector loading label="Loading..." />
<BusinessHoursTimeSelector loading />
```

## Props

### AppointmentTimeSelector

| Prop | Type | Description |
|------|------|-------------|
| `selectedTime` | `string` | Current time value (HH:MM) |
| `onTimeChange` | `function` | Selection callback |
| `selectedDate` | `Date` | Determines which day's business hours to use |
| `businessHours` | `object` | Config per weekday |
| `items` | `array` | Array of `{value, label}` for generic select mode |
| `selectedValue` | `string` | Currently selected value (items mode) |
| `placeholder` | `string` | Input placeholder text |
| `label` | `string` | Label text above the input |
| `columns` | `number` | Override auto column count |
| `popupWidth` | `string` | `'auto'`, `'match-button'`, or CSS value |
| `width` | `string` | CSS width for the trigger + popup |
| `disabled` | `boolean` | Disable the selector |
| `loading` | `boolean` | Show shimmer skeleton |

### BusinessHoursTimeSelector

| Prop | Type | Description |
|------|------|-------------|
| `startTime` | `string` | Opening time (HH:MM) |
| `endTime` | `string` | Closing time (HH:MM) |
| `onStartTimeChange` | `function` | Start time callback |
| `onEndTimeChange` | `function` | End time callback |
| `width` | `string` | CSS width override |
| `disabled` | `boolean` | Disable both selectors |
| `loading` | `boolean` | Show shimmer skeleton |

## Behavior

- **Desktop**: hover to open, type to filter, Enter selects first match, Escape closes, Tab closes
- **Mobile**: tap to open, tap backdrop to close (input stays read-only)
- **Keyboard**: Arrow keys navigate the grid, Home/End jump to first/last, Escape closes
- **Accessibility**: `role="listbox"` / `role="option"`, `aria-selected`, `aria-haspopup`, `aria-controls`
- **Reduced motion**: shimmer animation disabled when `prefers-reduced-motion: reduce`
- **Auto-positioning**: popup flips above/below based on viewport space

## Development

```bash
npm install
npm run dev          # Start demo on port 3005
npm test             # Run 128 tests
npm run build:webcomponent  # Build dist/quickpick.min.js
```

## License

MIT
