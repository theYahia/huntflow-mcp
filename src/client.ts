const BASE_URL = "https://api.huntflow.ai/v2";
const TIMEOUT = 10_000;
const MAX_RETRIES = 3;

export async function hfGet(path: string): Promise<unknown> {
  const token = process.env.HUNTFLOW_TOKEN;
  if (!token) {
    throw new Error("HUNTFLOW_TOKEN обязателен. Получите в настройках HuntFlow: Настройки → API.");
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      if (response.status === 401) {
        throw new Error("HuntFlow: неверный токен. Проверьте HUNTFLOW_TOKEN.");
      }

      throw new Error(`HuntFlow HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) continue;
      throw error;
    }
  }
  throw new Error("HuntFlow: все попытки исчерпаны");
}
