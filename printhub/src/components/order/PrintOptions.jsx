export default function PrintOptions({ options, onChange }) {
  const set = (key, val) => onChange({ ...options, [key]: val });

  const RadioGroup = ({ label, field, choices }) => (
    <div>
      <label className="label">{label}</label>
      <div className="flex flex-wrap gap-2">
        {choices.map(({ value, text }) => (
          <button
            key={value}
            type="button"
            onClick={() => set(field, value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all
              ${options[field] === value
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <RadioGroup label="Paper Size" field="paperSize" choices={[
        { value: 'a4', text: 'A4' },
        { value: 'a3', text: 'A3' },
        { value: 'letter', text: 'Letter' },
      ]} />

      <RadioGroup label="Color Mode" field="colorMode" choices={[
        { value: 'bw', text: 'Black & White' },
        { value: 'color', text: 'Full Color' },
      ]} />

      <RadioGroup label="Sides" field="sides" choices={[
        { value: 'single', text: 'Single-sided' },
        { value: 'double', text: 'Double-sided' },
      ]} />

      <div>
        <label htmlFor="copies" className="label">Number of Copies</label>
        <input
          id="copies"
          type="number"
          min={1}
          max={100}
          value={options.copies}
          onChange={e => set('copies', Math.max(1, parseInt(e.target.value) || 1))}
          className="input w-28"
        />
      </div>

      <RadioGroup label="Binding" field="binding" choices={[
        { value: 'none', text: 'No Binding' },
        { value: 'spiral', text: 'Spiral (GH₵ 5)' },
        { value: 'hardcover', text: 'Hardcover (GH₵ 15)' },
      ]} />

      <div>
        <label htmlFor="pageRange" className="label">Page Range (optional)</label>
        <input
          id="pageRange"
          type="text"
          placeholder="e.g. 1–10, 15–20"
          value={options.pageRange}
          onChange={e => set('pageRange', e.target.value)}
          className="input"
        />
        <p className="text-xs text-gray-400 mt-1">Leave blank to print all pages</p>
      </div>
    </div>
  );
}
