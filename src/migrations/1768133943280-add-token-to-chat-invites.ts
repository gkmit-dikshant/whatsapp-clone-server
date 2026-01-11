import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTokenToChatInvites1768133943280 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'chat_invites',
      new TableColumn({
        name: 'token',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('chat_invites', 'token');
  }
}
