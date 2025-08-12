import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import axios from "axios";

const name = process.env.MCP_NAME || "MCP Service";
const description =
  process.env.MCP_DESCRIPTION || "MCP Server providing model context.";
const tags = (process.env.MCP_TAGS || "MCP").split(",");
const email = process.env.MCP_CONTACT_EMAIL || "hi@ph7.me";
const website = process.env.MCP_CONTACT_WEBSITE || "https://ph7.me";
const version = process.env.APP_VERSION || "0.1.0";

export async function registerContextRoutes(server: FastifyInstance) {
  await server.register(cors, { origin: true });

  // Logging middleware
  server.addHook("onRequest", async (request) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  });
  server.addHook("onError", async (request, reply, error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${error.message}`);
  });

  // MCP Discovery Endpoint
  server.get("/.well-known/model-context", async () => {
    return {
      "@context": "/.well-known/v1.json", // Local context reference
      name: name,
      description: description,
      version: version,
      tags, // ES6 shorthand property name
      contact: {
        email: email,
        website: website,
      },
      content_endpoint: "/v1/content",
    };
  });

  // Available Models Content
  server.get("/v1/content", async () => {
    return [
      {
        title: "Customer Churn Prediction",
        content:
          "Predictive model using logistic regression and XGBoost to identify potential customer churn.",
        tags: ["ML", "churn", "classification", "xgboost"],
      },
      {
        title: "Exploratory Data Analysis Report",
        content:
          "Notebook-driven visualisation and summary statistics to uncover key trends and anomalies.",
        tags: ["EDA", "data analysis", "notebooks"],
      },
      {
        title: "Statistical Hypothesis Testing",
        content:
          "Support for t-tests, chi-square, ANOVA, and p-value interpretation for decision making.",
        tags: ["statistics", "hypothesis testing", "inference"],
      },
      {
        title: "Time Series Forecasting",
        content:
          "Models using ARIMA and Prophet to forecast trends in business KPIs.",
        tags: ["forecasting", "time series", "prophet"],
      },
    ];
  });

  // Model Metadata Endpoint
  server.get("/v1/model/:modelId", async (request) => {
    const { modelId } = request.params as { modelId: string };
    if (modelId === "churn") {
      return {
        id: "churn",
        title: "Customer Churn Prediction",
        input: { type: "json", example: { customerId: "123", features: [/* ... */] } },
        output: { type: "json", example: { churnProbability: 0.87 } },
        usage: "POST /v1/predict/churn",
      };
    }
    if (modelId === "eda") {
      return {
        id: "eda",
        title: "Exploratory Data Analysis Report",
        input: { type: "csv", example: "data.csv" },
        output: { type: "json", example: { summary: "..." } },
        usage: "GET /v1/content/eda",
      };
    }
    // ...other models...
    return { error: "Model not found" };
  });

  // Strava Activities Integration Endpoint
  server.post("/v1/strava/activities", async (request, reply) => {
    const { accessToken, endpoint = "https://www.strava.com/api/v3/athlete/activities", page = 1, per_page = 30 } = request.body as any;
    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { page, per_page }
      });
      return response.data;
    } catch (error: any) {
      console.error(`[${new Date().toISOString()}] Strava API ERROR:`, error.message);
      reply.code(500).send({ error: error.message });
    }
  });
}
