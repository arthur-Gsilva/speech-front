export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return new Response(JSON.stringify({ online: false, error: "Missing url" }), { status: 400 });
  }

  try {
    const r = await fetch(url, { method: "GET" });
    if (!r.ok) return Response.json({ online: false, status: r.status });

    const text = await r.text();
    const valid = text.includes("#EXTM3U") || text.includes("#EXTINF");
    return Response.json({ online: valid, status: r.status });
  } catch (e) {
    // @ts-expect-error ignorando types
    return Response.json({ online: false, error: e.message });
  }
}
