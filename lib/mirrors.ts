export const apiMirrors: string[] = [
  "https://tarkov-market.com/api/v1",
  "https://ru.tarkov-market.com/api/v1"
];

export async function bestMirror (): Promise<string> {
  const results = {};
  for (const url of apiMirrors) {
    const start = Date.now();
    results[url] = Date.now() - start;
  }
}