# Security Specification — Pendidikan Pancasila SMANDE Firestore

## 1. Data Invariants
1. **Default Deny**: All unmatched Firestore paths are denied by default (`match /{document=**} { allow read, write: if false; }`).
2. **Attendance Record Integrity (`/attendance/{recordId}`)**:
   - `recordId` must match `^[a-zA-Z0-9_-]+$` and length `<= 128`.
   - Required fields: `studentName`, `className`, `grade`, `dayName`, `dateStr`, `timeStr`, `lessonPeriod`, `status`, `note`, `createdAt`.
   - No shadow fields allowed (`keys().hasOnly(...)`).
   - `className` must strictly match `^(X|XI|XII)-([1-9]|10)$`.
   - `grade` must be `'X'`, `'XI'`, or `'XII'`.
   - `status` must be `'HADIR'`, `'IJIN'`, or `'ALPA'`.
   - `createdAt` must equal `request.time`.
   - Public visitors may read (`get`, `list`) and submit (`create`) strictly validated attendance records; updates and deletions are restricted to authenticated admins (`isAdmin()`).
3. **PII Isolation (`/users/{userId}`)**:
   - `email` and account data are readable and writable ONLY by the owning verified user (`request.auth.uid == userId && request.auth.token.email_verified == true`) or `isAdmin()`.
   - Blanket `list` on `/users` is strictly forbidden unless `isAdmin()`.
   - Users cannot escalate their own `role` field (`role == 'siswa'` on self-create; immutable on user update).
4. **Admin Collection (`/admins/{adminUid}`)**:
   - Readable and writable ONLY by verified bootstrapped admin (`munawarrois81@guru.sma.belajar.id` with `email_verified == true`) or existing admins.

## 2. "Dirty Dozen" Attack Payloads (Must Return PERMISSION_DENIED)
1. **Shadow Field Injection on `/attendance/{id}`**: Creating an attendance record with an extra `{ isVerified: true }` field.
2. **Oversized `studentName` Resource Exhaustion**: Creating an attendance record with a 5,000-char `studentName`.
3. **Invalid Class Format**: Creating an attendance record with `className: "XIII-99"`.
4. **Invalid Attendance Status**: Creating an attendance record with `status: "BOLOS"`.
5. **Client-Spoofed Timestamp**: Creating an attendance record with a custom client timestamp instead of `request.time`.
6. **ID Poisoning**: Creating `/attendance/bad..id..with..spaces` exceeding regex `^[a-zA-Z0-9_-]+$`.
7. **Unauthenticated Attendance Delete**: Unauthenticated visitor attempting `delete` on `/attendance/{id}`.
8. **Unauthenticated Attendance Tampering**: Unauthenticated visitor attempting `update` on `/attendance/{id}`.
9. **Cross-User PII Read**: Authenticated user A reading `/users/{userB}`.
10. **Blanket User List Scraping**: Non-admin authenticated user executing `list` on `/users`.
11. **Self-Assigned Privilege Escalation**: Authenticated user creating `/users/{uid}` with `role: "guru"` or updating `role`.
12. **Unverified Email Admin Spoof**: User with unverified email token attempting admin write on `/admins/{uid}`.
