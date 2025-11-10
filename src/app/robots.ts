import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/profile",
          `/login`,
          "/signup",
          "/reset-password",
          "/change-password",
          "/verify",
          "/account-deleted",
          "/api/",
          "/dev/",
        ],
      },
    ],
    sitemap: "https://numbler.net/sitemap.xml",
  };
}
