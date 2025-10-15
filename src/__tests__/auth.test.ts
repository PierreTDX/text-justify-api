import { authMiddleware, addToken } from '../middlewares/auth';
import { Token } from '../models/Token';
import { Request, Response, NextFunction } from 'express';

describe('Auth Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let jsonResponse: any;

    beforeEach(() => {
        jsonResponse = null;

        mockReq = {
            headers: {},
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((data) => {
                jsonResponse = data;
                return mockRes;
            }),
        } as unknown as jest.Mocked<Response>;

        mockNext = jest.fn();
    });

    describe('authMiddleware', () => {
        it('devrait appeler next() si le token est valide', async () => {
            const email = 'test@example.com';
            const token = await addToken(email);

            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockNext).toHaveBeenCalled();
            expect((mockReq as any).email).toBe(email);
            expect((mockReq as any).token).toBe(token);
        });

        it('devrait retourner 401 si le token est manquant', async () => {
            mockReq.headers = {};

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(jsonResponse.error).toContain('Token manquant');
        });

        it('devrait retourner 401 si Authorization header n\'a pas le bon format', async () => {
            mockReq.headers = {
                authorization: 'InvalidFormat token123',
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(jsonResponse.error).toContain('Token manquant ou invalide');
        });

        it('devrait retourner 403 si le token n\'existe pas en base', async () => {
            mockReq.headers = {
                authorization: 'Bearer nonexistenttoken123',
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(jsonResponse.error).toContain('Token non reconnu');
        });

        it('devrait retourner 403 si le token est expiré', async () => {
            const email = 'expired@example.com';
            const expiredDate = new Date(Date.now() - 1000); // 1 sec ago

            const token = await Token.create({
                token: 'expiredtoken123',
                email,
                expiresAt: expiredDate,
            });

            mockReq.headers = {
                authorization: `Bearer ${token.token}`,
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(jsonResponse.error).toContain('Token expiré');
        });

        it('devrait supprimer le token expiré de la base', async () => {
            const email = 'cleanup@example.com';
            const expiredDate = new Date(Date.now() - 1000);

            const token = await Token.create({
                token: 'tokentodellete',
                email,
                expiresAt: expiredDate,
            });

            mockReq.headers = {
                authorization: `Bearer ${token.token}`,
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            const deletedToken = await Token.findOne({ token: token.token });
            expect(deletedToken).toBeNull();
        });

        it('devrait extraire le token du header Authorization', async () => {
            const email = 'extract@example.com';
            const token = await addToken(email);

            mockReq.headers = {
                authorization: `Bearer ${token}`,
            };

            await authMiddleware(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect((mockReq as any).token).toBe(token);
        });
    });

    describe('addToken', () => {
        it('devrait créer un nouveau token', async () => {
            const email = 'newtoken@example.com';
            const token = await addToken(email);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.length).toBe(64); // 32 bytes en hex
        });

        it('devrait sauvegarder le token en base', async () => {
            const email = 'savetoken@example.com';
            const token = await addToken(email);

            const tokenDoc = await Token.findOne({ token });

            expect(tokenDoc).toBeTruthy();
            expect(tokenDoc?.email).toBe(email);
        });

        it('devrait définir l\'expiration correctement', async () => {
            const email = 'expiry@example.com';
            const beforeCreation = new Date();

            const token = await addToken(email);

            const afterCreation = new Date();

            const tokenDoc = await Token.findOne({ token });

            const expectedMin = new Date(beforeCreation.getTime() + 24 * 60 * 60 * 1000);
            const expectedMax = new Date(afterCreation.getTime() + 24 * 60 * 60 * 1000);

            expect(tokenDoc?.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin.getTime());
            expect(tokenDoc?.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax.getTime());
        });

        it('devrait générer des tokens uniques', async () => {
            const email1 = 'unique1@example.com';
            const email2 = 'unique2@example.com';

            const token1 = await addToken(email1);
            const token2 = await addToken(email2);

            expect(token1).not.toBe(token2);
        });
    });
});