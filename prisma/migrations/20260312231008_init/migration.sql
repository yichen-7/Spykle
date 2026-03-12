-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "toneScore" REAL NOT NULL,
    "volumeScore" REAL NOT NULL,
    "articulationScore" REAL NOT NULL,
    "paceScore" REAL NOT NULL,
    "wordsPerMinute" INTEGER NOT NULL,
    "transcript" TEXT NOT NULL,
    "focusArea" TEXT NOT NULL,
    "feedbackJson" TEXT NOT NULL
);
