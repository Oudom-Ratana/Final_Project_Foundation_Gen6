export default async function handler(req, res) {
  // 1. Instantly handle CORS preflight for all browsers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, Accept, X-Requested-With"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. Extract path & query parameters
  const query = { ...req.query };
  const targetPath = query.path || "";
  delete query.path;

  const queryString = new URLSearchParams(query).toString();
  const targetUrl = `https://cinema-booking-api.eunglyzhia.com/api/v1/${targetPath}${
    queryString ? `?${queryString}` : ""
  }`;

  // 3. Forward request headers without the browser's Vercel Origin
  // (Prevents the Teacher's Spring Security from blocking with 403 Forbidden)
  const headers = {};
  if (req.headers.authorization) {
    headers["Authorization"] = req.headers.authorization;
  }
  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"];
  }
  headers["Accept"] = req.headers["accept"] || "application/json, image/png, */*";

  try {
    let body = undefined;
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      if (typeof req.body === "object" && req.body !== null) {
        body = JSON.stringify(req.body);
      } else {
        body = req.body;
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body,
    });

    res.status(response.status);

    const contentType = response.headers.get("content-type");
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    // Support both binary data (e.g. KHQR PNG images) and JSON text
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return res.send(buffer);
  } catch (err) {
    console.error("Vercel Proxy Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
