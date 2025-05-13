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
  const sampledArtistIds = getRandomSample(artistIds, Math.min(limit, artistIds.length));
  
  if (sampledArtistIds.length === 0) {
    return [];
  }
  
  try {
    // Get related artists for each sampled artist
    const relatedArtistsPromises = sampledArtistIds.map(artistId => 
      spotifyApi(`/artists/${artistId}/related-artists`, accessToken)
    );
    
    const relatedArtistsResults = await Promise.all(relatedArtistsPromises);
    
    // Flatten and get unique related artist IDs
    const relatedArtistIds = relatedArtistsResults
      .flatMap(result => result.artists || [])
      .map(artist => artist.id)
      .filter((id, index, self) => self.indexOf(id) === index);
    
    // Select a random subset of related artist IDs
    const sampledRelatedArtistIds = getRandomSample(
      relatedArtistIds,
      Math.min(5, relatedArtistIds.length)
    );
    
    // Get top tracks from each related artist
    const tracksPromises = sampledRelatedArtistIds.map(artistId => 
      spotifyApi(`/artists/${artistId}/top-tracks?market=US`, accessToken)
    );
    
    const tracksResults = await Promise.all(tracksPromises);
    
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
    const [savedTracksResponse, recentTracksResponse] = await Promise.all([
      spotifyApi('/me/tracks?limit=50', accessToken),
      spotifyApi('/me/player/recently-played?limit=50', accessToken)
    ]);
    
    // Format saved tracks
    const savedTracks = savedTracksResponse.items?.map((item: { track: any }) => item.track) || [];
    
    // Format recently played tracks
    const recentTracks = recentTracksResponse.items?.map((item: { track: any }) => item.track) || [];
    
    // Combine and remove duplicates
    return [...savedTracks, ...recentTracks].filter((track, index, self) => 
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