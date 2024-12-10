import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const MarkdownDisplay = ({ content }: { content: string }) => {
  return (
    <Markdown
      className="leading-relaxed"
      rehypePlugins={[rehypeKatex]}
      remarkPlugins={[remarkGfm]}
    >
      {content.replace(/\n/g, "\n\n")}
    </Markdown>
  );
};

export default MarkdownDisplay;
