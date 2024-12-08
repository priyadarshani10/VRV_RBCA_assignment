import { NextRequest, NextResponse } from 'next/server';
import { rolesContainer } from '@/lib/cosmosClient';

// GET request to fetch roles document
export async function GET() {
  try {
    // Use the fixed ID for the roles document
    const documentId = 'rolesDocument'; // Replace with your actual document ID
    const { resource: roles } = await rolesContainer.item(documentId, documentId).read();

    if (!roles) {
      return new NextResponse("Roles document not found", { status: 404 });
    }

    return NextResponse.json(roles);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to fetch roles", { status: 500 });
  }
}

  
  // POST request to replace roles document
  export async function POST(request: NextRequest) {
    try {
      const documentId = 'rolesDocument'; // Replace with your actual document ID
  
      // Parse the incoming request body
      const newRoles = await request.json();
  
      // Replace the roles document with new data
      await rolesContainer
        .item(documentId, documentId)
        .replace({ id: documentId, ...newRoles });
  
      return NextResponse.json({message: "Roles replaced successfully"}, { status: 200 });
    } catch (error) {
      console.error(error);
      return new NextResponse("Failed to replace roles", { status: 500 });
    }
  }
  