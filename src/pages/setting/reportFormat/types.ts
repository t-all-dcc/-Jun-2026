export interface PageConfig {
  id: string;
  moduleMenu: string;
  reportTitleTh: string;
  reportTitleEn: string;
  documentCode: string;
  revisionNo: string;
  issueDate: string;
  orientation: 'portrait' | 'landscape';
  showSignatures: boolean;
}

export interface StandardConfig {
  paperSize: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  fontCompany: number;
  fontMetaGrid: number;
  fontReportTitle: number;
  fontContent: number;
  fontSignature: number;
  fontFooter: number;
}

export interface SignatureConfig {
  preparedByName: string;
  preparedByTitle: string;
  reviewedByName: string;
  reviewedByTitle: string;
  approvedByName: string;
  approvedByTitle: string;
}

export interface CompanyConfig {
  companyNameTh: string;
  companyNameEn: string;
  taxId: string;
  companyAddressTh: string;
  companyAddressEn: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string;
}
