import { CreatePatientPrescriptionRequest, Maybe } from '@hospital/shared';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { classNames } from '../../../utils/classNames';

const FrequencyButtons = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) => (
  <div className="flex gap-2">
    {[0.5, 1, 1.5, 2, 3].map((v) => (
      <button
        key={v}
        tabIndex={-1}
        className={classNames(
          value === v ? 'btn-primary' : 'btn-outline',
          'btn-small',
        )}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setValue(v);
        }}
      >
        {v}
      </button>
    ))}
  </div>
);

type Frequency = {
  earlyMorning?: number;
  morning?: number;
  afternoon?: number;
  evening?: number;
  night?: number;
};

const getShift = (raw: Maybe<string>): Frequency => {
  if (!raw) {
    return {
      earlyMorning: 0,
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0,
    };
  }
  const splitRaw = raw.split('-');
  const [earlyMorning, morning, afternoon, evening, night] =
    splitRaw.length === 5
      ? splitRaw
      : [0, splitRaw[0], splitRaw[1], 0, splitRaw[2]];
  return {
    earlyMorning: +earlyMorning,
    morning: +morning,
    afternoon: +afternoon,
    evening: +evening,
    night: +night,
  };
};

export const FrequencyAdvance = () => {
  const { watch, setValue } =
    useFormContext<CreatePatientPrescriptionRequest[number]>();
  const [frequency, setFrequency] = useState<Frequency>({
    earlyMorning: undefined,
    morning: undefined,
    afternoon: undefined,
    evening: undefined,
    night: undefined,
  });
  const formFrequency = watch('frequency');
  useEffect(() => {
    console.log(formFrequency);
    setFrequency(getShift(formFrequency));
  }, [formFrequency]);
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-black">Early Morning</p>
        <FrequencyButtons
          value={frequency.earlyMorning || 0}
          setValue={(value) => {
            setFrequency({
              ...frequency,
              earlyMorning: value,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-black">Morning</p>
        <FrequencyButtons
          value={frequency.morning || 0}
          setValue={(value) => {
            setFrequency({
              ...frequency,
              morning: value,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-black">Afternoon</p>
        <FrequencyButtons
          value={frequency.afternoon || 0}
          setValue={(value) => {
            setFrequency({
              ...frequency,
              afternoon: value,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-black">Evening</p>
        <FrequencyButtons
          value={frequency.evening || 0}
          setValue={(value) => {
            setFrequency({
              ...frequency,
              evening: value,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-black">Night</p>
        <FrequencyButtons
          value={frequency.night || 0}
          setValue={(value) => {
            setFrequency({
              ...frequency,
              night: value,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-end">
          <button
            type="button"
            className="btn-primary btn-small"
            onClick={(e) => {
              e.preventDefault();
              const frequencyString = `${frequency.earlyMorning}-${frequency.morning}-${frequency.afternoon}-${frequency.evening}-${frequency.night}`;
              setValue('frequency', frequencyString);
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
