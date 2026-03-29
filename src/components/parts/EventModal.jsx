import BaseModal from "./BaseModal";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import EventForm from "./EventForm";

export default function EventModal(props) {
  const {
    open,
    selectedDate,
    title,
    memo,
    startTime,
    endTime,
    reminder,
    reminderOptions,
    onClose,
    onChangeTitle,
    onChangeMemo,
    onChangeStartTime,
    onChangeEndTime,
    onChangeReminder,
    onSave,
  } = props;

  if (!open) return null;

  return (
    <BaseModal onClose={onClose}>
      <ModalHeader title="投稿" />

      <EventForm
        selectedDate={selectedDate}
        title={title}
        memo={memo}
        startTime={startTime}
        endTime={endTime}
        reminder={reminder}
        reminderOptions={reminderOptions}
        onChangeTitle={onChangeTitle}
        onChangeMemo={onChangeMemo}
        onChangeStartTime={onChangeStartTime}
        onChangeEndTime={onChangeEndTime}
        onChangeReminder={onChangeReminder}
      />

      <ModalFooter onClose={onClose} onSave={onSave} />
    </BaseModal>
  );
}