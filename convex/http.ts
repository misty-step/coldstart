import { httpAction, httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

type ClerkUserPayload = {
  id: string;
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserPayload;
};

const getPrimaryEmail = (data: ClerkUserPayload): string | null => {
  const emails = data.email_addresses ?? [];
  if (data.primary_email_address_id) {
    const primary = emails.find(
      (email) => email.id === data.primary_email_address_id
    );
    if (primary) {
      return primary.email_address;
    }
  }
  return emails[0]?.email_address ?? null;
};

const getFullName = (data: ClerkUserPayload): string | undefined => {
  const parts = [data.first_name, data.last_name]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part));
  return parts.length > 0 ? parts.join(" ") : undefined;
};

/**
 * HTTP actions for external webhooks
 */
const http = httpRouter();

export const clerkWebhook = httpAction(async (ctx, request) => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 500 });
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await request.text();
  let event: ClerkWebhookEvent;
  try {
    const webhook = new Webhook(secret);
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (error) {
    console.error("Clerk webhook signature verification failed", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created": {
        const email = getPrimaryEmail(event.data);
        if (!email) {
          console.error("Missing Clerk user email", event.data.id);
          return new Response("Missing email", { status: 500 });
        }

        await ctx.runMutation(internal.functions.users.createInternal, {
          clerkId: event.data.id,
          email,
          name: getFullName(event.data),
          imageUrl: event.data.image_url ?? undefined,
        });
        break;
      }
      case "user.updated": {
        const update: { clerkId: string; name?: string; imageUrl?: string } = {
          clerkId: event.data.id,
        };
        const name = getFullName(event.data);
        if (name !== undefined) {
          update.name = name;
        }
        if (event.data.image_url !== undefined && event.data.image_url !== null) {
          update.imageUrl = event.data.image_url;
        }

        await ctx.runMutation(internal.functions.users.updateInternal, update);
        break;
      }
      case "user.deleted": {
        await ctx.runMutation(internal.functions.users.removeInternal, {
          clerkId: event.data.id,
        });
        break;
      }
      default:
        break;
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Clerk webhook handler failed", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
});

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: clerkWebhook,
});

export default http;
