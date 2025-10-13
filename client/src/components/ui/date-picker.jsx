import { format } from 'date-fns';
import * as React from 'react';
import { FiCalendar } from 'react-icons/fi';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '~/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { cn } from '~/lib/utils';

export function DatePicker({ value, onChange, placeholder = 'Pick a date' }) {
  const [date, setDate] = React.useState(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = selectedDate => {
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <FiCalendar className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={date => date > new Date() || date < new Date('1900-01-01')}
        />
      </PopoverContent>
    </Popover>
  );
}

// Specific Date of Birth Picker with Year/Month dropdowns
export function DateOfBirthPicker({
  value,
  onChange,
  placeholder = 'Select your date of birth'
}) {
  const [date, setDate] = React.useState(value);
  const [month, setMonth] = React.useState(
    value ? new Date(value) : new Date()
  );

  React.useEffect(() => {
    setDate(value);
    if (value) {
      setMonth(new Date(value));
    }
  }, [value]);

  const handleSelect = selectedDate => {
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  const handleMonthChange = newMonth => {
    setMonth(newMonth);
  };

  // Generate years from current year back to 1900
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <FiCalendar className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='p-3 space-y-3'>
          {/* Year and Month Dropdowns */}
          <div className='flex gap-2'>
            <Select
              value={month.getMonth().toString()}
              onValueChange={value => {
                const newMonth = new Date(month);
                newMonth.setMonth(parseInt(value));
                handleMonthChange(newMonth);
              }}
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Month' />
              </SelectTrigger>
              <SelectContent>
                {months.map((monthName, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month.getFullYear().toString()}
              onValueChange={value => {
                const newMonth = new Date(month);
                newMonth.setFullYear(parseInt(value));
                handleMonthChange(newMonth);
              }}
            >
              <SelectTrigger className='w-[110px]'>
                <SelectValue placeholder='Year' />
              </SelectTrigger>
              <SelectContent className='max-h-[200px]'>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode='single'
            selected={date}
            onSelect={handleSelect}
            month={month}
            onMonthChange={handleMonthChange}
            disabled={date =>
              date > new Date() || date < new Date('1900-01-01')
            }
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
