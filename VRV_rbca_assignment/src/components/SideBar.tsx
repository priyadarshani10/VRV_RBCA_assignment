"use client";
import { ChevronLast, ChevronFirst } from "lucide-react";
import React, { useContext, createContext, useState, ReactNode } from "react";
import SpellForm from "./SpellForm";
import WizardForm from "./WizardForm";
import toast from 'react-hot-toast';

// Define the context type
interface SidebarContextType {
  expanded: boolean;
}

// Create the Sidebar Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Define the props for Sidebar component
interface SidebarProps {
  children: ReactNode; // Children elements for the sidebar
}

// Sidebar Component
export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <aside className="h-full">
      <nav className="flex flex-col h-full bg-white border-r shadow-sm w-max-1/5">
        {/* Logo and Collapse Button */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Provide Context */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

// Define the props for SidebarItem
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  setSideBarOption: (option: string) => void;
}

// SidebarItem Component
export function SidebarItem({ icon, text, active, alert, setSideBarOption }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a SidebarContext.Provider");
  }

  const { expanded } = context;

  return (
    <li
      onClick={() => setSideBarOption(text)}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-44 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}

interface SidebarButtonProps {
  icon: ReactNode;
  text: string;
  selectedButton: string | null;
  setSelectedButton: (option: string | null) => void;
}

export function SidebarButton({ icon, text, selectedButton, setSelectedButton }: SidebarButtonProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarButton must be used within a SidebarContext.Provider");
  }

  const { expanded } = context;

  const handleWizardCreation = (newWizard: any) => {
    fetch("/api/wizards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWizard),
    }).then((response) => {
      if (response.ok) {
        console.log("Wizard created successfully");
        toast.success("Wizard created successfully");
      } else {
        console.error("Failed to create Wizard");
      }
    }).catch((error) => {
      console.error("Error creating Wizard:", error);
      toast.error("Error creating Wizard");
    });
  };

  const handleSpellCreation = (newSpell: any) => {
    fetch("/api/spells", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSpell),
    }).then((response) => {
      if (response.ok) {
        console.log("Spell created successfully");
        toast.success("Spell created successfully");
      } else {
        console.error("Failed to create Spell");
      }
    }).catch((error) => {
      console.error("Error creating Spell:", error);
      toast.error("Error creating Spell");
    });
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedButton(text);
  };

  const handleModalClose = () => {
    setSelectedButton(null);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <>
      <li
        onClick={handleButtonClick}
        className={`
          relative flex items-center justify-center p-[10px] mt-2
          font-medium cursor-pointer transition-all group
          bg-indigo-500 hover:bg-indigo-600 text-white
          rounded-full
        `}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all whitespace-nowrap ${
            expanded ? "w-44 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-indigo-100 text-indigo-800 text-sm
              invisible opacity-0 -translate-x-3 transition-all whitespace-nowrap
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </li>

      {selectedButton && (
        <div
        onClick={handleBackdropClick}
        className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className=" p-1 rounded-xl max-w-lg w-full bg-transparent overflow-auto max-h-screen"
        >
          {selectedButton === "Add Wizard" ? (
            <WizardForm
              onClose={handleModalClose}
              onSubmit={(newWizard) => {
                handleWizardCreation(newWizard);
                handleModalClose();
              }}
            />
          ) : selectedButton === "Create Spell" ? (
            <SpellForm
              onClose={handleModalClose}
              onSubmit={(newSpell) => {
                handleSpellCreation(newSpell);
                handleModalClose();
              }}
            />
          ) : null}
        </div>
      </div>
      
      )}
    </>
  );
}