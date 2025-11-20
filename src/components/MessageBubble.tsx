import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full gap-4 mb-6",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                isUser ? "bg-indigo-500" : "bg-emerald-600"
            )}>
                {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
            </div>

            {/* Bubble */}
            <div className={cn(
                "flex flex-col max-w-[80%] min-w-[200px]",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border",
                    isUser
                        ? "bg-indigo-500/20 border-indigo-500/30 rounded-tr-none text-white"
                        : "bg-zinc-900/80 border-zinc-800 rounded-tl-none text-zinc-100"
                )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <Markdown
                            components={{
                                code(props) {
                                    const { children, className, node, ref, ...rest } = props
                                    const match = /language-(\w+)/.exec(className || '')
                                    return match ? (
                                        <SyntaxHighlighter
                                            {...rest}
                                            PreTag="div"
                                            children={String(children).replace(/\n$/, '')}
                                            language={match[1]}
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, borderRadius: '0.5rem', background: '#1e1e1e' }}
                                        />
                                    ) : (
                                        <code {...rest} className={className}>
                                            {children}
                                        </code>
                                    )
                                }
                            }}
                        >
                            {content}
                        </Markdown>
                    </div>
                </div>
                <span className="text-xs text-zinc-500 mt-2 px-1">
                    {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
            </div>
        </motion.div>
    );
}
