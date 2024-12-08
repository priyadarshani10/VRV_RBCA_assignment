import React, { useState, useEffect } from "react";
import SpellCard from "./SpellCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { spellTypes } from "@/utils/types";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";
import Loader from "./Loader";

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

const SpellsComponent: React.FC = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const spellsPerPage = 10;

  const fetchSpells = async () => {
    try {
      const response = await fetch("/api/spells/all");
      const data = await response.json();
      setSpells(data);
      setFilteredSpells(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spells:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpells();
  }, []);

  const indexOfLastSpell = currentPage * spellsPerPage;
  const indexOfFirstSpell = indexOfLastSpell - spellsPerPage;
  const currentSpells = filteredSpells.slice(indexOfFirstSpell, indexOfLastSpell);

  const totalPages = Math.ceil(spells.length / spellsPerPage);

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
    fetch(`/api/spells/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then((response) => {
      if (response.ok) {
        fetchSpells();
        toast.success("Spell deleted successfully");
      } else {
        console.error("Failed to deleted Spell");
      }
    }).catch((error) => {
      console.error("Error deleting Spell:", error);
      toast.error("Error deleting Spell");
    });
  };

  const handleEdit = (newSpell: Spell) => {
    fetch(`/api/spells`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSpell),
    }).then((response) => {
      if (response.ok) {
        fetchSpells();
        toast.success("Spell updated successfully");
      } else {
        console.error("Failed to update Spell");
      }
    }).catch((error) => {
      console.error("Error updating Spell:", error);
      toast.error("Error updating Spell");
    });
  }

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full p-4 pb-0">
        <SearchBar spells={spells} onFilteredSpellsChange={setFilteredSpells} />
      </div>
      <div className="container mx-auto px-4 py-6">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-center">S.no</th>
              <th className="px-4 py-2 text-left max-w-20">Name</th>
              <th className="px-4 py-2 text-center min-w-14 max-w-20">Difficulty</th>
              <th className="px-4 py-2 text-center">Created By</th>
              <th className="px-4 py-2 text-center">Type</th>
              <th className="px-4 py-2 text-center">Date of Creation</th>
            </tr>
          </thead>
          { currentSpells.length === 0 ? <tbody><tr><td>No Spells Found</td></tr></tbody> :
            <tbody>
              {currentSpells.map((spell, index) => (
                <tr
                  key={spell.name}
                  onClick={() => setSelectedSpell(spell)}
                  className="hover:bg-gray-200 cursor-pointer border-b border-gray-300"
                >
                  <td className=" py-2 text-center">
                    {indexOfFirstSpell + index + 1}
                  </td>
                  <td className=" px-4 py-2 text-left max-w-20">{spell.name}</td>
                  <td className="px-4 py-2 text-center min-w-14 max-w-20">
                      <span 
                          className={`px-2 py-1 rounded-md text-sm ${  
                              spell.difficulty_level === "Easy" ? "text-green-500 bg-green-50" 
                              : spell.difficulty_level === "Medium" ? "text-yellow-500 bg-yellow-50"
                              : spell.difficulty_level === "Hard" ? "text-orange-500 bg-orange-50"
                              : "text-red-500 bg-red-50"}
                          `}>
                          {spell.difficulty_level}
                      </span>
                  </td>
                  <td className=" px-4 py-2 text-center">{spell.created_by}</td>
                  <td className=" px-4 py-2 text-center"><span>{spell.type} {spellTypes[spell.type]}</span></td>
                  <td className=" px-4 py-2 text-center">{spell.date_of_creation}</td>
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
        {selectedSpell && (
          <div
            onClick={() => setSelectedSpell(null)}  
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg overflow-auto max-h-screen">
              <SpellCard spell={selectedSpell} onClose={() => setSelectedSpell(null)} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpellsComponent;
