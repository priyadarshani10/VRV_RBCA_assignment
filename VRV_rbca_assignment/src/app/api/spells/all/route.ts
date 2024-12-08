import { NextRequest, NextResponse } from 'next/server';
import { spellsContainer } from '@/lib/cosmosClient';
import { v4 as uuidv4 } from "uuid";

// GET request to fetch user details by ID
export async function GET(request: NextRequest) {
    try {
      // Query the container to fetch user details
      const query = 'SELECT * FROM c'; // Query to get all spells
      const { resources: spells } = await spellsContainer.items.query(query).fetchAll();
      return NextResponse.json(spells);
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to fetch Spell", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const spells = await request.json();
    for(const spell of spells){
      const newSpell = {
        id: uuidv4(), // Auto-generated ID
        ...spell
      };
      // Add new user to the Cosmos DB container
      await spellsContainer.items.create(newSpell);
    }

    return NextResponse.json({message: "Spells added successfully"}, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create spells", { status: 500 });
  }
}