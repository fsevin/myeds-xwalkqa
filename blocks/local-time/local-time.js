/*
 * Local Time Block
 * Displays a live-updating clock for the city entered in the "location" field.
 */

// city name (lowercased) -> IANA timezone identifier
const CITY_TIMEZONES = {
  'new york': 'America/New_York',
  'los angeles': 'America/Los_Angeles',
  chicago: 'America/Chicago',
  toronto: 'America/Toronto',
  'mexico city': 'America/Mexico_City',
  'sao paulo': 'America/Sao_Paulo',
  'buenos aires': 'America/Argentina/Buenos_Aires',
  london: 'Europe/London',
  paris: 'Europe/Paris',
  berlin: 'Europe/Berlin',
  madrid: 'Europe/Madrid',
  rome: 'Europe/Rome',
  amsterdam: 'Europe/Amsterdam',
  moscow: 'Europe/Moscow',
  istanbul: 'Europe/Istanbul',
  cairo: 'Africa/Cairo',
  johannesburg: 'Africa/Johannesburg',
  lagos: 'Africa/Lagos',
  nairobi: 'Africa/Nairobi',
  dubai: 'Asia/Dubai',
  mumbai: 'Asia/Kolkata',
  delhi: 'Asia/Kolkata',
  bangkok: 'Asia/Bangkok',
  singapore: 'Asia/Singapore',
  'hong kong': 'Asia/Hong_Kong',
  shanghai: 'Asia/Shanghai',
  beijing: 'Asia/Shanghai',
  tokyo: 'Asia/Tokyo',
  seoul: 'Asia/Seoul',
  sydney: 'Australia/Sydney',
  melbourne: 'Australia/Melbourne',
  auckland: 'Pacific/Auckland',
  honolulu: 'Pacific/Honolulu',
};

export default function decorate(block) {
  const location = block.textContent.trim();
  const timeZone = CITY_TIMEZONES[location.toLowerCase()];

  const city = document.createElement('p');
  city.className = 'local-time-city';
  city.textContent = location;

  const clock = document.createElement('p');
  clock.className = 'local-time-clock';

  block.replaceChildren(city, clock);

  if (!timeZone) {
    clock.textContent = 'Unknown location';
    block.classList.add('local-time-unknown');
    return;
  }

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const update = () => {
    clock.textContent = formatter.format(new Date());
  };

  update();
  setInterval(update, 1000);
}
