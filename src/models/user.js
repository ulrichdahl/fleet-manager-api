module.exports = dynamo.define('User', {
    hashKey: 'userId',

    // add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,

    schema: {
        userId: Joi.string(),
        orgId: Joi.string(),
        public: Joi.string(),
        numberOfShips: Joi.number(),
        shipsIndex: Joi.number(),
        settings: {
            userName: Joi.string(),
            guildName: Joi.string(),
            fleetMessageId: Joi.string(),
        }
    },

    indexes: [{
        hashKey: 'orgId',
        rangeKey: 'public',
        type: 'global',
        name: 'orgIdIndex'
    }]
});
