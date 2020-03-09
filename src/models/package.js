module.exports = dynamo.define('Package', {
    hashKey: 'id',
    rangeKey: 'userId',

    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema: {
        id: Joi.string(),
        userId: Joi.string(),
        orgId: Joi.string(),
        name: Joi.string(),
        description: Joi.string(),
        imageUri: Joi.string(),
        purchased: {
            price: Joi.number(),
            currency: Joi.string(),
            datetime: Joi.date(),
        },
        forSale: {
            price: Joi.number(),
            currency: Joi.string(),
            datetime: Joi.date(),
        },
        insurance: Joi.string(), // 6 months, IAE (10 years), LTI, etc.
        containedShips: dynamo.types.stringSet(),
        settings: {
            saleMessageId: Joi.string(),
        }
    },

    indexes: [
        {
            hashKey: 'orgId',
            type: 'global',
            name: 'orgIdIndex'
        },
        {
            hashKey: 'userId',
            type: 'global',
            name: 'userIdIndex'
        }
    ]
});
