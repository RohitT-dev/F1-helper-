export interface Track {
  id: string;
  /** Circuit name. */
  name: string;
  country: string;
  flag: string;
  /** One-line layout character, fed to Claude so it reasons about the real circuit. */
  character: string;
}

/** The 24 circuits on the F1 24 calendar, in race order. */
export const TRACKS: readonly Track[] = [
  { id: 'bahrain', name: 'Bahrain International Circuit', country: 'Bahrain', flag: '🇧🇭', character: 'Stop-start layout with heavy braking zones and long straights; rear traction and brake stability matter; abrasive surface.' },
  { id: 'jeddah', name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', flag: '🇸🇦', character: 'Extremely fast street circuit with long flat-out sections, close walls and quick direction changes.' },
  { id: 'melbourne', name: 'Albert Park Circuit', country: 'Australia', flag: '🇦🇺', character: 'Fast, flowing park street circuit with a handful of heavy braking zones and modest kerb use.' },
  { id: 'suzuka', name: 'Suzuka International Racing Course', country: 'Japan', flag: '🇯🇵', character: 'Technical high-speed layout: fast S-curves, Degner, 130R. Needs sharp front-end response and aero stability.' },
  { id: 'shanghai', name: 'Shanghai International Circuit', country: 'China', flag: '🇨🇳', character: 'Long back straight, tight hairpins and long multi-apex corners (T1-2, T13); heavy front tyre wear.' },
  { id: 'miami', name: 'Miami International Autodrome', country: 'USA', flag: '🇺🇸', character: 'Long straights joined by slow chicane sections; traction zones; bumpy, low-grip surface.' },
  { id: 'imola', name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', flag: '🇮🇹', character: 'Narrow old-school flowing circuit with kerbs and elevation; rewards precise turn-in and kerb riding.' },
  { id: 'monaco', name: 'Circuit de Monaco', country: 'Monaco', flag: '🇲🇨', character: 'Tight, slow street circuit with barriers everywhere; maximum downforce, mechanical grip and traction.' },
  { id: 'montreal', name: 'Circuit Gilles Villeneuve', country: 'Canada', flag: '🇨🇦', character: 'Stop-start with big braking zones, chicanes and walls; traction, brake stability and kerb tolerance.' },
  { id: 'barcelona', name: 'Circuit de Barcelona-Catalunya', country: 'Spain', flag: '🇪🇸', character: 'Balanced, aero-sensitive layout with long fast corners; hard on front tyres; rewards downforce.' },
  { id: 'spielberg', name: 'Red Bull Ring', country: 'Austria', flag: '🇦🇹', character: 'Very short lap with few corners, hard braking and strong traction demands; aggressive kerbs.' },
  { id: 'silverstone', name: 'Silverstone Circuit', country: 'United Kingdom', flag: '🇬🇧', character: 'High-speed flowing corners (Maggotts-Becketts-Chapel); needs high-speed stability; hard on tyres.' },
  { id: 'hungaroring', name: 'Hungaroring', country: 'Hungary', flag: '🇭🇺', character: 'Twisty, slow-to-medium speed and dusty; high downforce and strong traction; hard to overtake.' },
  { id: 'spa', name: 'Circuit de Spa-Francorchamps', country: 'Belgium', flag: '🇧🇪', character: 'Very long lap: needs low drag for the long straights yet stability through Eau Rouge and Pouhon; changeable weather.' },
  { id: 'zandvoort', name: 'Circuit Zandvoort', country: 'Netherlands', flag: '🇳🇱', character: 'Narrow, flowing, banked corners; high downforce; limited overtaking.' },
  { id: 'monza', name: 'Autodromo Nazionale Monza', country: 'Italy', flag: '🇮🇹', character: 'Temple of speed: lowest downforce of the year, long straights, heavy braking into chicanes.' },
  { id: 'baku', name: 'Baku City Circuit', country: 'Azerbaijan', flag: '🇦🇿', character: 'Very long main straight plus a tight, slow castle section; low drag but needs grip in the slow zone; walls.' },
  { id: 'singapore', name: 'Marina Bay Street Circuit', country: 'Singapore', flag: '🇸🇬', character: 'Slow, hot, humid street circuit with many corners, bumps and kerbs; high downforce; physically demanding.' },
  { id: 'austin', name: 'Circuit of the Americas', country: 'USA', flag: '🇺🇸', character: 'Fast esses in sector one, long back straight, tight hairpin; bumpy surface.' },
  { id: 'mexico', name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', flag: '🇲🇽', character: 'High altitude means thin air: less downforce and cooling; very long main straight; max wing still feels light.' },
  { id: 'interlagos', name: 'Autódromo José Carlos Pace', country: 'Brazil', flag: '🇧🇷', character: 'Short anti-clockwise lap with elevation and bumps; strong traction demands; rain-prone.' },
  { id: 'las-vegas', name: 'Las Vegas Strip Circuit', country: 'USA', flag: '🇺🇸', character: 'Long flat-out straights, cold night temperatures and low grip; low downforce with heavy braking zones.' },
  { id: 'lusail', name: 'Lusail International Circuit', country: 'Qatar', flag: '🇶🇦', character: 'Fast, flowing medium and high-speed corners with high tyre loading and kerbs.' },
  { id: 'yas-marina', name: 'Yas Marina Circuit', country: 'Abu Dhabi', flag: '🇦🇪', character: 'Long straights joined by slow chicane and hairpin sections; traction and braking stability.' },
];

export const TRACK_BY_ID: Record<string, Track> = Object.fromEntries(
  TRACKS.map((t) => [t.id, t]),
);
