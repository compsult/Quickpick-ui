# Quickpick UI

Fast, touch-friendly picker for React and vanilla JS. Type to filter on desktop, tap to select on mobile.

Works as a time picker, generic select list, or business hours editor.

[Live Demo](https://compsult.github.io/Quickpick-ui/)

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
| `autoSelectOnTab` | `boolean` | Auto-select first option on tab-through (default `false`) |

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
| `autoSelectOnTab` | `boolean` | Auto-select first option on tab-through (default `false`) |

## Tab-Through Auto-Select

Enable `autoSelectOnTab` to let keyboard users fill forms by tabbing alone. When a user tabs into a widget, the dropdown opens automatically. If they tab out without typing or selecting anything, the first available option is auto-selected. This is ideal for repetitive data entry where the most common choice is the first item in the list.

- Tabbing in opens the dropdown and focuses the input (desktop only)
- Tabbing out with no interaction auto-selects the first item
- Typing or arrow-navigating counts as interaction — their choice is preserved
- Existing values are never overwritten
- Opt-in: disabled by default, no breaking changes

```jsx
// React
<AppointmentTimeSelector items={states} autoSelectOnTab ... />
<BusinessHoursTimeSelector autoSelectOnTab ... />
```

```js
// Vanilla JS
Quickpick('#el', { data: ['A', 'B', 'C'], autoSelectOnTab: true });
```

```html
<!-- Web component attribute -->
<quickpick-appointment data="Red,Green,Blue" auto-select-on-tab></quickpick-appointment>
```

## Behavior

- **Desktop**: hover to open, type to filter, Enter selects first match, Escape closes, Tab closes
- **Mobile**: tap to open, tap backdrop to close (input stays read-only)
- **Keyboard**: Arrow keys navigate the grid, Home/End jump to first/last, Escape closes
- **Tab-through**: with `autoSelectOnTab`, Tab in opens the dropdown; Tab out auto-selects the first option if no interaction occurred
- **Accessibility**: `role="listbox"` / `role="option"`, `aria-selected`, `aria-haspopup`, `aria-controls`
- **Reduced motion**: shimmer animation disabled when `prefers-reduced-motion: reduce`
- **Auto-positioning**: popup flips above/below based on viewport space

## Development

```bash
npm install
npm run dev          # Start demo on port 3005
npm test             # Run 142 tests
npm run build:webcomponent  # Build dist/quickpick.min.js
```

## License

MIT
