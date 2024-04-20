export const cfg = {
  API: {
    HOST:
      process.env.NODE_ENV === "production"
        ? "https://ver..."
        : "http://localhost:3000",
  },
};
