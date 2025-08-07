/*
  Warnings:

  - The values [COOKIES] on the enum `LegalPageType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."LegalPageType_new" AS ENUM ('TERMS', 'PRIVACY');
ALTER TABLE "public"."legal_pages" ALTER COLUMN "type" TYPE "public"."LegalPageType_new" USING ("type"::text::"public"."LegalPageType_new");
ALTER TYPE "public"."LegalPageType" RENAME TO "LegalPageType_old";
ALTER TYPE "public"."LegalPageType_new" RENAME TO "LegalPageType";
DROP TYPE "public"."LegalPageType_old";
COMMIT;
