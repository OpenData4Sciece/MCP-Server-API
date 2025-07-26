import { FastifyInstance } from 'fastify';

// Context metadata structure for ML/Data Science services
export async function registerContextRoutes(server: FastifyInstance) {
  // Well-known endpoint for MCP discovery
  server.get('/.well-known/model-context', async () => {
    return {
      "@context": "https://modelcontext.org/contexts/v1.json",
      "name": "Data Science Services by Pierre",
      "description": "Freelance data scientist providing machine learning models, statistical analysis, and data-driven consulting.",
      "tags": ["data science", "machine learning", "statistics", "freelance", "MCP"],
      "contact": {
        "email": "contact@example.com",
        "website": "https://your-portfolio.com"
      }
    };
  });

  // Sample content endpoint listing available ML solutions
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
