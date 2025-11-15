import { sendMail } from "../../services/sendMail.js";
import { containsHateSpeech } from "./checkHateSpeech.js";

/**
 * Safe hate speech monitoring logic for local ML model.
 */
export const monitorHateSpeech = async (
  text,
  userEmail,
  userName = "User",
  postUrl = null
) => {
  try {
    console.log("🛡️ Hate speech monitor started...");

    const result = await containsHateSpeech(text);
    console.log("🔍 Hate speech result:", result);

    // -----------------------------------------------------
    // 1️. Skip if ML itself failed
    // -----------------------------------------------------
    if (result.reason.includes("ML_ERROR")) {
      console.log("⚠️ ML model error — skipping moderation.");
      return;
    }

    // -----------------------------------------------------
    // 2️. Skip if message is clean
    // -----------------------------------------------------
    if (result.detected !== true) {
      console.log("🟢 Message is clean. No action taken.");
      return;
    }

    // -----------------------------------------------------
    // 3️. Toxic content detected → send moderation email
    // -----------------------------------------------------
    const toxicityReason = result.reason[0] || "TOXIC";

    console.log(`🚨 Hate speech detected (${toxicityReason}) for ${userEmail}`);

    const mailSubject =
      "⚠️ Review Required: Inappropriate Language Detected in Your Post";

    const mailBody = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9ff; padding: 25px; border-radius: 8px; border: 1px solid #e0e0ff; max-width: 600px; margin: auto;">
        <div style="background-color: #6c63ff; color: white; padding: 12px 18px; border-radius: 6px 6px 0 0; font-size: 18px; font-weight: 600;">
          MyStudyPartner Moderation Notice
        </div>

        <div style="background-color: #ffffff; padding: 20px; border-radius: 0 0 6px 6px;">
          <p>Dear <strong>${userName}</strong>,</p>

          <p>
            Our automated moderation system detected language in your recent post
            that has been flagged as:
            <br><br>
            <strong style="color:#d32f2f; font-size: 16px;">${toxicityReason}</strong>
          </p>

          <p>
            This means the message may be considered offensive, harmful, or disrespectful.
            We kindly ask you to review your post and make necessary edits.
          </p>

          ${
            postUrl
              ? `
                <p style="text-align: center; margin: 25px 0;">
                  <a href="${postUrl}" target="_blank" 
                    style="background-color: #6c63ff; color: white; text-decoration: none; 
                    padding: 10px 22px; border-radius: 6px; font-weight: 500;">
                    🔗 View Your Post
                  </a>
                </p>
              `
              : ""
          }

          <p>
            If you believe this is a mistake, you may ignore this message. No further
            action is required unless issues persist.
          </p>

          <p style="margin-top: 25px;">Thank you for helping maintain a positive community.</p>
          <p style="margin-top: 25px;"><strong>Team MyStudyPartner</strong></p>
        </div>

        <hr style="border:none; border-top:1px solid #e0e0ff; margin-top:30px;"/>
        <p style="font-size: 13px; color: #777; text-align: center;">
          This is an automated notification — please do not reply directly.
        </p>
      </div>
    `;

    console.log("📨 Sending moderation email...");

    await sendMail(userEmail, mailSubject, mailBody);

    console.log("✅ Moderation email sent successfully.");
  } catch (err) {
    console.error("💥 Error in hate speech monitor:", err);
  }
};
