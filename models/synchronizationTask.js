
module.exports = class SynchronizationTask  {
    constructor(
        country,
        campaign,
        personalizationType,
        totalRows,
        page,
        batchSize,
        correlationId
    ){
        this.country = country;
        this.campaign = campaign;
        this.personalizationType = personalizationType;
        this.totalRows = totalRows;
        this.page = page;
        this.batchSize = batchSize;
        this.correlationId = correlationId;
    }
};