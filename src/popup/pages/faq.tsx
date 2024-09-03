"use client"

import '../../globals.css';

// UI components
import { FAQAccordion } from '../components/faq/accordian'; 
import { UserButton } from '@clerk/clerk-react';
import { BreadcrumbNav } from '../components/breadcrumb'; 
import { Separator } from "../../shadcn/components/separator";

export default function FaqPage() {
    return (
    <div className="root-container">

      {/* Account management button in top right */}
      <div className="flex justify-end items-center w-full mb-3">
        <UserButton afterSignOutUrl="/" showName={false} />
      </div>
    
      {/* Breadcrumb at top */}
      <BreadcrumbNav /> 
  
      <Separator className="my-4 -mt-1" />

      {/* Accordian containing all FAQ questions */}
      <FAQAccordion/>
    </div>
  );
}