-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nombre" TEXT,
    "role" TEXT NOT NULL DEFAULT 'TESTADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testamentos" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "datosIdentidad" JSONB,
    "herederos" JSONB NOT NULL,
    "bienes" JSONB NOT NULL,
    "disposiciones" JSONB NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'borrador',
    "hashDocumento" TEXT,
    "selloTiempo" TEXT,
    "blockchainTx" TEXT,

    CONSTRAINT "testamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "testamentos" ADD CONSTRAINT "testamentos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
