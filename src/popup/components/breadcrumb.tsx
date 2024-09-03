import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../shadcn/components/breadcrumb";
import { Link } from "react-router-dom";

export function BreadcrumbNav() {
  return (
    <Breadcrumb className="mb-2 -mt-6 text-[#373737]">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/home" className="text-[#636363] hover:text-[#373737]/80">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-[#636363]" />
        <BreadcrumbItem>
          <Link to="/settings" className="text-[#636363] hover:text-[#373737]/80">Configuration</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-[#636363]" />
        <BreadcrumbItem>
          <Link to="/faq" className="text-[#636363] hover:text-[#373737]/80">FAQ</Link>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

