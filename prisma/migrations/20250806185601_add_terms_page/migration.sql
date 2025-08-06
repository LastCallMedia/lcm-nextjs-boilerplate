/*
  Warnings:

  - You are about to drop the `LegalPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."LegalPage" DROP CONSTRAINT "LegalPage_createdById_fkey";

-- DropTable
DROP TABLE "public"."LegalPage";

-- DropEnum
DROP TYPE "public"."PageType";

-- CreateTable
CREATE TABLE "public"."terms_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "terms_pages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."terms_pages" ADD CONSTRAINT "terms_pages_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
