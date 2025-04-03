import { FormInstance } from "antd";
import { DesignOptionFormValues } from "./DesignOption";
import { PreviewPwaContent } from "./Preview/models";

interface AvatarUrls {
  male: string[];
  female: string[];
}

export const allowedExtensions = [".png", ".jpeg", ".jpg", ".svg", ".webp"];
export const allowedExtensionsErrorMessage = `Допустимые форматы: ${allowedExtensions.join(
  ", "
)}`;
export const languages = [
  { value: "all", label: "Все языки" },
  { value: "ar", label: "Арабский" },
  { value: "bg", label: "Болгарский" },
  { value: "cs", label: "Чешский" },
  { value: "da", label: "Датский" },
  { value: "de", label: "Немецкий" },
  { value: "el", label: "Греческий" },
  { value: "es", label: "Испанский" },
  { value: "et", label: "Эстонский" },
  { value: "fi", label: "Финский" },
  { value: "fr", label: "Французский" },
  { value: "hu", label: "Венгерский" },
  { value: "id", label: "Индонезийский" },
  { value: "it", label: "Итальянский" },
  { value: "ja", label: "Японский" },
  { value: "ko", label: "Корейский" },
  { value: "lt", label: "Литовский" },
  { value: "lv", label: "Латышский" },
  { value: "nb", label: "Норвежский (букмол)" },
  { value: "nl", label: "Нидерландский" },
  { value: "pl", label: "Польский" },
  { value: "ro", label: "Румынский" },
  { value: "ru", label: "Русский" },
  { value: "sk", label: "Словацкий" },
  { value: "sl", label: "Словенский" },
  { value: "sv", label: "Шведский" },
  { value: "tr", label: "Турецкий" },
  { value: "uk", label: "Украинский" },
  { value: "zh", label: "Китайский" },
  { value: "en-GB", label: "Английский (Великобритания)" },
  { value: "en-US", label: "Английский (США)" },
  { value: "pt-BR", label: "Португальский (Бразилия)" },
  { value: "pt-PT", label: "Португальский (Португалия)" },
];

export const categories = [
  { value: "gambling", label: "Gambling" },
  { value: "betting", label: "Betting" },
  { value: "casino", label: "Casino" },
  { value: "nutra", label: "Nutra" },
  { value: "crypto", label: "Crypto" },
  { value: "finance", label: "Finance" },
  { value: "dating", label: "Dating" },
];

export const generateRandomValue = (
  form: FormInstance<DesignOptionFormValues>,
  field: string,
  values: string[],
  previewContent: PreviewPwaContent,
  setPreviewContent: (values: PreviewPwaContent) => void
) => {
  const randomValue = values[Math.floor(Math.random() * values.length)];
  form.setFieldsValue({ [field]: randomValue });
  setPreviewContent({
    ...previewContent,
    [field]: randomValue,
  });
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

export const avatarUrls: AvatarUrls = {
  male: [
    "https://pwac-media.s3.eu-north-1.amazonaws.com/5ab91b21-8af4-47d4-8a6d-f670e513b756-678bbd909e3f150f6b7748498629709a.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/554812d7-93a0-4f53-afdc-435e9a0a72ba-0b05eab45da977b55fe5cd62e90c8638.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/8540098c-2fd5-467c-a5cc-10bead1bff7c-5a3805b37dc1c48cebb8f35eb3df1428.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/cd6314b4-eed9-4806-93c9-8c437061bb9a-7ec463330915395544dd672212e44271.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/37e66a97-2a23-43dd-89b9-3c85a95eb860-53cfbb02b425816e23d6fe391ffdae54.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/5eec3f0f-b01a-422a-9c3c-b6165068501d-73b48a4120e188b1457aa6e81f193689.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/18bbd4ba-a844-4931-aaea-df82b5113908-b1fc05412d81eb306b2cf687b7ff96d3.png",
  ],
  female: [
    "https://pwac-media.s3.eu-north-1.amazonaws.com/8e4ec898-9b10-437e-a86b-3f352e88f433-2e3ef0e4a8e761005eed0f1a52f745e2.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/ffad094f-244d-4e60-9b1d-6e2542e9cc22-4deecf0dffede981088f59e6135a2648.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/ac9e60df-725b-4516-99c4-807f5c312374-7cbbfbb351278fe60b5ef71433df6ae6.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/c63aa469-38c3-4026-9f0d-bb3613831590-47aeec01894590c5ce94990078d778cf.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/c507830b-9796-4638-b87a-e7f3a3eb29ef-546fd771605a1787675d2b80cccae02b.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/d4ebc9eb-b602-4ecd-9b08-2ea981fff859-6609b68a77b5f1b573399758eed09949.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/3495f929-caa0-46b6-afff-b8068bd1c220-db7901ebc0e86bb2993f8cc96de24956.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/3c7a2cde-5b94-41f9-b4cf-4ae4b8318772-eb274d896c33b0b598e2ca871d6517ba.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/582ce633-c250-478b-8e9f-85d7377e5fd3-f1f19e56bbf38285d3af1123c6781995.png",
    "https://pwac-media.s3.eu-north-1.amazonaws.com/3c40e6b5-21a9-44f0-8270-742f36df1947-f1041d25bacc3b8fd7d3195396af3aee.png",
  ],
};

export const gerRandomImageUrl = (sex: keyof AvatarUrls): string => {
  const urls = avatarUrls[sex];
  return urls[Math.floor(Math.random() * urls.length)];
};

export const generateTimeoutOptions = (
  start: number,
  end: number,
  step: number = 1000
) => {
  return Array.from({ length: (end - start) / step + 1 }, (_, i) => {
    const value = start + i * step;
    const seconds = value / 1000;
    const label =
      seconds === 1
        ? "1 секунда"
        : seconds >= 2 && seconds <= 4
        ? `${seconds} секунды`
        : `${seconds} секунд`;
    return { value, label };
  });
};
