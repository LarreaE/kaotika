import { PROGRESS_LABEL, PROGRESS_VALUE } from '@/constants/constants';
import { Progress } from '@nextui-org/react';
import React from 'react';

interface Props {
  label: string | any;
  value: number | undefined;
  maxValue: number;
}

const ProgressBar: React.FC<Props> = ({ label, value, maxValue }) => {
  return (
    <Progress
      key={"p-1"}
      size="lg" 
      radius="sm"
      minValue={0}
      maxValue={maxValue}
      classNames={{
        track: "drop-shadow-md border border-sepia h-2",
        indicator: "bg-medievalSepia h-2",
        label: PROGRESS_LABEL,
        value: PROGRESS_VALUE,
      }}
      formatOptions={{style: "decimal"}}
      label={label}
      value={value}
      showValueLabel={true}
    />
  )
}

export default ProgressBar