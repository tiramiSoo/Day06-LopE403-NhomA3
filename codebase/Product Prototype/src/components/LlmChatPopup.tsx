import { useMemo, useState } from "react";
import { Bot, Loader2, MessageCircle, Send } from "lucide-react";

import { sendChatMessage } from "@/lib/api/chat.functions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function LlmChatPopup() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Chào bạn, mình có thể gợi ý món ăn hoặc nhà hàng theo khẩu vị, ngân sách và địa điểm.",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  async function handleSend() {
    const content = input.trim();
    if (!content || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsSending(true);

    try {
      const result = await sendChatMessage({
        data: {
          messages: nextMessages.slice(-12),
        },
      });
      setMessages([...nextMessages, { role: "assistant", content: result.message }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat request failed.");
      setMessages(nextMessages);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Open AI chat"
          className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full p-0 shadow-2xl shadow-primary/25"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bottom-20 left-auto right-5 top-auto flex h-[min(680px,calc(100vh-7rem))] w-[min(420px,calc(100vw-2rem))] translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-lg p-0 sm:rounded-lg">
        <DialogHeader className="border-b border-border px-4 py-3">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Bot className="h-4 w-4 text-primary" />
            AI food assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 px-4 py-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isSending ? (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking
              </div>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="border-t border-border bg-destructive/10 px-4 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}

        <div className="border-t border-border bg-background p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Hỏi món nào hợp hôm nay..."
              className="min-h-11 flex-1 resize-none"
            />
            <Button aria-label="Send message" disabled={!canSend} onClick={() => void handleSend()} className="h-11 w-11 p-0">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
