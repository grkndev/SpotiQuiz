import SpotifyWebPlayer from "react-spotify-web-playback";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useRef } from "react";

interface SpotifyPlayerProps {
    uris: string[];
    isPlaying: boolean;
    onTogglePlay?: () => void;
}

export function SpotifyPlayer({ uris, isPlaying, onTogglePlay }: SpotifyPlayerProps) {
    const { data: session, status } = useSession();
    const [playerError, setPlayerError] = useState<string | null>(null);
    const [validUris, setValidUris] = useState<string[]>([]);
    const [playerReady, setPlayerReady] = useState(false);
    const playerDeviceId = useRef<string | null>(null);

    // Important: We only change the componentKey when the session changes, not on URI changes
    const [componentKey] = useState(() => `spotify-player-${Date.now()}`);

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

        // Log URIs for debugging
        // console.log("SpotifyPlayer - Original URIs:", uris);
        // console.log("SpotifyPlayer - Valid URIs after filtering:", validUriArray);

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
                                    // console.log("SpotifyPlayer - Extracted ID:", trackId);
                                    return `spotify:track:${trackId}`;
                                }
                            } else {
                                return uri;
                            }
                            return null;
                        })
                        .filter(Boolean) as string[];

                    // console.log("SpotifyPlayer - Fixed URIs:", fixedUris);

                    if (fixedUris.length > 0) {
                        setValidUris(fixedUris);
                    } else {
                        // console.warn("SpotifyPlayer - Could not fix URIs");
                        setValidUris([]);
                    }
                } catch (error) {
                    // console.error("SpotifyPlayer - Error fixing URIs:", error);
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

    // Debug: Log the session and access token
    // useEffect(() => {
    // console.log("SpotifyPlayer - Session status:", status);
    // console.log("SpotifyPlayer - Access token available:", !!session?.accessToken);
    // if (session?.accessToken) {
    // console.log("SpotifyPlayer - Access token first 10 chars:", session.accessToken.substring(0, 10) + '...');
    // } else {
    // console.log("SpotifyPlayer - No access token available");
    // }
    // console.log("SpotifyPlayer - URIs being played:", validUris);
    // console.log("SpotifyPlayer - Player device ID:", playerDeviceId.current);
    // }, [session, status, validUris]);

    // When URIs change, only update what's playing, NOT remount the player
    useEffect(() => {
        if (validUris.length > 0) {
            // console.log("SpotifyPlayer - URIs changed, updating track (keeping device)");
            // Reset error state
            setPlayerError(null);
        }
    }, [validUris]);

    // Add logging to track state changes
    // useEffect(() => {
    // console.log("SpotifyPlayer - isPlaying changed:", isPlaying);
    // console.log("SpotifyPlayer - playerReady:", playerReady);

    // When starting to play, check if player is ready
    // if (isPlaying && !playerReady) {
    // console.log("SpotifyPlayer - Attempting to play before player is ready, waiting...");
    // }
    // }, [isPlaying, playerReady]);

    const handleRelogin = async () => {
        await signOut({ redirect: false });
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const handleRetry = () => {
        // console.log("SpotifyPlayer - Manual retry requested");
        setPlayerError(null);
        setPlayerReady(false); // Reset player ready state to force re-initialization
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
                <p className="text-gray-600 mb-3">Geçerli bir Spotify şarkı URI'si sağlanmadı.</p>
                <div className="text-xs text-gray-500 mb-3 overflow-hidden">
                    <p>Gelen URI'ler: {JSON.stringify(uris)}</p>
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
                key={componentKey} // Important: Fixed value, doesn't change on every render
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
                    // Log player status for debugging
                    // console.log("SpotifyPlayer callback:", JSON.stringify(state));

                    // Track player device ID
                    if (state.deviceId && !playerDeviceId.current) {
                        // console.log("SpotifyPlayer - Device ID set to:", state.deviceId);
                        playerDeviceId.current = state.deviceId;
                    }

                    // Track player readiness
                    if (!playerReady && state && typeof state.status === 'string' && state.status.toLowerCase() === "ready") {
                        // console.log("SpotifyPlayer is now ready");
                        setPlayerReady(true);
                    }

                    // Handle player errors
                    if (state.error) {
                        // console.error("SpotifyPlayer error:", state.error);
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
