import BaseFieldGroup from "./BaseFieldGroup";
import BaseInput from "./BaseInput";
import BaseTextarea from "./BaseTextarea";
import BaseTimeInput from "./BaseTimeInput";
import BaseSelect from "./BaseSelect";

export default function EventForm({
  selectedDate,
  title,
  memo,
  startTime,
  endTime,
  reminder,
  reminderOptions,
  onChangeTitle,
  onChangeMemo,
  onChangeStartTime,
  onChangeEndTime,
  onChangeReminder,
}) {
  return (
    <>
      <BaseFieldGroup label="日付">
        <div className="modal-value">{selectedDate}</div>
      </BaseFieldGroup>

      <BaseFieldGroup label="タイトル">
        <BaseInput value={title} onChange={onChangeTitle} />
      </BaseFieldGroup>

      <BaseFieldGroup label="内容のメモ">
        <BaseTextarea value={memo} onChange={onChangeMemo} rows={2} />
      </BaseFieldGroup>

      <BaseFieldGroup label="時間">
        <BaseTimeInput
          value={startTime}
          onChange={onChangeStartTime}
        />
        <span className="dash">～</span>
        <BaseTimeInput
          value={endTime}
          min={startTime}
          onChange={onChangeEndTime}
        />
      </BaseFieldGroup>

      <BaseFieldGroup label="通知">
        <BaseSelect
          value={reminder}
          onChange={onChangeReminder}
          options={reminderOptions}
        />
      </BaseFieldGroup>
    </>
  );
}