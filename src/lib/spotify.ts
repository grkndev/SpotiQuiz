const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

/**
 * Makes a request to the Spotify API
 */
export async function spotifyApi(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error.message || 'Something went wrong with the Spotify API request');
  }

  return res.json();
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