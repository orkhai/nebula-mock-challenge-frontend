export async function authorizedFetch(
  url: string,
  options: RequestInit = {},
  token?: string | null
) {
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    const errorMessage = data?.error || response.statusText;
    throw new Error(errorMessage);
  }

  return response.json();
}
