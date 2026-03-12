export interface TongueTwister {
  text: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  targetSound: string
}

export interface DailyChallenge {
  instruction: string
  text?: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

export const tongueTwisters: TongueTwister[] = [
  { text: 'She sells seashells by the seashore.', difficulty: 'Easy', targetSound: 'sh/s' },
  { text: 'Peter Piper picked a peck of pickled peppers.', difficulty: 'Easy', targetSound: 'p' },
  { text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', difficulty: 'Medium', targetSound: 'w/ch' },
  { text: 'Red lorry, yellow lorry, red lorry, yellow lorry.', difficulty: 'Medium', targetSound: 'r/l' },
  { text: 'Unique New York, unique New York, you know you need unique New York.', difficulty: 'Medium', targetSound: 'n/y' },
  { text: 'The sixth sick sheik\'s sixth sheep\'s sick.', difficulty: 'Hard', targetSound: 'sh/s/k' },
  { text: 'Pad kid poured curd pulled cod.', difficulty: 'Hard', targetSound: 'p/k/d' },
  { text: 'Betty Botter bought some butter, but she said the butter\'s bitter.', difficulty: 'Medium', targetSound: 'b/t' },
  { text: 'I saw Susie sitting in a shoeshine shop.', difficulty: 'Easy', targetSound: 'sh/s' },
  { text: 'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn\'t very fuzzy, was he?', difficulty: 'Medium', targetSound: 'z/w' },
  { text: 'A proper copper coffee pot.', difficulty: 'Easy', targetSound: 'p/c' },
  { text: 'Irish wristwatch, Swiss wristwatch.', difficulty: 'Hard', targetSound: 'r/s/w' },
  { text: 'Toy boat, toy boat, toy boat.', difficulty: 'Medium', targetSound: 't/b' },
  { text: 'Which wristwatches are Swiss wristwatches?', difficulty: 'Hard', targetSound: 'w/s' },
  { text: 'Eleven benevolent elephants.', difficulty: 'Medium', targetSound: 'l/v' },
  { text: 'Fred fed Ted bread, and Ted fed Fred bread.', difficulty: 'Easy', targetSound: 'f/d' },
  { text: 'Six sleek swans swam swiftly southwards.', difficulty: 'Hard', targetSound: 's/w' },
  { text: 'Lesser leather never weathered wetter weather better.', difficulty: 'Hard', targetSound: 'l/w/th' },
  { text: 'A big black bug bit a big black bear.', difficulty: 'Easy', targetSound: 'b' },
  { text: 'How can a clam cram in a clean cream can?', difficulty: 'Medium', targetSound: 'cl/cr' },
  { text: 'If two witches would watch two watches, which witch would watch which watch?', difficulty: 'Hard', targetSound: 'w/ch' },
  { text: 'I scream, you scream, we all scream for ice cream.', difficulty: 'Easy', targetSound: 'scr' },
  { text: 'Whether the weather is warm, whether the weather is hot, we have to put up with the weather, whether we like it or not.', difficulty: 'Hard', targetSound: 'w/th' },
  { text: 'Round the rugged rocks the ragged rascal ran.', difficulty: 'Medium', targetSound: 'r' },
  { text: 'Can you can a canned can into an un-canned can like a canner can can a canned can into an un-canned can?', difficulty: 'Hard', targetSound: 'c/n' },
]

export const dailyChallenges: DailyChallenge[] = [
  {
    instruction: 'Introduce yourself in 30 seconds. Include your name, what you do, and one interesting fact about yourself.',
    difficulty: 'Easy',
  },
  {
    instruction: 'Read the following paragraph clearly and with good pace:',
    text: 'The ability to communicate effectively is one of the most important life skills to develop. Good communication helps you in your personal relationships, at work, and in everyday situations. It involves not just speaking clearly, but also listening actively and responding thoughtfully.',
    difficulty: 'Easy',
  },
  {
    instruction: 'Explain a topic you know well as if teaching it to a beginner. Speak for 60 seconds.',
    difficulty: 'Medium',
  },
  {
    instruction: 'Read this tongue twister three times, each time a little faster:',
    text: 'She sells seashells by the seashore. The shells she sells are seashells, I\'m sure. So if she sells seashells on the seashore, then I\'m sure she sells seashore shells.',
    difficulty: 'Medium',
  },
  {
    instruction: 'Give a 45-second impromptu speech on this topic: "What is the most underrated skill everyone should learn?"',
    difficulty: 'Medium',
  },
  {
    instruction: 'Read this passage with emotion, as if telling an exciting story:',
    text: 'The door creaked open slowly, revealing a room bathed in golden light. In the center stood an old wooden chest, its surface carved with intricate patterns that seemed to dance in the flickering candlelight. My heart raced as I stepped forward, knowing that whatever lay inside would change everything.',
    difficulty: 'Medium',
  },
  {
    instruction: 'Practice emphasizing different words. Read this sentence five times, each time emphasizing a different word: "I never said she stole my money."',
    text: 'I never said she stole my money.',
    difficulty: 'Hard',
  },
  {
    instruction: 'Deliver a 60-second persuasive argument on this topic: "Everyone should learn a musical instrument."',
    difficulty: 'Hard',
  },
  {
    instruction: 'Record yourself reading this passage at three different speeds: slow, normal, and fast.',
    text: 'Technology has transformed the way we live, work, and connect with one another. From smartphones to artificial intelligence, innovation continues to push the boundaries of what is possible.',
    difficulty: 'Medium',
  },
  {
    instruction: 'Practice vocal variety. Read this passage as if you were: 1) a news anchor, 2) telling a bedtime story, 3) giving a motivational speech.',
    text: 'Every great achievement starts with a single step. The journey of a thousand miles begins with the courage to move forward, even when the path ahead is uncertain.',
    difficulty: 'Hard',
  },
  {
    instruction: 'Give a 30-second elevator pitch for an imaginary product or service.',
    difficulty: 'Medium',
  },
  {
    instruction: 'Describe your surroundings in vivid detail for 45 seconds, as if painting a picture with words.',
    difficulty: 'Easy',
  },
  {
    instruction: 'Practice clear articulation by reading this deliberately and clearly:',
    text: 'Specifically, the statistical analysis substantially supported the theoretical hypothesis that strategic structural adjustments significantly strengthen institutional infrastructure.',
    difficulty: 'Hard',
  },
  {
    instruction: 'Tell a short story (real or made up) in exactly 60 seconds. Focus on pacing and dramatic pauses.',
    difficulty: 'Medium',
  },
]
