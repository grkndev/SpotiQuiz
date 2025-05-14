import { spotifyApi } from './spotify';
import { QuizTrack } from './types';

/**
 * Gets random tracks from related artists based on the user's top artists
 */
export async function getRelatedArtistTracks(
  artistIds: string[],
  accessToken: string,
  limit: number = 3
) {
  // Select a random subset of artist IDs to work with
  const sampledArtistIds = getRandomSample(artistIds, Math.min(limit * 2, artistIds.length));
  
  if (sampledArtistIds.length === 0) {
    return [];
  }
  
  try {
    // Get related artists for each sampled artist
    const relatedArtistsResults = [];
    let notFoundCount = 0;
    
    // Process artists sequentially to handle individual errors
    for (const artistId of sampledArtistIds) {
      try {
        // Check if the artistId is valid (should be 22 chars for Spotify IDs)
        if (!artistId || artistId.length !== 22) {
          // Silent skip
          continue;
        }
        
        const result = await spotifyApi(`/artists/${artistId}/related-artists`, accessToken);
        relatedArtistsResults.push(result);
      } catch (error: any) {
        // Only count 404s, don't log them to reduce console noise
        if (error.statusCode === 404) {
          notFoundCount++;
        } else {
          // Log other errors as they might be more significant
          console.warn(`Error fetching related artists: ${error.message || error}`);
        }
        // Continue with other artists
      }
      
      // If we have enough results, break early
      if (relatedArtistsResults.length >= limit) {
        break;
      }
    }
    
    // Only log a summary of not found artists if there were any
    if (notFoundCount > 0) {
      console.info(`${notFoundCount} artists were not found in Spotify.`);
    }
    
    // Flatten and get unique related artist IDs
    const relatedArtistIds = relatedArtistsResults
      .flatMap(result => result.artists || [])
      .map(artist => artist.id)
      .filter((id, index, self) => self.indexOf(id) === index);
    
    if (relatedArtistIds.length === 0) {
      return [];
    }
    
    // Select a random subset of related artist IDs
    const sampledRelatedArtistIds = getRandomSample(
      relatedArtistIds,
      Math.min(5, relatedArtistIds.length)
    );
    
    // Get top tracks from each related artist
    const tracksResults = [];
    let topTracksErrorCount = 0;
    
    // Process related artists sequentially to handle individual errors
    for (const artistId of sampledRelatedArtistIds) {
      try {
        const result = await spotifyApi(`/artists/${artistId}/top-tracks?market=US`, accessToken);
        tracksResults.push(result);
      } catch (error: any) {
        // Count errors but don't log each one
        topTracksErrorCount++;
        // Continue with other artists
      }
    }
    
    // Log a summary if there were errors
    if (topTracksErrorCount > 0) {
      console.info(`Could not fetch top tracks for ${topTracksErrorCount} artists.`);
    }
    
    // Combine all tracks from related artists
    return tracksResults.flatMap(result => result.tracks || []);
  } catch (error) {
    console.error('Error fetching related artist tracks:', error);
    return [];
  }
}

/**
 * Gets tracks from user's saved tracks and recently played
 */
export async function getUserSavedAndRecentTracks(accessToken: string) {
  try {
    // Fetch user's saved tracks and recently played tracks
    const results = [];
    let errorCount = 0;
    
    try {
      const savedTracksResponse = await spotifyApi('/me/tracks?limit=50', accessToken);
      results.push({
        type: 'saved',
        tracks: savedTracksResponse.items?.map((item: { track: any }) => item.track) || []
      });
    } catch (error: any) {
      errorCount++;
      // Check if this is a scope-related error
      const errorMessage = error?.message || '';
      if (errorMessage.includes('scope') || errorMessage.includes('Insufficient client scope')) {
        // This is an expected error if the user didn't grant the permission
        // Don't log anything to reduce noise
      } else {
        console.warn('Error fetching saved tracks:', error.message || 'Unknown error');
      }
    }
    
    try {
      // Only try to get recently played if we have permissions
      // This endpoint requires the user-read-recently-played scope 
      const recentTracksResponse = await spotifyApi('/me/player/recently-played?limit=50', accessToken);
      results.push({
        type: 'recent',
        tracks: recentTracksResponse.items?.map((item: { track: any }) => item.track) || []
      });
    } catch (error: any) {
      errorCount++;
      // Check if this is a scope-related error
      const errorMessage = error?.message || '';
      if (errorMessage.includes('scope') || errorMessage.includes('Insufficient client scope')) {
        // This is an expected error if the user didn't grant the permission
        // Don't log anything to reduce noise
      } else {
        console.warn('Error fetching recently played tracks:', error.message || 'Unknown error');
      }
    }
    
    if (errorCount > 0 && results.length === 0) {
      console.info('No track data sources were accessible. User might need to re-authenticate with more permissions.');
    }
    
    // Combine all tracks
    const allTracks = results.flatMap(result => result.tracks);
    
    // If we don't have any tracks at this point, return an empty array
    if (allTracks.length === 0) {
      return [];
    }
    
    // Remove duplicates
    return allTracks.filter((track, index, self) => 
      index === self.findIndex(t => t.id === track.id)
    );
  } catch (error) {
    console.error('Error fetching user saved and recent tracks:', error);
    return [];
  }
}

/**
 * Format track data for the API response
 */
export function formatTrackForResponse(track: any): QuizTrack {
  return {
    id: track.id,
    name: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    album: track.album?.name,
    image: track.album?.images?.[0]?.url,
    preview_url: track.preview_url,
    external_url: track.external_urls?.spotify,
    uri: `spotify:track:${track.id}`,
    popularity: track.popularity
  };
}

/**
 * Helper function to get random sample from array
 */
export function getRandomSample<T>(array: T[], size: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
} 