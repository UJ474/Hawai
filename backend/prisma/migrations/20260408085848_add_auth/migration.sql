/*
  Warnings:

  - Added the required column `password` to the `Passenger` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Passenger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Passenger" ("email", "id", "name") SELECT "email", "id", "name" FROM "Passenger";
DROP TABLE "Passenger";
ALTER TABLE "new_Passenger" RENAME TO "Passenger";
CREATE UNIQUE INDEX "Passenger_email_key" ON "Passenger"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
