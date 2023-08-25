-- CreateTable
CREATE TABLE "medias" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "username" VARCHAR(25) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medias_title_key" ON "medias"("title");
