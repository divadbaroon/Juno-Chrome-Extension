
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../../../../shadcn/lib/utils"
import { Button } from "../../../../shadcn/components/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../shadcn/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../shadcn/components/popover"

import { Profile } from "../../../../types"

interface ProfilePopoverProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    setValue: (value: string) => void;
    profiles: Profile[];
    handleProfileSelect: (profileName: string) => void;
  }
  
  export function ProfilePopover({ 
    open, 
    setOpen, 
    value, 
    setValue, 
    profiles, 
    handleProfileSelect 
  }: ProfilePopoverProps) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value || "Browse Profiles"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search profile..." />
            <CommandEmpty>No profile found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {profiles.map((profile) => (
                  <CommandItem
                    key={profile._id}
                    value={profile.name}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      handleProfileSelect(currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === profile.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {profile.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }