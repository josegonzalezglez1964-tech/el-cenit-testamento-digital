/*
  Warnings:

  - A unique constraint covering the columns `[dni]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "apellidos" TEXT,
ADD COLUMN     "direccion" TEXT,
ADD COLUMN     "dni" TEXT,
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3),
ADD COLUMN     "telefono" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_dni_key" ON "users"("dni");
