import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/.well-known/model-context', async (request, reply) => {
  return {
    "@context": "https://modelcontext.org/contexts/v1.json",
    "name": "Data Science Services by Pierre",
    "description": "Freelance data scientist offering ML models, analytics, statistical consulting, and AI integration.",
    "tags": ["data science", "machine learning", "statistics", "freelance"],
    "contact": {
      "email": "contact@example.com",
      "website": "https://your-portfolio.com"
    }
  };
});

fastify.get('/v1/content', async (request, reply) => {
  return [
    {
      "title": "Customer Churn Prediction",
      "content": "Predictive model for customer churn using logistic regression and XGBoost.",
      "tags": ["ML", "churn", "classification"]
    },
    {
      "title": "Exploratory Data Analysis Report",
      "content": "Jupyter notebook for visualising and summarising key data trends.",
      "tags": ["EDA", "data analysis", "notebooks"]
    },
    {
      "title": "Statistical Hypothesis Testing",
      "content": "Support for t-tests, chi-square, ANOVA, and p-value interpretation.",
      "tags": ["statistics", "hypothesis testing"]
    }
  ];
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('🚀 MCP server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
