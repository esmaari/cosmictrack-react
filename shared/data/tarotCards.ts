export type TarotCard = {
    id: number;
    name: string;
    arcana: "Major" | "Minor";
    number: number;
    upright: string;
    reversed: string;
    image: string;
    keywords: string[];
};

export const tarotCards: TarotCard[] = [
    {
        id: 0,
        name: "The Fool",
        arcana: "Major",
        number: 0,
        upright: "Upright meaning for the fool",
        reversed: "Reversed meaning for the fool (reversed)",
        image: "/cards/major_arcana/00_the_fool.png",
        keywords: ['beginning', 'freedom', 'innocence']
    },
    {
        id: 1,
        name: "The Magician",
        arcana: "Major",
        number: 1,
        upright: "Upright meaning for the magician",
        reversed: "Reversed meaning for the magician (reversed)",
        image: "/cards/major_arcana/01_the_magician.png",
        keywords: ['willpower', 'manifestation', 'resourcefulness']
    },
    {
        id: 2,
        name: "The High Priestess",
        arcana: "Major",
        number: 2,
        upright: "Upright meaning for the high priestess",
        reversed: "Reversed meaning for the high priestess (reversed)",
        image: "/cards/major_arcana/02_the_high_priestess.png",
        keywords: ['intuition', 'mystery', 'inner wisdom']
    },
    {
        id: 3,
        name: "The Empress",
        arcana: "Major",
        number: 3,
        upright: "Upright meaning for the empress",
        reversed: "Reversed meaning for the empress (reversed)",
        image: "/cards/major_arcana/03_the_empress.png",
        keywords: ['abundance', 'nurturing', 'creativity']
    },
    {
        id: 4,
        name: "The Emperor",
        arcana: "Major",
        number: 4,
        upright: "Upright meaning for the emperor",
        reversed: "Reversed meaning for the emperor (reversed)",
        image: "/cards/major_arcana/04_the_emperor.png",
        keywords: ['authority', 'structure', 'leadership']
    },
    {
        id: 5,
        name: "The Hierophant",
        arcana: "Major",
        number: 5,
        upright: "Upright meaning for the hierophant",
        reversed: "Reversed meaning for the hierophant (reversed)",
        image: "/cards/major_arcana/05_the_hierophant.png",
        keywords: ['tradition', 'spirituality', 'guidance']
    },
    {
        id: 6,
        name: "The Lovers",
        arcana: "Major",
        number: 6,
        upright: "Upright meaning for the lovers",
        reversed: "Reversed meaning for the lovers (reversed)",
        image: "/cards/major_arcana/06_the_lovers.png",
        keywords: ['union', 'choice', 'love']
    },
    {
        id: 7,
        name: "The Chariot",
        arcana: "Major",
        number: 7,
        upright: "Upright meaning for the chariot",
        reversed: "Reversed meaning for the chariot (reversed)",
        image: "/cards/major_arcana/07_the_chariot.png",
        keywords: ['determination', 'control', 'victory']
    },
    {
        id: 8,
        name: "Strength",
        arcana: "Major",
        number: 8,
        upright: "Upright meaning for strength",
        reversed: "Reversed meaning for strength (reversed)",
        image: "/cards/major_arcana/08_strength.png",
        keywords: ['courage', 'patience', 'inner strength']
    },
    {
        id: 9,
        name: "The Hermit",
        arcana: "Major",
        number: 9,
        upright: "Upright meaning for the hermit",
        reversed: "Reversed meaning for the hermit (reversed)",
        image: "/cards/major_arcana/09_the_hermit.png",
        keywords: ['solitude', 'introspection', 'guidance']
    },
    {
        id: 10,
        name: "Wheel of Fortune",
        arcana: "Major",
        number: 10,
        upright: "Upright meaning for wheel of fortune",
        reversed: "Reversed meaning for wheel of fortune (reversed)",
        image: "/cards/major_arcana/10_wheel_of_fortune.png",
        keywords: ['change', 'cycles', 'destiny']
    },
    {
        id: 11,
        name: "Justice",
        arcana: "Major",
        number: 11,
        upright: "Upright meaning for justice",
        reversed: "Reversed meaning for justice (reversed)",
        image: "/cards/major_arcana/11_justice.png",
        keywords: ['truth', 'fairness', 'karma']
    },
    {
        id: 12,
        name: "The Hanged Man",
        arcana: "Major",
        number: 12,
        upright: "Upright meaning for the hanged man",
        reversed: "Reversed meaning for the hanged man (reversed)",
        image: "/cards/major_arcana/12_the_hanged_man.png",
        keywords: ['sacrifice', 'perspective', 'surrender']
    },
    {
        id: 13,
        name: "Death",
        arcana: "Major",
        number: 13,
        upright: "Upright meaning for death",
        reversed: "Reversed meaning for death (reversed)",
        image: "/cards/major_arcana/13_death.png",
        keywords: ['transformation', 'endings', 'rebirth']
    },
    {
        id: 14,
        name: "Temperance",
        arcana: "Major",
        number: 14,
        upright: "Upright meaning for temperance",
        reversed: "Reversed meaning for temperance (reversed)",
        image: "/cards/major_arcana/14_temperance.png",
        keywords: ['balance', 'moderation', 'harmony']
    },
    {
        id: 15,
        name: "The Devil",
        arcana: "Major",
        number: 15,
        upright: "Upright meaning for the devil",
        reversed: "Reversed meaning for the devil (reversed)",
        image: "/cards/major_arcana/15_the_devil.png",
        keywords: ['addiction', 'materialism', 'shadow self']
    },
    {
        id: 16,
        name: "The Tower",
        arcana: "Major",
        number: 16,
        upright: "Upright meaning for the tower",
        reversed: "Reversed meaning for the tower (reversed)",
        image: "/cards/major_arcana/16_the_tower.png",
        keywords: ['upheaval', 'revelation', 'chaos']
    },
    {
        id: 17,
        name: "The Star",
        arcana: "Major",
        number: 17,
        upright: "Upright meaning for the star",
        reversed: "Reversed meaning for the star (reversed)",
        image: "/cards/major_arcana/17_the_star.png",
        keywords: ['hope', 'renewal', 'faith']
    },
    {
        id: 18,
        name: "The Moon",
        arcana: "Major",
        number: 18,
        upright: "Upright meaning for the moon",
        reversed: "Reversed meaning for the moon (reversed)",
        image: "/cards/major_arcana/18_the_moon.png",
        keywords: ['illusion', 'fear', 'subconscious']
    },
    {
        id: 19,
        name: "The Sun",
        arcana: "Major",
        number: 19,
        upright: "Upright meaning for the sun",
        reversed: "Reversed meaning for the sun (reversed)",
        image: "/cards/major_arcana/19_the_sun.png",
        keywords: ['joy', 'success', 'positivity']
    },
    {
        id: 20,
        name: "Judgement",
        arcana: "Major",
        number: 20,
        upright: "Upright meaning for judgement",
        reversed: "Reversed meaning for judgement (reversed)",
        image: "/cards/major_arcana/20_judgement.png",
        keywords: ['awakening', 'reflection', 'rebirth']
    },
    {
        id: 21,
        name: "The World",
        arcana: "Major",
        number: 21,
        upright: "Upright meaning for the world",
        reversed: "Reversed meaning for the world (reversed)",
        image: "/cards/major_arcana/21_the_world.png",
        keywords: ['completion', 'wholeness', 'achievement']
    },
    {
        id: 22,
        name: "Ace of Wands",
        arcana: "Minor",
        number: 1,
        upright: "Upright meaning for ace of wands",
        reversed: "Reversed meaning for ace of wands (reversed)",
        image: "/cards/wands/wand_ace.png",
        keywords: ['potential', 'new beginning', 'creativity']
    },
    {
        id: 23,
        name: "2 of Wands",
        arcana: "Minor",
        number: 2,
        upright: "Upright meaning for 2 of wands",
        reversed: "Reversed meaning for 2 of wands (reversed)",
        image: "/cards/wands/wand_2.png",
        keywords: ['duality', 'balance', 'creativity']
    },
    {
        id: 24,
        name: "3 of Wands",
        arcana: "Minor",
        number: 3,
        upright: "Upright meaning for 3 of wands",
        reversed: "Reversed meaning for 3 of wands (reversed)",
        image: "/cards/wands/wand_3.png",
        keywords: ['growth', 'collaboration', 'creativity']
    },
    {
        id: 25,
        name: "4 of Wands",
        arcana: "Minor",
        number: 4,
        upright: "Upright meaning for 4 of wands",
        reversed: "Reversed meaning for 4 of wands (reversed)",
        image: "/cards/wands/wand_4.png",
        keywords: ['stability', 'structure', 'creativity']
    },
    {
        id: 26,
        name: "5 of Wands",
        arcana: "Minor",
        number: 5,
        upright: "Upright meaning for 5 of wands",
        reversed: "Reversed meaning for 5 of wands (reversed)",
        image: "/cards/wands/wand_5.png",
        keywords: ['conflict', 'challenge', 'creativity']
    },
    {
        id: 27,
        name: "6 of Wands",
        arcana: "Minor",
        number: 6,
        upright: "Upright meaning for 6 of wands",
        reversed: "Reversed meaning for 6 of wands (reversed)",
        image: "/cards/wands/wand_6.png",
        keywords: ['harmony', 'sharing', 'creativity']
    },
    {
        id: 28,
        name: "7 of Wands",
        arcana: "Minor",
        number: 7,
        upright: "Upright meaning for 7 of wands",
        reversed: "Reversed meaning for 7 of wands (reversed)",
        image: "/cards/wands/wand_7.png",
        keywords: ['defense', 'faith', 'creativity']
    },
    {
        id: 29,
        name: "8 of Wands",
        arcana: "Minor",
        number: 8,
        upright: "Upright meaning for 8 of wands",
        reversed: "Reversed meaning for 8 of wands (reversed)",
        image: "/cards/wands/wand_8.png",
        keywords: ['movement', 'focus', 'creativity']
    },
    {
        id: 30,
        name: "9 of Wands",
        arcana: "Minor",
        number: 9,
        upright: "Upright meaning for 9 of wands",
        reversed: "Reversed meaning for 9 of wands (reversed)",
        image: "/cards/wands/wand_9.png",
        keywords: ['resilience', 'intensity', 'creativity']
    },
    {
        id: 31,
        name: "10 of Wands",
        arcana: "Minor",
        number: 10,
        upright: "Upright meaning for 10 of wands",
        reversed: "Reversed meaning for 10 of wands (reversed)",
        image: "/cards/wands/wand_10.png",
        keywords: ['completion', 'burden', 'creativity']
    },
    {
        id: 32,
        name: "Page of Wands",
        arcana: "Minor",
        number: 11,
        upright: "Upright meaning for page of wands",
        reversed: "Reversed meaning for page of wands (reversed)",
        image: "/cards/wands/wand_page.png",
        keywords: ['exploration', 'message', 'creativity']
    },
    {
        id: 33,
        name: "Knight of Wands",
        arcana: "Minor",
        number: 12,
        upright: "Upright meaning for knight of wands",
        reversed: "Reversed meaning for knight of wands (reversed)",
        image: "/cards/wands/wand_knight.png",
        keywords: ['pursuit', 'drive', 'creativity']
    },
    {
        id: 34,
        name: "Queen of Wands",
        arcana: "Minor",
        number: 13,
        upright: "Upright meaning for queen of wands",
        reversed: "Reversed meaning for queen of wands (reversed)",
        image: "/cards/wands/wand_queen.png",
        keywords: ['nurture', 'intuition', 'creativity']
    },
    {
        id: 35,
        name: "King of Wands",
        arcana: "Minor",
        number: 14,
        upright: "Upright meaning for king of wands",
        reversed: "Reversed meaning for king of wands (reversed)",
        image: "/cards/wands/wand_king.png",
        keywords: ['authority', 'wisdom', 'creativity']
    },
    {
        id: 36,
        name: "Ace of Cups",
        arcana: "Minor",
        number: 1,
        upright: "Upright meaning for ace of cups",
        reversed: "Reversed meaning for ace of cups (reversed)",
        image: "/cards/cups/cup_ace.png",
        keywords: ['potential', 'new beginning', 'emotion']
    },
    {
        id: 37,
        name: "2 of Cups",
        arcana: "Minor",
        number: 2,
        upright: "Upright meaning for 2 of cups",
        reversed: "Reversed meaning for 2 of cups (reversed)",
        image: "/cards/cups/cup_2.png",
        keywords: ['duality', 'balance', 'emotion']
    },
    {
        id: 38,
        name: "3 of Cups",
        arcana: "Minor",
        number: 3,
        upright: "Upright meaning for 3 of cups",
        reversed: "Reversed meaning for 3 of cups (reversed)",
        image: "/cards/cups/cup_3.png",
        keywords: ['growth', 'collaboration', 'emotion']
    },
    {
        id: 39,
        name: "4 of Cups",
        arcana: "Minor",
        number: 4,
        upright: "Upright meaning for 4 of cups",
        reversed: "Reversed meaning for 4 of cups (reversed)",
        image: "/cards/cups/cup_4.png",
        keywords: ['stability', 'structure', 'emotion']
    },
    {
        id: 40,
        name: "5 of Cups",
        arcana: "Minor",
        number: 5,
        upright: "Upright meaning for 5 of cups",
        reversed: "Reversed meaning for 5 of cups (reversed)",
        image: "/cards/cups/cup_5.png",
        keywords: ['conflict', 'challenge', 'emotion']
    },
    {
        id: 41,
        name: "6 of Cups",
        arcana: "Minor",
        number: 6,
        upright: "Upright meaning for 6 of cups",
        reversed: "Reversed meaning for 6 of cups (reversed)",
        image: "/cards/cups/cup_6.png",
        keywords: ['harmony', 'sharing', 'emotion']
    },
    {
        id: 42,
        name: "7 of Cups",
        arcana: "Minor",
        number: 7,
        upright: "Upright meaning for 7 of cups",
        reversed: "Reversed meaning for 7 of cups (reversed)",
        image: "/cards/cups/cup_7.png",
        keywords: ['defense', 'faith', 'emotion']
    },
    {
        id: 43,
        name: "8 of Cups",
        arcana: "Minor",
        number: 8,
        upright: "Upright meaning for 8 of cups",
        reversed: "Reversed meaning for 8 of cups (reversed)",
        image: "/cards/cups/cup_8.png",
        keywords: ['movement', 'focus', 'emotion']
    },
    {
        id: 44,
        name: "9 of Cups",
        arcana: "Minor",
        number: 9,
        upright: "Upright meaning for 9 of cups",
        reversed: "Reversed meaning for 9 of cups (reversed)",
        image: "/cards/cups/cup_9.png",
        keywords: ['resilience', 'intensity', 'emotion']
    },
    {
        id: 45,
        name: "10 of Cups",
        arcana: "Minor",
        number: 10,
        upright: "Upright meaning for 10 of cups",
        reversed: "Reversed meaning for 10 of cups (reversed)",
        image: "/cards/cups/cup_10.png",
        keywords: ['completion', 'burden', 'emotion']
    },
    {
        id: 46,
        name: "Page of Cups",
        arcana: "Minor",
        number: 11,
        upright: "Upright meaning for page of cups",
        reversed: "Reversed meaning for page of cups (reversed)",
        image: "/cards/cups/cup_page.png",
        keywords: ['exploration', 'message', 'emotion']
    },
    {
        id: 47,
        name: "Knight of Cups",
        arcana: "Minor",
        number: 12,
        upright: "Upright meaning for knight of cups",
        reversed: "Reversed meaning for knight of cups (reversed)",
        image: "/cards/cups/cup_knight.png",
        keywords: ['pursuit', 'drive', 'emotion']
    },
    {
        id: 48,
        name: "Queen of Cups",
        arcana: "Minor",
        number: 13,
        upright: "Upright meaning for queen of cups",
        reversed: "Reversed meaning for queen of cups (reversed)",
        image: "/cards/cups/cup_queen.png",
        keywords: ['nurture', 'intuition', 'emotion']
    },
    {
        id: 49,
        name: "King of Cups",
        arcana: "Minor",
        number: 14,
        upright: "Upright meaning for king of cups",
        reversed: "Reversed meaning for king of cups (reversed)",
        image: "/cards/cups/cup_king.png",
        keywords: ['authority', 'wisdom', 'emotion']
    },
    {
        id: 50,
        name: "Ace of Swords",
        arcana: "Minor",
        number: 1,
        upright: "Upright meaning for ace of swords",
        reversed: "Reversed meaning for ace of swords (reversed)",
        image: "/cards/swords/sword_ace.png",
        keywords: ['potential', 'new beginning', 'thought']
    },
    {
        id: 51,
        name: "2 of Swords",
        arcana: "Minor",
        number: 2,
        upright: "Upright meaning for 2 of swords",
        reversed: "Reversed meaning for 2 of swords (reversed)",
        image: "/cards/swords/sword_2.png",
        keywords: ['duality', 'balance', 'thought']
    },
    {
        id: 52,
        name: "3 of Swords",
        arcana: "Minor",
        number: 3,
        upright: "Upright meaning for 3 of swords",
        reversed: "Reversed meaning for 3 of swords (reversed)",
        image: "/cards/swords/sword_3.png",
        keywords: ['growth', 'collaboration', 'thought']
    },
    {
        id: 53,
        name: "4 of Swords",
        arcana: "Minor",
        number: 4,
        upright: "Upright meaning for 4 of swords",
        reversed: "Reversed meaning for 4 of swords (reversed)",
        image: "/cards/swords/sword_4.png",
        keywords: ['stability', 'structure', 'thought']
    },
    {
        id: 54,
        name: "5 of Swords",
        arcana: "Minor",
        number: 5,
        upright: "Upright meaning for 5 of swords",
        reversed: "Reversed meaning for 5 of swords (reversed)",
        image: "/cards/swords/sword_5.png",
        keywords: ['conflict', 'challenge', 'thought']
    },
    {
        id: 55,
        name: "6 of Swords",
        arcana: "Minor",
        number: 6,
        upright: "Upright meaning for 6 of swords",
        reversed: "Reversed meaning for 6 of swords (reversed)",
        image: "/cards/swords/sword_6.png",
        keywords: ['harmony', 'sharing', 'thought']
    },
    {
        id: 56,
        name: "7 of Swords",
        arcana: "Minor",
        number: 7,
        upright: "Upright meaning for 7 of swords",
        reversed: "Reversed meaning for 7 of swords (reversed)",
        image: "/cards/swords/sword_7.png",
        keywords: ['defense', 'faith', 'thought']
    },
    {
        id: 57,
        name: "8 of Swords",
        arcana: "Minor",
        number: 8,
        upright: "Upright meaning for 8 of swords",
        reversed: "Reversed meaning for 8 of swords (reversed)",
        image: "/cards/swords/sword_8.png",
        keywords: ['movement', 'focus', 'thought']
    },
    {
        id: 58,
        name: "9 of Swords",
        arcana: "Minor",
        number: 9,
        upright: "Upright meaning for 9 of swords",
        reversed: "Reversed meaning for 9 of swords (reversed)",
        image: "/cards/swords/sword_9.png",
        keywords: ['resilience', 'intensity', 'thought']
    },
    {
        id: 59,
        name: "10 of Swords",
        arcana: "Minor",
        number: 10,
        upright: "Upright meaning for 10 of swords",
        reversed: "Reversed meaning for 10 of swords (reversed)",
        image: "/cards/swords/sword_10.png",
        keywords: ['completion', 'burden', 'thought']
    },
    {
        id: 60,
        name: "Page of Swords",
        arcana: "Minor",
        number: 11,
        upright: "Upright meaning for page of swords",
        reversed: "Reversed meaning for page of swords (reversed)",
        image: "/cards/swords/sword_page.png",
        keywords: ['exploration', 'message', 'thought']
    },
    {
        id: 61,
        name: "Knight of Swords",
        arcana: "Minor",
        number: 12,
        upright: "Upright meaning for knight of swords",
        reversed: "Reversed meaning for knight of swords (reversed)",
        image: "/cards/swords/sword_knight.png",
        keywords: ['pursuit', 'drive', 'thought']
    },
    {
        id: 62,
        name: "Queen of Swords",
        arcana: "Minor",
        number: 13,
        upright: "Upright meaning for queen of swords",
        reversed: "Reversed meaning for queen of swords (reversed)",
        image: "/cards/swords/sword_queen.png",
        keywords: ['nurture', 'intuition', 'thought']
    },
    {
        id: 63,
        name: "King of Swords",
        arcana: "Minor",
        number: 14,
        upright: "Upright meaning for king of swords",
        reversed: "Reversed meaning for king of swords (reversed)",
        image: "/cards/swords/sword_king.png",
        keywords: ['authority', 'wisdom', 'thought']
    },
    {
        id: 64,
        name: "Ace of Pentacles",
        arcana: "Minor",
        number: 1,
        upright: "Upright meaning for ace of pentacles",
        reversed: "Reversed meaning for ace of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_ace.png",
        keywords: ['potential', 'new beginning', 'material']
    },
    {
        id: 65,
        name: "2 of Pentacles",
        arcana: "Minor",
        number: 2,
        upright: "Upright meaning for 2 of pentacles",
        reversed: "Reversed meaning for 2 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_2.png",
        keywords: ['duality', 'balance', 'material']
    },
    {
        id: 66,
        name: "3 of Pentacles",
        arcana: "Minor",
        number: 3,
        upright: "Upright meaning for 3 of pentacles",
        reversed: "Reversed meaning for 3 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_3.png",
        keywords: ['growth', 'collaboration', 'material']
    },
    {
        id: 67,
        name: "4 of Pentacles",
        arcana: "Minor",
        number: 4,
        upright: "Upright meaning for 4 of pentacles",
        reversed: "Reversed meaning for 4 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_4.png",
        keywords: ['stability', 'structure', 'material']
    },
    {
        id: 68,
        name: "5 of Pentacles",
        arcana: "Minor",
        number: 5,
        upright: "Upright meaning for 5 of pentacles",
        reversed: "Reversed meaning for 5 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_5.png",
        keywords: ['conflict', 'challenge', 'material']
    },
    {
        id: 69,
        name: "6 of Pentacles",
        arcana: "Minor",
        number: 6,
        upright: "Upright meaning for 6 of pentacles",
        reversed: "Reversed meaning for 6 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_6.png",
        keywords: ['harmony', 'sharing', 'material']
    },
    {
        id: 70,
        name: "7 of Pentacles",
        arcana: "Minor",
        number: 7,
        upright: "Upright meaning for 7 of pentacles",
        reversed: "Reversed meaning for 7 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_7.png",
        keywords: ['defense', 'faith', 'material']
    },
    {
        id: 71,
        name: "8 of Pentacles",
        arcana: "Minor",
        number: 8,
        upright: "Upright meaning for 8 of pentacles",
        reversed: "Reversed meaning for 8 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_8.png",
        keywords: ['movement', 'focus', 'material']
    },
    {
        id: 72,
        name: "9 of Pentacles",
        arcana: "Minor",
        number: 9,
        upright: "Upright meaning for 9 of pentacles",
        reversed: "Reversed meaning for 9 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_9.png",
        keywords: ['resilience', 'intensity', 'material']
    },
    {
        id: 73,
        name: "10 of Pentacles",
        arcana: "Minor",
        number: 10,
        upright: "Upright meaning for 10 of pentacles",
        reversed: "Reversed meaning for 10 of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_10.png",
        keywords: ['completion', 'burden', 'material']
    },
    {
        id: 74,
        name: "Page of Pentacles",
        arcana: "Minor",
        number: 11,
        upright: "Upright meaning for page of pentacles",
        reversed: "Reversed meaning for page of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_page.png",
        keywords: ['exploration', 'message', 'material']
    },
    {
        id: 75,
        name: "Knight of Pentacles",
        arcana: "Minor",
        number: 12,
        upright: "Upright meaning for knight of pentacles",
        reversed: "Reversed meaning for knight of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_knight.png",
        keywords: ['pursuit', 'drive', 'material']
    },
    {
        id: 76,
        name: "Queen of Pentacles",
        arcana: "Minor",
        number: 13,
        upright: "Upright meaning for queen of pentacles",
        reversed: "Reversed meaning for queen of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_queen.png",
        keywords: ['nurture', 'intuition', 'material']
    },
    {
        id: 77,
        name: "King of Pentacles",
        arcana: "Minor",
        number: 14,
        upright: "Upright meaning for king of pentacles",
        reversed: "Reversed meaning for king of pentacles (reversed)",
        image: "/cards/pentacles/pentacle_king.png",
        keywords: ['authority', 'wisdom', 'material']
    }
];