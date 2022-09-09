/*
  Warnings:

  - You are about to drop the column `Link` on the `rewards` table. All the data in the column will be lost.
  - Added the required column `link` to the `rewards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rewards" DROP COLUMN "Link",
ADD COLUMN     "link" VARCHAR(255) NOT NULL;
