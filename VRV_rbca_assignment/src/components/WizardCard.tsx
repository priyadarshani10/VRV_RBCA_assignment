import React, { useState } from "react";
import { X } from "lucide-react";
import { useRolesStore } from "@/stores/RolesStore";
import { useWizardStore } from "@/stores/WizardStore";
import { convertions } from "@/utils/types";

interface Wizard {
  id: string;
  name: string;
  date_of_joining: string;
  age: number;
  speciality: string;
  role: string;
  exp: number;
  spells_created: number;
}

interface WizardCardProps {
  wizard: Wizard;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (updatedWizard: Wizard) => void;
}

const WizardCard: React.FC<WizardCardProps> = ({ wizard, onClose, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWizard, setEditedWizard] = useState<Wizard>(wizard);
  const {roles} = useRolesStore();
  const {wizard:login} = useWizardStore();

  const handleEditChange = (field: keyof Wizard, value: string | number) => {
    setEditedWizard((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(editedWizard);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{wizard.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          <X className="w-7 h-7 text-red-500 hover:bg-red-200 rounded-full p-1" />
        </button>
      </div>
      {!isEditing ? (
        <>
          <p className="mt-2 text-gray-600">
            <strong>Role:</strong> {wizard.role}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Exp:</strong> {wizard.exp}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Speciality:</strong> {wizard.speciality}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Age:</strong> {wizard.age}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Date of Joining:</strong> {wizard.date_of_joining}
          </p>
          <p className="mt-2 text-gray-600">
            <strong>Number of Spells Created:</strong> {wizard.spells_created}
          </p>
          <div className="flex justify-end space-x-4 mt-4">
            {login && roles[convertions[login?.role]]["wizards-modify"] && <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>}
            {login && roles[convertions[login?.role]]["wizards-delete"] &&<button
              onClick={() => onDelete(wizard.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete
            </button>}
          </div>
        </>
      ) : (
        <>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Name</label>
            <input
              type="text"
              value={editedWizard.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Role</label>
            <input
              type="text"
              value={editedWizard.role}
              onChange={(e) => handleEditChange("role", e.target.value)}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Experience</label>
            <input
              type="number"
              value={editedWizard.exp}
              onChange={(e) => handleEditChange("exp", parseInt(e.target.value))}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Speciality</label>
            <input
              type="text"
              value={editedWizard.speciality}
              onChange={(e) => handleEditChange("speciality", e.target.value)}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Age</label>
            <input
              type="number"
              value={editedWizard.age}
              onChange={(e) => handleEditChange("age", parseInt(e.target.value))}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">Date of Joining</label>
            <input
              type="text"
              value={editedWizard.date_of_joining}
              onChange={(e) => handleEditChange("date_of_joining", e.target.value)}
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="mt-2">
            <label className="block text-gray-700 font-bold">
              Number of Spells Created
            </label>
            <input
              type="number"
              value={editedWizard.spells_created}
              onChange={(e) =>
                handleEditChange("spells_created", parseInt(e.target.value))
              }
              className="w-full border-gray-700 rounded-md p-2 border"
            />
          </div>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WizardCard;
