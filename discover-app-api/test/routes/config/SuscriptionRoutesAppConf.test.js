const routersApp = require('../../../src/routes/config/SuscriptionRoutesAppConf');
describe("Suscription routes app config", () => {

    it("should return all suscription routes app", async () => {
        /** length validate equals a real import routes to app use */
        expect(routersApp.length).toBe(4);
    });

});