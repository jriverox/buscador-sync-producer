const dbObjectManager = require("../dbObjectManager");
const collectionName = "OfertaPersonalizada";

module.exports = class PersonalizationRepository{    
    async getCount(country, campaign, personalizationType){
        let db = dbObjectManager.getDb(country.toUpperCase());

        if (!!db) {
            const ofertaPersonalizada = db.collection(collectionName);
            const query = {
                "AnioCampanaVenta": campaign,
                "TipoPersonalizacion": personalizationType
            };
            return await ofertaPersonalizada.count(query);            
        } else { // database is undefined, initialization error
            let mensaje = `error getting ${country} database`;
            throw new Error(mensaje);
        }
    }
}
