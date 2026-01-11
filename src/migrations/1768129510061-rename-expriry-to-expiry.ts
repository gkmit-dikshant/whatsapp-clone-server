import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameExpriryToExpiry1768129510061 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('chat_invites', 'expriry', 'expiry');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('chat_invites', 'expiry', 'expriry');
  }
}
