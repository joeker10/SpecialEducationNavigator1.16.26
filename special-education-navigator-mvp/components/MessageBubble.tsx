
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { User, ExternalLink, Bot, Compass } from 'lucide-react';
import { Message, Sender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.sender === Sender.AI;

  return (
    <div className={`flex gap-4 ${isAI ? 'bg-zinc-900/60' : 'bg-zinc-800/30'} p-6 rounded-2xl border ${isAI ? 'border-zinc-800 shadow-md shadow-black/20' : 'border-zinc-800/50'}`}>
      
      {/* Avatar */}
      <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center overflow-hidden border ${isAI ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500/30' : 'bg-zinc-800 border-zinc-700'}`}>
        {isAI ? (
          <Compass size={18} className="text-white" />
        ) : (
          <User size={18} className="text-zinc-400" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isAI ? 'text-blue-400' : 'text-zinc-400'}`}>
            {isAI ? 'Navigator AI' : 'You'}
          </span>
          {isAI && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-tighter font-bold">Verified</span>}
        </div>
        
        <div className={`prose prose-invert prose-sm md:prose-base max-w-none leading-relaxed ${!isAI ? 'text-zinc-300' : 'text-zinc-200'}`}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline decoration-blue-400/30 underline-offset-2 transition-colors" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-4 space-y-1 my-2 marker:text-zinc-600" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-4 space-y-1 my-2 marker:text-zinc-600" />,
              li: ({ node, ...props }) => <li {...props} className="pl-1" />,
              p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0" />,
              strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-white" />,
              code: ({ node, ...props }) => <code {...props} className="bg-zinc-800/50 px-1.5 py-0.5 rounded text-zinc-200 font-mono text-xs border border-zinc-700/50" />,
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Grounding Sources - Only for AI */}
        {isAI && message.groundingSources && message.groundingSources.length > 0 && (
          <div className="mt-5 pt-4 border-t border-zinc-800/50">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-blue-500"></span> Official Sources
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {message.groundingSources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all group"
                >
                  <div className="bg-zinc-900/80 p-1.5 rounded-md group-hover:bg-zinc-700 transition-colors">
                    <ExternalLink size={12} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-300 font-medium truncate group-hover:text-blue-200 transition-colors">
                      {source.title}
                    </div>
                    <div className="text-[10px] text-zinc-600 truncate group-hover:text-zinc-500">
                      {new URL(source.uri).hostname.replace('www.', '')}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
