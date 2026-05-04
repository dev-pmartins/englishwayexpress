import { Children, cloneElement, isValidElement } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const brandRegex = /\b(EnglishWay Express|EnglishWay|English Way Express|logo-conteudo)\b/gi;
const brandTokenRegex = /^(EnglishWay Express|EnglishWay|English Way Express|logo-conteudo)$/i;
const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const brandNode = (key) => (
  <span key={key} className="brand-inline">
    <img src="/logo-span-englishwayexpress.png" alt="English Way Express" />
  </span>
);

const replaceBrandTokensInSegment = (text) => {
  if (!brandRegex.test(text)) {
    brandRegex.lastIndex = 0;
    return text;
  }

  brandRegex.lastIndex = 0;
  const chunks = text.split(brandRegex);

  return chunks
    .filter(Boolean)
    .map((chunk, index) =>
      brandTokenRegex.test(chunk)
        ? brandNode(`brand-${index}-${chunk}`)
        : <span key={`chunk-${index}`}>{chunk}</span>
    );
};

const replaceBrandTokens = (text) => {
  if (!emailRegex.test(text)) {
    emailRegex.lastIndex = 0;
    return replaceBrandTokensInSegment(text);
  }

  emailRegex.lastIndex = 0;
  const output = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const emailMatch of text.matchAll(emailRegex)) {
    const emailStart = emailMatch.index ?? 0;
    const emailValue = emailMatch[0];
    const beforeEmail = text.slice(lastIndex, emailStart);

    if (beforeEmail) {
      output.push(...[].concat(replaceBrandTokensInSegment(beforeEmail)));
    }

    output.push(<span key={`email-${matchIndex}`}>{emailValue}</span>);
    lastIndex = emailStart + emailValue.length;
    matchIndex += 1;
  }

  const trailing = text.slice(lastIndex);
  if (trailing) {
    output.push(...[].concat(replaceBrandTokensInSegment(trailing)));
  }

  return output;
};

const decorateChildren = (children) =>
  Children.map(children, (child, index) => {
    if (typeof child === "string") {
      return <>{replaceBrandTokens(child)}</>;
    }

    if (isValidElement(child)) {
      return cloneElement(child, {
        key: child.key ?? `el-${index}`,
        children: decorateChildren(child.props.children)
      });
    }

    return child;
  });

function LegacyMarkdown({ markdown }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="section-title">{decorateChildren(children)}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="section-title section-title-small">
            {decorateChildren(children)}
          </h3>
        ),
        p: ({ children }) => <p>{decorateChildren(children)}</p>,
        li: ({ children }) => <li>{decorateChildren(children)}</li>,
        a: ({ href, children }) => {
          const normalizedHref = typeof href === "string" && href.startsWith("/")
            ? href.replace(/\/+$/, "") || "/"
            : href;

          const isExternal =
            typeof normalizedHref === "string" && /^https?:\/\//i.test(normalizedHref);

          if (typeof normalizedHref === "string" && normalizedHref.startsWith("/")) {
            return <Link to={normalizedHref}>{decorateChildren(children)}</Link>;
          }

          return (
            <a
              href={normalizedHref}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noreferrer" : undefined}
            >
              {decorateChildren(children)}
            </a>
          );
        }
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default LegacyMarkdown;
