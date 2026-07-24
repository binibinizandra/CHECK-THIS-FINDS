"use client";
import { useState } from "react";
import { bookMeetingForLead } from "@/lib/meetings/actions";
import * as f from "@/components/profile/formStyles";

export default function BookCallForm({ leadId }: { leadId: string }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!date || !time) return;
    setPending(true);
    setMessage(null);
    const whenAt = new Date(`${date}T${time}`);
    if (Number.isNaN(whenAt.getTime())) {
      setMessage("That date and time don't look right — try again.");
      setPending(false);
      return;
    }
    const created = await bookMeetingForLead(leadId, whenAt.toISOString());
    if (created) {
      setMessage(`Booked for ${created.whenLabel}.`);
      setDate("");
      setTime("");
    } else {
      setMessage("Something went wrong booking that — try again.");
    }
    setPending(false);
  }

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-cards)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 160px" }}>
          <label style={f.label}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={f.input} />
        </div>
        <div style={{ flex: "1 1 120px" }}>
          <label style={f.label}>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} style={f.input} />
        </div>
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending || !date || !time}
        style={{ ...f.secondaryButton, alignSelf: "flex-start", opacity: pending || !date || !time ? 0.5 : 1 }}
      >
        {pending ? "Booking…" : "Book a call"}
      </button>
      {message && (
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--color-muted)" }}>{message}</div>
      )}
    </div>
  );
}
