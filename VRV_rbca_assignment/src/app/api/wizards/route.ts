import { NextRequest, NextResponse } from 'next/server';
import { wizardsContainer } from '@/lib/cosmosClient';
import { v4 as uuidv4 } from "uuid";

// GET request to fetch user details by ID
export async function GET(request: NextRequest) {
    // Retrieve userId from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");
  
    if (!userId) {
      return new NextResponse("Wizard ID is required", { status: 400 });
    }
  
    try {
      // Query the container to fetch user details
      const { resource: user } = await wizardsContainer.item(userId, userId).read();
  
      if (!user) {
        return new NextResponse("Wizard not found", { status: 404 });
      }
  
      return NextResponse.json(user);
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to fetch Wizard", { status: 500 });
    }
}
  
// POST request to store new user details
export async function POST(request: NextRequest) {
    try {
      // Parse the incoming request body
      const wizard = await request.json();
  
      const newWizard = {
        id: uuidv4(), // Auto-generated ID
        ...wizard
      };
      // Add new user to the Cosmos DB container
      await wizardsContainer.items.create(newWizard);
  
      return NextResponse.json({message: "Wizard added successfully"}, { status: 201 });
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to create user", { status: 500 });
    }
}

// DELETE request to remove a wizard
export async function DELETE(request: NextRequest) {
    try {
        const {id:userId} = await request.json();
        // Check if wizard exists before deleting
        const { resource: existingWizard } = await wizardsContainer.item(userId, userId).read();

        if (!existingWizard) {
            return new NextResponse("Wizard not found", { status: 404 });
        }

        // Delete the wizard
        await wizardsContainer.item(userId, userId).delete();

        return NextResponse.json({ message: "Wizard deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Failed to delete wizard", { status: 500 });
    }
}

// PUT request to update wizard details
export async function PUT(request: NextRequest) {

    try {
        // Parse the incoming request body
        const updatedWizard = await request.json();
        const userId = updatedWizard.id;

        // Check if wizard exists before updating
        const { resource: existingWizard } = await wizardsContainer.item(userId, userId).read();

        if (!existingWizard) {
            return new NextResponse("Wizard not found", { status: 404 });
        }

        // Merge existing wizard with updates, maintaining the same ID
        const wizardToUpdate = {
            ...existingWizard,
            ...updatedWizard,
            id: userId // Ensure ID doesn't change
        };

        // Update the wizard
        await wizardsContainer.item(userId, userId).replace(wizardToUpdate);

        return NextResponse.json({ 
            message: "Wizard updated successfully",
            wizard: wizardToUpdate 
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Failed to update wizard", { status: 500 });
    }
}