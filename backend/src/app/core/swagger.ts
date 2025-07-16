import fs from 'fs';
import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

// Helper function to dynamically load schemas from the generated files
const loadSchemas = () => {
  // Construct the absolute path to the schema file, assuming it's in the same directory.
  const schemaFilePath = path.join(__dirname, 'json-schema.json');

  try {
    // Read the file content directly.
    const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
    // Parse and return the JSON content.
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error(`Could not load schema from ${schemaFilePath}:`, error);
    // Return an empty object if the file can't be read or parsed.
    return {};
  }
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Retro API',
      version: '1.0.0',
      description: 'API documentation for the My Retro retrospective tool, providing endpoints for managing users, teams, and retrospective sessions.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: loadSchemas(),
    },
  },
  // This is the key part for vertical slice architecture.
  // It tells swagger-jsdoc to look for JSDoc comments in all
  // .routes.ts files within the slices directory.
  apis: ['./src/slices/**/*.routes.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
