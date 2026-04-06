import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./Calendar.css";
import CalendarSearchPanel from "./search/CalendarSearchPanel";
import mockSearcher from "./search/searchers/mockSearcher";
import apiSearcher from "./search/searchers/apiSearcher";
import authFetch from "../auth/authFetch";
import { getToken } from "../auth/tokenStorage";
import { isHoliday } from "./holidayUtils"; //祝日指定

import { supabase } from "../../lib/supabaseClient";

function toDate(dateStr, timeStr) {
  const t = timeStr?.trim() ? timeStr.trim() : "00:00";
  return new Date(`${dateStr}T${t}:00`);
}

export default function Calendar() {
  const calendarRef = useRef(null);

  const [viewTitle, setViewTitle] = useState(""); // 例: February 2026
  const calApi = () => calendarRef.current?.getApi();
  const goToday = () => calApi()?.today();
  const goPrev = () => calApi()?.prev();
  const goNext = () => calApi()?.next();

  const jumpToDate = (dateLike) => {
    const d = dateLike instanceof Date ? dateLike : new Date(dateLike);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const ymd = `${yyyy}-${mm}-${dd}`;

    setHighlightDate(ymd); // ←ハイライトしたい日を保存
    calApi()?.gotoDate(d); // ←月移動（/その日へ移動）

    // 1.2秒後に消す（好みで時間調整OK）
    setTimeout(() => setHighlightDate(null), 2000);
  };

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);

  const [creator, setCreator] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [myAnswer, setMyAnswer] = useState("");

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

  const [reminder, setReminder] = useState("none");

  // ===== 追加: アンケート関連 =====
  const [isSurvey, setIsSurvey] = useState(false);
  const [surveyContent, setSurveyContent] = useState("");
  const [allowAttend, setAllowAttend] = useState(false);
  const [allowAbsent, setAllowAbsent] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [responses, setResponses] = useState({
    attend: [],
    absent: [],
  });

  const [events, setEvents] = useState([]);

  const [highlightDate, setHighlightDate] = useState(null); // "YYYY-MM-DD"

  const [currentRange, setCurrentRange] = useState(null);

  // ===== DBからイベント取得（初期表示用） =====
  const pad = (n) => String(n).padStart(2, "0");
  const toLocalIsoSec = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours(),
    )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

  const getThisMonthRange = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
    return { start, end };
  };

const fetchEventsRange = async (startDate, endDate) => {
  const fromISO = startDate.toISOString();
  const toISO = endDate.toISOString();

  try {
    const res = await authFetch(
      `http://localhost:8080/api/events?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`
    );

    console.log("events fetch response", res);

    if (!res.ok) {
      throw new Error(`GET /api/events failed: ${res.status}`);
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624

    const dtos = await res.json();

    const mapped = dtos.map((dto) => ({
      id: String(dto.id),
      title: dto.title,
      start: dto.startAt ?? dto.start,
      end: dto.endAt ?? dto.end,
      extendedProps: {
        creator: dto.authorUsername,
        memo: dto.memo,

        // ← サーバーから来る値
        isSurvey: dto.isSurvey ?? false,
        surveyContent: dto.surveyContent ?? "",
        surveyOptions: dto.surveyOptions
          ? JSON.parse(dto.surveyOptions)
          : [],
        deadline: dto.deadline,

        // ← フロント用
        reminder: "none",
      },
    }));

    setEvents(mapped);

  } catch (e) {
    console.error(e);
    alert("イベント取得に失敗しました: " + e.message);
  }
};
<<<<<<< HEAD
=======
  };
>>>>>>> 8da2878a813c75043ec69756c66ad28a4d1f1464
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624

  // 月移動・表示範囲変更のたびに：タイトル更新＋その範囲をDBから再取得
  const handleDatesSet = async (arg) => {
    setViewTitle(arg.view.title);

    setCurrentRange({
      start: arg.start,
      end: arg.end,
    });

    await fetchEventsRange(arg.start, arg.end);
  };

  // ===== 新規作成 =====
  const openModalForDate = (dateStr) => {
    setEditingEventId(null);
    setSelectedDate(dateStr);
    setCreator(currentUserEmail);

    setTitle("");
    setMemo("");
    setStartTime("09:00");
    setEndTime("10:00");
    setReminder("none");

    // 追加: 初期化
    setIsSurvey(false);
    setSurveyContent("");
    setAllowAttend(false);
    setAllowAbsent(false);
    setDeadlineDate(dateStr);
    setDeadlineTime("23:59");

    setOpen(true);
  };

  const handleDateClick = (info) => {
    openModalForDate(info.dateStr);
  };

  // ===== 編集 =====
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;

    setEditingEventId(event.id);
    setSelectedDate(event.startStr.slice(0, 10));
    setCreator(event.extendedProps.creator || "");
    setTitle(event.title);
    setMemo(event.extendedProps.memo || "");
    setStartTime(event.startStr.slice(11, 16));
    setEndTime(event.endStr?.slice(11, 16) || "10:00");
    setReminder(event.extendedProps.reminder || "none");
    setIsSurvey(event.extendedProps.isSurvey || false);

    // 追加: アンケート情報を戻す
    setSurveyContent(event.extendedProps.surveyContent || "");

    const options = event.extendedProps.surveyOptions || [];
    setAllowAttend(options.includes("参加する"));
    setAllowAbsent(options.includes("参加しない"));

    if (event.extendedProps.deadline) {
      const d = new Date(event.extendedProps.deadline);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      setDeadlineDate(`${yyyy}-${mm}-${dd}`);
      setDeadlineTime(d.toTimeString().slice(0, 5));
    } else {
      setDeadlineDate(event.startStr.slice(0, 10));
      setDeadlineTime("23:59");
    }

    setOpen(true);
  };

  // ===== 保存 =====
  const handleSave = async () => {
    console.log("save mode:", editingEventId);

    if (!title.trim()) return;

    const start = toDate(selectedDate, startTime);
    const end = toDate(selectedDate, endTime);

    if (end <= start) {
      alert("終了時間は開始時間より後にしてください");
      return;
    }

    // 追加: アンケート用バリデーション
    let deadline = null;
    let surveyOptions = [];

    if (isSurvey) {
      if (!surveyContent.trim()) {
        alert("アンケート内容を入力してください");
        return;
      }

      if (allowAttend) surveyOptions.push("参加する");
      if (allowAbsent) surveyOptions.push("参加しない");

      if (surveyOptions.length === 0) {
        alert("参加する / 参加しない の少なくともどちらかを選んでください");
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

    if (editingEventId) {
      const pad = (n) => String(n).padStart(2, "0");

      const toLocalIso = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate(),
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624
  try {
    const res = await authFetch(
      `http://localhost:8080/api/events/${editingEventId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
<<<<<<< HEAD
=======
      try {
        const res = await authFetch(
          `http://localhost:8080/api/events/${editingEventId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
>>>>>>> 8da2878a813c75043ec69756c66ad28a4d1f1464
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624

        if (!res.ok) throw new Error("update failed");

        const updated = await res.json();

        const updatedEvent = {
          id: String(updated.id),
          title: updated.title,
          start: updated.startAt ?? updated.start,
          end: updated.endAt ?? updated.end,
          extendedProps: {
            creator: updated.authorUsername,
            memo: updated.memo,

            // 追加: フロントだけで保持
            reminder,
            isSurvey,
            surveyContent: isSurvey ? surveyContent : "",
            surveyOptions: isSurvey ? surveyOptions : [],
            deadline: isSurvey && deadline ? deadline.toISOString() : null,
          },
        };

        setEvents((prev) =>
          prev.map((e) => (e.id === editingEventId ? updatedEvent : e)),
        );

        setOpen(false);
        return;
      } catch (e) {
        console.error(e);
        alert("イベント作成者が違います。編集に失敗しました。");
        return;
      }
    } else {
      const pad = (n) => String(n).padStart(2, "0");

      const toLocalIso = (d) =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate(),
        )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

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

      try {
        const res = await authFetch("http://localhost:8080/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("create failed");

        const saved = await res.json();

        const newEvent = {
          id: String(saved.id),
          title: saved.title,
          start: saved.startAt ?? saved.start,
          end: saved.endAt ?? saved.end,
          extendedProps: {
            creator: saved.authorUsername,
            memo: saved.memo,

            // 追加: フロントだけで保持
            reminder,
            isSurvey,
            surveyContent: isSurvey ? surveyContent : "",
            surveyOptions: isSurvey ? JSON.stringify(surveyOptions) : null,
            deadline: isSurvey && deadline ? deadline.toISOString() : null,
          },
        };

        setEvents((prev) => [...prev, newEvent]);

        setOpen(false);
        return;
      } catch (e) {
        console.error(e);
        alert("保存に失敗しました");
        return;
      }
    }
  };

  // ===== 削除 =====
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

      if (!res.ok) throw new Error("delete failed");

      setEvents((prev) => prev.filter((e) => e.id !== editingEventId));

      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("イベント作成者が違います。削除に失敗しました。");
    }
  };


  // ===== 回答送信 ===== ← ★これ追加
const handleAnswer = async (answer) => {
  try {
    const res = await authFetch(
      `http://localhost:8080/api/events/${editingEventId}/answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      }
    );

    if (!res.ok) throw new Error("answer failed");

    alert("回答しました");

  } catch (e) {
    console.error(e);
    alert("回答に失敗しました");
  }
};

  // ===== ハイライト表示用：eventsに背景イベントを混ぜる =====
  const viewEvents = useMemo(() => {
    if (!highlightDate) return events;

    const start = `${highlightDate}T00:00:00`;

    const endDate = new Date(`${highlightDate}T00:00:00`);
    endDate.setDate(endDate.getDate() + 1);
    const end = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}T00:00:00`;

    const highlightBg = {
      id: "__highlight__",
      start,
      end,
      display: "background",
      backgroundColor: "rgba(255, 230, 0, 0.25)", // 見えるように少し色つけ
    };

    return [highlightBg, ...events];
  }, [events, highlightDate]);

  return (
    <div className="app-container notranslate" translate="no">
      {/* PC上の日本語/英語翻訳対策 */}

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
              <h3>
                {editingEventId ? "予定編集" : `${selectedDate} の予定追加`}
              </h3>

              {/* 作成者 */}
              <div className="creator-row">
                <span className="creator-label">作成者：</span>
                <span className="creator-value">{creator || "未ログイン"}</span>
              </div>

              {/* タイトル */}
              <div>
                <label>タイトル</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* メモ */}
              <div>
                <label>内容メモ</label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  rows="3"
                />
              </div>

              {/* 時間 */}
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

              {/* 通知 */}
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

<<<<<<< HEAD
<<<<<<< HEAD
{isSurvey && (
  <div style={{ marginTop: "12px" }}>
    {/* アンケート内容 */}
    <div>
      <label>アンケート内容</label>
      <textarea
        value={surveyContent}
        onChange={(e) => setSurveyContent(e.target.value)}
        rows="3"
      />
    </div>

    {/* 回答項目（作成用） */}
    <div>
      <label>回答項目</label>
      <div>
        <label style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={allowAttend}
            onChange={(e) => setAllowAttend(e.target.checked)}
          />
          参加する
        </label>
=======
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624
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

                  <div>
                    <label>回答項目</label>
                    <div>
                      <div>
                        <div style={{ display: "block" }}>
                          <input
                            type="checkbox"
                            checked={allowAttend}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAllowAttend(checked);
<<<<<<< HEAD
>>>>>>> 8da2878a813c75043ec69756c66ad28a4d1f1464
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624

                              if (checked) {
                                setAllowAbsent(false);
                              }

<<<<<<< HEAD
<<<<<<< HEAD
    {/* 締切 */}
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

    {/* ★ここから追加（回答ボタン） */}
    {editingEventId && (
      <div style={{ marginTop: "12px" }}>
        <label>回答する</label>

        <div style={{ marginTop: "6px" }}>
          <button onClick={() => handleAnswer("参加する")}>
            参加する
          </button>

          <button
            onClick={() => handleAnswer("参加しない")}
            style={{ marginLeft: "10px" }}
          >
            参加しない
          </button>
        </div>
      </div>
    )}
  </div>
)}
=======
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624
                              setResponses((prev) => {
                                const nextAttend = checked
                                  ? [
                                      ...prev.attend.filter(
                                        (name) => name !== currentUserEmail,
                                      ),
                                      currentUserEmail,
                                    ]
                                  : prev.attend.filter(
                                      (name) => name !== currentUserEmail,
                                    );

                                const nextAbsent = prev.absent.filter(
                                  (name) => name !== currentUserEmail,
                                );

                                return {
                                  attend: nextAttend,
                                  absent: nextAbsent,
                                };
                              });
                            }}
                          />
                          <span style={{ marginLeft: "6px" }}>参加する</span>
                        </div>

                        <div style={{ display: "block", marginTop: "4px" }}>
                          <input
                            type="checkbox"
                            checked={allowAbsent}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAllowAbsent(checked);

                              if (checked) {
                                setAllowAttend(false);
                              }

                              setResponses((prev) => {
                                const nextAbsent = checked
                                  ? [
                                      ...prev.absent.filter(
                                        (name) => name !== currentUserEmail,
                                      ),
                                      currentUserEmail,
                                    ]
                                  : prev.absent.filter(
                                      (name) => name !== currentUserEmail,
                                    );

                                const nextAttend = prev.attend.filter(
                                  (name) => name !== currentUserEmail,
                                );

                                return {
                                  attend: nextAttend,
                                  absent: nextAbsent,
                                };
                              });
                            }}
                          />
                          <span style={{ marginLeft: "6px" }}>参加しない</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 回答者一覧（編集不可） */}
                  <div
                    style={{
                      marginTop: "10px",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>回答者一覧</div>

                    <div
                      style={{
                        display: "flex",
                        gap: "24px",
                        marginTop: "10px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          paddingRight: "12px",
                          borderRight: "1px solid #ddd",
                        }}
                      >
                        <div>
                          <strong>参加する</strong>
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          {responses.attend.length > 0
                            ? responses.attend.map((name, index) => (
                                <div
                                  key={index}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {name}
                                </div>
                              ))
                            : "なし"}
                        </div>
                      </div>

                      <div
                        style={{
                          flex: 1,
                        }}
                      >
                        <div>
                          <strong>参加しない</strong>
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          {responses.absent.length > 0
                            ? responses.absent.map((name, index) => (
                                <div
                                  key={index}
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {name}
                                </div>
                              ))
                            : "なし"}
                        </div>
                      </div>
                    </div>
                  </div>

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
                </div>
              )}
<<<<<<< HEAD
>>>>>>> 8da2878a813c75043ec69756c66ad28a4d1f1464
=======
>>>>>>> 131fb03e00a725e9aa748b725098fc78e9a17624

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

        {/* ===== カレンダー ===== */}
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
          events={events}
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
            const creator = arg.event.extendedProps.creator;
            return (
              <div>
                {creator && (
                  <div style={{ fontSize: "10px", fontWeight: "bold" }}>
                    {creator}
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
