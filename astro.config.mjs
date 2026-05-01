import { defineConfig } from "astro/config";

// TODO: retarget if a custom domain becomes available, or when the repo
// transfers to LUCK666DUCK. Currently published at
// https://crabsatellite.github.io/luckduck_portfolio/ (working fork).
const SITE = "https://crabsatellite.github.io";
const BASE = "/luckduck_portfolio";

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: "ignore",
  build: {
    assets: "_astro",
  },
});
