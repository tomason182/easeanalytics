import { Schema } from "express-validator";

export const pageSchema: Schema = {
  siteKey: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "Site key is required",
    },
    escape: true,
  },
  url: {
    in: ["body"],
    trim: true,
    isURL: {
      options: {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      },
      errorMessage: "Site URL must be a valid URL (http or https)",
    },
    customSanitizer: {
      options: (value: string) => {
        const url = new URL(value);
        return `${url.protocol}//${url.hostname.toLocaleLowerCase()}${
          url.pathname
        }`;
      },
    },
  },
  referrer: {
    in: ["body"],
    trim: true,
    optional: true,
    escape: true,
  },
  deviceWidth: {
    in: ["body"],
    trim: true,
    escape: true,
    isNumeric: {
      errorMessage: "Device width must be numeric",
    },
    toInt: true,
  },
  userAgent: {
    in: ["body"],
    trim: true,
    notEmpty: {
      errorMessage: "User agent is required",
    },
  },
  ipAddress: {
    in: ["body"],
    trim: true,
    isIP: {
      errorMessage: "IP address must be valid (IPv4 or IPv6)",
    },
  },
};

export const statsSchema: Schema = {
  websiteId: {
    in: ["body"],
    trim: true,
    isNumeric: true,
    notEmpty: {
      bail: true,
      errorMessage: "website id is required",
    },
    toInt: true,
  },
  days: {
    in: ["body"],
    trim: true,
    isNumeric: true,
    notEmpty: {
      bail: true,
      errorMessage: "days is required",
    },
  },
};
