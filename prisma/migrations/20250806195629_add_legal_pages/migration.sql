-- CreateEnum
CREATE TYPE "public"."LegalPageType" AS ENUM ('TERMS', 'PRIVACY', 'COOKIES');

-- CreateTable
CREATE TABLE "public"."legal_pages" (
    "id" TEXT NOT NULL,
    "type" "public"."LegalPageType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "legal_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "legal_pages_type_isActive_key" ON "public"."legal_pages"("type", "isActive");

-- AddForeignKey
ALTER TABLE "public"."legal_pages" ADD CONSTRAINT "legal_pages_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
