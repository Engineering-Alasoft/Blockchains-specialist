const booking = {
  step: 1,
  meetingType: null,
  meetingLabel: '',
  selectedDate: null,
  selectedTime: null,
  viewMonth: new Date().getMonth(),
  viewYear: new Date().getFullYear()
};

const MEETINGS = [
  { id: 'consultation', icon: 'fa-comments', title: 'Free Consultation', desc: 'Discuss your idea and get honest advice on next steps.', duration: '30 min' },
  { id: 'discovery', icon: 'fa-search', title: 'Project Discovery', desc: 'Deep-dive into tokenomics, timeline, and technical scope.', duration: '45 min' },
  { id: 'listing', icon: 'fa-chart-line', title: 'Listing Strategy', desc: 'Exchange listing roadmap, CMC/CG requirements, and budget.', duration: '30 min' }
];

function initBooking() {
  renderMeetingTypes();
  renderCalendar();
  renderTimeSlots();
  updateStepUI();
}

function renderMeetingTypes() {
  const el = document.getElementById('meetingTypes');
  if (!el) return;
  el.innerHTML = MEETINGS.map(m => `
    <div class="meeting-type" data-id="${m.id}" onclick="selectMeeting('${m.id}')">
      <i class="fas ${m.icon}"></i>
      <h4>${m.title}</h4>
      <p>${m.desc}</p>
      <div class="duration">${m.duration}</div>
    </div>
  `).join('');
}

function selectMeeting(id) {
  const m = MEETINGS.find(x => x.id === id);
  booking.meetingType = id;
  booking.meetingLabel = m.title;
  document.querySelectorAll('.meeting-type').forEach(el => {
    el.classList.toggle('selected', el.dataset.id === id);
  });
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const title = document.getElementById('calendarTitle');
  if (!grid || !title) return;

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  title.textContent = months[booking.viewMonth] + ' ' + booking.viewYear;

  const first = new Date(booking.viewYear, booking.viewMonth, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(booking.viewYear, booking.viewMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + SITE.booking.daysAhead);

  let html = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="calendar-dow">${d}</div>`).join('');

  for (let i = 0; i < startPad; i++) html += '<div class="calendar-day empty"></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(booking.viewYear, booking.viewMonth, d);
    const dow = date.getDay();
    const isPast = date < today;
    const isTooFar = date > maxDate;
    const isWorkDay = SITE.booking.workDays.includes(dow);
    const disabled = isPast || isTooFar || !isWorkDay;
    const isToday = date.getTime() === today.getTime();
    const isSelected = booking.selectedDate && date.toDateString() === booking.selectedDate.toDateString();
    const cls = ['calendar-day', disabled ? 'disabled' : '', isToday ? 'today' : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ');
    const click = disabled ? '' : `onclick="selectDate(${booking.viewYear},${booking.viewMonth},${d})"`;
    html += `<div class="${cls}" ${click}>${d}</div>`;
  }

  grid.innerHTML = html;
}

function changeMonth(delta) {
  booking.viewMonth += delta;
  if (booking.viewMonth > 11) { booking.viewMonth = 0; booking.viewYear++; }
  if (booking.viewMonth < 0) { booking.viewMonth = 11; booking.viewYear--; }
  renderCalendar();
}

function selectDate(y, m, d) {
  booking.selectedDate = new Date(y, m, d);
  booking.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
}

function renderTimeSlots() {
  const el = document.getElementById('timeSlots');
  if (!el) return;
  if (!booking.selectedDate) {
    el.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#797979;font-size:14px;">Select a date to see available times (PKT).</p>';
    return;
  }

  const slots = [];
  for (let h = SITE.booking.startHour; h < SITE.booking.endHour; h++) {
    for (let m of [0, 30]) {
      const label = formatTime(h, m);
      const key = booking.selectedDate.toDateString() + '-' + h + '-' + m;
      const booked = localStorage.getItem('bs-booked-' + key);
      slots.push({ h, m, label, key, booked: !!booked });
    }
  }

  el.innerHTML = slots.map(s => {
    const cls = ['time-slot', s.booked ? 'disabled' : '', booking.selectedTime === s.label ? 'selected' : ''].filter(Boolean).join(' ');
    const click = s.booked ? '' : `onclick="selectTime('${s.label}',${s.h},${s.m})"`;
    return `<div class="${cls}" ${click}>${s.label}${s.booked ? ' (Taken)' : ''}</div>`;
  }).join('');
}

function formatTime(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return hr + ':' + String(m).padStart(2, '0') + ' ' + ampm;
}

function selectTime(label, h, m) {
  booking.selectedTime = label;
  booking.selectedHour = h;
  booking.selectedMin = m;
  renderTimeSlots();
}

function goStep(n) {
  if (n === 2 && !booking.meetingType) { alert('Please select a meeting type.'); return; }
  if (n === 3 && (!booking.selectedDate || !booking.selectedTime)) { alert('Please select a date and time.'); return; }
  if (n === 4) updateSummary();
  booking.step = n;
  updateStepUI();
}

function updateStepUI() {
  document.querySelectorAll('.booking-step-tab').forEach(tab => {
    const s = +tab.dataset.step;
    tab.classList.toggle('active', s === booking.step);
    tab.classList.toggle('done', s < booking.step);
  });
  document.querySelectorAll('.booking-panel').forEach(panel => {
    panel.classList.toggle('active', +panel.dataset.panel === booking.step);
  });
}

function updateSummary() {
  const el = document.getElementById('bookingSummary');
  if (!el) return;
  const dateStr = booking.selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  el.innerHTML = `
    <p><strong>Meeting:</strong> ${booking.meetingLabel}</p>
    <p><strong>Date:</strong> ${dateStr}</p>
    <p><strong>Time:</strong> ${booking.selectedTime} (PKT)</p>
  `;
}

function confirmBooking() {
  const name = document.getElementById('bname')?.value.trim();
  const email = document.getElementById('bemail')?.value.trim();
  const phone = document.getElementById('bphone')?.value.trim();
  const notes = document.getElementById('bnotes')?.value.trim() || '';

  if (!name || !email || !phone) {
    alert('Please enter your name, email, and phone.');
    return;
  }

  const dateStr = booking.selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const key = booking.selectedDate.toDateString() + '-' + booking.selectedHour + '-' + booking.selectedMin;
  localStorage.setItem('bs-booked-' + key, '1');

  const msg = [
    'New meeting booking — BlockchainsSpecialist',
    '',
    'Meeting: ' + booking.meetingLabel,
    'Date: ' + dateStr,
    'Time: ' + booking.selectedTime + ' (PKT)',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + phone,
    notes ? 'Notes: ' + notes : ''
  ].filter(Boolean).join('\n');

  document.querySelector('.booking-wrap').style.display = 'none';
  const success = document.getElementById('bookingSuccess');
  success.style.display = 'block';
  document.getElementById('successDetails').textContent = booking.meetingLabel + ' on ' + dateStr + ' at ' + booking.selectedTime + ' PKT';

  const wa = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(msg);
  document.getElementById('whatsappConfirm').href = wa;

  const mailBtn = document.getElementById('emailConfirm');
  if (mailBtn) {
    mailBtn.href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Meeting Booking — ' + booking.meetingLabel) + '&body=' + encodeURIComponent(msg);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('bookingForm')) initBooking();
});
