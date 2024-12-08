import React, { useState, useEffect } from "react";
import WizardCard from "./WizardCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { spellTypes } from "@/utils/types";
import WizardSearchBar from "./WizardSearchBar";
import toast from "react-hot-toast";
import Loader from "./Loader";

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

const WizardsComponent: React.FC = () => {
  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [filteredWizards, setFilteredWizards] = useState<Wizard[]>([]);
  const [selectedWizard, setSelectedWizard] = useState<Wizard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const wizardsPerPage = 10;

  const fetchWizards = async () => {
    try {
      const response = await fetch("/api/wizards/all");
      const data = await response.json();
      setWizards(data);
      setFilteredWizards(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spells:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWizards();
  }, []);

  const indexOfLastWizard = currentPage * wizardsPerPage;
  const indexOfFirstWizard = indexOfLastWizard - wizardsPerPage;
  const currentWizards = filteredWizards.slice(indexOfFirstWizard, indexOfLastWizard);

  const totalPages = Math.ceil(filteredWizards.length / wizardsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = (id: string) => {
    fetch(`/api/wizards`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({ id }),
    }).then((response) => {
      if (response.ok) {
        fetchWizards();
        toast.success("Successfully deleted Wizard");
      }
    }).catch((error) => {
      console.error("Error deleting Wizard:", error);
      toast.error("Error deleting Wizard");
    })
  };

  const handleEdit = async (newWizard: Wizard) => {
    await fetch(`/api/wizards`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWizard),
    }).then((response) => {
      if (response.ok) {
        fetchWizards();
        toast.success("Wizard updated successfully");
      } else {
        console.error("Failed to update Wizard");
      }
    }).catch((error) => {
      console.error("Error updating Wizard:", error);
      toast.error("Error updating Wizard");
    });
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full p-4 pb-0">
        <WizardSearchBar wizards={wizards} onFilteredWizardsChange={setFilteredWizards} />
      </div>
      <div className="container mx-auto px-4 py-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-center">S.no</th>
              <th className="px-4 py-2 text-left max-w-20">Name</th>
              <th className="px-4 py-2 text-left max-w-20">Role</th>
              <th className="px-4 py-2 text-center min-w-14 max-w-20">Exp</th>
              <th className="px-4 py-2 text-center">Speciality</th>
              <th className="px-4 py-2 text-center">Date of Joining</th>
            </tr>
          </thead>
          { currentWizards.length === 0 ? <tbody><tr><td>No Wizards Found</td></tr></tbody> :
            <tbody>
              {currentWizards.map((wizard, index) => (
                <tr
                  key={wizard.name}
                  onClick={() => setSelectedWizard(wizard)}
                  className="hover:bg-gray-200 cursor-pointer border-b border-gray-300"
                >
                  <td className=" py-2 text-center">
                    {indexOfFirstWizard + index + 1}
                  </td>
                  <td className=" px-4 py-2 text-left max-w-20">{wizard.name}</td>
                  <td className=" px-4 py-2 text-left max-w-20">{wizard.role}</td>
                  <td className=" px-4 py-2 text-center">{wizard.exp}</td>
                  <td className=" px-4 py-2 text-center"><span>{wizard.speciality} {spellTypes[wizard.speciality]}</span></td>
                  <td className=" px-4 py-2 text-center">{wizard.date_of_joining}</td>
                </tr>
              ))}
            </tbody>
          }
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-indigo-500 text-white hover:bg-indigo-600"}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Modal for Selected Spell */}
        {selectedWizard && (
          <div
            onClick={() => setSelectedWizard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg">
              <WizardCard wizard={selectedWizard} onClose={() => setSelectedWizard(null)} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardsComponent;
