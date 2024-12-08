import React, { useState } from "react";
import { X, Wand2, BookOpen } from "lucide-react";

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

interface WizardFormProps {
  onClose: () => void;
  onSubmit: (wizard: Omit<Wizard, "id" | "date_of_joining" | "spells_created">) => void;
}

const WizardForm: React.FC<WizardFormProps> = ({ onClose, onSubmit }) => {
  const [wizard, setWizard] = useState<Omit<Wizard, "id" | "date_of_joining" | "spells_created">>({
    name: "",
    age: 0,
    speciality: "",
    role: "",
    exp: 0
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const parsedValue = name === "age" || name === "exp" ? parseInt(value) || 0 : value;
    setWizard((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = () => {
    const newWizard = {
      ...wizard,
      date_of_joining: new Date().toISOString().substring(0, 10),
      spells_created: 0,
      role: "novice",
    };
    onSubmit(newWizard);
    onClose();
  };

  return (
    <div className="max-w-2xl bg-white rounded-xl">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Wand2 className="w-6 h-6 text-white animate-pulse" />
            <h2 className="text-2xl font-bold text-white">Register New Wizard</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Wizard Name</label>
            <input
              type="text"
              name="name"
              value={wizard.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter wizard name..."
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={wizard.age || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter age..."
              min="0"
            />
          </div>
        </div>

        {/* Speciality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Speciality</label>
          <input
            type="text"
            name="speciality"
            value={wizard.speciality}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g., Elemental Magic, Healing, Illusion..."
          />
        </div>

        {/* Experience Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience Points</label>
          <input
            type="number"
            name="exp"
            value={wizard.exp || ""}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Enter experience points..."
            min="0"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium 
                   hover:from-blue-600 hover:to-purple-700 transform transition-all duration-200 
                   focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none
                   flex items-center justify-center space-x-2"
        >
          <BookOpen className="w-5 h-5" />
          <span>Register Wizard</span>
        </button>
      </div>
    </div>
  );
};

export default WizardForm;