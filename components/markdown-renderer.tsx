"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownRendererProps {
  content: string
}

// Add this interface for code component props
interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
  node?: any;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-3" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
        p: ({ node, ...props }) => <p className="my-2" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
        li: ({ node, ...props }) => <li className="my-1" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
        ),
        code: ({ node, inline, ...props }: CodeProps) =>
          inline ? (
            <code className="bg-slate-800 px-1 py-0.5 rounded text-sm" {...props} />
          ) : (
            <code className="block bg-slate-800 p-2 rounded-md text-sm my-2 overflow-x-auto" {...props} />
          ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-slate-600 pl-4 italic my-2" {...props} />
        ),
        hr: ({ node, ...props }) => <hr className="my-4 border-slate-700" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

