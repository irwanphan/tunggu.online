-- CreateTable
CREATE TABLE "public"."GovernmentSite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "responseMs" INTEGER,
    "checkedAt" TIMESTAMP(3),

    CONSTRAINT "GovernmentSite_pkey" PRIMARY KEY ("id")
);
