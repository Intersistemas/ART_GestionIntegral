"use client";
import { signOut } from "next-auth/react";
import React from 'react';

interface SignOutButtonProps {
  icon: React.ReactNode;
}

export default function SignOutButton({ icon }: SignOutButtonProps) {
  return (
    <button onClick={() => signOut()} style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {icon}
    </button>
  );
}