import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateChatInviteTable1767848641128 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'chat_invites',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chat_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'to_user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'from_user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'expriry',
            type: 'int',
            default: 1440, // one day
          },
          {
            name: 'is_accepted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('chat_invites', [
      new TableForeignKey({
        columnNames: ['chat_id'],
        referencedTableName: 'chats',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['to_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['from_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('chat_invites');
  }
}
