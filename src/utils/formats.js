export function listFromText(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function textFromList(value) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export function makeId(prefix) {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0")
  ].join("");
  return `${prefix}_${stamp}`;
}
