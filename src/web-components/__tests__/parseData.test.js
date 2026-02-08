/**
 * Tests for QuickpickAppointment._parseData static method.
 * Validates all supported data attribute formats.
 */
import QuickpickAppointment from '../quickpick-appointment';

describe('QuickpickAppointment._parseData', () => {
  const parse = QuickpickAppointment._parseData;

  // ─── JSON array of objects ──────────────────────────────────────

  describe('JSON array of objects', () => {
    test('parses value/label objects', () => {
      const input = '[{"value":"CA","label":"California"},{"value":"NY","label":"New York"}]';
      expect(parse(input)).toEqual([
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
      ]);
    });

    test('uses label as value fallback', () => {
      const input = '[{"label":"California"}]';
      expect(parse(input)).toEqual([
        { value: 'California', label: 'California' },
      ]);
    });

    test('uses value as label fallback', () => {
      const input = '[{"value":"CA"}]';
      expect(parse(input)).toEqual([
        { value: 'CA', label: 'CA' },
      ]);
    });

    test('coerces numeric values to strings', () => {
      const input = '[{"value":1,"label":"One"},{"value":2,"label":"Two"}]';
      expect(parse(input)).toEqual([
        { value: '1', label: 'One' },
        { value: '2', label: 'Two' },
      ]);
    });
  });

  // ─── JSON array of strings ─────────────────────────────────────

  describe('JSON array of strings', () => {
    test('parses string array with value=label', () => {
      const input = '["Red","Green","Blue"]';
      expect(parse(input)).toEqual([
        { value: 'Red', label: 'Red' },
        { value: 'Green', label: 'Green' },
        { value: 'Blue', label: 'Blue' },
      ]);
    });

    test('handles single-element array', () => {
      const input = '["Solo"]';
      expect(parse(input)).toEqual([{ value: 'Solo', label: 'Solo' }]);
    });
  });

  // ─── Simple CSV ────────────────────────────────────────────────

  describe('simple CSV', () => {
    test('parses comma-separated values with value=label', () => {
      expect(parse('Red,Green,Blue')).toEqual([
        { value: 'Red', label: 'Red' },
        { value: 'Green', label: 'Green' },
        { value: 'Blue', label: 'Blue' },
      ]);
    });

    test('trims whitespace around entries', () => {
      expect(parse(' Red , Green , Blue ')).toEqual([
        { value: 'Red', label: 'Red' },
        { value: 'Green', label: 'Green' },
        { value: 'Blue', label: 'Blue' },
      ]);
    });

    test('filters out empty entries', () => {
      expect(parse('Red,,Green,,')).toEqual([
        { value: 'Red', label: 'Red' },
        { value: 'Green', label: 'Green' },
      ]);
    });

    test('handles single value', () => {
      expect(parse('Solo')).toEqual([{ value: 'Solo', label: 'Solo' }]);
    });
  });

  // ─── CSV with value:label pairs ────────────────────────────────

  describe('CSV with value:label pairs', () => {
    test('parses colon-separated value:label pairs', () => {
      expect(parse('CA:California,NY:New York')).toEqual([
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
      ]);
    });

    test('trims whitespace around values and labels', () => {
      expect(parse(' CA : California , NY : New York ')).toEqual([
        { value: 'CA', label: 'California' },
        { value: 'NY', label: 'New York' },
      ]);
    });

    test('handles mixed simple and value:label entries', () => {
      expect(parse('CA:California,Texas,NY:New York')).toEqual([
        { value: 'CA', label: 'California' },
        { value: 'Texas', label: 'Texas' },
        { value: 'NY', label: 'New York' },
      ]);
    });
  });

  // ─── Edge cases ────────────────────────────────────────────────

  describe('edge cases', () => {
    test('returns null for null input', () => {
      expect(parse(null)).toBeNull();
    });

    test('returns null for undefined input', () => {
      expect(parse(undefined)).toBeNull();
    });

    test('returns null for empty string', () => {
      expect(parse('')).toBeNull();
    });

    test('returns null for whitespace-only string', () => {
      expect(parse('   ')).toBeNull();
    });

    test('returns null for empty JSON array', () => {
      expect(parse('[]')).toBeNull();
    });

    test('returns null for invalid JSON and logs warning', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      expect(parse('[invalid json')).toBeNull();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    test('handles JSON with extra whitespace', () => {
      const input = '  [  { "value" : "A" , "label" : "Alpha" }  ]  ';
      expect(parse(input)).toEqual([{ value: 'A', label: 'Alpha' }]);
    });
  });
});
