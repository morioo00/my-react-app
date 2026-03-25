export const postDate = async (date) => {
  await fetch("/api/date", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date })
  })
}