import { useState } from 'react';
import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input';
import type { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronDown, Globe } from 'lucide-react';

type FlagIcon = React.ComponentType<{ country?: Country; label?: string }>;

type CountrySelectProps = {
  value?: Country;
  onChange: (value: Country) => void;
  options: { value?: Country; label: string }[];
  iconComponent: FlagIcon;
  disabled?: boolean;
};

/** Searchable country picker (by name) used as react-phone-number-input's dropdown. */
function CountrySelect({ value, onChange, options, iconComponent: Icon, disabled }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Pilih negara"
          className="flex items-center gap-1 rounded-md px-1 py-0.5 outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        >
          {value ? <Icon country={value} label={value} /> : <Globe className="h-4 w-4 text-muted-foreground" />}
          <ChevronDown className="h-4 w-4 text-foreground/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Cari negara..." />
          <CommandList>
            <CommandEmpty>Negara tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((o) => o.value)
                .map((o) => (
                  <CommandItem
                    key={o.value}
                    value={o.label}
                    onSelect={() => {
                      onChange(o.value as Country);
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <Icon country={o.value} label={o.label} />
                    <span className="flex-1 truncate">{o.label}</span>
                    <span className="text-xs text-muted-foreground">+{getCountryCallingCode(o.value as Country)}</span>
                    <Check className={`h-4 w-4 ${value === o.value ? 'opacity-100' : 'opacity-0'}`} />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
};

/** Site-wide WhatsApp number field: E.164 value, flags, searchable country dropdown. */
export default function PhoneField({ value, onChange, ...rest }: PhoneFieldProps) {
  return (
    <PhoneInput
      international
      defaultCountry="ID"
      countrySelectComponent={CountrySelect}
      value={value}
      onChange={(v) => onChange(v || '')}
      {...rest}
    />
  );
}
