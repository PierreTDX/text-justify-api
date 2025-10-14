import request from 'supertest';
import express from 'express';
import { Token } from '../src/models/Token';
import tokenRouter from '../src/routes/token';

const app = express();
app.use(express.json());
app.use('/api/token', tokenRouter);

describe('Token Routes', () => {
    describe('POST /api/token', () => {
        it('devrait créer un nouveau token pour un email valide', async () => {
            const email = 'test@example.com';
            const response = await request(app)
                .post('/api/token')
                .send({ email });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(typeof response.body.token).toBe('string');
            expect(response.body.token.length).toBe(64); // 32 bytes en hex = 64 chars
        });

        it('devrait retourner le token existant si valide', async () => {
            const email = 'existing@example.com';

            // Créer un premier token
            const response1 = await request(app)
                .post('/api/token')
                .send({ email });

            const firstToken = response1.body.token;

            // Créer un deuxième token avec le même email
            const response2 = await request(app)
                .post('/api/token')
                .send({ email });

            const secondToken = response2.body.token;

            // Les deux tokens doivent être identiques
            expect(firstToken).toBe(secondToken);
        });

        it('devrait retourner 400 pour un email manquant', async () => {
            const response = await request(app)
                .post('/api/token')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Email invalide ou manquant');
        });

        it('devrait retourner 400 pour un email invalide', async () => {
            const response = await request(app)
                .post('/api/token')
                .send({ email: 'invalid-email' });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain("Format d'email invalide");
        });

        it('devrait retourner 400 pour un email non-string', async () => {
            const response = await request(app)
                .post('/api/token')
                .send({ email: 12345 });

            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Email invalide ou manquant');
        });

        it('devrait valider différents formats d\'email', async () => {
            const validEmails = [
                'user@domain.com',
                'test.name@example.co.uk',
                'user+tag@domain.org',
            ];

            for (const email of validEmails) {
                const response = await request(app)
                    .post('/api/token')
                    .send({ email });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('token');
            }
        });

        it('devrait rejeter les emails avec caractères invalides', async () => {
            const invalidEmails = [
                'user @domain.com',
                'user@domain',
                '@domain.com',
                'user@.com',
            ];

            for (const email of invalidEmails) {
                const response = await request(app)
                    .post('/api/token')
                    .send({ email });

                expect(response.status).toBe(400);
            }
        });

        it('devrait stocker le token en base de données', async () => {
            const email = 'db-test@example.com';
            const response = await request(app)
                .post('/api/token')
                .send({ email });

            const token = response.body.token;
            const tokenDoc = await Token.findOne({ token });

            expect(tokenDoc).toBeTruthy();
            expect(tokenDoc?.email).toBe(email);
            expect(tokenDoc?.expiresAt).toBeDefined();
        });

        it('devrait définir l\'expiration à 24h', async () => {
            const email = 'expiry@example.com';
            const beforeRequest = new Date();

            const response = await request(app)
                .post('/api/token')
                .send({ email });

            const afterRequest = new Date();
            const tokenDoc = await Token.findOne({ token: response.body.token });

            const expectedMin = new Date(beforeRequest.getTime() + 24 * 60 * 60 * 1000);
            const expectedMax = new Date(afterRequest.getTime() + 24 * 60 * 60 * 1000);

            expect(tokenDoc?.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
            expect(tokenDoc?.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
        });
    });
});