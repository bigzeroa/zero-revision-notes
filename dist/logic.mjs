export function validTime(value) {
  if (!value.trim()) return true;
  return /^(?:\d{1,3}:[0-5]\d|\d{1,3}:[0-5]\d:[0-5]\d)$/.test(value.trim());
}
export function complete(note) {
  return Boolean(note.clip.trim() && note.version.trim() && note.change.trim() && validTime(note.time));
}
export function reviewText(project, approver, notes) {
  const ready = notes.filter(complete);
  if (!ready.length) return '';
  const header = [`Video review: ${project.trim() || 'Untitled project'}`];
  if (approver.trim()) header.push(`Final approver: ${approver.trim()}`);
  header.push(`${ready.length} ${ready.length === 1 ? 'note' : 'notes'}`);
  const body = ready.map((n, i) => `${i + 1}. ${n.clip.trim()} | ${n.version.trim()} | ${n.time.trim() || 'Whole clip'}\n${n.priority}\n${n.change.trim()}`).join('\n\n');
  return `${header.join('\n')}\n\n${body}\n\nPlease resolve conflicting requests before editing. Approval refers to the versions listed above.`;
}
