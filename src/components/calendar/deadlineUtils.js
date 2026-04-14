// 締め切りを過ぎているか判定する関数
export function isDeadlinePassed(deadlineDate, deadlineTime) {
  if (!deadlineDate) return false;

  const now = new Date();
  const deadline = new Date(
    `${deadlineDate}T${deadlineTime || "23:59"}:00`,
  );

  return now > deadline;
}