import "./WorksheetPicker.css";

interface WorksheetPickerProps {
  fileName: string;
  sheetNames: string[];
  onCancel: () => void;
  onSelect: (sheetName: string) => void;
}

export function WorksheetPicker({
  fileName,
  sheetNames,
  onCancel,
  onSelect,
}: WorksheetPickerProps) {
  return (
    <div className="worksheet-picker__backdrop" role="presentation">
      <section
        className="worksheet-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="worksheet-picker-title"
      >
        <p className="workspace__eyebrow">Excel workbook</p>
        <h2 id="worksheet-picker-title">Select a worksheet</h2>
        <p className="worksheet-picker__file">{fileName}</p>
        <div className="worksheet-picker__list">
          {sheetNames.map((sheetName) => (
            <button
              key={sheetName}
              type="button"
              onClick={() => onSelect(sheetName)}
            >
              <span className="worksheet-picker__radio" aria-hidden="true" />
              {sheetName}
            </button>
          ))}
        </div>
        <button
          className="worksheet-picker__cancel"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}
