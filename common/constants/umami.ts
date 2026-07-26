export const UMAMI_ACCOUNT = {
  username: "Muhamad Taufiq Riza",
  api_key: process.env.UMAMI_API_KEY,
  base_url: "https://api.umami.is/v1/websites",
  endpoint: {
    page_views: "/pageviews",
    sessions: "/sessions/stats",
  },
  parameters: {
    startAt: 1717174800000,
    endAt: 1767190799000,
    unit: "month",
    timezone: "Asia/Jakarta",
  },
  is_active: false,
  websites: [
    {
      domain: "taufiqriza.vercel.app",
      website_id: process.env.UMAMI_WEBSITE_ID_MYID,
      umami_url: "",
    },
  ],
};
