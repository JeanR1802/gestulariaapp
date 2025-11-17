// components/Greeting.tsx
"use client";
import React, { useState, useEffect } from "react";

interface GreetingProps {
  className?: string;
}

export default function Greeting({ className = "" }: GreetingProps) {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingMessage = "";

    if (hour >= 5 && hour < 12) {
      greetingMessage = "Buenos días";
    } else if (hour >= 12 && hour < 20) {
      greetingMessage = "Buenas tardes";
    } else {
      greetingMessage = "Buenas noches";
    }

    setGreeting(greetingMessage);
  }, []);

  if (!greeting) return null;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-2xl">👋</span>
      <span className="font-medium">{greeting}</span>
    </div>
  );
}
