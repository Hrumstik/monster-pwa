import { FormInstance } from "antd";
import { DesignOptionFormValues } from "./DesignOption";

export const languages = [
  { value: "en-US", label: "Английский (США)" },
  { value: "en-GB", label: "Английский (Великобритания)" },
  { value: "DE", label: "Немецкий" },
  { value: "FR", label: "Французский" },
  { value: "ES", label: "Испанский" },
  { value: "IT", label: "Итальянский" },
  { value: "PT", label: "Португальский" },
  { value: "NL", label: "Нидерландский" },
  { value: "SV", label: "Шведский" },
  { value: "DA", label: "Датский" },
  { value: "FI", label: "Финский" },
  { value: "PL", label: "Польский" },
  { value: "ZH", label: "Китайский" },
  { value: "JA", label: "Японский" },
  { value: "ET", label: "Эстонский" },
  { value: "LT", label: "Литовский" },
  { value: "SL", label: "Словенский" },
  { value: "BG", label: "Болгарский" },
  { value: "SK", label: "Словацкий" },
  { value: "RO", label: "Румынский" },
  { value: "EL", label: "Греческий" },
  { value: "HU", label: "Венгерский" },
  { value: "CS", label: "Чешский" },
  { value: "AR", label: "Арабский" },
];

export const categories = [
  { value: "gambling", label: "Гемблинг" },
  { value: "betting", label: "Ставки" },
  { value: "casino", label: "Казино" },
  { value: "nutra", label: "Нутра" },
  { value: "crypto", label: "Крипто" },
  { value: "finance", label: "Финансы" },
  { value: "dating", label: "Знакомства" },
];

export const generateRandomValue = (
  form: FormInstance<DesignOptionFormValues>,
  field: string,
  values: string[]
) => {
  const randomValue = values[Math.floor(Math.random() * values.length)];
  form.setFieldsValue({ [field]: randomValue });
};

export const sizeValues = [
  "2 mb",
  "3 mb",
  "4 mb",
  "5 mb",
  "6 mb",
  "7 mb",
  "8 mb",
  "9 mb",
  "10 mb",
  "11 mb",
  "12 mb",
];

export const ageValues = ["0+", "3+", "7+", "18+"];

export const countOfDownloadsValues = [
  "100 тыс +",
  "200 тыс +",
  "300 тыс +",
  "400 тыс +",
  "500 тыс +",
  "600 тыс +",
  "700 тыс +",
  "800 тыс +",
  "900 тыс +",
  "1 млн +",
  "2 млн +",
  "3 млн +",
  "4 млн +",
  "5 млн +",
  "6 млн +",
  "7 млн +",
  "8 млн +",
  "9 млн +",
  "10 млн +",
];

export const casinoKeywords = [
  "Casino",
  "Betting",
  "Slots",
  "Gambling",
  "SpinToWin",
  "OnlineCasino",
  "Lucky",
  "BigWin",
  "Fortune",
  "Bet",
  "CasinoGames",
  "WinBig",
  "SlotMachine",
  "Roulette",
  "Poker",
  "Blackjack",
  "Bingo",
  "Vegas",
  "CasinoNight",
  "SlotGames",
  "CasinoLife",
  "SlotWins",
  "BetAndWin",
  "CasinoBonus",
  "LuckySpin",
  "SlotWins",
  "BetOnIt",
  "SpinAndWin",
  "LuckyWin",
  "CasinoKing",
  "BetNow",
  "WinMoney",
  "SlotFun",
  "CasinoChips",
  "BettingTips",
  "WinCash",
  "LuckyCasino",
  "SlotBonanza",
  "OnlineSlots",
  "BettingOdds",
  "FortuneWheel",
  "Gamble",
  "WinBig",
  "CasinoVIP",
  "BettingApp",
  "WinPrizes",
  "SpinCasino",
  "SlotMania",
  "BigWinCasino",
  "LuckyBet",
];

export const casinoMessages = [
  "🎰 Играйте и выигрывайте в лучшем казино! 🏆",
  "💰 Делайте ставки и выигрывайте каждый день! 🎲",
  "🍀 Испытайте удачу и выигрывайте крупные призы! 💎",
  "🃏 Присоединяйтесь к нам и наслаждайтесь азартными играми! 🌟",
  "🎉 Выигрывайте большие деньги с нашими слотами! 🏅",
  "🚀 Делайте ставки и станьте чемпионом! 🏆",
  "🎲 Играйте в рулетку и выигрывайте! 💰",
  "🌟 Вращайте барабаны и побеждайте! 🎰",
  "🏅 Участвуйте в турнирах и выигрывайте призы! 🎉",
  "💎 Откройте для себя мир казино и крупных выигрышей! 🍀",
  "🎰 Крутите барабаны и выигрывайте крупные суммы! 🏆",
  "💰 Ставьте на спорт и выигрывайте каждый матч! ⚽",
  "🎲 Играйте в покер и побеждайте! 🃏",
  "🌟 Станьте мастером ставок и выигрывайте! 🚀",
  "🏅 Наслаждайтесь азартными играми и крупными выигрышами! 🎰",
  "🎉 Испытайте удачу и выигрывайте каждый день! 🍀",
  "💎 Ставьте на спорт и станьте чемпионом! 🏆",
  "🃏 Играйте в блэкджек и выигрывайте! 🎲",
  "🍀 Делайте ставки и увеличивайте свои выигрыши! 💰",
  "🏆 Играйте в слоты и выигрывайте крупные призы! 🎰",
  "🎲 Крутите барабаны и наслаждайтесь азартом! 🃏",
  "🌟 Делайте ставки и выигрывайте крупные суммы! 💎",
  "🏅 Станьте чемпионом и выигрывайте призы! 🎉",
  "💰 Играйте в рулетку и побеждайте каждый раз! 🚀",
  "🎰 Наслаждайтесь лучшими играми казино и выигрывайте! 🌟",
  "🍀 Испытайте свою удачу и выигрывайте каждый день! 🏆",
  "🎲 Делайте ставки и наслаждайтесь азартом! 🃏",
  "🌟 Вращайте барабаны и выигрывайте крупные суммы! 💰",
  "🏅 Станьте чемпионом и выигрывайте каждый раз! 🎉",
  "💎 Играйте в блэкджек и побеждайте! 🍀",
  "🎰 Ставьте на спорт и выигрывайте крупные призы! 🚀",
  "🎲 Наслаждайтесь азартными играми и крупными выигрышами! 🌟",
  "💰 Делайте ставки и увеличивайте свои выигрыши! 🎉",
  "🍀 Играйте в слоты и выигрывайте каждый раз! 🏆",
  "🃏 Крутите барабаны и наслаждайтесь азартом! 💎",
  "🎰 Ставьте на спорт и станьте чемпионом! 🎲",
  "🏅 Играйте в рулетку и побеждайте! 💰",
  "🌟 Делайте ставки и выигрывайте крупные суммы! 🚀",
  "🎉 Испытайте удачу и выигрывайте каждый день! 🃏",
  "💎 Наслаждайтесь лучшими играми казино и крупными выигрышами! 🍀",
];

export const countOfReviews = [
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "1000",
];

export const developerValue = [
  "Casino Blitz",
  "BetMaster Pro",
  "Jackpot Joy",
  "SpinWin 24/7",
  "LuckyBet Supreme",
  "Vegas Victory",
  "RollTheDice",
  "FortuneFrenzy",
  "BetBlast",
  "CasinoCraze",
  "WinWave",
  "BetBazaar",
  "CashCascade",
  "JackpotJunction",
  "BetBuddy",
  "LuckySpin Casino",
  "BigWinRush",
  "SlotSpot",
  "BetBolt",
  "CasinoSplash",
  "MegaBet Mania",
  "FortuneFind",
  "LuckyLanes",
  "BetBurst",
  "CashCraze",
  "WinWonders",
  "BetBliss",
  "JackpotJourney",
  "SpinSphere",
  "BetBonanza",
  "CasinoCrush",
  "LuckyLines",
  "WinWorld",
  "BetBingo",
  "CashKingdom",
  "JackpotJive",
  "SpinSaga",
  "BetBlitz",
  "FortuneFusion",
  "LuckyLounge",
  "WinWinGo",
  "CasinoCarnival",
  "BetBuzz",
  "JackpotJungle",
  "SpinStorm",
  "BetBoost",
  "LuckyLeap",
  "CashCraze Pro",
  "JackpotJoyride",
  "SpinSpree",
  "BetBoom",
  "FortuneFever",
  "LuckyLotto",
  "WinWave Casino",
  "CasinoCrazeX",
  "BetBash",
  "JackpotJewel",
  "SpinSpectra",
  "BetBuddies",
  "CashCrown",
  "JackpotJubilee",
  "SpinSwirl",
  "BetBrilliance",
  "FortuneFest",
  "LuckyLands",
  "WinWorldX",
  "CasinoCharm",
  "BetBling",
  "JackpotJamboree",
  "SpinSphereX",
  "BetBlaze",
  "FortuneFiesta",
  "LuckyLuxe",
  "CashCastle",
  "JackpotJiveX",
  "SpinSensation",
  "BetBonanzaX",
  "FortuneFlash",
  "LuckyLights",
  "WinWizards",
  "CasinoCrazeXX",
  "BetBlastX",
  "JackpotJunctionX",
  "SpinSafari",
  "BetBreeze",
  "FortuneFantasy",
  "LuckyLinks",
  "CashCascadeX",
  "JackpotJovial",
  "SpinSizzler",
  "BetBazaarX",
  "FortuneFrenzyX",
  "LuckyLasso",
  "WinWonderland",
  "CasinoCarnivalX",
  "BetBoltX",
  "JackpotJunctionPro",
  "SpinSavvy",
  "BetBoomX",
  "FortuneFusionX",
];
