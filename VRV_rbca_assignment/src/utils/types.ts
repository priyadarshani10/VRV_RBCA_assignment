export const spellTypes: Record<string, string> = {
    "Fire": '🔥',
    "Water": '🌊',
    "Lightning": '⚡',
    "Ice": '❄️',
    "Earth": '🌍',
    "Air": '🌪️',
    "Dark": '🌑',
    "Light": '🌟',
    "Poison": '☠️',
    "Shadow": '👤',
    "Nature": '🌳',
    "Healing": '❤️',
    "Illusion": '👻',
    "Portal": '🔮',
    "Sky": '🌤️',
    "Strength": '💪',
}

export type Role = "novice" | "master" | "grandmaster";

export const convertions: Record<string,Role> = {
    "Grand Master": "grandmaster",
    "Master": "master",
    "Novice": "novice",
  }