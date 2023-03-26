-- CreateTable
CREATE TABLE "user_data" (
    "id" BIGSERIAL NOT NULL,
    "data" JSONB NOT NULL,
    "data_key" VARCHAR(255) NOT NULL,
    "data_type" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_data_key_user_id_key" ON "user_data"("data_key", "user_id");
