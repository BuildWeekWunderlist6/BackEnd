describe('Server', () => {
    test('database environment is set to "testing"', () => {
        expect(process.env.DB_ENV).toBe('testing');    
    });
});
