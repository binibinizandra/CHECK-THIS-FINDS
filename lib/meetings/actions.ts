"use server";
import { revalidatePath } from "next/cache";
import { currentUserId } from "@/lib/auth/currentUser";
import { createMeeting } from "@/lib/meetings/store";
import type { Meeting } from "@/lib/meetings/store";
import { getLeadById, listLeads } from "@/lib/leads/store";
import { parseBookingRequest } from "@/lib/ai/booking";
import { logActivity } from "@/lib/activity/store";

function formatLabel(whenAt: Date): string {
  return whenAt.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function bookMeetingForLead(leadId: string, whenAtIso: string, title?: string): Promise<Meeting | null> {
  const userId = await currentUserId();
  if (!userId) return null;
  const lead = await getLeadById(userId, leadId);
  if (!lead) return null;
  const whenAt = new Date(whenAtIso);
  if (Number.isNaN(whenAt.getTime())) return null;

  const meetingTitle = title?.trim() || `Call with ${lead.company || lead.name}`;
  const whenLabel = formatLabel(whenAt);
  const created = await createMeeting(userId, {
    agentId: lead.agentId ?? "scheduler",
    leadId: lead.id,
    title: meetingTitle,
    whenAt,
    whenLabel,
  });
  if (created) {
    await logActivity(userId, {
      agentId: lead.agentId ?? "scheduler",
      type: "meeting_booked",
      leadId: lead.id,
      text: `booked a call with ${lead.company || lead.name} for ${whenLabel}`,
    });
  }
  revalidatePath("/calendar");
  revalidatePath(`/deals/${leadId}`);
  return created;
}

export interface QuickBookResult {
  ok: boolean;
  meeting?: Meeting;
  message: string;
}

export async function quickBookMeeting(text: string): Promise<QuickBookResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, message: "Please sign in." };
  if (!text.trim()) return { ok: false, message: "Type what you'd like to book first." };

  const leadsList = await listLeads(userId);
  if (leadsList.length === 0) {
    return { ok: false, message: "Add a brand in Deals first, then you can book a call with them." };
  }

  const parsed = await parseBookingRequest(
    text,
    leadsList.map((l) => l.company || l.name),
    new Date()
  );
  if (!parsed) {
    return {
      ok: false,
      message: "I can't understand plain English right now — open the brand's page and use the date/time fields instead.",
    };
  }
  if (!parsed.confident || !parsed.whenAt) {
    return {
      ok: false,
      message: 'Couldn\'t quite catch the brand and time — try including both, like "book a call with Acme next Tuesday at 2pm."',
    };
  }

  const matchedLead = parsed.matchedBrand
    ? leadsList.find((l) => {
        const label = (l.company || l.name).toLowerCase();
        const target = parsed.matchedBrand!.toLowerCase();
        return label === target || label.includes(target) || target.includes(label);
      })
    : null;
  if (!matchedLead) {
    return { ok: false, message: "Couldn't tell which brand you meant — try naming it exactly as it appears in Deals." };
  }

  const whenAt = new Date(parsed.whenAt);
  if (Number.isNaN(whenAt.getTime())) {
    return { ok: false, message: "Couldn't quite catch the time — try again with a specific day and time." };
  }

  const title = `Call with ${matchedLead.company || matchedLead.name}`;
  const whenLabel = parsed.whenLabel || formatLabel(whenAt);
  const created = await createMeeting(userId, {
    agentId: matchedLead.agentId ?? "scheduler",
    leadId: matchedLead.id,
    title,
    whenAt,
    whenLabel,
  });
  if (!created) {
    return { ok: false, message: "Something went wrong saving that — try again." };
  }

  await logActivity(userId, {
    agentId: matchedLead.agentId ?? "scheduler",
    type: "meeting_booked",
    leadId: matchedLead.id,
    text: `booked a call with ${matchedLead.company || matchedLead.name} for ${whenLabel}`,
  });

  revalidatePath("/calendar");
  return { ok: true, meeting: created, message: `Booked — ${title} on ${whenLabel}.` };
}
