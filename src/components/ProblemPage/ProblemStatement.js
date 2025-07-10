import React, { useMemo } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const parseLatexString = (text) => {
  const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
  const parts = text.split(regex);
  const result = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("$$") && part.endsWith("$$")) {
      result.push({
        type: "block",
        content: part.slice(2, -2).trim(),
      });
    } else if (part.startsWith("$") && part.endsWith("$")) {
      result.push({
        type: "inline",
        content: part.slice(1, -1).trim(),
      });
    } else {
      result.push({ type: "text", content: part });
    }
  }
  return result;
};

const RenderContent = ({ part, index }) => {
  switch (part.type) {
    case "inline":
      return <InlineMath key={index} math={part.content} />;
    case "block":
      return (
        <div key={index} className="my-4">
          <BlockMath math={part.content} />
        </div>
      );
    case "text":
    default:
      return (
        <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />
      );
  }
};

export default function ProblemStatement({ content }) {
  const parsedContent = useMemo(() => parseLatexString(content), [content]);

  return (
    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-base">
      {parsedContent.map((part, i) => (
        <RenderContent key={i} part={part} index={i} />
      ))}
    </div>
  );
}
