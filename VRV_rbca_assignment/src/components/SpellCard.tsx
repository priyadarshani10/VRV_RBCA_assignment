import React, { useState } from "react";
import { X } from "lucide-react";
import { useRolesStore } from "@/stores/RolesStore";
import { useWizardStore } from "@/stores/WizardStore";
import { convertions } from "@/utils/types";

interface Spell {
  id: string;
  name: string;
  date_of_creation: string;
  created_by: string;
  type: string;
  description: string;
  steps: string[];
  difficulty_level: string;
}

interface SpellCardProps {
  spell: Spell;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (updatedSpell: Spell) => void;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell, onClose, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSpell, setEditedSpell] = useState<Spell>(spell);
  const {roles} = useRolesStore();
  const {wizard:login} = useWizardStore();

  const handleEditChange = (field: keyof Spell, value: string | string[]) => {
    setEditedSpell((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(editedSpell);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{spell.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          <X className="w-7 h-7 text-red-500 hover:bg-red-200 rounded-full p-1" />
        </button>
      </div>
      <div>
        {!isEditing ? (
          <>
            <p className="mt-2 text-gray-600">
              <strong>Type:</strong> {spell.type}
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Difficulty:</strong> {spell.difficulty_level}
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Created By:</strong> {spell.created_by}
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Date of Creation:</strong> {spell.date_of_creation}
            </p>
            <p className="mt-4 text-gray-800">
              <strong>Description:</strong> {spell.description}
            </p>
            <div className="mt-4">
              <strong>Steps:</strong>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {spell.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              {login && roles[convertions[login?.role]]["spells-modify"] && <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit
              </button>}
              {login && roles[convertions[login?.role]]["spells-delete"] && <button
                onClick={() => onDelete(spell.id)}
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
                value={editedSpell.name}
                onChange={(e) => handleEditChange("name", e.target.value)}
                className="w-full border-gray-700 rounded-md p-2 border"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700 font-bold">Type</label>
              <input
                type="text"
                value={editedSpell.type}
                onChange={(e) => handleEditChange("type", e.target.value)}
                className="w-full border-gray-700 rounded-md p-2 border"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700 font-bold">Difficulty</label>
              <input
                type="text"
                value={editedSpell.difficulty_level}
                onChange={(e) => handleEditChange("difficulty_level", e.target.value)}
                className="w-full border-gray-700 rounded-md p-2 border"
              />
            </div>
            <div className="mt-2">
              <label className="block text-gray-700 font-bold">Description</label>
              <textarea
                value={editedSpell.description}
                onChange={(e) => handleEditChange("description", e.target.value)}
                className="w-full border-gray-700 rounded-md p-2 border"
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-bold">Steps</label>
              <textarea
                value={editedSpell.steps.join("\n")}
                onChange={(e) =>
                  handleEditChange("steps", e.target.value.split("\n"))
                }
                className="w-full border-gray-700 rounded-md p-2 border"
              ></textarea>
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
    </div>
  );
};

export default SpellCard;
