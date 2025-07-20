export interface Scripture {
  verse: string;
  reference: string;
  theme: "default" | "business" | "stewardship" | "community" | "service" | "growth" | "faith" | "giving" | "leadership" | "wisdom" | "peace" | "strength";
}

export const scriptureCollection: Scripture[] = [
  // Faith & Trust
  {
    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    theme: "faith"
  },
  {
    verse: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    theme: "faith"
  },
  {
    verse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    theme: "faith"
  },

  // Community & Fellowship
  {
    verse: "And let us consider how we may spur one another on toward love and good deeds, not giving up meeting together, as some are in the habit of doing, but encouraging one another.",
    reference: "Hebrews 10:24-25",
    theme: "community"
  },
  {
    verse: "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ.",
    reference: "1 Corinthians 12:12",
    theme: "community"
  },
  {
    verse: "Therefore encourage one another and build each other up, just as in fact you are doing.",
    reference: "1 Thessalonians 5:11",
    theme: "community"
  },
  {
    verse: "By this everyone will know that you are my disciples, if you love one another.",
    reference: "John 13:35",
    theme: "community"
  },

  // Service & Ministry
  {
    verse: "Each of you should use whatever gift you have to serve others, as faithful stewards of God's grace in its various forms.",
    reference: "1 Peter 4:10",
    theme: "service"
  },
  {
    verse: "For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.",
    reference: "Mark 10:45",
    theme: "service"
  },
  {
    verse: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
    reference: "Colossians 3:23",
    theme: "service"
  },

  // Giving & Generosity
  {
    verse: "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.",
    reference: "2 Corinthians 9:7",
    theme: "giving"
  },
  {
    verse: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.",
    reference: "Luke 6:38",
    theme: "giving"
  },
  {
    verse: "Remember this: Whoever sows sparingly will also reap sparingly, and whoever sows generously will also reap generously.",
    reference: "2 Corinthians 9:6",
    theme: "giving"
  },

  // Stewardship & Financial Wisdom
  {
    verse: "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing, and your vats will brim over with new wine.",
    reference: "Proverbs 3:9-10",
    theme: "stewardship"
  },
  {
    verse: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
    reference: "Luke 16:10",
    theme: "stewardship"
  },
  {
    verse: "Keep your lives free from the love of money and be content with what you have, because God has said, 'Never will I leave you; never will I forsake you.'",
    reference: "Hebrews 13:5",
    theme: "stewardship"
  },

  // Leadership & Business
  {
    verse: "Commit to the Lord whatever you do, and he will establish your plans.",
    reference: "Proverbs 16:3",
    theme: "business"
  },
  {
    verse: "The plans of the diligent lead to profit as surely as haste leads to poverty.",
    reference: "Proverbs 21:5",
    theme: "business"
  },
  {
    verse: "Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all.",
    reference: "Mark 10:43-44",
    theme: "leadership"
  },
  {
    verse: "Above all else, guard your heart, for everything you do flows from it.",
    reference: "Proverbs 4:23",
    theme: "leadership"
  },

  // Wisdom & Growth
  {
    verse: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
    reference: "James 1:5",
    theme: "wisdom"
  },
  {
    verse: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding.",
    reference: "Proverbs 9:10",
    theme: "wisdom"
  },
  {
    verse: "As iron sharpens iron, so one person sharpens another.",
    reference: "Proverbs 27:17",
    theme: "growth"
  },
  {
    verse: "But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To him be glory both now and forever! Amen.",
    reference: "2 Peter 3:18",
    theme: "growth"
  },

  // Strength & Peace
  {
    verse: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    theme: "strength"
  },
  {
    verse: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.",
    reference: "Psalm 28:7",
    theme: "strength"
  },
  {
    verse: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27",
    theme: "peace"
  },
  {
    verse: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
    reference: "Philippians 4:7",
    theme: "peace"
  },
];

export const getRandomScripture = (theme?: Scripture['theme']): Scripture => {
  let filteredScriptures = scriptureCollection;
  
  if (theme) {
    filteredScriptures = scriptureCollection.filter(scripture => scripture.theme === theme);
  }
  
  const randomIndex = Math.floor(Math.random() * filteredScriptures.length);
  return filteredScriptures[randomIndex] || scriptureCollection[0];
};

export const getDailyScripture = (theme?: Scripture['theme']): Scripture => {
  // Use the current date as a seed for consistent daily scripture
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  let filteredScriptures = scriptureCollection;
  if (theme) {
    filteredScriptures = scriptureCollection.filter(scripture => scripture.theme === theme);
  }
  
  // Simple hash function to get consistent daily scripture
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash) % filteredScriptures.length;
  return filteredScriptures[index] || scriptureCollection[0];
};