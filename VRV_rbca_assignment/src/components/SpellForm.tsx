import React, { useState } from "react";
import { X, Sparkles, Plus, Minus } from "lucide-react";
import { useWizardStore } from "../stores/WizardStore";

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

interface SpellFormProps {
  onClose: () => void;
  onSubmit: (spell: Omit<Spell, "date_of_creation" | "created_by" | "id">) => void;
}

const SpellForm: React.FC<SpellFormProps> = ({ onClose, onSubmit }) => {
  const { wizard } = useWizardStore();

  const [spell, setSpell] = useState<Omit<Spell, "date_of_creation" | "created_by" | "id">>({
    name: "",
    type: "",
    description: "",
    steps: [""],
    difficulty_level: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setSpell((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (index: number, value: string) => {
    setSpell((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = value;
      return { ...prev, steps: updatedSteps };
    });
  };

  const addStep = () => {
    setSpell((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  };

  const removeStep = (index: number) => {
    setSpell((prev) => {
      const updatedSteps = prev.steps.filter((_, i) => i !== index);
      return { ...prev, steps: updatedSteps };
    });
  };

  const handleSubmit = () => {
    const newSpell = {
      ...spell,
      date_of_creation: new Date().toISOString().substring(0, 10),
      created_by: wizard?.name,
    };
    onSubmit(newSpell);
    onClose();
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Create New Spell</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-6">
        {/* Basic Info Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Spell Name</label>
            <input
              type="text"
              name="name"
              value={spell.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter spell name..."
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={spell.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="e.g., Charm, Hex, Curse..."
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
          <select
            name="difficulty_level"
            value={spell.difficulty_level}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
          >
            <option value="">Select difficulty...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
            <option value="Impossible">Impossible</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={spell.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            rows={4}
            placeholder="Describe your spell..."
          />
        </div>

        {/* Steps */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Spell Steps</label>
            <button
              type="button"
              onClick={addStep}
              className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Step</span>
            </button>
          </div>
          <div className="space-y-3">
            {spell.steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  placeholder={`Step ${index + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium 
                   hover:from-indigo-600 hover:to-purple-700 transform transition-all duration-200 
                   focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:outline-none
                   flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Create Spell</span>
        </button>
      </div>
    </div>
  );
};

export default SpellForm;