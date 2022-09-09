/*
  Warnings:

  - You are about to drop the column `link` on the `rewards` table. All the data in the column will be lost.
  - Added the required column `Link` to the `rewards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rewards" DROP COLUMN "link",
ADD COLUMN     "Link" VARCHAR(255) NOT NULL;
