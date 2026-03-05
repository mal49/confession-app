var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-XwwufS/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/middleware/error-handler.ts
function errorHandler(error) {
  console.error("Worker Error:", error);
  const message = error instanceof Error ? error.message : "Internal Server Error";
  const status = error instanceof Error && "status" in error ? error.status : 500;
  const errorData = error instanceof Error && "data" in error ? error.data : void 0;
  const responseBody = {
    success: false,
    error: message,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (errorData) {
    responseBody.data = errorData;
  }
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  if (status === 429 && errorData?.retryAfter && typeof errorData.retryAfter === "number") {
    headers["Retry-After"] = String(errorData.retryAfter * 60);
  }
  return new Response(
    JSON.stringify(responseBody),
    { status, headers }
  );
}
__name(errorHandler, "errorHandler");
var ApiError = class extends Error {
  static {
    __name(this, "ApiError");
  }
  status;
  data;
  constructor(message, status = 500, data) {
    super(message);
    this.status = status;
    this.name = "ApiError";
    this.data = data;
  }
};

// src/middleware/cors.ts
var ALLOWED_ORIGINS = [
  "http://localhost:5173",
  // Vite dev server
  "http://localhost:8787"
  // Wrangler dev
];
function corsMiddleware(request) {
  const origin = request.headers.get("Origin");
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || "") ? origin : ALLOWED_ORIGINS[0];
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigin || "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  return null;
}
__name(corsMiddleware, "corsMiddleware");
function addCorsHeaders(response, origin) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin || "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
__name(addCorsHeaders, "addCorsHeaders");

// src/middleware/turnstile.ts
async function verifyTurnstileToken(token, secretKey, clientIP) {
  if (!token) {
    throw new ApiError("CAPTCHA token is required", 400);
  }
  if (!secretKey) {
    console.error("TURNSTILE_SECRET_KEY not configured");
    throw new ApiError("Server configuration error", 500);
  }
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (clientIP) {
    formData.append("remoteip", clientIP);
  }
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData
      }
    );
    const data = await response.json();
    if (!data.success) {
      console.error("Turnstile verification failed:", data["error-codes"]);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
__name(verifyTurnstileToken, "verifyTurnstileToken");
async function requireTurnstile(token, secretKey, clientIP) {
  if (!token) {
    throw new ApiError("CAPTCHA verification required. Please complete the challenge.", 403);
  }
  const isValid = await verifyTurnstileToken(token, secretKey, clientIP);
  if (!isValid) {
    throw new ApiError("CAPTCHA verification failed. Please try again.", 403);
  }
}
__name(requireTurnstile, "requireTurnstile");

// src/middleware/rate-limit.ts
var rateLimitStore = /* @__PURE__ */ new Map();
var DEFAULT_CONFIG = {
  maxRequests: 3,
  windowMinutes: 60
};
function checkRateLimit(identifier, config = DEFAULT_CONFIG) {
  const now = Date.now();
  const windowMs = config.windowMinutes * 60 * 1e3;
  const entry = rateLimitStore.get(identifier);
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }
  if (now - entry.firstRequest > windowMs) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now
    });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }
  if (entry.count >= config.maxRequests) {
    const retryAfter = Math.ceil((entry.firstRequest + windowMs - now) / 1e3 / 60);
    return { allowed: false, remaining: 0, retryAfter };
  }
  entry.count++;
  rateLimitStore.set(identifier, entry);
  return { allowed: true, remaining: config.maxRequests - entry.count };
}
__name(checkRateLimit, "checkRateLimit");
function requireRateLimit(ipHash, customConfig) {
  if (!ipHash) {
    console.warn("Rate limiting skipped: no IP hash available");
    return;
  }
  const result = checkRateLimit(ipHash, customConfig);
  if (!result.allowed) {
    throw new ApiError(
      `Rate limit exceeded. Please try again in ${result.retryAfter} minute(s).`,
      429,
      { retryAfter: result.retryAfter }
    );
  }
}
__name(requireRateLimit, "requireRateLimit");

// src/middleware/content-filter.ts
var BLOCKED_PATTERNS = [
  // Hate speech patterns (regex)
  /\b(hate\s+(?:speech|crime))\b/gi,
  // Common spam patterns
  /\b(viagra|cialis|casino|lottery|winner\s+\$\d+)\b/gi,
  // Excessive repetition (more than 5 identical consecutive characters)
  /(.)\1{5,}/,
  // All caps shouting (more than 80% caps in long words)
  /\b[A-Z]{10,}\b/
];
var BLOCKED_WORDS = /* @__PURE__ */ new Set([
  // Common slurs and hate speech would go here
  // Using placeholder examples - customize for your needs
  "spam",
  "scam",
  "click here",
  "visit my profile",
  "follow me",
  "dm me",
  "message me",
  "check my bio",
  "link in bio"
]);
var SUSPICIOUS_PATTERNS = [
  /https?:\/\/\S+/gi,
  // URLs (flag for review)
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  // Credit card-like numbers
  /\b\d{3}-\d{2}-\d{4}\b/,
  // SSN-like patterns
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
  // Email addresses
];
function checkBlockedPatterns(content) {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      return { blocked: true, reason: "Content contains blocked patterns" };
    }
  }
  return { blocked: false };
}
__name(checkBlockedPatterns, "checkBlockedPatterns");
function checkBlockedWords(content) {
  const lowerContent = content.toLowerCase();
  const words = lowerContent.split(/\s+/);
  for (const word of words) {
    if (BLOCKED_WORDS.has(word)) {
      return { blocked: true, reason: "Content contains blocked words" };
    }
  }
  for (const blockedPhrase of BLOCKED_WORDS) {
    if (blockedPhrase.includes(" ") && lowerContent.includes(blockedPhrase)) {
      return { blocked: true, reason: "Content contains blocked phrases" };
    }
  }
  return { blocked: false };
}
__name(checkBlockedWords, "checkBlockedWords");
function checkSuspiciousPatterns(content) {
  return SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(content));
}
__name(checkSuspiciousPatterns, "checkSuspiciousPatterns");
function checkQuality(content) {
  const wordCount = content.trim().split(/\s+/).length;
  if (wordCount < 20) {
    return { passed: false, reason: "Content is too short (minimum 20 words)" };
  }
  const words = content.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = /* @__PURE__ */ new Map();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }
  const maxFreq = Math.max(...wordFreq.values());
  if (maxFreq > words.length * 0.3) {
    return { passed: false, reason: "Content has excessive word repetition" };
  }
  return { passed: true };
}
__name(checkQuality, "checkQuality");
function filterContent(content) {
  const patternCheck = checkBlockedPatterns(content);
  if (patternCheck.blocked) {
    return {
      clean: false,
      flagged: true,
      reason: patternCheck.reason,
      category: "blocked"
    };
  }
  const wordCheck = checkBlockedWords(content);
  if (wordCheck.blocked) {
    return {
      clean: false,
      flagged: true,
      reason: wordCheck.reason,
      category: "profanity"
    };
  }
  const qualityCheck = checkQuality(content);
  if (!qualityCheck.passed) {
    return {
      clean: false,
      flagged: true,
      reason: qualityCheck.reason,
      category: "spam"
    };
  }
  const hasSuspicious = checkSuspiciousPatterns(content);
  if (hasSuspicious) {
    return {
      clean: true,
      flagged: true,
      reason: "Content contains suspicious patterns and requires manual review",
      category: "suspicious"
    };
  }
  return {
    clean: true,
    flagged: false,
    category: "clean"
  };
}
__name(filterContent, "filterContent");
function requireCleanContent(content) {
  const result = filterContent(content);
  if (result.category === "profanity" || result.category === "blocked") {
    throw new ApiError(
      result.reason || "Content violates our community guidelines",
      400,
      { category: result.category }
    );
  }
  if (result.category === "spam") {
    throw new ApiError(
      result.reason || "Content does not meet quality standards",
      400,
      { category: result.category }
    );
  }
  return result;
}
__name(requireCleanContent, "requireCleanContent");
function sanitizeContent(content) {
  return content.replace(/\s+/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
}
__name(sanitizeContent, "sanitizeContent");

// src/routes/confession.ts
async function confessionRoutes(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  if (path === "/api/confession" && method === "POST") {
    return await submitConfession(request, env);
  }
  if (path === "/api/confession/pending" && method === "GET") {
    return await getPendingConfessions(request, env);
  }
  const approveMatch = path.match(/\/api\/confession\/(\d+)\/approve/);
  if (approveMatch && method === "POST") {
    const id = parseInt(approveMatch[1], 10);
    return await approveConfession(request, env, id);
  }
  const rejectMatch = path.match(/\/api\/confession\/(\d+)\/reject/);
  if (rejectMatch && method === "POST") {
    const id = parseInt(rejectMatch[1], 10);
    return await rejectConfession(request, env, id);
  }
  throw new ApiError("Not Found", 404);
}
__name(confessionRoutes, "confessionRoutes");
async function submitConfession(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    throw new ApiError("Invalid JSON in request body", 400);
  }
  const { content, category, turnstileToken } = body;
  if (!content || typeof content !== "string") {
    throw new ApiError("Content is required", 400);
  }
  if (!category || typeof category !== "string") {
    throw new ApiError("Category is required", 400);
  }
  if (content.length < 500 || content.length > 800) {
    throw new ApiError("Content must be between 500 and 800 characters", 400);
  }
  const clientIP = request.headers.get("CF-Connecting-IP") || void 0;
  await requireTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, clientIP);
  const ipHash = clientIP ? await hashIP(clientIP) : null;
  requireRateLimit(ipHash, { maxRequests: 3, windowMinutes: 60 });
  const sanitizedContent = sanitizeContent(content);
  let filterResult;
  try {
    filterResult = requireCleanContent(sanitizedContent);
  } catch (filterError) {
    throw filterError;
  }
  try {
    const initialStatus = filterResult.flagged ? "pending" : "pending";
    const result = await env.DB.prepare(
      `INSERT INTO confessions (content, category, ip_hash, turnstile_token, status)
       VALUES (?, ?, ?, ?, ?)
       RETURNING id`
    ).bind(sanitizedContent, category, ipHash, turnstileToken, initialStatus).first();
    if (!result) {
      throw new ApiError("Failed to create confession", 500);
    }
    return addCorsHeaders(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            id: result.id,
            status: initialStatus,
            message: filterResult.flagged ? "Confession submitted and is awaiting manual review." : "Confession submitted successfully and is awaiting review.",
            flagged: filterResult.flagged
          }
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      )
    );
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError("Failed to save confession", 500);
  }
}
__name(submitConfession, "submitConfession");
async function hashIP(ip) {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + "confession-app-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hashIP, "hashIP");
async function getPendingConfessions(request, env) {
  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, confessions: [], total: 0, hasMore: false }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}
__name(getPendingConfessions, "getPendingConfessions");
async function approveConfession(request, env, id) {
  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, message: "Confession approved", id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}
__name(approveConfession, "approveConfession");
async function rejectConfession(request, env, id) {
  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: true, message: "Confession rejected", id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}
__name(rejectConfession, "rejectConfession");

// src/routes/admin.ts
async function adminRoutes(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  if (path === "/api/admin/stats" && method === "GET") {
    return await getStats(request, env);
  }
  return addCorsHeaders(
    new Response(
      JSON.stringify({ success: false, error: "Not Found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    )
  );
}
__name(adminRoutes, "adminRoutes");
async function getStats(request, env) {
  return addCorsHeaders(
    new Response(
      JSON.stringify({
        success: true,
        stats: {
          pending: 0,
          approved: 0,
          rejected: 0,
          posted: 0,
          total: 0
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  );
}
__name(getStats, "getStats");

// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    try {
      const corsResponse = corsMiddleware(request);
      if (corsResponse) return corsResponse;
      const url = new URL(request.url);
      const path = url.pathname;
      if (path.startsWith("/api/confession")) {
        return await confessionRoutes(request, env, ctx);
      }
      if (path.startsWith("/api/admin")) {
        return await adminRoutes(request, env, ctx);
      }
      if (path === "/api/health") {
        return new Response(
          JSON.stringify({ success: true, message: "OK", timestamp: (/* @__PURE__ */ new Date()).toISOString() }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({ success: false, error: "Not Found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
};

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XwwufS/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XwwufS/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
