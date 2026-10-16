import { Icon } from "../ui/Icon";
import "./PropertiesPanel.css";

export function PropertiesPanel() {
  return (
    <aside className="properties-panel" aria-label="Properties">
      <div className="properties-panel__heading">
        <div>
          <p className="properties-panel__eyebrow">Inspector</p>
          <h2>Properties</h2>
        </div>
        <button
          className="properties-panel__more"
          type="button"
          title="More property actions will be available in a future milestone"
        >
          •••
        </button>
      </div>
      <div className="properties-panel__empty-state">
        <div className="properties-panel__empty-icon" aria-hidden="true">
          <Icon name="settings" size={20} />
        </div>
        <p>Select an object to view its properties.</p>
        <span>Canvas elements will expose configurable options here.</span>
      </div>
    </aside>
  );
}
