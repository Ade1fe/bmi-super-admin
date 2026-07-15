import { apiRequest, endpoints } from "./endpoints";

export interface CertificateStudent {
  firstName: string;
  lastName: string;
}

export interface CertificateSchool {
  name: string;
  logoUrl: string | null;
}


export interface Certificate {
  id: string;
  certificateId: string;
  student: CertificateStudent;
  courseName: string;
  issuedDate: string;
  certificateCode: string;
  status: CertificateStatus;
  adminNote?: string | null;
  school?: CertificateSchool;
  verificationUrl?: string;
}



export interface CertificateStudent {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CertificateCourse {
  id: string;
  name: string;
}

export type CertificateStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revoked"
  | "issued"
  | "active"
  | "verified"
  | "reissued";

export interface Certificate {
  id: string;
  studentId: string;
  courseId: string;
  schoolId: string;
  status: CertificateStatus;
  certificateUrl: string | null;
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  course: CertificateCourse;
  student: CertificateStudent;
  school?: { name: string; logoUrl: string | null };
}

export interface CertificatesResponse {
  message: string;
  data: Certificate[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CertificateDetailResponse {
  message: string;
  data: Certificate;
}

export interface CertificateActionResponse {
  message: string;
  data: Certificate;
}

function logRequest(title: string, endpoint: string, body?: unknown) {
  console.group(`📤 ${title}`);
  console.log("Endpoint:", endpoint);
  console.log("Body:", body);
  console.groupEnd();
}

function logResponse(title: string, response: unknown) {
  console.group(`✅ ${title}`);
  console.log("Response:");
  console.dir(response, { depth: null });
  console.groupEnd();
}

function logError(title: string, error: unknown) {
  console.group(`❌ ${title}`);

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error);
  } else {
    console.error(error);
  }

  console.groupEnd();
}
export function formatCertificateDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

/**
 * Merge a partial API response (from approve/reject/revoke/reissue) into an
 * existing table record, preserving display fields the response doesn't include.
 */
export function mergeCertificateUpdate(
  existing: ReturnType<typeof formatCertificateForTable>,
  updated: Certificate,
  schoolNameMap?: Record<string, string>
) {
  const newDate = updated.reviewedAt || updated.createdAt || existing.completionDate;

  return {
    ...existing,
    status: updated.status, // lowercase, straight from the API
    completionDate: newDate,
    completionDateDisplay: formatCertificateDate(newDate),
    issueDate: newDate,
    school: schoolNameMap?.[updated.schoolId] || existing.school,
    __originalCert: { ...existing.__originalCert, ...updated },
  };
}

/**
 * Fetch all certificates
 */
export async function getAllCertificates(
  authToken: string
): Promise<Certificate[]> {
  const endpoint = endpoints.admin.certificates.all;

  try {
    logRequest("GET ALL CERTIFICATES", endpoint);

    const response = await apiRequest<CertificatesResponse>(endpoint, {
      method: "GET",
      authToken,
    });

    logResponse("GET ALL CERTIFICATES", response);

    return response.data;
  } catch (error) {
    logError("GET ALL CERTIFICATES", error);
    throw error;
  }
}

/**
 * Fetch pending certificates
 */
export async function getPendingCertificates(
  authToken: string
): Promise<Certificate[]> {
  const endpoint = endpoints.admin.certificates.pending;

  try {
    logRequest("GET PENDING CERTIFICATES", endpoint);

    const response = await apiRequest<CertificatesResponse>(endpoint, {
      method: "GET",
      authToken,
    });

    logResponse("GET PENDING CERTIFICATES", response);

    return response.data;
  } catch (error) {
    logError("GET PENDING CERTIFICATES", error);
    throw error;
  }
}

/**
 * Fetch certificate by ID
 */
export async function getCertificateById(
  certificateId: string,
  authToken: string
): Promise<Certificate> {
  const endpoint = endpoints.admin.certificates.byId(certificateId);

  try {
    logRequest("GET CERTIFICATE", endpoint);

    const response = await apiRequest<CertificateDetailResponse>(endpoint, {
      method: "GET",
      authToken,
    });

    logResponse("GET CERTIFICATE", response);

    return response.data;
  } catch (error) {
    logError("GET CERTIFICATE", error);
    throw error;
  }
}

/**
 * Approve certificate
 */
export async function approveCertificate(
  certificateId: string,
  authToken: string
): Promise<Certificate> {
  const endpoint = endpoints.admin.certificates.approve(certificateId);

  try {
    logRequest("APPROVE CERTIFICATE", endpoint, {});

    const response = await apiRequest<CertificateActionResponse>(endpoint, {
      method: "PUT",
      authToken,
      body: {},
    });

    logResponse("APPROVE CERTIFICATE", response);

    return response.data;
  } catch (error) {
    logError("APPROVE CERTIFICATE", error);
    throw error;
  }
}

/**
 * Reject certificate
 */
export async function rejectCertificate(
  certificateId: string,
  reason: string,
  authToken: string
): Promise<Certificate> {
  const endpoint = endpoints.admin.certificates.reject(certificateId);

  try {
    logRequest("REJECT CERTIFICATE", endpoint, { reason });

    const response = await apiRequest<CertificateActionResponse>(endpoint, {
      method: "PUT",
      authToken,
      body: {
        reason,
      },
    });

    logResponse("REJECT CERTIFICATE", response);

    return response.data;
  } catch (error) {
    logError("REJECT CERTIFICATE", error);
    throw error;
  }
}

/**
 * Revoke certificate
 */
export async function revokeCertificate(
  certificateId: string,
  reason: string,
  authToken: string
): Promise<Certificate> {
  const endpoint = endpoints.admin.certificates.revoke(certificateId);

  try {
    logRequest("REVOKE CERTIFICATE", endpoint, { adminNote: reason });

    const response = await apiRequest<CertificateActionResponse>(endpoint, {
      method: "PUT",
      authToken,
      body: {
        adminNote: reason,
      },
    });

    logResponse("REVOKE CERTIFICATE", response);
    return response.data;
  } catch (error) {
    logError("REVOKE CERTIFICATE", error);
    throw error;
  }
}

/**
 * Reissue certificate
 */
export async function reissueCertificate(
  certificateId: string,
  authToken: string
): Promise<Certificate> {
  const endpoint = endpoints.admin.certificates.reissue(certificateId);

  try {
    logRequest("REISSUE CERTIFICATE", endpoint, {});

    const response = await apiRequest<CertificateActionResponse>(endpoint, {
      method: "PUT",
      authToken,
      body: {},
    });

    logResponse("REISSUE CERTIFICATE", response);

    return response.data;
  } catch (error) {
    logError("REISSUE CERTIFICATE", error);
    throw error;
  }
}

/**
 * Format certificate for table display
 * ✅ FIXED: Now stores both formatted data and original cert for type safety
 */
export function formatCertificateForTable(
  cert: Certificate,
  schoolNameMap?: Record<string, string>
) {
  const studentName = cert.student?.user
    ? `${cert.student.user.firstName} ${cert.student.user.lastName}`.trim()
    : "—";

  const rawDate = cert.reviewedAt || cert.createdAt || "";

  return {
    id: cert.id,
    student: studentName,
    registryId: cert.id,
    course: cert.course?.name || "—",
    school: schoolNameMap?.[cert.schoolId] || cert.school?.name || "—",
    completionDate: rawDate, // raw ISO — used for filtering
    completionDateDisplay: formatCertificateDate(rawDate), // formatted — used for UI
    issueDate: rawDate,
    status: cert.status,
    studentFirstName: cert.student?.user?.firstName || "",
    studentLastName: cert.student?.user?.lastName || "",
    __originalCert: cert,
  };
}



/**
 * Get initials from certificate
 * ✅ FIXED: Accept certificate object properly typed
 */
export function getCertificateInitials(cert: Certificate): string {
  if (!cert.student?.user) return "?";
  const first = cert.student.user.firstName?.[0] || "";
  const last = cert.student.user.lastName?.[0] || "";
  return (first + last).toUpperCase() || "?";
}

/**
 * Get initials from formatted certificate record
 * ✅ NEW: Helper for formatted records
 */
export function getCertificateInitialsFromRecord(record: ReturnType<typeof formatCertificateForTable>): string {
  if (!record.studentFirstName && !record.studentLastName) return "?";

  const first = record.studentFirstName?.[0] || "";
  const last = record.studentLastName?.[0] || "";

  return (first + last).toUpperCase() || "?";
}