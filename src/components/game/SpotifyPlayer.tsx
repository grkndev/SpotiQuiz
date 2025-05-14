import SpotifyWebPlayer from "react-spotify-web-playback";
import { useSession } from "next-auth/react";

interface SpotifyPlayerProps {
    uris: string[];
    isPlaying: boolean;
    onTogglePlay?: () => void;
}

export function SpotifyPlayer({ uris, isPlaying, onTogglePlay }: SpotifyPlayerProps) {
    const { data: session } = useSession();

    return (
        <div className="hidden">
            <SpotifyWebPlayer 
                token={session?.accessToken!} 
                hideCoverArt 
                hideAttribution
                name="SpotiQuiz Web Player"
                play={isPlaying}
                uris={uris || []}
                styles={{
                    trackNameColor: "transparent",
                    trackArtistColor: "transparent",
                }}
                layout="responsive"
                callback={(state) => {
                    // If player naturally ends playing, we can notify parent
                    if (onTogglePlay && state.isPlaying === false && isPlaying === true) {
                        onTogglePlay();
                    }
                }}
            />
        </div>
    )
}
