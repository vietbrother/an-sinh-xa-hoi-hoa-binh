import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string) {
  // Regex to extract Tổ and Phường/Xã
  // Example: "Tổ 10, phường Phương Lâm"
  const patterns = [
    /(?:Tổ|Xóm|Thôn)\s+(\d+|\w+)/i,
    /(?:phường|xã|thị trấn)\s+([^,]+)/i
  ];
  
  const toMatch = address.match(/(?:Tổ|Xóm|Thôn)\s+([^,]+)/i);
  const phuongMatch = address.match(/(?:phường|xã|thị trấn)\s+([^,]+)/i);
  
  return {
    to: toMatch ? toMatch[1].trim() : "Khác",
    phuong: phuongMatch ? phuongMatch[1].trim() : "Khác"
  };
}
