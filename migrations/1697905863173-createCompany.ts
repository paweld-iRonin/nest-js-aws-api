import {
    MigrationInterface,
    QueryRunner,
    Table,
} from "typeorm"

export class CreateCompany1697905863173 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "company",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "location",
                        type: "varchar",
                    },
                ],
            }),
            true,
        )
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("company")
    }
}
