// If using Deno, ensure your environment supports remote imports and Deno types are installed.
// If using Node.js, replace with a compatible HTTP server, e.g.:
const { createServer } = require("http");

// For Deno, uncomment the following line and ensure Deno is used to run this file:
// import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentRequest {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  service: string;
  message?: string;
}

const serviceNames: Record<string, string> = {
  "gel-manicure": "Gel Manicure",
  "nail-art": "Nail Art & Design",
  "acrylic": "Acrylic Extensions",
  "spa-pedicure": "Spa Pedicure",
  "bridal": "Bridal Package",
  "vip": "VIP Treatment",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // For Supabase Edge Functions, use Deno.env.get
    const resendApiKey = (globalThis as any).Deno?.env?.get("RESEND_API_KEY");
    const ownerEmail = (globalThis as any).Deno?.env?.get("OWNER_EMAIL") || "hello@nirvananails.com";

    if (!resendApiKey) {
      throw new Error("Email service is not configured");
    }

    const { name, email, phone, date, time, service, message }: AppointmentRequest = await req.json();
    const serviceName = serviceNames[service] || service;

    // Send to owner
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Nirvana Nails <onboarding@resend.dev>",
        to: [ownerEmail],
        subject: `✨ New Appointment: ${name}`,
        html: `<h2>New Appointment Request</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>${phone ? `<p><b>Phone:</b> ${phone}</p>` : ""}<p><b>Service:</b> ${serviceName}</p><p><b>Date:</b> ${date}</p><p><b>Time:</b> ${time}</p>${message ? `<p><b>Notes:</b> ${message}</p>` : ""}`,
      }),
    });

    // Send confirmation to client
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Nirvana Nails <onboarding@resend.dev>",
        to: [email],
        subject: "✨ Appointment Request Received - Nirvana Nails",
        html: `<h2>Thank you, ${name}!</h2><p>We received your appointment request for <b>${serviceName}</b> on <b>${date}</b> at <b>${time}</b>.</p><p>We'll confirm within 24 hours.</p><p>- Nirvana Nails Team 💅</p>`,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to send" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

function serve(handler: (req: Request) => Promise<Response>) {
    // For Deno Deploy/Supabase Edge Functions, use globalThis.fetch event
    if (typeof globalThis.addEventListener === "function") {
        globalThis.addEventListener("fetch", (event: any) => {
            event.respondWith(handler(event.request));
        });
    } else {
        // For Node.js (local testing), use HTTP server
        createServer((req: any, res: any) => {
            let body = "";
            req.on("data", (chunk: any) => (body += chunk));
            req.on("end", async () => {
                const request = new Request(`http://${req.headers.host}${req.url}`, {
                    method: req.method,
                    headers: req.headers,
                    body: body || undefined,
                });
                const response = await handler(request);
                res.writeHead(response.status, Object.fromEntries(response.headers));
                const respBody = await response.text();
                res.end(respBody);
            });
        }).listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    }
}

