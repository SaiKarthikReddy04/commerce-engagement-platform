import jwt from "jsonwebtoken";

function unauthorized(res, message = "A valid access token is required.") {
  return res.status(401).json({
    error: {
      code: "UNAUTHORIZED",
      message,
    },
  });
}

export function authenticate(req, res, next) {
  const authorization = req.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return unauthorized(res);
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next(new Error("JWT_SECRET is missing from the environment."));
  }

  try {
    const payload = jwt.verify(match[1], secret);

    if (
      typeof payload !== "object" ||
      !payload.sub ||
      !payload.role
    ) {
      return unauthorized(res, "The access token is invalid.");
    }

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch {
    return unauthorized(res, "The access token is invalid or expired.");
  }
}

export function requireRole(...allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: "UNAUTHORIZED",
            message: "A valid access token is required.",
          },
        });
      }
  
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to perform this action.",
          },
        });
      }
  
      next();
    };
  }