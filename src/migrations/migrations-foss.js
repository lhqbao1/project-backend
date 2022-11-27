'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('foss', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            commment: {
                type: Sequelize.STRING,
                defaultValue: "pets table stores all pets"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('foss');
    }
};