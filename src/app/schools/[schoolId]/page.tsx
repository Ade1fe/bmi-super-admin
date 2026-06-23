// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   ArrowLeft,
//   ArrowUpRight,
//   Building2,
//   ChevronRight,
//   TrendingUp,
// } from "lucide-react";
// import { AppShell } from "@/components/app-shell";
// import { apiRequest, endpoints } from "@/lib/endpoints";
// import { parseSchoolSummary, type SchoolSummary } from "@/lib/backend-models";
// import { useAuthSession } from "@/lib/auth-session";

// function buildSchoolCode(school: SchoolSummary) {
//   const normalizedId = school.id.replace(/-/g, "").slice(0, 8).toUpperCase();
//   return normalizedId ? `SCH-${normalizedId}` : "SCH-UNKNOWN";
// }

// function StatCard({
//   label,
//   value,
//   change = "Live",
// }: {
//   label: string;
//   value: string | number;
//   change?: string;
// }) {
//   return (
//     <div className="rounded-[14px] border border-[#e7eafb] bg-white px-6 py-8 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
//       <p className="text-[15px] font-medium text-[#334768]">{label}</p>
//       <div className="mt-7 flex items-end justify-between gap-3">
//         <p className="text-[34px] font-extrabold tracking-[-0.05em] text-[#16345d]">{value}</p>
//         <span className="inline-flex items-center gap-1 text-[14px] font-bold text-[#14985b]">
//           <ArrowUpRight className="h-4 w-4" strokeWidth={2.3} />
//           {change}
//         </span>
//       </div>
//     </div>
//   );
// }

// export default function SchoolDetailsPage() {
//   const params = useParams();
//   const schoolId = Array.isArray(params?.schoolId) ? params.schoolId[0] : params?.schoolId;
//   const { session } = useAuthSession();
//   const [school, setSchool] = useState<SchoolSummary | null>(null);
//   const [errorMessage, setErrorMessage] = useState("Loading school details...");
//   const [isLoading, setIsLoading] = useState(true);
//   const [schoolData, setSchoolData] = useState<any>(null);

//   useEffect(() => {
//     if (!schoolId) {
//       setErrorMessage("No school ID provided.");
//       setIsLoading(false);
//       return;
//     }

//     if (!session?.token) {
//       setErrorMessage("Sign in to load school details.");
//       setIsLoading(false);
//       return;
//     }

//     const loadSchool = async () => {
//       setIsLoading(true);
//       setErrorMessage("Loading school details...");

//       try {
//         const response = await apiRequest(endpoints.admin.schoolById(schoolId), {
//           authToken: session.token,
//           cache: "no-store",
//         });

//      const payload =
//   response &&
//   typeof response === "object" &&
//   !Array.isArray(response)
//     ? (
//         (response as any).data?.school ??
//         (response as any).school ??
//         (response as any).data ??
//         response
//       )
//     : response;


    
// console.log("Raw response:", response);
// console.log("Payload being parsed:", payload);


// const data = (response as any).data;

// setSchoolData(data);

// const parsedSchool = parseSchoolSummary(data.school);
// setSchool(parsedSchool);
//         // const parsedSchool = parseSchoolSummary(payload);

//         if (!parsedSchool) {
//           throw new Error("School details could not be parsed.");
//         }

//         setSchool(parsedSchool);
//         setErrorMessage("");
//       } catch (error) {
//         setErrorMessage(
//           error instanceof Error
//             ? error.message
//             : "Unable to load the selected school."
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     void loadSchool();
//   }, [schoolId, session?.token]);

//   return (
//     <AppShell
//       title={
//         <div className="flex items-center gap-3">
//           <Link href="/schools" className="text-[#223b61]">
//             <ArrowLeft className="h-6 w-6" strokeWidth={2.2} />
//           </Link>
//           <span>{school?.name ?? "School Details"}</span>
//         </div>
//       }
//       activeSection="schools"
//     >
//       <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
//         {isLoading ? (
//           <div className="rounded-[18px] border border-[#e4e8f7] bg-white px-6 py-10 text-center text-[15px] text-[#5b6d8b] shadow-[0_16px_34px_rgba(171,185,223,0.08)]">
//             Loading school details...
//           </div>
//         ) : errorMessage ? (
//           <div className="rounded-[18px] border border-[#ffd7df] bg-[#fff3f3] px-6 py-10 text-center text-[15px] text-[#b53a4c] shadow-[0_16px_34px_rgba(239,31,79,0.12)]">
//             {errorMessage}
//           </div>
//         ) : school ? (
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)] sm:p-8">
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-4">
//                   <div className="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#4e7c5f] text-white">
//                     <span className="text-[24px] font-bold">
//                       {school.name
//                         .split(" ")
//                         .map((w) => w[0])
//                         .join("")
//                         .slice(0, 2)}
//                     </span>
//                   </div>
//                   <div>
//                     <h1 className="text-[24px] font-bold text-[#182c4e]">{school.name}</h1>
//                     <div className="mt-2 space-y-1 text-[14px] text-[#7a88a2]">
//                       <p>{school.email}</p>
//                       {school.address ? <p>{school.address}</p> : null}
//                     </div>
//                     <p className="mt-3 text-[14px] text-[#7a88a2]">
//                       {school.isActive ? "✓ Active Entity" : "Inactive"}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3">
//                   <button className="rounded-[8px] border border-[#d1e0d6] bg-white px-4 py-3 text-[14px] font-semibold text-[#4e7c5f] hover:bg-[#f6faf8]">
//                     Edit Profile
//                   </button>
//                   <button className="rounded-[8px] border border-[#14985b] bg-[#14985b] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#0d6a46]">
//                     + Add New Student
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
// <StatCard
//   label="TOTAL STUDENTS"
//   value={schoolData?.stats?.totalStudents ?? 0}
// />

// <StatCard
//   label="ACTIVE STUDENTS"
//   value={schoolData?.stats?.activeStudents ?? 0}
// />

// <StatCard
//   label="COURSE COMPLETION"
//   value={`${schoolData?.stats?.courseCompletion ?? 0}%`}
// />

// <StatCard
//   label="LEARNING ACTIVITY"
//   value={schoolData?.stats?.learningActivity ?? "N/A"}
// />
//             </div>

//             {/* Main Content Grid */}
//             <div className="grid gap-6 xl:grid-cols-3">
//               {/* Left Column - Assigned Courses */}
//               <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)] xl:col-span-2">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-[16px] font-bold text-[#182c4e]">Assigned Courses</h2>
//                   <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
//                     View all
//                   </button>
//                 </div>

//                 {/* <div className="mt-5 space-y-3">
//                   <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#dfe5ff]">
//                         <TrendingUp className="h-5 w-5 text-[#4e63dd]" strokeWidth={2} />
//                       </div>
//                       <div>
//                         <p className="text-[15px] font-semibold text-[#182c4e]">
//                           Computer Science 101
//                         </p>
//                         <p className="text-[13px] text-[#7a88a2]">3 Modules • 250 Students Enrolled</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
//                   </div>

//                   <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ffe5d5]">
//                         <span className="text-[16px] font-bold text-[#f97316]">∑</span>
//                       </div>
//                       <div>
//                         <p className="text-[15px] font-semibold text-[#182c4e]">
//                           Advanced Mathematics
//                         </p>
//                         <p className="text-[13px] text-[#7a88a2]">8 Modules • 323 Students Enrolled</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
//                   </div>

//                   <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#f0e5ff]">
//                         <span className="text-[16px] font-bold text-[#8b5cf6]">📚</span>
//                       </div>
//                       <div>
//                         <p className="text-[15px] font-semibold text-[#182c4e]">English Literature</p>
//                         <p className="text-[13px] text-[#7a88a2]">6 Modules • 193 Students Enrolled</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
//                   </div>

//                   <div className="flex items-center justify-between rounded-[10px] border border-[#e7eafb] bg-[#f8fbff] p-4 hover:bg-[#f0f5ff]">
//                     <div className="flex items-center gap-3">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#ffe5f0]">
//                         <span className="text-[16px] font-bold text-[#ec4899]">🏛️</span>
//                       </div>
//                       <div>
//                         <p className="text-[15px] font-semibold text-[#182c4e]">Government Studies</p>
//                         <p className="text-[13px] text-[#7a88a2]">6 Modules • 450 Students Enrolled</p>
//                       </div>
//                     </div>
//                     <ChevronRight className="h-5 w-5 text-[#b0bace]" strokeWidth={2} />
//                   </div>
//                 </div> */}

//                 {schoolData?.assignedCourses?.length ? (
//   schoolData.assignedCourses.map((course: any) => (
//     <div key={course.id}>
//       <p>{course.title}</p>
//     </div>
//   ))
// ) : (
//   <p className="text-sm text-gray-500">
//     No assigned courses.
//   </p>
// )}
//               </div>

//               {/* Right Column - Current Plan */}
//               <div className="rounded-[16px] border border-[#14985b] bg-[#14985b] p-6 text-white shadow-[0_16px_34px_rgba(20,152,91,0.2)]">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-[16px] font-bold">CURRENT PLAN</h2>
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
//                     <Building2 className="h-5 w-5" strokeWidth={2} />
//                   </div>
//                 </div>

//                 <div className="mt-8 space-y-6">
//                   <div>
//                     <p className="text-[14px] font-medium text-white/80">Plan Name</p>
//                     <p className="mt-2 text-[22px] font-bold">Premium Enterprise</p>
//                   </div>

//                   <div>
//                     <p className="text-[14px] font-medium text-white/80">Status:</p>
//                     <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold">
//                       <span className="inline-block h-2 w-2 rounded-full bg-white" />
//                       Active
//                     </p>
//                   </div>

//                   <div>
//                     <p className="text-[14px] font-medium text-white/80">Expires:</p>
//                     <p className="mt-1 text-[15px] font-semibold">Dec 31, 2024</p>
//                   </div>

//                   <div>
//                     <p className="text-[14px] font-medium text-white/80">Auto-renew:</p>
//                     <p className="mt-1 text-[15px] font-semibold">On</p>
//                   </div>

//                   <button className="w-full rounded-[10px] border border-white bg-white px-4 py-3 text-[16px] font-semibold text-[#14985b] hover:bg-white/90">
//                     Manage Subscription
//                   </button>
//                 </div>
//               </div>

//               {schoolData?.currentPlan ? (
//   <>
//     <p>{schoolData.currentPlan.name}</p>
//     ...
//   </>
// ) : (
//   <p>No active subscription plan.</p>
// )}
//             </div>

//             {/* Bottom Row */}
//             <div className="grid gap-6 xl:grid-cols-2">
//               {/* Top Students */}
//               <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-[16px] font-bold text-[#182c4e]">Top Students</h2>
//                   <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
//                     See Rankings
//                   </button>
//                 </div>

//                 <div className="mt-5 space-y-3">
//                   {[...Array(6)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="flex items-center justify-between rounded-[8px] p-3 hover:bg-[#f6f8fd]"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5e9f7] font-semibold text-[#5a6986]">
//                           {i + 1}
//                         </div>
//                         <div>
//                           <p className="text-[14px] font-semibold text-[#182c4e]">
//                             Sarah Jenkins
//                           </p>
//                           <p className="text-[12px] text-[#b0bace]">AI/iPM</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-[14px] font-bold text-[#182c4e]">88%</p>
//                         <p className="text-[12px] text-[#b0bace]">Avg Progress</p>
//                       </div>
//                     </div>
//                   ))}


//                   {schoolData?.topStudents?.map((student: any, index: number) => (
//   <div key={student.id}>
//     <p>
//       {student.user.firstName} {student.user.lastName}
//     </p>
//   </div>
// ))}
//                 </div>
//               </div>

//               {/* Learning Activity */}
//               <div className="rounded-[16px] border border-[#e7eafb] bg-white p-6 shadow-[0_16px_34px_rgba(171,185,223,0.06)]">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-[16px] font-bold text-[#182c4e]">Learning Activity</h2>
//                   <button className="text-[14px] font-semibold text-[#1f64d0] hover:text-[#1550a8]">
//                     View Stats
//                   </button>
//                 </div>

//                 <div className="mt-6 flex items-end justify-between gap-2">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
//                     <div key={day} className="flex flex-col items-center gap-2">
//                       <div
//                         className="w-8 rounded-[4px] bg-[#c4dcd4]"
//                         style={{ height: `${[40, 50, 30, 60, 45, 35, 55][i]}px` }}
//                       />
//                       <p className="text-[12px] text-[#b0bace]">{day}</p>
//                     </div>
//                   ))}
//                 </div>

//                 <p className="mt-6 text-[13px] text-[#9aa7bf]">
//                   Learning peaks on Wednesdays with 2,450+ total interactions.
//                 </p>
//               </div>


//               {schoolData?.learningActivityData?.map(
//   (height: number, i: number) => (
//     <div key={i}>
//       <div
//         className="w-8 rounded bg-[#c4dcd4]"
//         style={{
//           height: `${height / 5}px`,
//         }}
//       />
//     </div>
//   )
// )}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     </AppShell>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Loader2,
  TrendingUp,
  UserPlus,
  X,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { apiRequest, endpoints } from "@/lib/endpoints";
import { parseSchoolSummary, type SchoolSummary } from "@/lib/backend-models";
import { useAuthSession } from "@/lib/auth-session";
import {
  adminCreateStudent,
  type AdminCreateStudentResponse,
} from "@/lib/students-api";

// ─── Stat card ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change = "Live",
}: {
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[#e7f3ea] bg-white px-6 py-8 shadow-[0_16px_34px_rgba(20,152,91,0.06)]">
      <p className="text-[14px] font-medium text-[#2f4f3f]">{label}</p>

      <div className="mt-7 flex items-end justify-between gap-3">
        <p className="text-[34px] font-extrabold tracking-[-0.05em] text-[#0f3d2e]">
          {value}
        </p>

        <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#14985b]">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2.3} />
          {change}
        </span>
      </div>
    </div>
  );
}

// ─── Modal close button ────────────────────────────────────────────────

function ModalClose({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3f6fb] text-[#7e8ba5] transition-colors hover:bg-[#e8edf5]"
    >
      <X className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

// ─── Add Student Modal (school-scoped, school_id is fixed) ───────────────

function AddStudentModal({
  schoolId,
  onClose,
  onSuccess,
  authToken,
}: {
  schoolId: string;
  onClose: () => void;
  onSuccess: () => void;
  authToken: string;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdResult, setCreatedResult] = useState<AdminCreateStudentResponse | null>(null);

  async function handleSubmit() {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await adminCreateStudent(
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          school_id: schoolId,
        },
        authToken,
      );
      setCreatedResult(res);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (createdResult) {
    return (
      <>
        <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-[500px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
            <ModalClose onClose={onClose} label="Close" />
            <div className="px-6 py-8 pr-20 sm:px-8">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dff6eb] text-[#0f8751]">
                  <UserPlus className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <div>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#0f3d2e]">
                    Student Created!
                  </h2>
                  <p className="mt-1 text-[14px] text-[#6b8a7a]">
                    {createdResult.user.firstName} {createdResult.user.lastName} has been registered.
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-[12px] border border-[#d5ede0] bg-[#f3fbf7] px-5 py-5">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-[#14985b]">
                  Login Credentials
                </p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[14px] font-semibold text-[#4b6278]">Email</span>
                    <span className="text-[14px] font-bold text-[#0f3d2e]">
                      {createdResult.user.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[14px] font-semibold text-[#4b6278]">Temporary Password</span>
                    <code className="rounded-[6px] bg-[#e7f5ee] px-3 py-1 text-[14px] font-bold text-[#0f8751]">
                      {createdResult.password}
                    </code>
                  </div>
                </div>
                <p className="mt-4 text-[13px] text-[#7a8fa5]">
                  Share these credentials with the student. They should change their password after first login.
                </p>
              </div>
            </div>
            <div className="border-t border-[#edf0f7] bg-[#f7fbff] px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-12 w-full items-center justify-center rounded-[10px] bg-[#14985b] text-[16px] font-semibold text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Create form
  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#1f2430]/55 backdrop-blur-[1.5px]" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[520px] overflow-hidden rounded-[16px] bg-white shadow-[0_34px_90px_rgba(15,25,51,0.24)]">
          <ModalClose onClose={onClose} label="Close add student modal" />

          <div className="border-b border-[#edf0f7] px-6 py-6 pr-20 sm:px-8">
            <h2 className="text-[22px] font-extrabold tracking-[-0.04em] text-[#0f3d2e]">
              Add New Student
            </h2>
            <p className="mt-1 text-[14px] text-[#6b8a7a]">
              Register a new student for this school. A password will be auto-generated.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8">
            {error && (
              <p className="rounded-[10px] bg-[#fff0f3] px-4 py-3 text-[14px] text-[#c52c50]">
                {error}
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-[14px] font-bold text-[#0f3d2e]">First Name</span>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Michael"
                  className="h-12 w-full rounded-[10px] border border-[#dce3f2] px-4 text-[15px] text-[#274267] outline-none focus:border-[#14985b] placeholder:text-[#98a2b6]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[14px] font-bold text-[#0f3d2e]">Last Name</span>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Smith"
                  className="h-12 w-full rounded-[10px] border border-[#dce3f2] px-4 text-[15px] text-[#274267] outline-none focus:border-[#14985b] placeholder:text-[#98a2b6]"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-[14px] font-bold text-[#0f3d2e]">Email Address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. michael.smith@school.edu"
                className="h-12 w-full rounded-[10px] border border-[#dce3f2] px-4 text-[15px] text-[#274267] outline-none focus:border-[#14985b] placeholder:text-[#98a2b6]"
              />
            </label>
          </div>

          <div className="grid gap-3 border-t border-[#edf0f7] bg-[#f7fbff] px-6 py-4 sm:grid-cols-2 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#dce3f2] bg-white px-6 text-[15px] font-semibold text-[#3e5172]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !firstName.trim() || !lastName.trim() || !email.trim()}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#14985b] px-6 text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating…" : "Create Student"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function SchoolDetailsPage() {
  const params = useParams();
  const schoolId = Array.isArray(params?.schoolId)
    ? params.schoolId[0]
    : params?.schoolId;

  const { session } = useAuthSession();
  const authToken = session?.token ?? "";

  const [school, setSchool] = useState<SchoolSummary | null>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Loading school details...");
  const [showAddStudent, setShowAddStudent] = useState(false);

  async function loadSchool() {
    if (!schoolId || !session?.token) return;
    try {
      setIsLoading(true);

      const response = await apiRequest(
        endpoints.admin.schoolById(schoolId),
        {
          authToken: session.token,
          cache: "no-store",
        }
      );

      const data =
        (response as any)?.data?.school ??
        (response as any)?.school ??
        (response as any)?.data ??
        response;

      setSchoolData((response as any)?.data ?? response);

      const parsed = parseSchoolSummary(data);

      if (!parsed) throw new Error("Unable to parse school");

      setSchool(parsed);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load school"
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!schoolId) {
      setErrorMessage("No school ID provided.");
      setIsLoading(false);
      return;
    }

    if (!session?.token) {
      setErrorMessage("Sign in to load school details.");
      setIsLoading(false);
      return;
    }

    loadSchool();
  }, [schoolId, session?.token]);

  return (
    <AppShell
      title={
        <div className="flex items-center gap-3">
          <Link href="/schools" className="text-[#14985b]">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <span className="text-[#0f3d2e] font-semibold">
            {school?.name ?? "School Details"}
          </span>
        </div>
      }
      activeSection="schools"
    >
      {/* ── Add Student Modal ── */}
      {showAddStudent && schoolId && (
        <AddStudentModal
          schoolId={schoolId}
          authToken={authToken}
          onClose={() => setShowAddStudent(false)}
          onSuccess={() => {
            loadSchool();
          }}
        />
      )}

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {isLoading ? (
          <div className="rounded-[16px] border border-[#dff3e6] bg-white px-6 py-10 text-center text-[#2f4f3f]">
            Loading school details...
          </div>
        ) : errorMessage ? (
          <div className="rounded-[16px] border border-[#ffd6db] bg-[#fff5f6] px-6 py-10 text-center text-[#b4232f]">
            {errorMessage}
          </div>
        ) : school ? (
          <div className="space-y-6">

            {/* HEADER */}
            <div className="rounded-[16px] border border-[#e7f3ea] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-4">

                  <div className="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#14985b] text-white">
                    <span className="text-[22px] font-bold">
                      {school.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>

                  <div>
                    <h1 className="text-[24px] font-bold text-[#0f3d2e]">
                      {school.name}
                    </h1>

                    <div className="mt-2 text-[14px] text-[#4c6b5d]">
                      <p>{school.email}</p>
                      {school.address && <p>{school.address}</p>}
                    </div>

                    <p className="mt-3 text-[13px] text-[#14985b] font-semibold">
                      {school.isActive ? "● Active School" : "● Inactive"}
                    </p>
                  </div>

                </div>

                <div className="flex gap-3">
                  <button className="rounded-[8px] border border-[#14985b] px-4 py-3 text-[14px] font-semibold text-[#14985b] hover:bg-[#f2fbf6]">
                    Edit Profile
                  </button>

                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="rounded-[8px] bg-[#14985b] px-4 py-3 text-[14px] font-semibold text-white hover:bg-[#0f6a45]"
                  >
                    + Add Student
                  </button>
                </div>

              </div>
            </div>

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="TOTAL STUDENTS" value={schoolData?.stats?.totalStudents ?? 0} />
              <StatCard label="ACTIVE STUDENTS" value={schoolData?.stats?.activeStudents ?? 0} />
              <StatCard label="COURSE COMPLETION" value={`${schoolData?.stats?.courseCompletion ?? 0}%`} />
              <StatCard label="LEARNING ACTIVITY" value={schoolData?.stats?.learningActivity ?? "0"} />
            </div>

            <div className="grid gap-6 xl:grid-cols-3">

              {/* COURSES */}
              <div className="xl:col-span-2 rounded-[16px] border border-[#e7f3ea] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#0f3d2e]">
                    Assigned Courses
                  </h2>
                  <button className="text-[#14985b] font-medium">
                    View all
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {schoolData?.assignedCourses?.length ? (
                    schoolData.assignedCourses.map((course: any) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between rounded-[10px] border border-[#e7f3ea] bg-[#f6fbf8] p-4 hover:bg-[#eef8f2]"
                      >
                        <div className="flex items-center gap-3">
                          <TrendingUp className="text-[#14985b]" />
                          <p className="text-[#0f3d2e] font-medium">
                            {course.title}
                          </p>
                        </div>
                        <ChevronRight className="text-[#14985b]" />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6b8a7a]">
                      No assigned courses yet.
                    </p>
                  )}
                </div>
              </div>

              {/* PLAN */}
              <div className="rounded-[16px] border border-[#14985b] bg-[#14985b] p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-bold">CURRENT PLAN</h2>
                  <Building2 />
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-sm text-white/70">Plan Name</p>
                    <p className="text-xl font-bold">
                      {schoolData?.currentPlan?.name ?? "No Plan"}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* STUDENTS + ACTIVITY */}
            <div className="grid gap-6 xl:grid-cols-2">

              {/* TOP STUDENTS */}
              <div className="rounded-[16px] border border-[#e7f3ea] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#0f3d2e]">
                    Top Students
                  </h2>
                </div>

                <div className="mt-5 space-y-3">
                  {schoolData?.topStudents?.length ? (
                    schoolData.topStudents.map((student: any, i: number) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between rounded-[10px] bg-[#f6fbf8] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14985b] text-white font-bold">
                            {i + 1}
                          </div>

                          <div>
                            <p className="text-[#0f3d2e] font-medium">
                              {student.user.firstName} {student.user.lastName}
                            </p>
                            <p className="text-xs text-[#6b8a7a]">
                              Student
                            </p>
                          </div>
                        </div>

                        <p className="text-[#14985b] font-bold">
                          88%
                        </p>
                      </div>
                    ))
                  ) : (
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex justify-between p-3">
                        <p className="text-[#6b8a7a]">No student data</p>
                      </div>
                    ))
                  )}

                </div>
              </div>

              {/* ACTIVITY */}
              <div className="rounded-[16px] border border-[#e7f3ea] bg-white p-6">
                <h2 className="text-[16px] font-bold text-[#0f3d2e]">
                  Learning Activity
                </h2>

                <div className="mt-6 flex items-end justify-between">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d, i) => (
                      <div key={d} className="text-center">
                        <div
                          className="w-6 rounded bg-[#14985b]"
                          style={{
                            height: `${[40, 50, 30, 60, 45, 35, 55][i]}px`,
                          }}
                        />
                        <p className="text-xs text-[#6b8a7a]">{d}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
// a complete flow.