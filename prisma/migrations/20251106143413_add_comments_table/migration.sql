-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "comment" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT,
    "courseInstanceID" INTEGER,
    "courseID" TEXT,
    "courseNumber" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseInstanceID_fkey" FOREIGN KEY ("courseInstanceID") REFERENCES "CourseInstance"("courseInstanceID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_courseID_courseNumber_fkey" FOREIGN KEY ("courseID", "courseNumber") REFERENCES "Course"("subject", "number") ON DELETE SET NULL ON UPDATE CASCADE;
