import headerRaw from "../../legacy_content/parts_header.md?raw";
import navRaw from "../../legacy_content/parts_nav.md?raw";
import footerRaw from "../../legacy_content/parts_footer.md?raw";

const pageFiles = import.meta.glob("../../legacy_content/pages_*.md", {
  eager: true,
  query: "?raw",
  import: "default"
});

const cleanPath = (path = "") => {
  const normalized = `/${path}`.replace(/\/+/g, "/").replace(/\/+$/, "");
  return normalized || "/";
};

const slugFromFileName = (filePath) => {
  const fileName = filePath.split("/").at(-1) ?? "";
  const rawSlug = fileName.replace(/^pages_/, "").replace(/\.md$/, "");
  return rawSlug === "home" ? "" : rawSlug.replaceAll("_", "/");
};

const parseTitle = (markdownText) => {
  const firstHeading = markdownText
    .split("\n")
    .find((line) => line.trim().startsWith("# "));

  return firstHeading ? firstHeading.replace(/^#\s+/, "").trim() : "Pagina";
};

const stripFirstHeading = (markdownText) => markdownText.replace(/^#\s+.*\n?/, "").trim();

const parseNav = (markdownText) => {
  const lines = markdownText.split("\n").map((line) => line.trim());
  const sections = [];
  let current = null;

  for (const line of lines) {
    const mainMatch = line.match(/^##\s+(.+)\s+\/(.*)$/);
    if (mainMatch) {
      const [, label, path] = mainMatch;
      current = {
        label: label.trim(),
        path: cleanPath(path.trim()),
        children: []
      };
      sections.push(current);
      continue;
    }

    const childMatch = line.match(/^###\s+(.+)\s+\/(.*)$/);
    if (childMatch && current) {
      const [, label, path] = childMatch;
      current.children.push({
        label: label.trim(),
        path: cleanPath(path.trim())
      });
    }
  }

  return sections;
};

const normalizeUrl = (url = "") => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "#";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return cleanPath(trimmed);
};

const extractLinks = (markdownText, sectionTitlePattern) => {
  const blockRegex = new RegExp(
    `#{1,6}\\s+${sectionTitlePattern}([\\s\\S]*?)(?:\\n#{1,6}\\s+|$)`,
    "i"
  );
  const block = markdownText.match(blockRegex)?.[1] ?? "";
  const matches = [...block.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)];

  return matches.map((match) => ({
    label: match[1],
    url: normalizeUrl(match[2])
  }));
};

const pages = Object.entries(pageFiles)
  .map(([filePath, markdown]) => {
    const slug = slugFromFileName(filePath);
    const path = cleanPath(slug);
    const title = parseTitle(markdown);

    return {
      filePath,
      slug,
      path,
      title,
      markdown,
      body: stripFirstHeading(markdown)
    };
  })
  .sort((a, b) => {
    if (a.path === "/") {
      return -1;
    }
    if (b.path === "/") {
      return 1;
    }
    return a.path.localeCompare(b.path, "pt-BR");
  });

export const legacyContent = {
  headerRaw,
  navRaw,
  footerRaw,
  navItems: parseNav(navRaw),
  pageMap: new Map(pages.map((page) => [page.path, page])),
  pages,
  sitemapLinks: extractLinks(footerRaw, "P[aá]ginas"),
  serviceLinks: extractLinks(footerRaw, "Servi[cç]os"),
  usefulLinks: extractLinks(footerRaw, "Links\\s+[UÚ]teis")
};
