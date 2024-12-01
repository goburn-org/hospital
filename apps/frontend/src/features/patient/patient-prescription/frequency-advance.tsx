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

const getFrequencyString = (frequency: Frequency) => {
  const earlyMorning = frequency.earlyMorning ?? 0;
  const morning = frequency.morning ?? 0;
  const afternoon = frequency.afternoon ?? 0;
  const evening = frequency.evening ?? 0;
  const night = frequency.night ?? 0;
  if (
    earlyMorning === 0 &&
    morning === 0 &&
    afternoon === 0 &&
    evening === 0 &&
    night === 0
  ) {
    return '';
  }
  return `${earlyMorning}-${morning}-${afternoon}-${evening}-${night}`;
};

export const FrequencyAdvance = ({
  onDone,
  running,
}: {
  onDone?: () => void;
  running: boolean;
}) => {
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
    setFrequency(getShift(formFrequency));
  }, [formFrequency]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Early Morning</p>
        <FrequencyButtons
          value={frequency.earlyMorning || 0}
          setValue={(value) => {
            const update = {
              ...frequency,
              earlyMorning: value,
            };
            if (running) {
              const frequencyString = getFrequencyString(update);
              setValue('frequency', frequencyString);
            }
            setFrequency(update);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Morning</p>
        <FrequencyButtons
          value={frequency.morning || 0}
          setValue={(value) => {
            const update = {
              ...frequency,
              morning: value,
            };
            if (running) {
              const frequencyString = getFrequencyString(update);
              setValue('frequency', frequencyString);
            }
            setFrequency(update);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Afternoon</p>
        <FrequencyButtons
          value={frequency.afternoon || 0}
          setValue={(value) => {
            const update = {
              ...frequency,
              afternoon: value,
            };
            if (running) {
              const frequencyString = getFrequencyString(update);
              setValue('frequency', frequencyString);
            }
            setFrequency(update);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Evening</p>
        <FrequencyButtons
          value={frequency.evening || 0}
          setValue={(value) => {
            const update = {
              ...frequency,
              evening: value,
            };
            if (running) {
              const frequencyString = getFrequencyString(update);
              setValue('frequency', frequencyString);
            }
            setFrequency(update);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-gray-600">Night</p>
        <FrequencyButtons
          value={frequency.night || 0}
          setValue={(value) => {
            const update = {
              ...frequency,
              night: value,
            };
            if (running) {
              const frequencyString = getFrequencyString(update);
              setValue('frequency', frequencyString);
            }
            setFrequency(update);
          }}
        />
      </div>
      {!running ? (
        <div className="flex flex-col gap-1">
          <div className="flex justify-end">
            <button
              type="button"
              className="btn-primary btn-small"
              onClick={(e) => {
                onDone?.();
                e.preventDefault();
                const frequencyString = `${frequency.earlyMorning}-${frequency.morning}-${frequency.afternoon}-${frequency.evening}-${frequency.night}`;
                setValue('frequency', frequencyString);
              }}
            >
              Add
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
