import { sendMail } from "../../services/sendMail.js";
import { containsHateSpeech } from "./checkHateSpeech.js";

/**
 * Run hate speech detection asynchronously after post creation.
 * @param {string} text - The text to check
 * @param {string} userEmail - The user's email to notify if found
 * @param {string} userName - (optional) user's name
 * @param {string} postUrl - Direct link to the user's discussion (frontend URL)
 */
export const monitorHateSpeech = async (
  text,
  userEmail,
  userName = "User",
  postUrl = null
) => {
  try {
    // Run ML model in background
    console.log("monitor started");

    const isHateSpeech = await containsHateSpeech(text);
    console.log("hate speech result:", isHateSpeech);

    if (isHateSpeech && userEmail) {
      console.log(`🚨 Hate speech detected for ${userEmail}`);

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
              Our automated moderation system has detected language in your recent post that may be considered
              <strong>offensive, hateful, or inappropriate</strong> under our community guidelines.
            </p>

            <p>
              We kindly ask you to <strong>review your post once again</strong>. If possible, please edit or remove any content that might seem inappropriate.
              If other users report similar content multiple times, your account may be <strong>temporarily restricted</strong> from using certain services.
            </p>

            ${
              postUrl
                ? `
                  <p style="text-align: center; margin: 25px 0;">
                    <a href="${postUrl}" target="_blank" 
                      style="background-color: #6c63ff; color: white; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 500;">
                      🔗 View Your Post
                    </a>
                  </p>
                `
                : ""
            }

            <p>
              If you believe your post complies with our standards, you can safely <strong>ignore this message</strong>.
              No further action is required unless the issue persists.
            </p>

            <p style="margin-top: 25px;">
              Thank you for helping us maintain a positive and respectful community.
            </p>

            <p style="margin-top: 25px;">Warm regards,<br>
            <strong>Team MyStudyPartner</strong></p>
          </div>

          <hr style="border:none; border-top:1px solid #e0e0ff; margin-top:30px;"/>
          <p style="font-size: 13px; color: #777; text-align: center;">
            This is an automated notification — please do not reply directly to this email.
          </p>
        </div>
      `;
      console.log("Sending mail");

      await sendMail(userEmail, mailSubject, mailBody);
      console.log("Mail sent successfully");
    }
  } catch (err) {
    console.error("💥 Error in hate speech monitor:", err);
  }
};
