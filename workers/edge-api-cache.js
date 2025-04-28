export default {
  async fetch(req, env) {
    if (req.method !== "GET") return fetch(req);                 // POST/PUT BYPASS
    let cacheKey = new URL(req.url).toString();
    let cached = await env.CB_EDGE_CACHE.get(cacheKey, "stream");
    if (cached) return new Response(cached, { headers: { "CF-Cache-Status": "EDGE-HIT" }});
    let resp = await fetch(req);
    let clone = resp.clone();
    if (resp.ok) env.CB_EDGE_CACHE.put(cacheKey, clone.body, { expirationTtl: 30 });
    return resp;
  }
}; 