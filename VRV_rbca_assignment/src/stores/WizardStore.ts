import {create} from "zustand";

interface Wizard {
  id: string;
  name: string;
  date_of_joining: string;
  age: number;
  speciality: string;
  role: string; // Role as a string for flexibility, e.g., "novice", "master", or "grandmaster"
  exp: number; // Experience points
  spells_created: number; // Number of spells created by the wizard
}

interface WizardState {
  wizard: Wizard | null; // Current logged-in wizard
  login: (wizardData: Wizard) => void; // Action to log in a wizard
  logout: () => void; // Action to log out the current wizard
}

export const useWizardStore = create<WizardState>((set) => ({
  wizard: null, // Initial state

  // Action to log in the wizard
  login: (wizardData: Wizard) =>
    set({
      wizard: wizardData,
    }),

  // Action to log out the wizard
  logout: () =>
    set({
      wizard: null,
    }),
}));
