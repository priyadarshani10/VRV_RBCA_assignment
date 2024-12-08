"use client";
import Sidebar, { SidebarButton, SidebarItem } from "@/components/SideBar";
import { ListTodo, Plus, TestTubeDiagonal, UserPlus, Users } from "lucide-react";
import { useState, useEffect } from "react";
import SpellsComponent from "@/components/SpellsComponent";
import WizardsComponent from "@/components/WizardsComponent";
import RolesComponent from "@/components/RolesComponent";
import { useRolesStore } from "@/stores/RolesStore";
import { useWizardStore } from "@/stores/WizardStore";
import { useParams } from "next/navigation";
import { convertions } from "@/utils/types";
import Loader from "@/components/Loader";

export default function Home() {
    const { roles, initializeRoles } = useRolesStore();
    const { wizard,login } = useWizardStore();
    const {wizId} = useParams();
    const [loading, setLoading] = useState(true);
    const [sideBarOption, setSideBarOption] = useState<string>("Spells");
    const [selectedButton, setSelectedButton] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
          try {
            const response = await fetch("/api/roles");
            if (!response.ok) {
              throw new Error("Failed to fetch roles");
            }
            const data = await response.json();
            // Avoid reinitializing if already set
            initializeRoles(data);
            console.log(data);
          } catch (error) {
            console.error("Error fetching roles:", error);
          }
        };
        fetchRoles();
    }, []);

    useEffect(() => {
      const fetchWizard = async () => {
        try {
          const response = await fetch(`/api/wizards?id=${wizId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch Wizard");
          }
          const data = await response.json();

          // Avoid reinitializing if already set
          login(data);
          setLoading(false);
          console.log(data);
        } catch (error) {
          console.error("Error fetching roles:", error);
          setLoading(false);
        }
      };

      fetchWizard();
    }, []);

    if (loading) {
      return <Loader/>;
    }
    
    return (
        <div className="w-full flex flex-row h-full">
            <div className="f-full">
                <Sidebar>
                    {wizard && roles[convertions[wizard?.role]]["wizards-view"] && <SidebarItem icon={<Users size={20}/>} text="Wizards" active={sideBarOption === "Wizards"} setSideBarOption={setSideBarOption} />}
                    {wizard?.role === "Grand Master" && <SidebarItem icon={<ListTodo size={20}/>} text="Roles" active={sideBarOption === "Roles"} setSideBarOption={setSideBarOption} />}
                    {wizard && roles[convertions[wizard?.role]]["spells-view"] && <SidebarItem icon={<TestTubeDiagonal size={20}/>} text="Spells" active={sideBarOption === "Spells"} setSideBarOption={setSideBarOption} />}
                    {wizard && roles[convertions[wizard?.role]]["spells-add"] && <SidebarButton icon={<Plus size={23} className="text-white"/>} text="Create Spell" selectedButton={selectedButton} setSelectedButton={setSelectedButton}/>}
                    {wizard && roles[convertions[wizard?.role]]["wizards-add"] && <SidebarButton icon={<UserPlus size={20} className="text-white"/>} text="Add Wizard" selectedButton={selectedButton} setSelectedButton={setSelectedButton}/>}
                </Sidebar>
            </div>
            <div className="w-full">
                {sideBarOption === "Wizards" && <WizardsComponent />}
                {sideBarOption === "Roles" && <RolesComponent />}
                {sideBarOption === "Spells" && <SpellsComponent />}
            </div>
        </div>
    );
}
