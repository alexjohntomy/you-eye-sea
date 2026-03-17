import { ImageResponse } from "next/og";
import prisma from "@/lib/prisma";
import { formatGradeData } from "@/app/_util/formatGradeData";
import { calculateGPA } from "@/app/_util/gpaCalculator";
import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";

const manropeRegular = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'manrope', 'manrope-latin-400-normal.woff'));
const manropeMedium = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'manrope', 'manrope-latin-500-normal.woff'));
const manropeSemiBold = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'manrope', 'manrope-latin-600-normal.woff'));
const manropeBold = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'manrope', 'manrope-latin-700-normal.woff'));
const manropeExtraBold = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'manrope', 'manrope-latin-800-normal.woff'));

const logoBufferString = fs.readFileSync(path.join(process.cwd(), 'public', 'logo.png')).toString('base64');
const logoBase64 = `data:image/png;base64,${logoBufferString}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("course");
  const professor = searchParams.get("professor");

  if (!courseSlug) {
    return new Response("Missing course slug", { status: 400 });
  }

  const parsedSlug = courseSlug.split("-");
  if (parsedSlug.length !== 2) {
    return new Response("Invalid course slug", { status: 400 });
  }

  const courseID = parsedSlug[0];
  const courseNumber = parseInt(parsedSlug[1]);

  try {
    // Fetch Course Info
    const courseDetails = await prisma.course.findFirst({
      where: {
        subject: courseID,
        number: courseNumber,
      },
      select: {
        title: true,
      },
    });

    if (!courseDetails) {
      return new Response("Course not found", { status: 404 });
    }

    // Fetch Grade Distribution
    let courseInstanceAggregation;
    let selectedProfessorName = "";

    if (professor && professor !== "all-professors") {
      const professorID = parseInt(professor);
      courseInstanceAggregation = await prisma.courseInstance.aggregate({
        _sum: { A: true, B: true, C: true, D: true, F: true, W: true },
        where: {
          courseID: courseID,
          courseNumber: courseNumber,
          professorID: professorID,
        },
      });

      const prof = await prisma.professor.findUnique({
        where: { id: professorID },
      });
      if (prof) {
        selectedProfessorName = prof.name;
      }
    } else {
      courseInstanceAggregation = await prisma.courseInstance.aggregate({
        _sum: { A: true, B: true, C: true, D: true, F: true, W: true },
        where: {
          courseID: courseID,
          courseNumber: courseNumber,
        },
      });
    }

    const formattedGradeData = formatGradeData(courseInstanceAggregation);
    const gpa = calculateGPA(formattedGradeData);

    const grades = {
      A: courseInstanceAggregation._sum.A ?? 0,
      B: courseInstanceAggregation._sum.B ?? 0,
      C: courseInstanceAggregation._sum.C ?? 0,
      D: courseInstanceAggregation._sum.D ?? 0,
      F: courseInstanceAggregation._sum.F ?? 0,
      W: courseInstanceAggregation._sum.W ?? 0,
    };

    const totalGrades = grades.A + grades.B + grades.C + grades.D + grades.F + grades.W;
    const totalPassed = grades.A + grades.B + grades.C + grades.D;
    const passRate = totalGrades === 0 ? 0 : (totalPassed / (totalGrades - grades.W)) * 100;
    const dropRate = totalGrades === 0 ? 0 : (grades.W / totalGrades) * 100;

    // We can't use complex Tailwind plugins or okclh in Satori easily, so we use hex codes
    // UIC Red: #D92B38
    // Background: #ffffff
    // Chart 1 (A, green): #5CD67C
    // Chart 2 (B, teal): #13CFE6
    // Chart 3 (C, yellow): #F3C44C
    // Chart 4 (D, orange): #F0763C
    // Chart 5 (F, red): #E54949
    // Chart 6 (W, dark grey): #303030

    const chartColors = ["#5CD67C", "#13CFE6", "#F3C44C", "#F0763C", "#E54949", "#303030"];

    const maxCount = Math.max(...formattedGradeData.map(d => d.count), 1);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundImage: "linear-gradient(to bottom, #FAFAFA, #EBEBEB)",
            fontFamily: "Manrope",
            padding: "0px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "100%", flex: 1, padding: "48px 64px 32px 64px" }}>
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", height: "160px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                <span style={{ fontSize: 76, fontWeight: 800, color: "#D50032", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {courseID} {courseNumber}
                </span>
                <span style={{ fontSize: 36, fontWeight: 500, color: "#52525B", letterSpacing: "-0.01em" }}>
                  {courseDetails.title}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#ffffff", padding: "24px 40px", borderRadius: "32px", border: "2px solid #E5E7EB", gap: "10px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px" }}>
                  <div style={{ width: 14, height: 14, backgroundColor: "#5CD67C", borderRadius: "50%" }} />
                  <span style={{ fontSize: 42, fontWeight: 700, color: "#09090B", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    GPA: {gpa}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: 24, fontWeight: 500, color: "#18181B", lineHeight: 1 }}>
                    Pass Rate: {passRate.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: 24, fontWeight: 500, color: "#18181B", lineHeight: 1 }}>
                    Drop Rate: {dropRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row (Graph) */}
            <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "300px", marginTop: "24px", backgroundColor: "#ffffff", border: "2px solid #E5E7EB", borderRadius: "24px", padding: "28px 40px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)" }}>
              <div style={{ display: "flex", flexDirection: "column", height: "60px" }}>
                <span style={{ fontSize: 34, fontWeight: 700, color: "#09090B", letterSpacing: "-0.01em", lineHeight: 1 }}>
                  Grade Distribution
                </span>
                {selectedProfessorName && (
                  <span style={{ fontSize: 24, fontWeight: 600, color: "#71717A", marginTop: "8px", lineHeight: 1 }}>
                    {selectedProfessorName} (Spring &apos;22 - Fall &apos;25)
                  </span>
                )}
              </div>

              <div style={{ display: "flex", width: "100%", height: "150px", alignItems: "flex-end", gap: "24px", marginTop: "24px", position: "relative" }}>
                <div style={{ position: "absolute", bottom: -2, width: "100%", height: "2px", backgroundColor: "#E5E7EB" }} />
                <div style={{ position: "absolute", bottom: 35, width: "100%", height: "1px", backgroundColor: "#F4F4F5" }} />
                <div style={{ position: "absolute", bottom: 70, width: "100%", height: "1px", backgroundColor: "#F4F4F5" }} />
                <div style={{ position: "absolute", bottom: 105, width: "100%", height: "1px", backgroundColor: "#F4F4F5" }} />
                {formattedGradeData.map((data, index) => {
                  const barPxHeight = data.count === 0 ? 0 : Math.max((data.count / maxCount) * 105, 4);

                  return (
                    <div key={data.grade} style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", justifyContent: "flex-end", height: "100%", zIndex: 10, position: "relative" }}>

                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: data.count > 0 ? 1 : 0, marginBottom: "8px" }}>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "#09090B", lineHeight: 1 }}>{data.count}</span>
                        <span style={{ fontSize: 14, color: "#71717A", marginTop: "4px", lineHeight: 1 }}>{data.count > 0 ? "(" + ((data.count / totalGrades) * 100).toFixed(1) + "%)" : ""}</span>
                      </div>

                      <div
                        style={{
                          width: "85%",
                          height: `${barPxHeight}px`,
                          backgroundColor: chartColors[index],
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />

                      <div style={{ position: "absolute", bottom: "-32px", fontSize: 22, fontWeight: 600, color: "#52525B", opacity: data.count > 0 ? 1 : 0.5 }}>
                        {data.grade}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div style={{ display: "flex", width: "100%", height: "72px", backgroundColor: "#051127", alignItems: "center", justifyContent: "space-between", padding: "0 64px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: 24, fontWeight: 500, color: "#d4d4d8", letterSpacing: "0.01em" }}>
                Visit
              </span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#ffffff", letterSpacing: "0.01em" }}>
                YouEyeSea.com
              </span>
              <span style={{ fontSize: 24, fontWeight: 500, color: "#d4d4d8", letterSpacing: "0.01em" }}>
                to see more details
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
              <img src={logoBase64} height={36} style={{ objectFit: "contain" }} />
              <span style={{ fontSize: 26, fontWeight: 800, color: "#ffffff", letterSpacing: "0.01em" }}>
                YouEyeSea
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Manrope", data: manropeRegular, weight: 400, style: "normal" },
          { name: "Manrope", data: manropeMedium, weight: 500, style: "normal" },
          { name: "Manrope", data: manropeSemiBold, weight: 600, style: "normal" },
          { name: "Manrope", data: manropeBold, weight: 700, style: "normal" },
          { name: "Manrope", data: manropeExtraBold, weight: 800, style: "normal" },
        ],
      }
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
