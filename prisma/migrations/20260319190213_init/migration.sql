-- CreateTable
CREATE TABLE "Console" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT 'no-image.png',
    "releasedate" TIMESTAMP(3) NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Console_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "developer" TEXT NOT NULL,
    "releasedate" TIMESTAMP(3) NOT NULL,
    "prince" DOUBLE PRECISION NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "console_id" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Console_name_key" ON "Console"("name");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_console_id_fkey" FOREIGN KEY ("console_id") REFERENCES "Console"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
