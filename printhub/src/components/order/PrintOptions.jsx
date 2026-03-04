export default function PrintOptions({ options, onChange }) {
  const set = (key, val) => onChange({ ...options, [key]: val });

  const RadioGroup = ({ label, field, choices }) => (
    <div>
      <p className="label">{label}</p>
      <div className="flex flex-wrap gap-2">
        {choices.map(({ value, text }) => (
          <button
            key={value}
            type="button"
            onClick={() => set(field, value)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all min-h-[44px]
              ${options[field] === value
                ? 'border-primary-600 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50'}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('copies', Math.max(1, options.copies - 1))}
              className="w-11 h-11 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-primary-400 hover:bg-primary-50 font-bold text-lg transition-all flex items-center justify-center"
              aria-label="Decrease copies"
            >−</button>
            <input
              id="copies"
              type="number"
              min={1}
              max={100}
              value={options.copies}
              onChange={e => set('copies', Math.max(1, parseInt(e.target.value) || 1))}
              className="input text-center w-20"
            />
            <button
              type="button"
              onClick={() => set('copies', Math.min(100, options.copies + 1))}
              className="w-11 h-11 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-primary-400 hover:bg-primary-50 font-bold text-lg transition-all flex items-center justify-center"
              aria-label="Increase copies"
            >+</button>
          </div>
        </div>
      </div>

      <RadioGroup label="Binding" field="binding" choices={[
        { value: 'none', text: 'No Binding' },
        { value: 'spiral', text: 'Spiral — GH₵ 5' },
        { value: 'hardcover', text: 'Hardcover — GH₵ 15' },
      ]} />

      <div>
        <label htmlFor="pageRange" className="label">Page Range <span className="text-gray-400 font-normal">(optional)</span></label>
        <input
          id="pageRange"
          type="text"
          placeholder="e.g. 1–10, 15–20  (leave blank for all pages)"
          value={options.pageRange}
          onChange={e => set('pageRange', e.target.value)}
          className="input"
        />
      </div>
    </div>
  );
}
