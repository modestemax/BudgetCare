import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 5001;
const LATENCY_MS = Number(process.env.MOCK_LATENCY_MS ?? 300);

const DEMO_EMAIL = (process.env.DEMO_EMAIL ?? "finance@solidcam.org").toLowerCase();
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "BudgetCare!23";

const DEMO_USER = {
  id: "ngo-admin-1",
  name: process.env.DEMO_NAME ?? "Admin BudgetCare",
  email: DEMO_EMAIL,
};

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/auth/login", async (req, res) => {
  await delay(LATENCY_MS);

  const { email, password } = (req.body ?? {}) as {
    email?: string;
    password?: string;
  };

  const normalizedEmail = email?.toLowerCase();

  if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
    const token = Buffer.from(`${normalizedEmail}:${Date.now()}`).toString("base64");

    return res.json({
      token,
      user: DEMO_USER,
    });
  }

  return res.status(401).json({ message: "Identifiants invalides" });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});
