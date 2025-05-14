const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

/**
 * Makes a request to the Spotify API
 */
export async function spotifyApi(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  try {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      // Try to parse the error response
      let errorMessage = `${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch (parseError) {
        // If we can't parse the error JSON, just use the status code
      }
      
      // Extract resource ID from endpoint for better error context
      const resourceIdMatch = endpoint.match(/\/([a-zA-Z0-9]{22})(\/|$|\?)/);
      const resourceId = resourceIdMatch ? resourceIdMatch[1] : 'unknown';
      
      // Create a more descriptive error
      const error = new Error(errorMessage);
      // Add extra properties for debugging
      (error as any).endpoint = endpoint;
      (error as any).resourceId = resourceId;
      (error as any).statusCode = res.status;
      
      throw error;
    }

    return res.json();
  } catch (error: any) {
    // Don't log 404 errors for artist endpoints, as these are expected sometimes
    const is404ForArtist = error?.statusCode === 404 && 
                          (error?.endpoint?.includes('/artists/') || 
                           error?.endpoint?.includes('/artist/'));
    
    if (!is404ForArtist) {
      console.error(`Spotify API error (${endpoint}):`, error);
    }
    
    throw error;
  }
}

/**
 * Gets the current user's profile
 */
export async function getUserProfile(accessToken: string) {
  return spotifyApi('/me', accessToken);
}

/**
 * Gets the user's top tracks
 */
export async function getTopTracks(accessToken: string, timeRange = 'medium_term', limit = 20) {
  return spotifyApi(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
}

/**
 * Gets the user's top artists
 */
export async function getTopArtists(accessToken: string, timeRange = 'medium_term', limit = 20) {
  return spotifyApi(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    accessToken
  );
} 