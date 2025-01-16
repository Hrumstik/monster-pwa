import { FacebookEvent } from "@models/pwa";

export const generateLabelForFBEvents = (event: FacebookEvent) => {
  switch (event) {
    case FacebookEvent.AddToCart:
      return "Добавление товара в корзину (AddToCart)";
    case FacebookEvent.AddPaymentInfo:
      return "Добавление платежных данных (AddPaymentInfo)";
    case FacebookEvent.Purchase:
      return "Покупка (Purchase)";
    case FacebookEvent.Subscribe:
      return "Подписка (Subscribe)";
    case FacebookEvent.ViewContent:
      return "Просмотр контента (ViewContent)";
    case FacebookEvent.AddToWishlist:
      return "Добавление в список желаний (AddToWishlist)";
    case FacebookEvent.CompleteRegistration:
      return "Завершение регистрации (CompleteRegistration)";
    case FacebookEvent.Contact:
      return "Контакт (Contact)";
    case FacebookEvent.CustomizeProduct:
      return "Настройка продукта (CustomizeProduct)";
    case FacebookEvent.Donate:
      return "Донат (Donate)";
    case FacebookEvent.FindLocation:
      return "Поиск местоположения (FindLocation)";
    case FacebookEvent.InitiateCheckout:
      return "Инициация оплаты (InitiateCheckout)";
    case FacebookEvent.Lead:
      return "Лид (Lead)";
    case FacebookEvent.Schedule:
      return "Расписание (Schedule)";
    case FacebookEvent.Search:
      return "Поиск (Search)";
    case FacebookEvent.StartTrial:
      return "Начало триала (StartTrial)";
    case FacebookEvent.SubmitApplication:
      return "Отправка заявки (SubmitApplication)";
    default:
      return "";
  }
};
