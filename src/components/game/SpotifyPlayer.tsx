import SpotifyWebPlayer from "react-spotify-web-playback";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

interface SpotifyPlayerProps {
    uris: string[];
    isPlaying: boolean;
    onTogglePlay?: () => void;
}

export function SpotifyPlayer({ uris, isPlaying, onTogglePlay }: SpotifyPlayerProps) {
    const { data: session } = useSession();
    const [playerError, setPlayerError] = useState<string | null>(null);
    const [validUris, setValidUris] = useState<string[]>([]);
    const [playerReady, setPlayerReady] = useState(false);
    const playerDeviceId = useRef<string | null>(null);
    const previousUriRef = useRef<string | null>(null);
    const trackChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const playerStateRef = useRef<any>(null);
    
    // Force re-render of player component with a unique key when tracks change
    const [playerKey, setPlayerKey] = useState(() => `spotify-player-${Date.now()}`);

    // Validate URIs and ensure they're in the correct format
    useEffect(() => {
        // Reset error when URIs change, but keep device
        setPlayerError(null);

        // Safe check if uris are null or undefined
        if (!uris || !Array.isArray(uris)) {
            console.error("SpotifyPlayer - URIs is not an array:", uris);
            setValidUris([]);
            return;
        }

        // Filter to ensure we only have valid Spotify URIs (spotify:track:id format)
        const validUriArray = uris.filter(uri => {
            if (!uri) return false;
            if (typeof uri !== 'string') return false;
            if (uri.trim() === '') return false;

            return (
                uri.startsWith('spotify:track:') ||
                uri.startsWith('spotify:album:') ||
                uri.startsWith('spotify:playlist:')
            );
        });

        // If no valid URIs, try to fix them
        if (validUriArray.length === 0) {
            if (uris.length > 0) {
                try {
                    // Try to extract track IDs from various formats
                    const fixedUris = uris
                        .filter(uri => uri && typeof uri === 'string' && uri.trim() !== '')
                        .map(uri => {
                            if (!uri.startsWith('spotify:')) {
                                // First check if it's a URL with track ID
                                let trackId = uri;

                                if (uri.includes('spotify.com/track/')) {
                                    const match = uri.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
                                    if (match && match[1]) {
                                        trackId = match[1];
                                    }
                                } else {
                                    // Otherwise just take the last segment or the whole string
                                    trackId = uri.split('/').pop() || uri.trim();
                                    // Remove any query params
                                    trackId = trackId.split('?')[0];
                                }

                                // Make sure trackId is a valid Spotify ID (alphanumeric)
                                if (/^[a-zA-Z0-9]+$/.test(trackId)) {
                                    return `spotify:track:${trackId}`;
                                }
                            } else {
                                return uri;
                            }
                            return null;
                        })
                        .filter(Boolean) as string[];

                    if (fixedUris.length > 0) {
                        setValidUris(fixedUris);
                    } else {
                        setValidUris([]);
                    }
                } catch (error) {
                    console.error("SpotifyPlayer - Error fixing URIs:", error);
                    setValidUris([]);
                }
            } else {
                // Empty uri list
                setValidUris([]);
            }
        } else {
            // We have valid URIs
            setValidUris(validUriArray);
        }
    }, [uris]);

    // When URIs change, force the player to reset completely
    useEffect(() => {
        // Track URI changes for better transitioning
        const currentUri = validUris.length > 0 ? validUris[0] : null;
        
        if (currentUri && previousUriRef.current && currentUri !== previousUriRef.current) {
            // URI has changed - force a complete reset of the player
            
            // First stop current playback
            setPlayerReady(false);
            
            // Clear any existing timeout
            if (trackChangeTimeoutRef.current) {
                clearTimeout(trackChangeTimeoutRef.current);
            }
            
            // Generate a new component key to force remount of the player
            setPlayerKey(`spotify-player-${Date.now()}`);
            
            // Set a delay before allowing playback again
            trackChangeTimeoutRef.current = setTimeout(() => {
                setPlayerReady(true);
            }, 1000);
        }
        
        // Store current URI for next comparison
        previousUriRef.current = currentUri;
        
        // Reset error state when URIs change
        setPlayerError(null);
    }, [validUris]);

    const handleRelogin = async () => {
        await signOut({ redirect: false });
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const handleRetry = () => {
        // Reset both player errors and ready state to force a fresh start
        setPlayerError(null);
        setPlayerReady(false);
        
        // Force complete remount of the player component
        setPlayerKey(`spotify-player-${Date.now()}`);
        
        // Force update of player with slight delay
        setTimeout(() => {
            setPlayerReady(true);
        }, 500);
    };

    // Handle token-related issues
    if (!session?.accessToken) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-center">
                <p className="text-red-600 font-medium mb-2">Spotify oynatıcısı için yetkilendirme hatası.</p>
                <p className="text-gray-600 mb-3">Spotify premium hesabınız ile giriş yapmanız gerekiyor.</p>
                <button
                    onClick={handleRelogin}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Yeniden Giriş Yap
                </button>
            </div>
        );
    }

    // Handle case where no valid URIs are available
    if (validUris.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
                <p className="text-yellow-600 font-medium mb-2">Çalınacak şarkı bulunamadı</p>
                <p className="text-gray-600 mb-3">Geçerli bir Spotify şarkı URI&apos;si sağlanmadı.</p>
                <div className="text-xs text-gray-500 mb-3 overflow-hidden">
                    <p>Gelen URI&apos;ler: {JSON.stringify(uris)}</p>
                </div>
                {/* Retry button for convenience */}
                <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    // Handle player errors
    if (playerError) {
        return (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-md text-center">
                <p className="text-orange-600 font-medium mb-2">Spotify oynatıcı hatası: {playerError}</p>
                <p className="text-gray-600 mb-3">Spotify Premium hesabınız olduğundan emin olun ve yeniden deneyin.</p>
                <div className="flex justify-center space-x-3">
                    <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Tekrar Dene
                    </button>
                    <button
                        onClick={handleRelogin}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Yeniden Giriş Yap
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="sr-only">
            <SpotifyWebPlayer
                key={playerKey} // Key changes when track changes, forcing component remount
                token={session.accessToken}
                initialVolume={0.5}
                magnifySliderOnHover={true}
                hideCoverArt
                hideAttribution
                syncExternalDevice={false}
                persistDeviceSelection={true}
                name="SpotiQuiz Web Player"
                play={isPlaying && playerReady} // Only play when both isPlaying is true AND player is ready
                uris={validUris}
                styles={{
                    activeColor: '#1cb954',
                    bgColor: '#282828',
                    color: '#ffffff',
                    loaderColor: '#1cb954',
                    sliderColor: '#1cb954',
                    trackArtistColor: 'transparent',
                    trackNameColor: 'transparent',
                }}
                layout="responsive"
                getOAuthToken={async (cb) => {
                    // Refresh token if needed
                    if (session?.accessToken) {
                        cb(session.accessToken);
                    }
                }}
                callback={(state) => {
                    // Store the current player state
                    playerStateRef.current = state;
                    
                    // Track player device ID
                    if (state.deviceId && !playerDeviceId.current) {
                        playerDeviceId.current = state.deviceId;
                    }

                    // Track player readiness
                    if (!playerReady && state && typeof state.status === 'string' && state.status.toLowerCase() === "ready") {
                        setPlayerReady(true);
                    }

                    // Track the player state for debugging
                    if (state.track && state.track.id) {
                        // Track is loaded and playing
                        if (state.isPlaying !== isPlaying && onTogglePlay) {
                            // If the player's state doesn't match our expected state, sync them
                            if (state.isPlaying === false && isPlaying === true && !state.errorType) {
                                onTogglePlay();
                            }
                        }
                    }
                    
                    // Handle player errors
                    if (state.error) {
                        setPlayerError(state.error);

                        // If there's an error and we were trying to play, notify parent
                        if (isPlaying && onTogglePlay) {
                            onTogglePlay();
                        }
                    }

                    // If player naturally ends playing, we can notify parent
                    if (onTogglePlay && state.isPlaying === false && isPlaying === true && !state.error) {
                        onTogglePlay();
                    }
                }}
            />
        </div>
    );
}
