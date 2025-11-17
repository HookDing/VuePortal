export const openApiSpec = {
  openapi: '3.0.1',
  info: {
    title: 'Vue Portal API',
    version: '1.0.0',
    description:
      '用于 Vue 多端门户 Demo 的身份认证与用户管理接口。默认测试账号：demo@vue.dev / 123456。',
  },
  servers: [{ url: 'http://localhost:4000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string', enum: ['admin', 'member'] },
              createdAt: { type: 'string' },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'member'] },
          createdAt: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        summary: '注册账号（如已存在则直接返回 token）',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: '成功注册/登录', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: '登录',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: '登录成功', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: '获取当前用户信息',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: '当前用户', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
    },
    '/api/users': {
      get: {
        summary: '管理员：列出所有用户',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: '用户数组',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } } },
          },
        },
      },
    },
    '/api/users/me': {
      patch: {
        summary: '更新个人资料',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string' } } },
            },
          },
        },
        responses: {
          200: { description: '更新后的用户', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
    },
    '/api/users/me/password': {
      patch: {
        summary: '修改个人密码',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  currentPassword: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: '成功' } },
      },
    },
    '/api/users/{id}': {
      patch: {
        summary: '管理员：更新用户信息',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['admin', 'member'] },
                },
              },
            },
          },
        },
        responses: { 200: { description: '更新后的用户', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } } },
      },
    },
    '/api/users/{id}/password': {
      patch: {
        summary: '管理员：重置密码',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { newPassword: { type: 'string' } } } } },
        },
        responses: { 200: { description: '成功' } },
      },
    },
  },
};

