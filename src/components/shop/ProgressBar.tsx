import { PROGRESS_LABEL, PROGRESS_VALUE } from '@/constants/constants';
import { Progress } from '@nextui-org/react';
import React from 'react';

interface Props {
  label: React.JSX.Element;
  value: number | undefined;
  maxValue: number;
  barColor: string;
}

const ProgressBar: React.FC<Props> = ({ label, value, maxValue, barColor }) => {
  return (
    <Progress
      size="lg"
      radius="sm"
      minValue={0}
      maxValue={maxValue}
      value={value}
      label={label}
      showValueLabel={true}
      classNames={{
        track: "drop-shadow-md border border-sepia h-2",
        indicator: `${barColor} h-2`,
        label: PROGRESS_LABEL,
        value: PROGRESS_VALUE,
      }}
      formatOptions={{ style: "decimal" }}
    />
  );
};

export default ProgressBar;
