-- CreateTable
CREATE TABLE "Department" (
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "subject" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "departmentID" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("subject","number")
);

-- CreateTable
CREATE TABLE "CourseInstance" (
    "courseInstanceID" SERIAL NOT NULL,
    "courseID" TEXT NOT NULL,
    "courseNumber" INTEGER NOT NULL,
    "professorID" INTEGER NOT NULL,
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    "C" INTEGER NOT NULL,
    "D" INTEGER NOT NULL,
    "F" INTEGER NOT NULL,
    "ADV" INTEGER NOT NULL,
    "CR" INTEGER NOT NULL,
    "DFR" INTEGER NOT NULL,
    "I" INTEGER NOT NULL,
    "NG" INTEGER NOT NULL,
    "NR" INTEGER NOT NULL,
    "O" INTEGER NOT NULL,
    "PR" INTEGER NOT NULL,
    "S" INTEGER NOT NULL,
    "U" INTEGER NOT NULL,
    "W" INTEGER NOT NULL,
    "total_students" INTEGER NOT NULL,
    "semester" TEXT NOT NULL,

    CONSTRAINT "CourseInstance_pkey" PRIMARY KEY ("courseInstanceID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Professor_name_key" ON "Professor"("name");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_departmentID_fkey" FOREIGN KEY ("departmentID") REFERENCES "Department"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstance" ADD CONSTRAINT "CourseInstance_courseID_courseNumber_fkey" FOREIGN KEY ("courseID", "courseNumber") REFERENCES "Course"("subject", "number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseInstance" ADD CONSTRAINT "CourseInstance_professorID_fkey" FOREIGN KEY ("professorID") REFERENCES "Professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
