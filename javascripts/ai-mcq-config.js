// AI MCQ report endpoint configuration.
// Loaded before ai-mcq-quiz.js.
// The final dot makes the workers.dev host a fully-qualified domain name,
// which avoids some ISP/router DNS suffix rewrites such as .ziggo.nl.
window.AIMCQ_CONFIG = Object.assign(window.AIMCQ_CONFIG || {}, {
  reportEndpoint: "https://aiq-report.eor-wiki.workers.dev.",
  reportAdminEndpoint: "https://aiq-report.eor-wiki.workers.dev.",
  reportAdminParam: "aiq_report_admin",
  reportAdminTokenKey: "ai_mqc_report_admin_token_v1"
});
