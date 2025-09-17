// utils/checkCam.ts
export async function checkCameraStatus(url: string): Promise<boolean> {
  try {
    const encoded = encodeURIComponent(url);
    const res = await fetch(`/api/check?url=${encoded}`);
    if (!res.ok) return false;
    const json = await res.json();
    return Boolean(json.online);
  } catch {
    return false;
  }
}
