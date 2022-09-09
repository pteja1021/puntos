/*
  Warnings:

  - Added the required column `company_id` to the `rewards` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_points` to the `rewards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rewards" ADD COLUMN     "company_id" INTEGER NOT NULL,
ADD COLUMN     "minimum_points" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
