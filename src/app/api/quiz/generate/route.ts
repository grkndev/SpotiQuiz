import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getTopTracks, getTopArtists } from '@/lib/spotify';
import { 
  getRelatedArtistTracks, 
  getUserSavedAndRecentTracks,
  formatTrackForResponse,
  getRandomSample
} from '@/lib/quiz-utils';
import { QuizTrack } from '@/lib/types';

// Question types for the quiz - limited to song_name and artist_name only
type QuestionType = 'artist_name' | 'song_name';

// Structured question format
interface QuizQuestion {
  id: string;
  type: QuestionType;
  track: QuizTrack;
  question: string;
  options: string[];
  correctAnswer: string;
}

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
    const questionCount = parseInt(searchParams.get('count') || '10', 10);
    const limit = Math.min(Math.max(questionCount, 5), 20); // Ensure between 5 and 20
    
    // Fetch all the track data we need
    const [topTracksResponse, topArtistsResponse] = await Promise.all([
      getTopTracks(accessToken, 'medium_term', 50),
      getTopArtists(accessToken, 'medium_term', 20)
    ]);
    
    // Get artist IDs
    const topArtistIds = topArtistsResponse.items.map((artist: any) => artist.id);
    
    // Fetch additional track data
    const [relatedArtistTracks, savedAndRecentTracks] = await Promise.all([
      getRelatedArtistTracks(topArtistIds, accessToken),
      getUserSavedAndRecentTracks(accessToken)
    ]);
    
    // Combine all tracks and remove duplicates
    const allTracks = [
      ...topTracksResponse.items,
      ...relatedArtistTracks,
      ...savedAndRecentTracks
    ];
    
    const uniqueTracks = allTracks.filter((track: any, index: number, self: any[]) => 
      index === self.findIndex((t: any) => t.id === track.id)
    );
    
    // Create a pool of formatted tracks
    const formattedTracks = uniqueTracks.map(formatTrackForResponse);
    
    // Generate quiz questions
    const questions = generateQuizQuestions(
      formattedTracks,
      limit
    );
    
    return NextResponse.json({
      quiz: {
        title: "Your Personalized Spotify Quiz",
        description: "Test your knowledge of your favorite music!",
        questions: questions,
        totalQuestions: questions.length
      }
    });
    
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}

/**
 * Generate a set of quiz questions based on the user's music
 */
function generateQuizQuestions(
  tracks: QuizTrack[],
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  // Select a random subset of tracks for questions
  const selectedTracks = getRandomSample(tracks, count);
  
  // Define question types - only song_name and artist_name
  const questionTypes: QuestionType[] = [
    'artist_name',
    'song_name'
  ];
  
  // Generate questions for each selected track
  selectedTracks.forEach((track) => {
    // Alternate between question types
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // Generate question based on the type
    const question = createQuestion(track, questionType, tracks);
    questions.push(question);
  });
  
  return questions;
}

/**
 * Create a quiz question based on track data and question type
 */
function createQuestion(
  track: QuizTrack,
  type: QuestionType,
  allTracks: QuizTrack[]
): QuizQuestion {
  let question = '';
  let correctAnswer = '';
  let options: string[] = [];
  
  const questionId = `question_${track.id}_${type}`;
  
  switch (type) {
    case 'artist_name': {
      question = `Who is the artist of the song "${track.name}"?`;
      correctAnswer = track.artist;
      
      // Get other artists as wrong options
      const otherArtists = allTracks
        .filter(t => t.id !== track.id)
        .map(t => t.artist)
        .filter((artist, index, self) => self.indexOf(artist) === index);
      
      const wrongOptions = getRandomSample(otherArtists, 3);
      options = shuffleArray([correctAnswer, ...wrongOptions]);
      break;
    }
    
    case 'song_name': {
      question = `Which song is by ${track.artist}?`;
      correctAnswer = track.name;
      
      // Get songs from other artists as wrong options
      const otherSongs = allTracks
        .filter(t => t.artist !== track.artist)
        .map(t => t.name);
      
      const wrongOptions = getRandomSample(otherSongs, 3);
      options = shuffleArray([correctAnswer, ...wrongOptions]);
      break;
    }
  }
  
  return {
    id: questionId,
    type,
    track,
    question,
    options,
    correctAnswer
  };
}

/**
 * Shuffle an array in random order
 */
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => 0.5 - Math.random());
} 