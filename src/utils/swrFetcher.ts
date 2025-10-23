export const fetcher = <T>(url: string, init?: RequestInit): Promise<T> =>
  fetch(url, init).then(async (res) => {
    if (!res.ok) {
      const error = new Error("Fetch error");
      (error as any).info = await res.json().catch(() => null);
      (error as any).status = res.status;
      throw error;
    }
    return res.json() as Promise<T>;
  });
