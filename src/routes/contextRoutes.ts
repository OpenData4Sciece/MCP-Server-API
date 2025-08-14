import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import axios from "axios";

const mcpMetadata = {
  name: process.env.MCP_NAME || "MCP Service",
  description: process.env.MCP_DESCRIPTION || "MCP Server providing model context.",
  tags: (process.env.MCP_TAGS || "MCP").split(","),
  contact: {
    email: process.env.MCP_CONTACT_EMAIL || "hi@ph7.me",
    website: process.env.MCP_CONTACT_WEBSITE || "https://ph7.me",
  },
  version: process.env.APP_VERSION || "0.1.0",
};

export async function registerContextRoutes(server: FastifyInstance) {
  await server.register(cors, { origin: true });

  // Logging middleware
  server.addHook("onRequest", async (request) => {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  });
  server.addHook("onError", async (request, reply, error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${error.message}`);
  });

  /**
   * MCP Discovery Endpoint
   * Returns metadata about the MCP server including name, description, version, tags, contact, and content endpoint.
   * The @context points to the public .well-known/v1.json JSON-LD context served by this server.
   */
  server.get("/.well-known/model-context", async () => {
    return {
      "@context": "/.well-known/v1.json", // Public JSON-LD context reference served by this server
      name: mcpMetadata.name,
      description: mcpMetadata.description,
      version: mcpMetadata.version,
      tags: mcpMetadata.tags,
      contact: mcpMetadata.contact,
      content_endpoint: "/v1/content",
    };
  });

  /**
   * JSON-LD Context Endpoint
   * Serves the JSON-LD context document defining terms used in the MCP metadata,
   * mapping them to schema.org and other vocabularies.
   */
  server.get("/.well-known/v1.json", async () => {
    return {
      "@context": {
        name: "https://schema.org/name",
        description: "https://schema.org/description",
        version: "https://schema.org/version",
        content_endpoint: "https://schema.org/url",
        metadata: "https://schema.org/CreativeWork",
      },
    };
  });

  /**
   * Available Models Content Endpoint
   * Returns a list of available model contents with titles, descriptions, and tags.
   */
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

  /**
   * Model Metadata Endpoint
   * Returns metadata for a specific model identified by modelId.
   */
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

  /**
   * Strava Activities Integration Endpoint
   * Fetches Strava athlete activities using provided access token and optional pagination parameters.
   */
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
