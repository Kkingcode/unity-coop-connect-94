
import jsPDF from 'jspdf';

interface MemberData {
  fullName: string;
  sex: string;
  homeAddress: string;
  townLgaState: string;
  occupation: string;
  jobAddress: string;
  phoneNumber: string;
  introducedBy: string;
  nokName: string;
  nokAddress: string;
  nokPhone: string;
  nokAltPhone: string;
  idType: string;
  idNumber: string;
  guarantor1Name: string;
  guarantor1Address: string;
  guarantor1Phone: string;
  guarantor2Name: string;
  guarantor2Address: string;
  guarantor2Phone: string;
}

interface Signatures {
  applicant: string;
  guarantor1: string;
  guarantor2: string;
  president: string;
  secretary: string;
}

export const generateMembershipApplicationPDF = (memberData: MemberData, signatures: Signatures) => {
  const pdf = new jsPDF();
  
  // Page 1 - Membership Application
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OLORUN NI NSOGO CO-OPERATIVE SOCIETY', 105, 20, { align: 'center' });
  pdf.text('MEMBERSHIP APPLICATION FORM', 105, 30, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  let yPos = 50;
  
  // Applicant Information
  pdf.setFont('helvetica', 'bold');
  pdf.text('APPLICANT INFORMATION', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Full Name: ${memberData.fullName}`, 20, yPos);
  pdf.text(`Sex: ${memberData.sex}`, 120, yPos);
  yPos += 8;
  
  pdf.text(`Home Address: ${memberData.homeAddress}`, 20, yPos);
  yPos += 8;
  
  pdf.text(`Town/L.G.A/State: ${memberData.townLgaState}`, 20, yPos);
  yPos += 8;
  
  pdf.text(`Occupation: ${memberData.occupation}`, 20, yPos);
  yPos += 8;
  
  pdf.text(`Job Address: ${memberData.jobAddress}`, 20, yPos);
  yPos += 8;
  
  pdf.text(`Phone: ${memberData.phoneNumber}`, 20, yPos);
  pdf.text(`Introduced By: ${memberData.introducedBy}`, 120, yPos);
  yPos += 15;
  
  // Next of Kin
  pdf.setFont('helvetica', 'bold');
  pdf.text('NEXT OF KIN', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${memberData.nokName}`, 20, yPos);
  yPos += 8;
  pdf.text(`Address: ${memberData.nokAddress}`, 20, yPos);
  yPos += 8;
  pdf.text(`Phone: ${memberData.nokPhone}`, 20, yPos);
  pdf.text(`Alt Phone: ${memberData.nokAltPhone}`, 120, yPos);
  yPos += 15;
  
  // Identification
  pdf.setFont('helvetica', 'bold');
  pdf.text('IDENTIFICATION', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`ID Type: ${memberData.idType}`, 20, yPos);
  pdf.text(`ID Number: ${memberData.idNumber}`, 120, yPos);
  yPos += 15;
  
  // Guarantors
  pdf.setFont('helvetica', 'bold');
  pdf.text('GUARANTORS', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text('Guarantor 1:', 20, yPos);
  yPos += 8;
  pdf.text(`Name: ${memberData.guarantor1Name}`, 25, yPos);
  yPos += 8;
  pdf.text(`Address: ${memberData.guarantor1Address}`, 25, yPos);
  yPos += 8;
  pdf.text(`Phone: ${memberData.guarantor1Phone}`, 25, yPos);
  yPos += 10;
  
  pdf.text('Guarantor 2:', 20, yPos);
  yPos += 8;
  pdf.text(`Name: ${memberData.guarantor2Name}`, 25, yPos);
  yPos += 8;
  pdf.text(`Address: ${memberData.guarantor2Address}`, 25, yPos);
  yPos += 8;
  pdf.text(`Phone: ${memberData.guarantor2Phone}`, 25, yPos);
  yPos += 15;
  
  // Signatures
  pdf.setFont('helvetica', 'bold');
  pdf.text('SIGNATURES', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  if (signatures.applicant) {
    try {
      pdf.addImage(signatures.applicant, 'PNG', 20, yPos, 40, 20);
    } catch (e) {
      console.warn('Could not add applicant signature to PDF');
    }
  }
  pdf.text('Applicant Signature', 20, yPos + 25);
  
  if (signatures.guarantor1) {
    try {
      pdf.addImage(signatures.guarantor1, 'PNG', 70, yPos, 40, 20);
    } catch (e) {
      console.warn('Could not add guarantor1 signature to PDF');
    }
  }
  pdf.text('Guarantor 1 Signature', 70, yPos + 25);
  
  if (signatures.guarantor2) {
    try {
      pdf.addImage(signatures.guarantor2, 'PNG', 120, yPos, 40, 20);
    } catch (e) {
      console.warn('Could not add guarantor2 signature to PDF');
    }
  }
  pdf.text('Guarantor 2 Signature', 120, yPos + 25);
  
  // Page 2 - Declaration of Nominee
  pdf.addPage();
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DECLARATION OF NOMINEE', 105, 20, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPos = 40;
  
  const currentDate = new Date();
  pdf.text(`Declaration made this ${currentDate.getDate()} day of ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`, 20, yPos);
  yPos += 15;
  
  pdf.text('I, the undersigned, being a member of OLORUN NI NSOGO Co-operative Society,', 20, yPos);
  yPos += 8;
  pdf.text('hereby declare that the person named below shall be my nominee in the event', 20, yPos);
  yPos += 8;
  pdf.text('of my death. All sums due to me from the Society shall be transferred to this nominee.', 20, yPos);
  yPos += 8;
  pdf.text('If I owe any money to the Society, the nominee shall be responsible for settling', 20, yPos);
  yPos += 8;
  pdf.text('the outstanding balance.', 20, yPos);
  yPos += 15;
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('NOMINEE DETAILS:', 20, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${memberData.nokName}`, 20, yPos);
  yPos += 8;
  pdf.text(`Address: ${memberData.nokAddress}`, 20, yPos);
  yPos += 8;
  pdf.text(`Phone: ${memberData.nokPhone}`, 20, yPos);
  yPos += 8;
  pdf.text(`Alternate Phone: ${memberData.nokAltPhone}`, 20, yPos);
  yPos += 20;
  
  // Member signature on page 2
  if (signatures.applicant) {
    try {
      pdf.addImage(signatures.applicant, 'PNG', 20, yPos, 40, 20);
    } catch (e) {
      console.warn('Could not add member signature to page 2');
    }
  }
  pdf.text('Member Signature', 20, yPos + 25);
  
  // Official signatures
  if (signatures.president) {
    try {
      pdf.addImage(signatures.president, 'PNG', 120, yPos, 40, 20);
    } catch (e) {
      console.warn('Could not add president signature to PDF');
    }
  }
  pdf.text('President Signature', 120, yPos + 25);
  
  if (signatures.secretary) {
    try {
      pdf.addImage(signatures.secretary, 'PNG', 120, yPos + 35, 40, 20);
    } catch (e) {
      console.warn('Could not add secretary signature to PDF');
    }
  }
  pdf.text('Secretary Signature', 120, yPos + 60);
  
  yPos += 80;
  pdf.text('This declaration cancels any previous declaration made by me in this regard.', 20, yPos);
  
  return pdf;
};

// PDF Statement Generator
export const generateMemberStatement = async (member: any) => {
  const pdf = new jsPDF();
  
  // Header
  pdf.setFontSize(20);
  pdf.text('Alajeseku Cooperative Society', 20, 20);
  pdf.setFontSize(16);
  pdf.text('Member Statement', 20, 35);
  
  // Member Details
  pdf.setFontSize(12);
  pdf.text(`Member Name: ${member.name}`, 20, 55);
  pdf.text(`Account Number: ${member.account_number}`, 20, 65);
  pdf.text(`Phone: ${member.phone}`, 20, 75);
  pdf.text(`Email: ${member.email || 'N/A'}`, 20, 85);
  pdf.text(`Status: ${member.status}`, 20, 95);
  
  // Financial Summary
  pdf.setFontSize(14);
  pdf.text('Financial Summary', 20, 115);
  pdf.setFontSize(12);
  pdf.text(`Current Balance: ₦${(member.balance || 0).toLocaleString()}`, 20, 130);
  pdf.text(`Savings Balance: ₦${(member.savings_balance || 0).toLocaleString()}`, 20, 140);
  pdf.text(`Loan Balance: ₦${(member.loan_balance || 0).toLocaleString()}`, 20, 150);
  
  // Footer
  pdf.setFontSize(10);
  pdf.text('Generated on: ' + new Date().toLocaleDateString(), 20, 280);
  pdf.text('Alajeseku Cooperative Society - Member Statement', 20, 290);
  
  // Save the PDF
  pdf.save(`${member.name}_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
};
