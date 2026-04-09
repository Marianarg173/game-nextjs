/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cover" TEXT NOT NULL DEFAULT 'no-cover.png';

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");
