/**
 * INK & IVORY — Universal Wedding Calendar .ics Generator
 * Generates and triggers the download of an iCalendar (.ics) file
 * containing all functions (Mehndi, Haldi, Wedding, Reception).
 */

export const downloadWeddingCalendar = (weddingData) => {
  if (typeof window === 'undefined') return;

  const events = [
    {
      title: 'Mehndi & Sangeet — Aarav & Riya',
      description: 'Join us for an evening of henna, royal sangeet rhythms, and joyous musical celebrations.',
      start: '20261216T133000Z', // 7:00 PM IST
      end: '20261216T183000Z',
      location: 'The Heritage Palace & Gardens, Jaipur, Rajasthan, India',
    },
    {
      title: 'Haldi & Phoolon Ki Holi — Aarav & Riya',
      description: 'Morning of auspicious turmeric blessings, marigold flower showers, and folk melodies.',
      start: '20261217T043000Z', // 10:00 AM IST
      end: '20261217T083000Z',
      location: 'The Heritage Palace & Gardens, Jaipur, Rajasthan, India',
    },
    {
      title: 'The Royal Wedding Ceremony — Aarav & Riya',
      description: 'The Vedic royal wedding ceremony, Baraat arrival, and Saat Phere under the star-lit mandap.',
      start: '20261218T113000Z', // 5:00 PM IST
      end: '20261218T173000Z',
      location: 'The Heritage Palace & Gardens, Jaipur, Rajasthan, India',
    },
    {
      title: 'Grand Royal Reception — Aarav & Riya',
      description: 'An elegant imperial dinner, live classical & contemporary symphony, and joyous farewell toast.',
      start: '20261219T140000Z', // 7:30 PM IST
      end: '20261219T193000Z',
      location: 'The Heritage Palace & Gardens, Jaipur, Rajasthan, India',
    },
  ];

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ink & Ivory//Wedding Invitation Template 01//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Aarav & Riya Wedding Festivities',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  events.forEach((ev, idx) => {
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:wedding-event-${idx}-${Date.now()}@inkivory.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${ev.start}`,
      `DTEND:${ev.end}`,
      `SUMMARY:${ev.title}`,
      `DESCRIPTION:${ev.description}`,
      `LOCATION:${ev.location}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${ev.title} tomorrow`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'aarav-riya-royal-wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export default downloadWeddingCalendar;
