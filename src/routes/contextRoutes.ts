import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import axios from 'axios';

export async function registerContextRoutes(server: FastifyInstance) {
  const mcpMetadata = {
    name: process.env.MCP_NAME || 'ML Metadata Service',
    description:
      process.env.MCP_DESCRIPTION || 'REST prototype exposing sample ML service metadata.',
    tags: [
      ...new Set(
        (process.env.MCP_TAGS || 'ML')
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      ),
    ],
    contact: {
      email: process.env.MCP_CONTACT_EMAIL || 'hi@ph7.me',
      website: process.env.MCP_CONTACT_WEBSITE || 'https://ph7.me',
    },
    version: process.env.APP_VERSION || '1.1.0',
  };

  await server.register(cors, { origin: true });

  /**
   * REST discovery metadata (not a Model Context Protocol transport).
   * Returns metadata about this service including name, description, version, tags, contact, and content endpoint.
   * The @context points to the public .well-known/v1.json JSON-LD context served by this server.
   */
  const discovery = async () => {
    return {
      '@context': '/.well-known/v1.json', // Public JSON-LD context reference served by this server
      name: mcpMetadata.name,
      description: mcpMetadata.description,
      version: mcpMetadata.version,
      tags: mcpMetadata.tags,
      contact: mcpMetadata.contact,
      content_endpoint: '/v1/content',
    };
  };
  server.get('/.well-known/model-context', discovery);
  server.get('/v1/discovery', discovery);

  /**
   * JSON-LD Context Endpoint
   * Serves the JSON-LD context document defining terms used in the MCP metadata,
   * mapping them to schema.org and other vocabularies.
   */
  server.get('/.well-known/v1.json', async () => {
    return {
      '@context': {
        name: 'https://schema.org/name',
        description: 'https://schema.org/description',
        version: 'https://schema.org/version',
        content_endpoint: 'https://schema.org/url',
        tags: 'https://schema.org/keywords',
        contact: {
          '@id': 'https://schema.org/contactPoint',
          '@context': {
            email: 'https://schema.org/email',
            website: { '@id': 'https://schema.org/url', '@type': '@id' },
          },
        },
      },
    };
  });

  /**
   * Available Models Content Endpoint
   * Returns a list of available model contents with titles, descriptions, and tags.
   */
  server.get('/v1/content', async () => {
    return [
      {
        title: 'Customer Churn Prediction',
        content:
          'Predictive model using logistic regression and XGBoost to identify potential customer churn.',
        tags: ['ML', 'churn', 'classification', 'xgboost'],
      },
      {
        title: 'Exploratory Data Analysis Report',
        content:
          'Notebook-driven visualisation and summary statistics to uncover key trends and anomalies.',
        tags: ['EDA', 'data analysis', 'notebooks'],
      },
      {
        title: 'Statistical Hypothesis Testing',
        content:
          'Support for t-tests, chi-square, ANOVA, and p-value interpretation for decision making.',
        tags: ['statistics', 'hypothesis testing', 'inference'],
      },
      {
        title: 'Time Series Forecasting',
        content: 'Models using ARIMA and Prophet to forecast trends in business KPIs.',
        tags: ['forecasting', 'time series', 'prophet'],
      },
    ];
  });

  /**
   * Model Metadata Endpoint
   * Returns metadata for a specific model identified by modelId.
   */
  server.get('/v1/model/:modelId', async (request, reply) => {
    const { modelId } = request.params as { modelId: string };
    if (modelId === 'churn') {
      return {
        id: 'churn',
        title: 'Customer Churn Prediction',
        input: {
          type: 'json',
          example: {
            customerId: '123',
            features: [
              /* ... */
            ],
          },
        },
        output: { type: 'json', example: { churnProbability: 0.87 } },
        example: true,
      };
    }
    if (modelId === 'eda') {
      return {
        id: 'eda',
        title: 'Exploratory Data Analysis Report',
        input: { type: 'csv', example: 'data.csv' },
        output: { type: 'json', example: { summary: '...' } },
        example: true,
      };
    }
    // ...other models...
    return reply.code(404).send({ error: 'Model not found' });
  });

  // Token-bearing requests can reach only Strava's documented activities endpoint.
  server.post<{ Body: { accessToken: string; page?: number; per_page?: number } }>(
    '/v1/strava/activities',
    {
      onRequest: async (_request, reply) => {
        reply.header('Cache-Control', 'no-store');
      },
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['accessToken'],
          properties: {
            accessToken: { type: 'string', minLength: 1, maxLength: 4096, pattern: '^\\S+$' },
            page: { type: 'integer', minimum: 1, maximum: 10000, default: 1 },
            per_page: { type: 'integer', minimum: 1, maximum: 200, default: 30 },
          },
        },
      },
    },
    async (request, reply) => {
      const { accessToken, page = 1, per_page = 30 } = request.body;
      try {
        const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { page, per_page },
          timeout: 10000,
          maxRedirects: 0,
          maxContentLength: 2 * 1024 * 1024,
        });
        return response.data;
      } catch (error: unknown) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        request.log.error({ status }, 'Strava request failed');
        return reply.code(502).send({ error: 'Unable to retrieve Strava activities' });
      }
    }
  );
}
