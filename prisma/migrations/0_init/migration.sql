-- CreateTable
CREATE TABLE "announcement" (
    "message" XML,
    "placement_id" VARCHAR(25),
    "attributes" VARCHAR(50),
    "id" SERIAL NOT NULL,

    CONSTRAINT "anouncements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_option" (
    "operatorius" VARCHAR,
    "kaina" MONEY,
    "aprasymas" TEXT,
    "ar_rodoma" BOOLEAN,
    "delivery_id" SERIAL NOT NULL,
    "trukme_dd" VARCHAR,

    CONSTRAINT "siuntimas_pkey" PRIMARY KEY ("delivery_id")
);

-- CreateTable
CREATE TABLE "email" (
    "email" CHAR(50),
    "date_subscribed" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faktura" (
    "total_paid" MONEY,
    "total_product" MONEY,
    "total_delivery" MONEY,
    "client_name" TEXT,
    "client_contact" TEXT,
    "client_code" TEXT,
    "total_discount" MONEY,
    "date_issued" TIMESTAMP(6),
    "nr" SERIAL NOT NULL,

    CONSTRAINT "fakturos_pkey" PRIMARY KEY ("nr")
);

-- CreateTable
CREATE TABLE "order" (
    "contact" VARCHAR,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "order_nr" SERIAL NOT NULL,
    "paid" BOOLEAN,
    "sent_out" BOOLEAN,
    "delivery_id" INTEGER,
    "delivery_adr" TEXT,
    "pay_id" INTEGER,
    "faktura_nr" INTEGER,
    "total_paid" MONEY,
    "receipt_url" TEXT,
    "comments" TEXT,
    "token" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("order_nr")
);

-- CreateTable
CREATE TABLE "payment" (
    "pay_id" SERIAL NOT NULL,
    "name" TEXT,
    "fee" MONEY,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("pay_id")
);

-- CreateTable
CREATE TABLE "product" (
    "name" VARCHAR(20),
    "category" VARCHAR(20),
    "price" MONEY,
    "description" TEXT,
    "size" VARCHAR(20),
    "weight" VARCHAR(10),
    "pic_thumbnail" TEXT,
    "pic_large" TEXT,
    "prod_id" SERIAL NOT NULL,
    "status" CHAR(4),
    "page" DECIMAL,
    "order_nr" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("prod_id")
);

-- CreateTable
CREATE TABLE "session" (
    "floka_token" TEXT,
    "stripe_session" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uniqa" ON "product"("prod_id");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "orders_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery_option"("delivery_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "orders_faktura_nr_fkey" FOREIGN KEY ("faktura_nr") REFERENCES "faktura"("nr") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "orders_pay_id_fkey" FOREIGN KEY ("pay_id") REFERENCES "payment"("pay_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "fk_order_nr" FOREIGN KEY ("order_nr") REFERENCES "order"("order_nr") ON DELETE NO ACTION ON UPDATE NO ACTION;

