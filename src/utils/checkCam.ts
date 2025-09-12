export async function checkCameraStatus(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors', 
      headers: {
        'Accept': 'application/vnd.apple.mpegurl',
      },
    });

    return res.ok; 
  } catch {
    return false;
  }
}