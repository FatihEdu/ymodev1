import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express Jobs ile Asal Sayı Testleri API',
            version: '1.0.0',
            description: 'Bu API, Express Jobs kullanarak asal sayı testleri yapmanızı sağlar.',
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;