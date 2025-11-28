// page_new.tsx — duplicate variant replaced with a redirect to the canonical sites list
import { redirect } from 'next/navigation';

export default function Page() {
  // Duplicate/experimental copy removed — redirect to canonical list page
  redirect('/dashboard/sites/list');
}
