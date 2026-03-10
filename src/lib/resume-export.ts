import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import type { ResumeData } from "@/pages/ATSResumeBuilder";

export async function exportToPDF(element: HTMLElement) {
  // Load html2pdf from CDN to avoid duplicate React bundling
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.2/html2pdf.bundle.min.js";
  await new Promise<void>((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2pdf"));
    document.head.appendChild(script);
  });
  const html2pdf = (window as any).html2pdf;
  html2pdf()
    .set({
      margin: [10, 10, 10, 10],
      filename: "ATS_Resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
}

export async function exportToDOCX(data: ResumeData) {
  const children: Paragraph[] = [];

  const heading = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: 28, font: "Calibri" })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 100 },
    });

  const bullet = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22, font: "Calibri" })],
      bullet: { level: 0 },
      spacing: { after: 40 },
    });

  const normal = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text, size: 22, font: "Calibri" })],
      spacing: { after: 80 },
    });

  // Professional Summary
  children.push(heading("PROFESSIONAL SUMMARY"));
  children.push(normal(data.professionalSummary));

  // Technical Skills
  children.push(heading("TECHNICAL SKILLS"));
  children.push(normal(data.technicalSkills.join(" • ")));

  // Experience
  children.push(heading("PROFESSIONAL EXPERIENCE"));
  data.experience.forEach((exp) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: exp.title, bold: true, size: 24, font: "Calibri" }),
          new TextRun({ text: ` | ${exp.company} | ${exp.duration}`, size: 22, font: "Calibri" }),
        ],
        spacing: { before: 150, after: 60 },
      })
    );
    exp.bullets.forEach((b) => children.push(bullet(b)));
  });

  // Projects
  if (data.projects.length > 0) {
    children.push(heading("PROJECTS"));
    data.projects.forEach((p) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: p.name, bold: true, size: 24, font: "Calibri" }),
            new TextRun({ text: ` — ${p.description}`, size: 22, font: "Calibri" }),
          ],
          spacing: { before: 100, after: 60 },
        })
      );
      p.bullets.forEach((b) => children.push(bullet(b)));
    });
  }

  // Education
  children.push(heading("EDUCATION"));
  data.education.forEach((ed) => {
    children.push(normal(`${ed.degree} | ${ed.institution} | ${ed.year}`));
  });

  // Certifications
  if (data.certifications.length > 0) {
    children.push(heading("CERTIFICATIONS"));
    data.certifications.forEach((c) => children.push(bullet(c)));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "ATS_Resume.docx");
}
