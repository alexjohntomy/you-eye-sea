-- CreateIndex
CREATE INDEX "Comment_courseID_courseNumber_idx" ON "Comment"("courseID", "courseNumber");

-- CreateIndex
CREATE INDEX "CourseInstance_courseID_courseNumber_idx" ON "CourseInstance"("courseID", "courseNumber");

-- CreateIndex
CREATE INDEX "CourseInstance_professorID_idx" ON "CourseInstance"("professorID");

-- CreateIndex
CREATE INDEX "Review_courseID_courseNumber_idx" ON "Review"("courseID", "courseNumber");

-- CreateIndex
CREATE INDEX "Review_professorID_idx" ON "Review"("professorID");
