import { NextRequest, NextResponse } from 'next/server';
import { spellsContainer } from '@/lib/cosmosClient';
import { v4 as uuidv4 } from "uuid";

// GET request to fetch user details by ID
export async function GET(request: NextRequest) {
    // Retrieve userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
  
    if (!userId) {
      return new NextResponse("Spell ID is required", { status: 400 });
    }
  
    try {
      // Query the container to fetch user details
      const { resource: user } = await spellsContainer.item(userId, userId).read();
  
      if (!user) {
        return new NextResponse("Spell not found", { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to fetch Spell", { status: 500 });
    }
}
  
// POST request to store new user details
export async function POST(request: NextRequest) {
    try {
      // Parse the incoming request body
      const spell = await request.json();
  
      if (!spell.name) {
        return new NextResponse("Spell 'id' and 'name' are required fields", { status: 400 });
      }

      const newSpell = {
        id: uuidv4(), // Auto-generated ID
        ...spell
      };
  
      // Add new user to the Cosmos DB container
      const { resource: createdSpell } = await spellsContainer.items.create(newSpell);
  
      return NextResponse.json(createdSpell, { status: 201 });
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to create user", { status: 500 });
    }
}

// DELETE request to remove a spell
export async function DELETE(request: NextRequest) {
    try {
        // Check if spell exists before deleting
        const {id:spellId} = await request.json();
        const { resource: existingSpell } = await spellsContainer.item(spellId, spellId).read();

        if (!existingSpell) {
            return new NextResponse("Spell not found", { status: 404 });
        }

        // Delete the spell
        await spellsContainer.item(spellId, spellId).delete();

        return NextResponse.json({ 
            message: "Spell deleted successfully",
            deletedSpellId: spellId 
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Failed to delete spell", { status: 500 });
    }
}

// PUT request to update spell details
export async function PUT(request: NextRequest) {
    try {
        // Parse the incoming request body
        const updatedSpell = await request.json();
        const spellId = updatedSpell.id;

        if (!updatedSpell.name) {
            return new NextResponse("Spell name is required", { status: 400 });
        }

        // Check if spell exists before updating
        const { resource: existingSpell } = await spellsContainer.item(spellId, spellId).read();

        if (!existingSpell) {
            return new NextResponse("Spell not found", { status: 404 });
        }

        // Merge existing spell with updates, maintaining the same ID and created_by
        const spellToUpdate = {
            ...existingSpell,
            ...updatedSpell,
            id: spellId, // Ensure ID doesn't change
            created_by: existingSpell.created_by, // Preserve original creator
            date_of_creation: existingSpell.date_of_creation // Preserve original creation date
        };

        // Update the spell
        const { resource: updatedResource } = await spellsContainer.item(spellId, spellId).replace(spellToUpdate);

        return NextResponse.json(updatedResource, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Failed to update spell", { status: 500 });
    }
}