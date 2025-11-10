import { CommentsPane } from "@/components/custom/comments-pane";
import prisma from "@/lib/prisma";

async function getCommentsFromDB(courseName: any) {
  const commentsFromDB = await prisma.comment.findMany({
    where: {
      courseID: courseName[0],
      courseNumber: parseInt(courseName[1]),
    },
  });
  return commentsFromDB;
}

interface CommentsPaneServerProps {
  slug: string;
  professorID?: any;
}

async function CommentsPaneServer({
  slug,
  professorID,
}: CommentsPaneServerProps) {
  const parsedCourseName = slug.split("-") ?? ["test", "test"];
  const commentsFromDB = await getCommentsFromDB(parsedCourseName);
  return (
    <CommentsPane
      comments={commentsFromDB}
      parsedSlug={parsedCourseName}
      professorID={professorID}
    />
  );
}

export { CommentsPaneServer };
