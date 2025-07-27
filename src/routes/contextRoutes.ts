import { FastifyInstance } from 'fastify';

const name = process.env.MCP_NAME || "MCP Service";
const description = process.env.MCP_DESCRIPTION || "MCP Server providing model context.";
const tags = (process.env.MCP_TAGS || "MCP").split(',');
const email = process.env.MCP_CONTACT_EMAIL || "hi@ph7.me";
const website = process.env.MCP_CONTACT_WEBSITE || "https://ph7.me";
const version = process.env.APP_VERSION || '0.1.0';

export async function registerContextRoutes(server: FastifyInstance) {
  // MCP Discovery Endpoint
  server.get('/.well-known/model-context', async () => {
    return {
      "@context": "/.well-known/v1.json", // Local context reference
      "name": name,
      "description": description,
      "version": version,
      "tags": tags,
      "contact": {
        "email": email,
        "website": website
      },
      "content_endpoint": "/v1/content"
    };
  });

  // Available Models Content
  server.get('/v1/content', async () => {
    return [
      {
        title: "Customer Churn Prediction",
        content: "Predictive model using logistic regression and XGBoost to identify potential customer churn.",
        tags: ["ML", "churn", "classification", "xgboost"]
      },
      {
        title: "Exploratory Data Analysis Report",
        content: "Notebook-driven visualisation and summary statistics to uncover key trends and anomalies.",
        tags: ["EDA", "data analysis", "notebooks"]
      },
      {
        title: "Statistical Hypothesis Testing",
        content: "Support for t-tests, chi-square, ANOVA, and p-value interpretation for decision making.",
        tags: ["statistics", "hypothesis testing", "inference"]
      },
      {
        title: "Time Series Forecasting",
        content: "Models using ARIMA and Prophet to forecast trends in business KPIs.",
        tags: ["forecasting", "time series", "prophet"]
      }
    ];
  });
}
