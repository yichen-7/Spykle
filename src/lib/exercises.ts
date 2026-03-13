export interface TongueTwister {
  text: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  targetSound: string
}

export interface DailyChallenge {
  topic: string
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

export const dailyTopics: string[] = [
  'Why do people procrastinate and how can they stop?',
  'What makes a good leader?',
  'Is social media more harmful or helpful?',
  'What would you change about the education system?',
  'Describe your perfect day from start to finish.',
  'Should everyone learn to code? Why or why not?',
  'What is the most important invention of the last 100 years?',
  'If you could have dinner with anyone, dead or alive, who and why?',
  'What does success mean to you?',
  'Is it better to be feared or loved?',
  'What skill do you wish you had learned earlier in life?',
  'Explain why your favorite movie is worth watching.',
  'What would you do if you had unlimited money for one day?',
  'Is remote work better than working in an office?',
  'Describe a challenge you overcame and what you learned.',
  'What makes a friendship last?',
  'If you could live in any time period, which would you choose?',
  'What is one thing everyone should try at least once?',
  'Is it better to be a specialist or a generalist?',
  'What role does music play in your life?',
  'Convince someone to visit your hometown.',
  'What is the biggest misconception people have about your field?',
  'Should school start later in the morning?',
  'Describe how a technology works to someone from the 1800s.',
  'What is the best advice you have ever received?',
  'Talk about a book, show, or podcast that changed your perspective.',
  'Is it important to follow the news? Why or why not?',
  'What would you tell your younger self?',
  'Explain why a hobby you enjoy is worth picking up.',
  'What does it mean to live a good life?',
  'Should AI be used in schools?',
  'Describe your morning routine and why it works for you.',
  'What is one problem in the world you wish you could solve?',
  'Is competition healthy or toxic?',
  'Talk about a place that is special to you and why.',
  'What makes someone a good communicator?',
  'If you started a business tomorrow, what would it be?',
  'Is it possible to be truly selfless?',
  'What is something you changed your mind about?',
  'Describe what your life will look like in 10 years.',
  'Should we colonize Mars?',
  'What is the hardest part about growing up?',
  'Talk about a person who influenced you the most.',
  'Is happiness a choice or a circumstance?',
  'What makes a great teacher?',
  'Explain a complex idea in simple terms.',
  'Should voting be mandatory?',
  'What is one cultural tradition you value?',
  'Talk about a risk you took and how it turned out.',
  'What would the world look like without the internet?',
]

export interface PhilosophyQuote {
  quote: string
  author: string
  context: string
}

export const philosophyQuotes: PhilosophyQuote[] = [
  // Marcus Aurelius
  { quote: 'You have power over your mind — not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius', context: 'Meditations' },
  { quote: 'The happiness of your life depends upon the quality of your thoughts.', author: 'Marcus Aurelius', context: 'Meditations' },
  { quote: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius', context: 'Meditations' },
  { quote: 'The best revenge is not to be like your enemy.', author: 'Marcus Aurelius', context: 'Meditations' },
  { quote: 'It is not death that a man should fear, but he should fear never beginning to live.', author: 'Marcus Aurelius', context: 'Meditations' },
  { quote: 'Very little is needed to make a happy life; it is all within yourself, in your way of thinking.', author: 'Marcus Aurelius', context: 'Meditations' },

  // Nietzsche
  { quote: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche', context: 'Twilight of the Idols' },
  { quote: 'Without music, life would be a mistake.', author: 'Friedrich Nietzsche', context: 'Twilight of the Idols' },
  { quote: 'Whoever fights monsters should see to it that in the process he does not become a monster.', author: 'Friedrich Nietzsche', context: 'Beyond Good and Evil' },
  { quote: 'There are no facts, only interpretations.', author: 'Friedrich Nietzsche', context: 'Notebooks' },
  { quote: 'The individual has always had to struggle to keep from being overwhelmed by the tribe.', author: 'Friedrich Nietzsche', context: 'Beyond Good and Evil' },
  { quote: 'Man is something that shall be overcome. What have you done to overcome him?', author: 'Friedrich Nietzsche', context: 'Thus Spoke Zarathustra' },

  // Dostoevsky
  { quote: 'The soul is healed by being with children.', author: 'Fyodor Dostoevsky', context: 'The Idiot' },
  { quote: 'Pain and suffering are always inevitable for a large intelligence and a deep heart.', author: 'Fyodor Dostoevsky', context: 'Crime and Punishment' },
  { quote: 'The mystery of human existence lies not in just staying alive, but in finding something to live for.', author: 'Fyodor Dostoevsky', context: 'The Brothers Karamazov' },
  { quote: 'To go wrong in one\'s own way is better than to go right in someone else\'s.', author: 'Fyodor Dostoevsky', context: 'Crime and Punishment' },
  { quote: 'Above all, don\'t lie to yourself. The man who lies to himself and listens to his own lie comes to a point that he cannot distinguish the truth within him.', author: 'Fyodor Dostoevsky', context: 'The Brothers Karamazov' },

  // Kafka
  { quote: 'A book must be the axe for the frozen sea within us.', author: 'Franz Kafka', context: 'Letter to Oskar Pollak' },
  { quote: 'In the struggle between yourself and the world, side with the world.', author: 'Franz Kafka', context: 'Aphorisms' },
  { quote: 'Paths are made by walking.', author: 'Franz Kafka', context: 'Notebooks' },
  { quote: 'Don\'t bend; don\'t water it down; don\'t try to make it logical; don\'t edit your own soul according to the fashion.', author: 'Franz Kafka', context: 'Letters' },

  // Machiavelli
  { quote: 'Everyone sees what you appear to be, few experience what you really are.', author: 'Niccolo Machiavelli', context: 'The Prince' },
  { quote: 'The lion cannot protect himself from traps, and the fox cannot defend himself from wolves. One must therefore be a fox to recognize traps, and a lion to frighten wolves.', author: 'Niccolo Machiavelli', context: 'The Prince' },
  { quote: 'Never was anything great achieved without danger.', author: 'Niccolo Machiavelli', context: 'The Prince' },
  { quote: 'Men judge generally more by the eye than by the hand, for everyone can see and few can feel.', author: 'Niccolo Machiavelli', context: 'The Prince' },

  // Seneca
  { quote: 'We suffer more often in imagination than in reality.', author: 'Seneca', context: 'Letters to Lucilius' },
  { quote: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca', context: 'Letters to Lucilius' },
  { quote: 'It is not that we have a short time to live, but that we waste a great deal of it.', author: 'Seneca', context: 'On the Shortness of Life' },
  { quote: 'Difficulties strengthen the mind, as labor does the body.', author: 'Seneca', context: 'Moral Letters' },

  // Epictetus
  { quote: 'It\'s not what happens to you, but how you react to it that matters.', author: 'Epictetus', context: 'Discourses' },
  { quote: 'First say to yourself what you would be; and then do what you have to do.', author: 'Epictetus', context: 'Discourses' },
  { quote: 'No man is free who is not master of himself.', author: 'Epictetus', context: 'Discourses' },

  // Alexander the Great (attributed)
  { quote: 'There is nothing impossible to him who will try.', author: 'Alexander the Great', context: 'Attributed' },
  { quote: 'I am not afraid of an army of lions led by a sheep; I am afraid of an army of sheep led by a lion.', author: 'Alexander the Great', context: 'Attributed' },
  { quote: 'Remember, upon the conduct of each depends the fate of all.', author: 'Alexander the Great', context: 'Attributed' },

  // Sun Tzu
  { quote: 'Appear weak when you are strong, and strong when you are weak.', author: 'Sun Tzu', context: 'The Art of War' },
  { quote: 'The supreme art of war is to subdue the enemy without fighting.', author: 'Sun Tzu', context: 'The Art of War' },
  { quote: 'In the midst of chaos, there is also opportunity.', author: 'Sun Tzu', context: 'The Art of War' },

  // Camus
  { quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.', author: 'Albert Camus', context: 'Return to Tipasa' },
  { quote: 'The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.', author: 'Albert Camus', context: 'The Rebel' },
  { quote: 'Should I kill myself, or have a cup of coffee?', author: 'Albert Camus', context: 'The Myth of Sisyphus' },

  // Schopenhauer
  { quote: 'A man can be himself only so long as he is alone; and if he does not love solitude, he will not love freedom.', author: 'Arthur Schopenhauer', context: 'Counsels and Maxims' },
  { quote: 'Talent hits a target no one else can hit. Genius hits a target no one else can see.', author: 'Arthur Schopenhauer', context: 'The World as Will and Representation' },

  // Lao Tzu
  { quote: 'When I let go of what I am, I become what I might be.', author: 'Lao Tzu', context: 'Tao Te Ching' },
  { quote: 'Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.', author: 'Lao Tzu', context: 'Tao Te Ching' },

  // Plato / Socrates
  { quote: 'The unexamined life is not worth living.', author: 'Socrates', context: 'Apology (via Plato)' },
  { quote: 'I know that I know nothing.', author: 'Socrates', context: 'Apology (via Plato)' },
  { quote: 'Be kind, for everyone you meet is fighting a hard battle.', author: 'Plato', context: 'Attributed' },
]

export function getDailyQuote(): PhilosophyQuote {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  // Use a different offset than daily challenge so they don't correlate
  const index = (seed * 7 + 13) % philosophyQuotes.length
  return philosophyQuotes[index]
}

export function getDailyChallenge(): DailyChallenge {
  // Use the date as seed so everyone gets the same topic per day, but it changes daily
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const index = seed % dailyTopics.length
  return {
    topic: dailyTopics[index],
    instruction: `Talk about this topic for 1 full minute. Speak clearly, stay on topic, and try to fill the entire minute without long pauses.`,
    difficulty: 'Medium',
  }
}
