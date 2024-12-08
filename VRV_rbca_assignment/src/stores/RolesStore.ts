import {create} from "zustand";

type Role = "novice" | "master" | "grandmaster";

const PERMISSIONS = [
  "spells-view",
  "spells-add",
  "spells-delete",
  "spells-modify",
  "wizards-view",
  "wizards-add",
  "wizards-delete",
  "wizards-modify",
];

// Define the roles state
interface RolesState {
  roles: Record<Role, Record<string, boolean>>;
  togglePermission: (role: Role, permission: string) => void;
  setPermissions: (role: Role, permissions: Record<string, boolean>) => void;
  initializeRoles: (roles: Record<Role, Record<string, boolean>>) => void;
}

// Default roles state if no data is fetched
const DEFAULT_ROLES: Record<Role, Record<string, boolean>> = {
  novice: Object.fromEntries(PERMISSIONS.map((perm) => [perm, false])),
  master: Object.fromEntries(PERMISSIONS.map((perm) => [perm, false])),
  grandmaster: Object.fromEntries(PERMISSIONS.map((perm) => [perm, true])),
};

// Create the store
export const useRolesStore = create<RolesState>((set) => ({
  roles: DEFAULT_ROLES,

  // Toggle a permission for a given role
  togglePermission: (role, permission) => {
    if (role === "grandmaster") return; // Grandmaster permissions are immutable
    set((state) => ({
      roles: {
        ...state.roles,
        [role]: {
          ...state.roles[role],
          [permission]: !state.roles[role][permission],
        },
      },
    }));
  },

  // Set permissions for a role (e.g., for bulk updates)
  setPermissions: (role, permissions) => {
    if (role === "grandmaster") return; // Grandmaster permissions are immutable
    set((state) => ({
      roles: {
        ...state.roles,
        [role]: permissions,
      },
    }));
  },

  // Initialize roles from fetched API data
  initializeRoles: (roles) => {
    set(() => ({
      roles,
    }));
  },
}));
