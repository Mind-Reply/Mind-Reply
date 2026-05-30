"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, newMessage] })
    });

    const reader = res.body.getReader();
    let aiText = "";
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        aiText += new TextDecoder().decode(value);
        setMessages((prev) => [
          ...prev.filter((m) => m.role !== "assistant-temp"),
          { role: "assistant-temp", content: aiText }
        ]);
      }
    }

    setMessages((prev) => [
      ...prev.filter((m) => m.role !== "assistant-temp"),
      { role: "assistant", content: aiText }
    ]);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e2e8f0 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backdropFilter: "blur(20px)",
          background: "rgba(255, 255, 255, 0.55)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255,255,255,0.3)",
          padding: "30px"
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "600",
            marginBottom: "20px",
            textAlign: "center",
            background: "linear-gradient(90deg, #000, #555)",
            WebkitBackgroundClip: "text",
            color: "transparent"
          }}
        >
          MindReply
        </h1>

        <div
          style={{
            height: "450px",
            overflowY: "auto",
            padding: "20px",
            borderRadius: "16px",
            background: "rgba(255, 255, 255, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            marginBottom: "20px",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)"
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                marginBottom: "16px",
                padding: "14px 18px",
                borderRadius: "14px",
                maxWidth: "80%",
                backdropFilter: "blur(12px)",
                background:
                  m.role === "user"
                    ? "rgba(0, 122, 255, 0.15)"
                    : "rgba(255, 255, 255, 0.5)",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                border:
                  m.role === "user"
                    ? "1px solid rgba(0,122,255,0.25)"
                    : "1px solid rgba(255,255,255,0.4)"
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "13px",
                  opacity: 0.6
                }}
              >
                {m.role === "user" ? "You" : "MindReply"}
              </strong>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <input
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: "14px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              fontSize: "16px"
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask MindReply…"
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "14px 24px",
              borderRadius: "14px",
              background: "black",
              color: "white",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              transition: "0.2s"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}

