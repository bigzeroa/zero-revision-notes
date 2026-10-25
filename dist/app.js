import {complete, validTime, reviewText} from './logic.mjs';
const $ = (s) => document.querySelector(s);
const notesBox = $('#notes');
let removed = null;
let dirty = false;
let noteId = 0;
const readNotes = () => [...notesBox.querySelectorAll('.note')].map(el => Object.fromEntries([...el.querySelectorAll('[data-field]')].map(f => [f.dataset.field, f.value])));
const status = (message) => { $('#status').textContent = message; };
function update() {
  const notes = readNotes();
  const count = notes.filter(complete).length;
  $('#count').textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
  const text = reviewText($('#project').value, $('#approver').value, notes);
  $('#preview').textContent = text || 'Add a clip ID, version, and requested change to see your review sheet here.';
  [...notesBox.querySelectorAll('.note')].forEach((el,i) => {
    el.querySelector('.note-number').textContent = i + 1;
    el.querySelector('.remove').setAttribute('aria-label', `Remove note ${i+1}`);
    const invalid = !validTime(notes[i].time);
    el.querySelector('[data-field="time"]').setAttribute('aria-invalid', String(invalid));
    el.querySelector('.note-error').textContent = invalid ? 'Use a timecode such as 00:08 or 01:02:30, or leave it blank.' : '';
  });
  $('#copy-fallback').hidden = true;
  status(count ? `${count} complete ${count === 1 ? 'note is' : 'notes are'} ready. Incomplete notes stay out of the export.` : 'Add a clip ID, version, and requested change. Timecode is optional.');
}
function addNote(data = {}, focus = false) {
  const el = $('#note-template').content.firstElementChild.cloneNode(true);
  const hint = el.querySelector('.field-hint');
  hint.id = `time-help-${++noteId}`;
  el.querySelector('[data-field="time"]').setAttribute('aria-describedby',hint.id);
  for (const field of el.querySelectorAll('[data-field]')) {
    if (data[field.dataset.field] !== undefined) field.value = data[field.dataset.field];
    field.addEventListener('input', () => {dirty = true; update();});
  }
  el.querySelector('.remove').addEventListener('click', () => {
    removed = {data:readNotes()[[...notesBox.children].indexOf(el)],index:[...notesBox.children].indexOf(el)};
    el.remove(); dirty = true; $('#undo').hidden = false; update(); $('#undo').focus();
  });
  notesBox.append(el); update();
  if (focus) el.querySelector('input').focus();
  return el;
}
function exportText() {
  const notes = readNotes();
  const pending = notes.some(n => !complete(n) && Object.entries(n).some(([key,value]) => key !== 'priority' && value.trim()));
  if (pending) {
    status('Finish or remove incomplete notes before exporting. Check clip ID, version, requested change, and any timecode.');
    const index = notes.findIndex(n => !complete(n) && Object.entries(n).some(([key,value]) => key !== 'priority' && value.trim()));
    notesBox.children[index]?.querySelector('input')?.focus();
    return '';
  }
  const text = reviewText($('#project').value, $('#approver').value, notes);
  if (!text) status('Add at least one complete note before exporting.');
  return text;
}
$('#add').addEventListener('click', () => {dirty = true; addNote({},true);});
$('#undo').addEventListener('click', () => {
  if (!removed) return;
  const el = addNote(removed.data);
  notesBox.insertBefore(el,notesBox.children[removed.index] || null);
  removed = null; $('#undo').hidden = true; dirty = true; update(); el.querySelector('input').focus();
});
for (const id of ['#project','#approver']) $(id).addEventListener('input',() => {dirty = true;update();});
$('#example').addEventListener('click', () => {
  if (dirty && !confirm('Replace your current notes with the fictional example? Download your work first if you want to keep it.')) return;
  notesBox.replaceChildren(); $('#project').value = 'Harbor Cup · social clips (fictional example)'; $('#approver').value = 'Morgan';
  addNote({clip:'C01',version:'v01',time:'00:03',change:'Remove the greeting and start with the phone-ordering close-up. Keep the voiceover that follows.',priority:'Required change'});
  addNote({clip:'C02',version:'v01',time:'00:12',change:'Replace the caption “pick-up self” with “pickup shelf”.',priority:'Required change'});
  dirty = true; removed = null; $('#undo').hidden = true; status('Fictional example loaded. Edit any field to make it your own.');
});
$('#copy').addEventListener('click', async () => {
  const text = exportText(); if (!text) return;
  try {await navigator.clipboard.writeText(text); status('Review sheet copied. Paste it into your usual feedback thread.');}
  catch {const area = $('#copy-fallback');area.value = text;area.hidden = false;area.focus();area.select();status('Select and copy the text below using your device’s copy command.');}
});
$('#download').addEventListener('click', () => {
  const text = exportText(); if (!text) return;
  const blob = new Blob([text+'\n'],{type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a');a.href = url;a.download = 'video-review-notes.txt';a.click();setTimeout(() => URL.revokeObjectURL(url),1000);status('Review sheet downloaded as video-review-notes.txt.');
});
addNote();
