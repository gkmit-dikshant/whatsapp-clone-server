import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMediaTypeColumnToMessageMedia1768201529562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'message_media',
      new TableColumn({
        name: 'media_type',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('message_media', 'media_type');
  }
}
