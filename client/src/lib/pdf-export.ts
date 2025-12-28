import { jsPDF } from 'jspdf';
import type { Roadmap, Milestone } from '@shared/schema';

export const generateRoadmapPDF = (roadmap: Roadmap, milestones: Milestone[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(roadmap.title, 20, yPosition);
  yPosition += 15;

  // Subtitle
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`${roadmap.duration} weeks • ${roadmap.timePerWeek} hours/week`, 20, yPosition);
  yPosition += 20;

  // Overview section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Overview', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const overviewText = `Topic: ${roadmap.topic}\nSkill Level: ${roadmap.skillLevel}\nGoal: ${roadmap.goal}`;
  const splitOverview = doc.splitTextToSize(overviewText, pageWidth - 40);
  doc.text(splitOverview, 20, yPosition);
  yPosition += splitOverview.length * 6 + 15;

  // Phases section
  const phases = roadmap.phases as any[];
  
  phases.forEach((phase, phaseIndex) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }

    // Phase header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Phase ${phaseIndex + 1}: ${phase.title}`, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const phaseDesc = doc.splitTextToSize(phase.description, pageWidth - 40);
    doc.text(phaseDesc, 20, yPosition);
    yPosition += phaseDesc.length * 6 + 10;

    // Phase milestones
    const phaseMilestones = milestones.filter(m => m.phaseId === phase.id);
    
    phaseMilestones.forEach((milestone, milestoneIndex) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }

      // Milestone checkbox and title
      doc.setFont('helvetica', 'bold');
      const checkbox = milestone.completed ? '☑' : '☐';
      doc.text(`${checkbox} ${milestone.title}`, 30, yPosition);
      yPosition += 8;

      // Milestone description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const milestoneDesc = doc.splitTextToSize(milestone.description, pageWidth - 60);
      doc.text(milestoneDesc, 35, yPosition);
      yPosition += milestoneDesc.length * 5 + 5;

      // Resources
      if (milestone.resources && (milestone.resources as any[]).length > 0) {
        doc.setFont('helvetica', 'italic');
        doc.text('Resources:', 35, yPosition);
        yPosition += 5;

        (milestone.resources as any[]).slice(0, 3).forEach((resource) => {
          if (yPosition > pageHeight - 20) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${resource.title} (${resource.source})`, 40, yPosition);
          yPosition += 5;
        });
        
        yPosition += 5;
      }
    });

    yPosition += 10;
  });

  // Generate filename
  const filename = `${roadmap.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roadmap.pdf`;
  
  // Save the PDF
  doc.save(filename);
};
