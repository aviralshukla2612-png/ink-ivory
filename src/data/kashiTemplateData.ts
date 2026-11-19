export interface WeddingEvent {
  id: string;
  name: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  dressCode?: string;
  mapsUrl: string;
  directionsUrl: string;
}

export interface KashiWeddingData {
  tradition: string;
  traditionBlessing: string;
  groom: {
    name: string;
    father: string;
    mother: string;
    city: string;
  };
  bride: {
    name: string;
    father: string;
    mother: string;
    city: string;
  };
  inLovingMemoryOf: string[];
  hostedBy: string;
  weddingDate: {
    dayOfWeek: string;
    date: number;
    month: string;
    year: number;
    formatted: string;
  };
  primaryVenue: {
    name: string;
    city: string;
  };
  events: WeddingEvent[];
  closingMessage: string;
}

export const kashiWeddingData: KashiWeddingData = {
  tradition: 'North Indian Vedic Hindu Wedding',
  traditionBlessing: 'With the blessings of Lord Ganesha',
  groom: {
    name: 'Arjun',
    father: 'Shri Ramesh Sharma',
    mother: 'Smt. Sunita Sharma',
    city: 'Jaipur',
  },
  bride: {
    name: 'Sia',
    father: 'Shri Anil Mehta',
    mother: 'Smt. Kavita Mehta',
    city: 'Udaipur',
  },
  inLovingMemoryOf: [
    'Late Shri Hari Narayan Sharma',
  ],
  hostedBy: 'Shri Vinod & Smt. Rekha Sharma',
  weddingDate: {
    dayOfWeek: 'Saturday',
    date: 13,
    month: 'February',
    year: 2027,
    formatted: 'Saturday, 13 February 2027',
  },
  primaryVenue: {
    name: 'Rambagh Palace',
    city: 'Jaipur',
  },
  events: [
    {
      id: 'haldi',
      name: 'Haldi',
      day: 'Friday',
      date: '12 February 2027',
      time: '10:00 AM',
      venue: 'Sharma Family Estate',
      city: 'Jaipur',
      dressCode: 'Shades of Turmeric Yellow & Festive Silk',
      mapsUrl: 'https://maps.google.com/?q=Jaipur+Rajasthan',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jaipur+Rajasthan',
    },
    {
      id: 'mehendi',
      name: 'Mehendi',
      day: 'Friday',
      date: '12 February 2027',
      time: '4:00 PM',
      venue: 'The Palm Courtyard, Rambagh Palace',
      city: 'Jaipur',
      dressCode: 'Vibrant Floral Lehengas & Kurtas',
      mapsUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Rambagh+Palace+Jaipur',
    },
    {
      id: 'sangeet',
      name: 'Sangeet',
      day: 'Friday',
      date: '12 February 2027',
      time: '8:00 PM',
      venue: 'The Royal Ballroom, Rambagh Palace',
      city: 'Jaipur',
      dressCode: 'Glitzy Glamour & Royal Indo-Western',
      mapsUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Rambagh+Palace+Jaipur',
    },
    {
      id: 'wedding',
      name: 'Wedding (Phere)',
      day: 'Saturday',
      date: '13 February 2027',
      time: '7:30 PM',
      venue: 'The Mughal Gardens, Rambagh Palace',
      city: 'Jaipur',
      dressCode: 'Regal Traditional Indian Formal',
      mapsUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Rambagh+Palace+Jaipur',
    },
    {
      id: 'reception',
      name: 'Reception',
      day: 'Sunday',
      date: '14 February 2027',
      time: '8:00 PM',
      venue: 'Jai Mahal Palace',
      city: 'Jaipur',
      dressCode: 'Royal Evening Black Tie & Traditional Elegance',
      mapsUrl: 'https://maps.google.com/?q=Jai+Mahal+Palace+Jaipur',
      directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Jai+Mahal+Palace+Jaipur',
    },
  ],
  closingMessage: 'Your presence is the greatest gift. We look forward to celebrating with you.',
};
