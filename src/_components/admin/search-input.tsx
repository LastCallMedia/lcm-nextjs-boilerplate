import type { RefObject } from "react";
import { Input } from "~/_components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onPageReset: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  ariaLabel: string;
}

export function SearchInput({
  placeholder,
  value,
  onChange,
  onPageReset,
  inputRef,
  ariaLabel,
}: SearchInputProps) {
  return (
    <div className="relative max-w-sm">
      <SearchIcon
        className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onPageReset(); // Reset to first page when searching
        }}
        className="cursor-text pl-9"
        aria-label={ariaLabel}
      />
    </div>
  );
}
