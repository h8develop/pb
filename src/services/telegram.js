export function useTelegram() {
  const tg = window.Telegram.WebApp;

  const isLocalTest = !tg.initDataUnsafe?.user;
  const mockUser = {
    id: 666,
    username: "mock_user",
    first_name: "Mock",
    last_name: "User",
  };

  if (isLocalTest) {
    console.warn("Используются мокированные данные пользователя");
  }

  return {
    tg,
    user: isLocalTest ? mockUser : tg.initDataUnsafe?.user || null,
  };
}
