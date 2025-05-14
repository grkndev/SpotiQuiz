import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    // Get the authentication token
    const token = await getToken({ req });
    
    if (!token || !token.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Return the access token
    return NextResponse.json({
      accessToken: token.accessToken
    });
    
  } catch (error: any) {
    console.error('Error retrieving Spotify token:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve token' },
      { status: 500 }
    );
  }
} 