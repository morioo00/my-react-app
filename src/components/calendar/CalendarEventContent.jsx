// src/components/calendar/CalendarEventContent.jsx
// アンケート付き、期限前、期限切れを管理

export default function CalendarEventContent({ event }) {
  const creator = event.extendedProps.creator;
  const isSurvey = event.extendedProps.isSurvey;
  const deadline = event.extendedProps.deadline;

  // 現在時刻と締切を比較
  const now = new Date();
  const deadlineDate = deadline ? new Date(deadline) : null;
  // アンケート状態判定
  const isSurveyRecruiting =
    isSurvey && deadlineDate && deadlineDate > now;
  const isSurveyClosed =
    isSurvey && deadlineDate && deadlineDate <= now;

  return (
    <div>
      {creator && (
        <div style={{ fontSize: "10px", fontWeight: "bold" }}>

          {isSurveyRecruiting && (
            <span
              style={{ marginRight: "4px" }}
              title="アンケート募集中"
            >
              📋🟢
            </span>
          )}

          {isSurveyClosed && (
            <span
              style={{ marginRight: "4px" }}
              title="アンケート締切"
            >
              📋🔴
            </span>
          )}

          <span>{creator}</span>
        </div>
      )}

      <div>{event.title}</div>
    </div>
  );
}