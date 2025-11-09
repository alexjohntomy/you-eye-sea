-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "review" TEXT NOT NULL,
    "stars" INTEGER,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT,
    "professorID" INTEGER,
    "courseID" TEXT,
    "courseNumber" INTEGER,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_courseID_courseNumber_fkey" FOREIGN KEY ("courseID", "courseNumber") REFERENCES "Course"("subject", "number") ON DELETE SET NULL ON UPDATE CASCADE;
