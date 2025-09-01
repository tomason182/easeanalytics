import { Schema } from "express-validator";

export const websiteSchema: Schema = {
  siteName: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "Site name must be provided",
    },
    escape: true,
    isLength: {
      options: {
        min: 1,
        max: 150,
      },
      errorMessage: "Site name max length is 150 characters",
    },
  },
  siteUrl: {
    in: ["body"],
    trim: true,
    notEmpty: {
      bail: true,
      errorMessage: "site url must be provided",
    },
    isURL: {
      options: {
        protocols: ["http", "https"],
        require_tld: true,
        require_protocol: true,
      },
      errorMessage: "site URL must be a valid URL (http or https)",
    },
    custom: {
      options: (value: string) => {
        const url = new URL(value);
        if (url.pathname !== "/" || url.search || url.hash) {
          throw new Error(
            "Site URL must be a root domain without /path/query/hash"
          );
        }
        return true;
      },
    },
    customSanitizer: {
      options: (value: string) => {
        const url = new URL(value);
        return url.origin.toLowerCase();
      },
    },
  },
};
