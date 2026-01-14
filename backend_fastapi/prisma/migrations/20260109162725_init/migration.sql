-- CreateEnum
CREATE TYPE "RolGlobal" AS ENUM ('JUGADOR', 'ENTRENADOR', 'ADMIN_EQUIP', 'ADMIN_WEB', 'ARBITRE', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "RolEquip" AS ENUM ('JUGADOR', 'ENTRENADOR', 'ADMIN_EQUIP');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDENT', 'COMPLETAT', 'CANCELAT');

-- CreateTable
CREATE TABLE "Usuari" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasenya" TEXT NOT NULL,
    "creatEl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualitzatEl" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Usuari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariRol" (
    "id" SERIAL NOT NULL,
    "usuariId" INTEGER NOT NULL,
    "rol" "RolGlobal" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UsuariRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equip" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "clubId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Equip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipUsuari" (
    "id" SERIAL NOT NULL,
    "equipId" INTEGER NOT NULL,
    "usuariId" INTEGER NOT NULL,
    "rolEquip" "RolEquip" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EquipUsuari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lliga" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Lliga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jornada" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "lligaId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Jornada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partit" (
    "id" SERIAL NOT NULL,
    "jornadaId" INTEGER NOT NULL,
    "localId" INTEGER NOT NULL,
    "visitanteId" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Partit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puntuacio" (
    "id" SERIAL NOT NULL,
    "partitId" INTEGER NOT NULL,
    "jugadorId" INTEGER NOT NULL,
    "punts" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Puntuacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacio" (
    "id" SERIAL NOT NULL,
    "usuariId" INTEGER NOT NULL,
    "titol" TEXT NOT NULL,
    "missatge" TEXT NOT NULL,
    "llegit" BOOLEAN NOT NULL DEFAULT false,
    "creatEl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Notificacio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merch" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "preu" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Merch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" SERIAL NOT NULL,
    "usuariId" INTEGER NOT NULL,
    "merchId" INTEGER NOT NULL,
    "quantitat" INTEGER NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "creatEl" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagat" BOOLEAN NOT NULL DEFAULT false,
    "status" "Status" NOT NULL DEFAULT 'PENDENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EquipToLliga" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuari_email_key" ON "Usuari"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_EquipToLliga_AB_unique" ON "_EquipToLliga"("A", "B");

-- CreateIndex
CREATE INDEX "_EquipToLliga_B_index" ON "_EquipToLliga"("B");

-- AddForeignKey
ALTER TABLE "UsuariRol" ADD CONSTRAINT "UsuariRol_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equip" ADD CONSTRAINT "Equip_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipUsuari" ADD CONSTRAINT "EquipUsuari_equipId_fkey" FOREIGN KEY ("equipId") REFERENCES "Equip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipUsuari" ADD CONSTRAINT "EquipUsuari_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jornada" ADD CONSTRAINT "Jornada_lligaId_fkey" FOREIGN KEY ("lligaId") REFERENCES "Lliga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partit" ADD CONSTRAINT "Partit_jornadaId_fkey" FOREIGN KEY ("jornadaId") REFERENCES "Jornada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partit" ADD CONSTRAINT "Partit_localId_fkey" FOREIGN KEY ("localId") REFERENCES "Equip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partit" ADD CONSTRAINT "Partit_visitanteId_fkey" FOREIGN KEY ("visitanteId") REFERENCES "Equip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puntuacio" ADD CONSTRAINT "Puntuacio_partitId_fkey" FOREIGN KEY ("partitId") REFERENCES "Partit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Puntuacio" ADD CONSTRAINT "Puntuacio_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacio" ADD CONSTRAINT "Notificacio_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_usuariId_fkey" FOREIGN KEY ("usuariId") REFERENCES "Usuari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_merchId_fkey" FOREIGN KEY ("merchId") REFERENCES "Merch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipToLliga" ADD CONSTRAINT "_EquipToLliga_A_fkey" FOREIGN KEY ("A") REFERENCES "Equip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EquipToLliga" ADD CONSTRAINT "_EquipToLliga_B_fkey" FOREIGN KEY ("B") REFERENCES "Lliga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
