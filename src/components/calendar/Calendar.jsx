import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";
import CalendarSearchPanel from "./search/CalendarSearchPanel";
import apiSearcher from "./search/searchers/apiSearcher";
import authFetch from "../auth/authFetch";
import { isHoliday } from "./holidayUtils";
import { supabase } from "../../lib/supabaseClient";

function toDate(dateStr, timeStr) {
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function toLocalIso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateToInputValue(dateLike) {
  const d = new Date(dateLike);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mapDtoToEvent(dto) {
  let surveyOptions = [];

  try {
    if (Array.isArray(dto.surveyOptions)) {
      surveyOptions = dto.surveyOptions;
    } else if (typeof dto.surveyOptions === "string" && dto.surveyOptions) {
      surveyOptions = JSON.parse(dto.surveyOptions);
    }
  } catch (e) {
    console.error("surveyOptions parse error:", e);
    surveyOptions = [];
  }

  return {
    id: String(dto.id),
    title: dto.title,
    start: dto.startAt ?? dto.start,
    end: dto.endAt ?? dto.end,
    extendedProps: {
      creator: dto.authorUsername ?? dto.creator ?? "",
      memo: dto.memo ?? "",
      reminder: dto.reminder ?? "none", // ここ整理
      isSurvey: dto.isSurvey ?? false,
      surveyContent: dto.surveyContent ?? "",
      surveyOptions,
      deadline: dto.deadline ?? null,
      myAnswer: dto.myAnswer ?? "",
    },
  };
}

export default function Calendar() {
  const calendarRef = useRef(null);

  const [viewTitle, setViewTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const [creator, setCreator] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [reminder, setReminder] = useState("none");

  // ===== ここ整理: アンケート関連 =====
  const [isSurvey, setIsSurvey] = useState(false);
  const [surveyContent, setSurveyContent] = useState("");
  const [allowAttend, setAllowAttend] = useState(false);
  const [allowAbsent, setAllowAbsent] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [myAnswer, setMyAnswer] = useState("");
  const [answerSelection, setAnswerSelection] = useState("");
  const [selfAnswerSelection, setSelfAnswerSelection] = useState("");

  const [events, setEvents] = useState([]);
  const [highlightDate, setHighlightDate] = useState(null);

  const calApi = () => calendarRef.current?.getApi();
  const goToday = () => calApi()?.today();
  const goPrev = () => calApi()?.prev();
  const goNext = () => calApi()?.next();

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("getUser error:", error);
          return;
        }

        const email = data?.user?.email || "";
        setCreator(email);
        setCurrentUserEmail(email);
      } catch (e) {
        console.error("fetchLoggedInUser unexpected error:", e);
      }
    };

    fetchLoggedInUser();
  }, []);

  const reminderOptions = useMemo(
    () => [
      { value: "none", label: "なし" },
      { value: "5m", label: "5分前" },
      { value: "10m", label: "10分前" },
      { value: "30m", label: "30分前" },
      { value: "60m", label: "1時間前" },
    ],
    [],
  );

  const fetchEventsRange = async (startDate, endDate) => {
    const fromISO = startDate.toISOString();
    const toISO = endDate.toISOString();

    try {
      const res = await authFetch(
        `http://localhost:8080/api/events?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
      );

      if (!res.ok) {
        throw new Error(`GET /api/events failed: ${res.status}`);
      }

      const dtos = await res.json();
      const mapped = dtos.map(mapDtoToEvent);
      setEvents(mapped);
    } catch (e) {
      console.error(e);
      alert("イベント取得に失敗しました: " + e.message);
    }
  };

  const handleDatesSet = async (arg) => {
    setViewTitle(arg.view.title);
    await fetchEventsRange(arg.start, arg.end);
  };

  const jumpToDate = (dateLike) => {
    const d = dateLike instanceof Date ? dateLike : new Date(dateLike);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const ymd = `${yyyy}-${mm}-${dd}`;

    setHighlightDate(ymd);
    calApi()?.gotoDate(d);

    setTimeout(() => setHighlightDate(null), 2000);
  };

  const resetFormForCreate = (dateStr) => {
    setEditingEventId(null);
    setSelectedDate(dateStr);
    setCreator(currentUserEmail);

    setTitle("");
    setMemo("");
    setStartTime("09:00");
    setEndTime("10:00");
    setReminder("none");

    // ここ整理
    setIsSurvey(false);
    setSurveyContent("");
    setAllowAttend(false);
    setAllowAbsent(false);
    setDeadlineDate(dateStr);
    setDeadlineTime("23:59");
    setMyAnswer("");
    setAnswerSelection("");
    setSelfAnswerSelection("");
  };

  const openModalForDate = (dateStr) => {
    resetFormForCreate(dateStr);
    setOpen(true);
  };

  const handleDateClick = (info) => {
    openModalForDate(info.dateStr);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const options = event.extendedProps.surveyOptions || [];

    setEditingEventId(event.id);
    setSelectedDate(event.startStr.slice(0, 10));
    setCreator(event.extendedProps.creator || "");
    setTitle(event.title || "");
    setMemo(event.extendedProps.memo || "");
    setStartTime(event.startStr.slice(11, 16));
    setEndTime(event.endStr?.slice(11, 16) || "10:00");
    setReminder(event.extendedProps.reminder || "none");

    setIsSurvey(event.extendedProps.isSurvey || false);
    setSurveyContent(event.extendedProps.surveyContent || "");
    setAllowAttend(options.includes("参加する"));
    setAllowAbsent(options.includes("参加しない"));
    const existingAnswer = event.extendedProps.myAnswer || "";
    setMyAnswer(existingAnswer);
    setAnswerSelection(existingAnswer);
    setSelfAnswerSelection(existingAnswer);

    if (event.extendedProps.deadline) {
      const deadline = new Date(event.extendedProps.deadline);
      setDeadlineDate(formatDateToInputValue(deadline));
      setDeadlineTime(deadline.toTimeString().slice(0, 5));
    } else {
      setDeadlineDate(event.startStr.slice(0, 10));
      setDeadlineTime("23:59");
    }

    setOpen(true);
  };

  const buildSurveyOptions = () => {
    const options = [];
    if (allowAttend) options.push("参加する");
    if (allowAbsent) options.push("参加しない");
    return options;
  };

  const handleSave = async () => {
    const isAuthor = creator === currentUserEmail;

    if (editingEventId && isSurvey && !isAuthor) {
      if (!answerSelection) {
        alert("回答を選択してください");
        return;
      }

      try {
        const res = await authFetch(
          `http://localhost:8080/api/events/${editingEventId}/answer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: answerSelection }),
          },
        );

        if (!res.ok) {
          throw new Error("answer failed");
        }

        setEvents((prev) =>
          prev.map((e) =>
            e.id === editingEventId
              ? {
                  ...e,
                  extendedProps: {
                    ...e.extendedProps,
                    myAnswer: answerSelection,
                  },
                }
              : e,
          ),
        );
        setMyAnswer(answerSelection);
        alert("回答を保存しました");
        setOpen(false);
      } catch (e) {
        console.error(e);
        alert("回答の保存に失敗しました");
      }
      return;
    }

    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    const start = toDate(selectedDate, startTime);
    const end = toDate(selectedDate, endTime);

    if (end <= start) {
      alert("終了時間は開始時間より後にしてください");
      return;
    }

    let deadline = null;
    let surveyOptions = [];

    if (isSurvey) {
      if (!surveyContent.trim()) {
        alert("アンケート内容を入力してください");
        return;
      }

      surveyOptions = buildSurveyOptions();

      if (surveyOptions.length === 0) {
        alert("参加する / 参加しない の少なくともどちらかを選んでください");
        return;
      }

      if (selfAnswerSelection && !surveyOptions.includes(selfAnswerSelection)) {
        alert("自分の回答は回答項目に含まれている必要があります");
        return;
      }

      if (!deadlineDate) {
        alert("締切日を入力してください");
        return;
      }

      deadline = toDate(deadlineDate, deadlineTime);

      if (deadline >= start) {
        alert("締切は開始時間より前にしてください");
        return;
      }
    }

    const payload = {
      title: title.trim(),
      memo: memo ?? "",
      startAt: toLocalIso(start),
      endAt: toLocalIso(end),
      isSurvey,
      surveyContent: isSurvey ? surveyContent : null,
      surveyOptions: isSurvey ? JSON.stringify(surveyOptions) : null,
      deadline: isSurvey && deadline ? deadline.toISOString() : null,
    };

    const url = editingEventId
      ? `http://localhost:8080/api/events/${editingEventId}`
      : "http://localhost:8080/api/events";

    const method = editingEventId ? "PUT" : "POST";

    try {
      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`${method} failed`);
      }

      const savedOrUpdated = await res.json();
      const savedEventId = String(savedOrUpdated.id);

      const normalizedEvent = {
        id: String(savedOrUpdated.id),
        title: savedOrUpdated.title,
        start: savedOrUpdated.startAt ?? savedOrUpdated.start,
        end: savedOrUpdated.endAt ?? savedOrUpdated.end,
        extendedProps: {
          creator: savedOrUpdated.authorUsername ?? creator,
          memo: savedOrUpdated.memo ?? memo,
          reminder,
          isSurvey,
          surveyContent: isSurvey ? surveyContent : "",
          surveyOptions: isSurvey ? surveyOptions : [],
          deadline: isSurvey && deadline ? deadline.toISOString() : null,
        },
      };

      if (editingEventId) {
        setEvents((prev) =>
          prev.map((e) => (e.id === editingEventId ? normalizedEvent : e)),
        );
      } else {
        setEvents((prev) => [...prev, normalizedEvent]);
      }

      if (isSurvey && selfAnswerSelection) {
        const answerRes = await authFetch(
          `http://localhost:8080/api/events/${savedEventId}/answer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: selfAnswerSelection }),
          },
        );

        if (!answerRes.ok) {
          throw new Error("self answer save failed");
        }

        setMyAnswer(selfAnswerSelection);
      }

      setOpen(false);
    } catch (e) {
      console.error(e);
      alert(editingEventId ? "更新に失敗しました" : "保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    if (!editingEventId) return;
    if (!confirm("この予定を削除しますか？")) return;

    try {
      const res = await authFetch(
        `http://localhost:8080/api/events/${editingEventId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("delete failed");
      }

      setEvents((prev) => prev.filter((e) => e.id !== editingEventId));
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  const viewEvents = useMemo(() => {
    if (!highlightDate) return events;

    const start = `${highlightDate}T00:00:00`;

    const endDate = new Date(`${highlightDate}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);

    const end = `${endDate.getFullYear()}-${String(
      endDate.getMonth() + 1,
    ).padStart(2, "0")}-${String(endDate.getDate()).padStart(
      2,
      "0",
    )}T00:00:00`;

    const highlightBg = {
      id: "__highlight__",
      start,
      end,
      display: "background",
      backgroundColor: "rgba(255, 230, 0, 0.25)",
    };

    return [highlightBg, ...events];
  }, [events, highlightDate]);

  return (
    <div className="app-container notranslate" translate="no">
      <div className="calendar-area">
        <CalendarSearchPanel
          title={viewTitle || "Calendar"}
          rightControls={
            <>
              <button className="calBtn" type="button" onClick={goToday}>
                today
              </button>
              <button className="calBtn" type="button" onClick={goPrev}>
                ‹
              </button>
              <button className="calBtn" type="button" onClick={goNext}>
                ›
              </button>
            </>
          }
          searcher={apiSearcher}
          onJumpToDate={jumpToDate}
        />

        {open && (
          <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>{editingEventId ? "予定編集" : `${selectedDate} の予定追加`}</h3>

              <div className="creator-row">
                <span className="creator-label">作成者：</span>
                <span className="creator-value">{creator || "未ログイン"}</span>
              </div>

              <div>
                <label>タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label>内容メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows="3"
                />
              </div>

              <div>
                <label>開始時間</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label>終了時間</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              <div>
                <label>通知</label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                >
                  {reminderOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isSurvey}
                    onChange={(e) => setIsSurvey(e.target.checked)}
                  />
                  {editingEventId
                    ? "アンケートを表示する"
                    : "アンケートを作成する"}
                </label>
              </div>

              {isSurvey && (
                <div style={{ marginTop: "12px" }}>
                  <div>
                    <label>アンケート内容</label>
                    <textarea
                      value={surveyContent}
                      onChange={(e) => setSurveyContent(e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div style={{ marginTop: "10px" }}>
                    <label>回答項目</label>

                    <div style={{ marginTop: "6px" }}>
                      {(editingEventId && creator !== currentUserEmail) ? (
                        <>
                          {allowAttend && (
                            <label style={{ display: "block" }}>
                              <input
                                type="checkbox"
                                checked={answerSelection === "参加する"}
                                onChange={(e) =>
                                  setAnswerSelection(
                                    e.target.checked ? "参加する" : "",
                                  )
                                }
                              />
                              参加する
                            </label>
                          )}

                          {allowAbsent && (
                            <label
                              style={{ display: "block", marginTop: "4px" }}
                            >
                              <input
                                type="checkbox"
                                checked={answerSelection === "参加しない"}
                                onChange={(e) =>
                                  setAnswerSelection(
                                    e.target.checked ? "参加しない" : "",
                                  )
                                }
                              />
                              参加しない
                            </label>
                          )}
                        </>
                      ) : (
                        <>
                          <label style={{ display: "block" }}>
                            <input
                              type="checkbox"
                              checked={allowAttend}
                              onChange={(e) => setAllowAttend(e.target.checked)}
                            />
                            参加する
                          </label>

                          <label style={{ display: "block", marginTop: "4px" }}>
                            <input
                              type="checkbox"
                              checked={allowAbsent}
                              onChange={(e) => setAllowAbsent(e.target.checked)}
                            />
                            参加しない
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  {(creator === currentUserEmail || !editingEventId) && (
                    <div style={{ marginTop: "10px" }}>
                      <label>自分の参加可否（任意）</label>
                      <div style={{ marginTop: "6px" }}>
                        {allowAttend && (
                          <label style={{ display: "block" }}>
                            <input
                              type="checkbox"
                              checked={selfAnswerSelection === "参加する"}
                              onChange={(e) =>
                                setSelfAnswerSelection(
                                  e.target.checked ? "参加する" : "",
                                )
                              }
                            />
                            参加する
                          </label>
                        )}

                        {allowAbsent && (
                          <label style={{ display: "block", marginTop: "4px" }}>
                            <input
                              type="checkbox"
                              checked={selfAnswerSelection === "参加しない"}
                              onChange={(e) =>
                                setSelfAnswerSelection(
                                  e.target.checked ? "参加しない" : "",
                                )
                              }
                            />
                            参加しない
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <label>回答締切</label>
                    <div>
                      <input
                        type="date"
                        value={deadlineDate}
                        onChange={(e) => setDeadlineDate(e.target.value)}
                      />
                      <input
                        type="time"
                        value={deadlineTime}
                        onChange={(e) => setDeadlineTime(e.target.value)}
                        style={{ marginTop: "8px" }}
                      />
                    </div>
                  </div>

                  {editingEventId && creator !== currentUserEmail && (
                    <div style={{ marginTop: "12px" }}>
                      <label>回答は「更新」で保存されます</label>
                      {myAnswer && (
                        <div style={{ marginTop: "8px", fontSize: "14px" }}>
                          あなたの回答: <strong>{myAnswer}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: "15px" }}>
                <button onClick={handleSave}>
                  {editingEventId ? "更新" : "保存"}
                </button>

                {editingEventId && (
                  <button
                    onClick={handleDelete}
                    style={{
                      marginLeft: "10px",
                      background: "#e74c3c",
                      color: "white",
                    }}
                  >
                    削除
                  </button>
                )}

                <button
                  onClick={() => setOpen(false)}
                  style={{ marginLeft: "10px" }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="100%"
          expandRows={true}
          headerToolbar={false}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={viewEvents} // ここ変更
          dayCellClassNames={(arg) => {
            const classes = [];

            if (isHoliday(arg.date)) {
              classes.push("holiday");
            }

            if (highlightDate) {
              const y = arg.date.getFullYear();
              const m = String(arg.date.getMonth() + 1).padStart(2, "0");
              const d = String(arg.date.getDate()).padStart(2, "0");
              const ymd = `${y}-${m}-${d}`;

              if (ymd === highlightDate) {
                classes.push("jump-highlight");
              }
            }

            return classes;
          }}
          eventContent={(arg) => {
            const creatorName = arg.event.extendedProps.creator;

            return (
              <div>
                {creatorName && (
                  <div style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {creatorName}
                  </div>
                )}
                <div>{arg.event.title}</div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
