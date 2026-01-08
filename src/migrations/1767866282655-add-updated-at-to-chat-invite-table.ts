import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUpdatedAtToChatInviteTable1767866282655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'chat_invites',
      new TableColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: 'NOW()',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('chat_invites', 'updated_at');
  }
}
