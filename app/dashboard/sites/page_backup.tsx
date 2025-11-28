// page_backup.tsx — duplicate backup file replaced with a server redirect to canonical page
import { redirect } from 'next/navigation';

export default function Page() {
  // This file was a duplicate/backup. Redirect to the canonical page to avoid duplicate content.
  redirect('/dashboard/sites');
}
