export const PORTAL_URL = "https://bhsss-exam-bridge.lovable.app/";
export const GRADE12_PORTAL_URL = `${PORTAL_URL}?tab=exambot`;

export const PORTAL_BUTTONS = {
  inline_keyboard: [
    [{ text: "Open verification portal", web_app: { url: PORTAL_URL } }],
    [{ text: "Grade 12: Exam portal", web_app: { url: GRADE12_PORTAL_URL } }],
  ],
};