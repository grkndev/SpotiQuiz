import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getTopTracks, getTopArtists } from '@/lib/spotify';
import { 
  getRelatedArtistTracks, 
  getUserSavedAndRecentTracks,
  formatTrackForResponse,
  getRandomSample
} from '@/lib/quiz-utils';

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
    
    const accessToken = token.accessToken as string;
    
    // Get search parameters
    const searchParams = req.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '10', 10);
    const limit = Math.min(Math.max(count, 1), 20); // Ensure between 1 and 20
    
    // Fetch user's top tracks and artists in parallel
    const [topTracksResponse, topArtistsResponse] = await Promise.all([
      getTopTracks(accessToken, 'medium_term', 50),
      getTopArtists(accessToken, 'medium_term', 20)
    ]);
    
    // Get artist IDs from top artists
    const topArtistIds = topArtistsResponse.items.map((artist: any) => artist.id);
    
    // Fetch tracks from related artists and user's saved/recent tracks in parallel
    const [relatedArtistTracks, savedAndRecentTracks] = await Promise.all([
      getRelatedArtistTracks(topArtistIds, accessToken),
      getUserSavedAndRecentTracks(accessToken)
    ]);
    
    // Combine all track sources
    const allTracks = [
      ...topTracksResponse.items,
      ...relatedArtistTracks,
      ...savedAndRecentTracks
    ];
    
    // Remove duplicate tracks
    const uniqueTracks = allTracks.filter((track: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.id === track.id)
    );
    
    // Filter tracks with preview URLs if available
    const tracksWithPreview = uniqueTracks.filter((track: any) => track.preview_url);
    
    // Prioritize tracks with preview URLs, but fall back to all tracks if not enough
    const trackPool = tracksWithPreview.length >= limit ? tracksWithPreview : uniqueTracks;
    
    // Randomly select tracks from the pool
    const selectedTracks = getRandomSample(trackPool, Math.min(limit, trackPool.length));
    
    // Format the response
    const formattedTracks = selectedTracks.map(formatTrackForResponse);
    
    return NextResponse.json({ 
      tracks: formattedTracks,
      total: formattedTracks.length
    });
    
  } catch (error: any) {
    console.error('Error fetching random tracks:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch random tracks' },
      { status: 500 }
    );
  }
} 