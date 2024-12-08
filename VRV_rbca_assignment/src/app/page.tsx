"use client";
import { useRouter } from 'next/navigation';
import React from 'react';
import { Card, CardContent } from '@/components/Card';

export default function Home() {
  const router = useRouter();

  const roleCards = [
    {
      id: 12,
      role: "Novice Wizard",
      icon: "🔮",
      description: "Apprentice wizards learning the mystical arts",
      permissions: ["View basic spells", "View other wizards", "Request mentorship"],
      theme: "bg-purple-100"
    },
    {
      id: 2,
      role: "Master Wizard",
      icon: "⚡",
      description: "Experienced wizards teaching the next generation",
      permissions: ["Add novices", "Create spells", "Conduct classes"],
      theme: "bg-indigo-100"
    },
    {
      id: 1,
      role: "Grand Master",
      icon: "👑",
      description: "The supreme leader of Wiz Academy",
      permissions: ["Full academy control", "Appoint masters", "Can Dynamically change permissions to roles"],
      theme: "bg-amber-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-4xl">✨</span>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Wiz Academy
            </h1>
            <span className="text-4xl">✨</span>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Welcome to the mystical realm of knowledge and power. Explore our magical dashboard
            designed for different roles within the academy.
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto`}>
          {roleCards.map((card) => (
            <Card 
              key={card.id}
              className={`transition-transform hover:scale-105 cursor-pointer ${card.theme}`}
              onClick={() => router.push(`/dashboard/${card.id}`)}
            >
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{card.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800">{card.role}</h2>
                </div>
                <p className="text-gray-600">{card.description}</p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-700">Permissions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {card.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={() => router.push(`/dashboard/${card.id}`)}
                >
                  Enter Dashboard
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-16 max-w-3xl mx-auto bg-white/10">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4 text-center">About This Project</h2>
            <p className="text-gray-300">
              This dashboard demonstrates Role-Based Access Control (RBAC) in a magical context. 
              Each role (Novice, Master, and Grand Master) has different permissions and access levels, 
              showcasing my ability to implement complex authorization systems. Feel free to explore 
              each roles perspective by clicking on their respective cards above.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}