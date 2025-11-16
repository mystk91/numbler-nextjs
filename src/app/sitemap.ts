import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://numbler.net";
  const staticRoutes = [
    "",
    "/digits2",
    "/digits3",
    "/digits4",
    "/digits5",
    "/digits6",
    "/digits7",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
  }));
}
