/*
  Warnings:

  - You are about to drop the column `creatEl` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `creatEl` on the `Notificacio` table. All the data in the column will be lost.
  - You are about to drop the column `actualitzatEl` on the `Usuari` table. All the data in the column will be lost.
  - You are about to drop the column `creatEl` on the `Usuari` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `Usuari` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "creatEl",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notificacio" DROP COLUMN "creatEl",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuari" DROP COLUMN "actualitzatEl",
DROP COLUMN "creatEl",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
