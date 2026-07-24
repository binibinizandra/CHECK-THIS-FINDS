"use client";
import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "@/lib/chat/actions";
import type { ChatMessage } from "@/lib/chat/store";
import type { AgentSummary } from "@/lib/agents/types";

const YELLOW = "#FFC700";
const NAVY = "#0A192F";

const TIP_PROMPTS = [
  "@Research find me skincare brands",
  "@Otis pitch Acme Outdoor",
  "@Sam book a call with Acme next Tuesday at 2pm",
];

export default function ChatPageClient({
  initialMessages,
  agents,
}: {
  initialMessages: ChatMessage[];
  agents: AgentSummary[];
}) {
  const [messageList, setMessageList] = useState(initialMessages);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList.length]);

  async function handleSend() {
    if (!text.trim() || pending) return;
    setPending(true);
    const toSend = text;
    setText("");
    const result = await sendChatMessage(toSend);
    if (result.length > 0) setMessageList((prev) => [...prev, ...result]);
    setPending(false);
  }

  function agentFor(id: string | null) {
    return id ? agents.find((a) => a.id === id) ?? null : null;
  }

  function insertMention(name: string) {
    const first = name.split(" ")[0];
    setText(`@${first} `);
    inputRef.current?.focus();
  }

  function useTip(prompt: string) {
    setText(prompt);
    inputRef.current?.focus();
  }

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 26px 24px", display: "flex", gap: 22, height: "calc(100dvh - 64px)" }}>
      {/* Left panel */}
      <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: YELLOW,
            borderRadius: 16,
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: NAVY,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 13,
              color: YELLOW,
              flexShrink: 0,
            }}
          >
            {agents.length}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: NAVY }}>Your AI team</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11.5, color: NAVY, opacity: 0.7 }}>Ready to help</div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            background: "#fff",
            border: "1px solid var(--color-border)",
            borderRadius: 18,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: NAVY, marginBottom: 12 }}>
            Your team
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            {agents.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => insertMention(a.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 8px",
                  borderRadius: 12,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  font: "inherit",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: a.color,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: 12,
                    flexShrink: 0,
                  }}
                >
                  {a.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      color: NAVY,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.name}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--color-muted)" }}>{a.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: NAVY, borderRadius: 16, padding: 16 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12.5, color: YELLOW, marginBottom: 8 }}>
            Try asking
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {TIP_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => useTip(p)}
                style={{
                  textAlign: "left",
                  background: "rgba(255,255,255,.08)",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 9px",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Right panel — conversation */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          border: "1px solid var(--color-border)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: NAVY }}>Team chat</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>
            @mention a helper and ask for what you need — they&apos;ll actually do it and reply right here.
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, padding: "20px 22px" }}>
          {messageList.length === 0 && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--color-muted)" }}>
              Try something like <em>&quot;@Research find me skincare brands&quot;</em>, or click a helper on the left.
            </div>
          )}
          {messageList.map((m) => {
            const agent = agentFor(m.agentId);
            const isMe = m.who === "me";
            return (
              <div key={m.id} style={{ display: "flex", gap: 10, flexDirection: isMe ? "row-reverse" : "row" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: isMe ? NAVY : "#fff",
                    background: isMe ? YELLOW : agent?.color ?? "var(--color-muted)",
                  }}
                >
                  {isMe ? "Me" : agent?.initials ?? "AI"}
                </div>
                <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 3 }}>
                  {!isMe && (
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: agent?.color ?? "var(--color-muted)",
                      }}
                    >
                      {agent?.name ?? "Team"}
                    </span>
                  )}
                  <div
                    style={{
                      background: isMe ? YELLOW : "var(--color-bg-alt)",
                      color: NAVY,
                      borderRadius: "var(--radius-inputs)",
                      padding: "10px 14px",
                      fontFamily: "var(--font-body)",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--color-border)", padding: 16 }}>
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type something…"
            style={{
              flex: 1,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: NAVY,
              background: "var(--color-bg-alt)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-buttons)",
              padding: "10px 16px",
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={pending || !text.trim()}
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 14,
              color: NAVY,
              background: YELLOW,
              border: "none",
              borderRadius: "var(--radius-buttons)",
              padding: "0 22px",
              cursor: "pointer",
              opacity: pending || !text.trim() ? 0.5 : 1,
            }}
          >
            {pending ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
