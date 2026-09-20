import type { Persona } from './storage'

const GENDERS = [
  'Woman',
  'Man',
  'Non-binary',
  'Bog hag',
  'Conceptual entity',
  'Plural (we are legion)',
  'TBD',
]

const AGES = [
  '19',
  '27',
  '34',
  '42',
  '57',
  '68',
  '70',
  '83',
  'Unknown (time is a flat circle)',
]

const OCCUPATIONS = [
  'Vintage fashion enthusiast',
  'Professional queue stander',
  'Retired wizard',
  'Liminal space curator',
  'Unpaid intern at life',
  'Freelance gargoyle',
  'Assistant to the Regional Manager',
  'Soup sommelier',
  'Extreme couponer',
  'Self-taught dentist (unlicensed)',
  'Haunted house real estate agent',
  'Competitive sleeper',
]

const LOCATIONS = [
  'Mordor',
  'A liminal space',
  'Your mom\'s house',
  'Cleveland, but ironically',
  'The Shire (rent-controlled)',
  'An abandoned mall food court',
  'Bikini Bottom',
  'A Wendys parking lot at 3am',
  'The backrooms',
  'Narnia (just visiting)',
  'A small town that doesn\'t exist on maps',
  'Legally distinct from Florida',
]

const INTERESTS = [
  'Competitive birdwatching, extreme ironing, suspicious cheeses',
  'Tax law ASMR, artisanal firewood, yelling at clouds',
  'Vintage fax machines, beige, the smell of libraries',
  'Underground ping pong, conspiracy theories about pigeons',
  'Renaissance faires (but only the food), silent discos, fungus',
  'Doom jazz, urban exploring, collecting hotel shampoo',
  'Amateur radio, feudalism (ironically), fancy mustard',
  'Breeding show newts, harpsichord covers of nu-metal',
  'Railway trivia, fermented beverages, long stares',
  'Cemetery picnics, taxidermy (as a hobby), cursed objects',
]

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function randomPersona(): Persona {
  return {
    gender: pick(GENDERS),
    age: pick(AGES),
    occupation: pick(OCCUPATIONS),
    location: pick(LOCATIONS),
    interests: pick(INTERESTS),
  }
}
