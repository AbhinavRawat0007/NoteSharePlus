// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await resend.emails.send({
      from: "NoteShare+ <onboarding@resend.dev>", // ✅ use a verified sender domain
      to: email,
      subject: "🎉 Welcome to NoteShare+ — Let’s Boost Your Productivity!",
      html: `
        <div style="font-family:Arial, sans-serif; line-height:1.6; color:#333;">
          <h2>Hi ${name || "there"}, 👋</h2>
          <p>Welcome to <strong>NoteShare+</strong>! 🎊<br/>
          We’re excited to have you join our growing community of students, creators, and teams who believe in smarter note-taking and collaboration.</p>

          <h3>Here’s what you can look forward to:</h3>
          <ul>
            <li>✅ <strong>Secure login</strong> — your notes are always safe.</li>
            <li>✅ <strong>Organized notes</strong> — with tags, search, and categories.</li>
            <li>✅ <strong>Real-time collaboration</strong> — work together just like Google Docs.</li>
            <li>✅ <strong>Cross-platform sync</strong> — your notes, anywhere and anytime.</li>
            <li>✅ <strong>Regular updates</strong> — new features and improvements added often.</li>
          </ul>

          <p>💡 <strong>Pro Tip:</strong> Bookmark your dashboard so you can access your notes quickly.</p>

          <p>Thank you for subscribing — you’ll now receive updates, tips, and early access to new features. 🚀</p>

          <p>If you have any feedback or feature requests, hit reply — we’d love to hear from you.</p>

          <p>Cheers,<br/>The NoteShare+ Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
