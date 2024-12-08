import React from "react";
import { useRolesStore } from "@/stores/RolesStore";
import toast from "react-hot-toast";
import Loader from "./Loader";

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

const RolesComponent: React.FC = () => {
  const { roles, togglePermission } = useRolesStore();
  const [changed, setChanged] = React.useState("unchanged");

  const saveRolePermissions = async () => {
    try {
      setChanged("saving");
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roles),
      });
      if (!response.ok) {
        throw new Error("Failed to save role permissions");
      }
      console.log("Role permissions saved successfully");
      toast.success("Role permissions saved successfully");
    } catch (error) {
      console.error("Error saving role permissions:", error);
    }
    setChanged("done");
  }

  if (!roles) {
    return <Loader/>;
  }

  const renderPermissions = (role: string) => (
    <div key={role} className="mt-4">
      <h2 className="text-lg font-semibold text-gray-700 capitalize">{role} Permissions</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        {PERMISSIONS.map((permission) => (
          <div key={permission} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`${role}-${permission}`}
              checked={!!roles[role as keyof typeof roles]?.[permission]}
              onChange={() =>{ 
                togglePermission(role as keyof typeof roles, permission);
                setChanged("changed");
              }}
              disabled={role === "grandmaster"} // Grandmasters have all permissions locked
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`${role}-${permission}`}
              className="text-sm text-gray-600 capitalize"
            >
              {permission.replace("-", " ")}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex flex-row gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        {(changed==="changed" || changed==="saving") && <button
          disabled={changed === "saving"}
          onClick={() => saveRolePermissions()}
          className={`bg-indigo-500 hover:bg-indigo-700 text-white 
            h-8 w-16 text-sm rounded focus:outline-none focus:shadow-outline
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500`}
        >
          Save
        </button>}
      </div>
      {Object.keys(roles).filter((role) => ["novice", "master", "grandmaster"].includes(role)).map((role) => renderPermissions(role))}
    </div>
  );
};

export default RolesComponent;
