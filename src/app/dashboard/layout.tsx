// src/app/dashboard/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import { authOptions } from '../api/auth/[...nextauth]/auth';

export default async function DashboardLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const session = await getServerSession(authOptions);
 if (!session) {
  redirect('/login');
 }

 return <ClientLayoutWrapper session={session} status="authenticated">{children}</ClientLayoutWrapper>;
}