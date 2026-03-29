import BaseFieldLabel from "./BaseFieldLabel";

export default function BaseFieldGroup({ label, children }) {
  return (
    <div className="modal-field">
      <BaseFieldLabel>{label}</BaseFieldLabel>
      {children}
    </div>
  );
}