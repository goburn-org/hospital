import { XMarkIcon } from '@heroicons/react/24/outline';
import { DetailedPatientVisit } from '@hospital/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { OutsideClick } from '../../../component/outside-click';
import { useVisitDrawer } from '../../../provider/patient-drawer-context-provider';
import { HttpService } from '../../../utils/http';
import { useEsc } from '../../../utils/use-esc';
import { usePatientByIdQuery } from '../use-patient-query';
import { VisitIdPatientId } from '../use-patient-visit';
import { VisitDrawerDetails } from './visit-drawer-details';

type DataReady<T> = {
  loading: false;
  data: T;
  error: null;
};

type Loading = {
  loading: true;
  data: null;
  error: null;
};

type Error = {
  loading: false;
  data: null;
  error: unknown;
};

type Idle = {
  loading: false;
  data: null;
  error: null;
};

type Stale<T> = {
  loading: false;
  data: T;
  error: null;
  stale: true;
};

type State<T> = DataReady<T> | Loading | Error | Idle | Stale<T>;

const loadingState: Loading = {
  loading: true,
  data: null,
  error: null,
};

const usePatientVisitDetails = () => {
  const [state, setState] = useState<State<DetailedPatientVisit>>({
    loading: false,
    data: null,
    error: null,
  });
  const staleRef = useRef<DetailedPatientVisit[]>();
  const staleSize = 5;
  const get = useCallback((param: VisitIdPatientId) => {
    const updateStale = (data: DetailedPatientVisit) => {
      if (staleRef.current) {
        staleRef.current = [...staleRef.current, data].slice(-staleSize);
      } else {
        staleRef.current = [data];
      }
    };

    const staleData = staleRef.current?.find(
      (d) => d.id === param.visitId,
    ) as DetailedPatientVisit;
    if (staleData) {
      setState({ loading: false, data: staleData, error: null, stale: true });
      return;
    }

    setState(loadingState);

    HttpService.get<DetailedPatientVisit>(
      `/v1/visit/${param.patientId}/${param.visitId}`,
    )
      .then((data) => {
        updateStale(data);
        setState({ loading: false, data, error: null });
      })
      .catch((error) => {
        setState({ loading: false, data: null, error });
      });
  }, []);
  return { state, get };
};

export const PatientVisitDetailsDrawer = () => {
  const { hide, state } = useVisitDrawer();
  const { state: data, get } = usePatientVisitDetails();
  const { data: patientDetails } = usePatientByIdQuery(
    state?.show ? state.patientId : '',
  );
  useEsc(hide);
  useEffect(() => {
    if (state?.show) {
      const { patientId, visitId } = state;
      get({ patientId, visitId });
    }
  }, [get, state]);
  const isOpen = state?.show;

  return (
    <div>
      <OutsideClick onOutsideClick={hide}>
        <div
          className={`fixed top-0 z-[100] right-0 h-full w-[100vw] lg:w-[35vw] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg text-gray-500 font-bold">
              {patientDetails?.name}
            </h3>
            <button onClick={hide}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            {data.loading && <div>Loading...</div>}
            {data.error ? <div>Something went wrong</div> : null}
            {data.data ? (
              <VisitDrawerDetails
                data={data.data}
                patientId={state?.show ? state.patientId : ''}
              />
            ) : null}
          </div>
        </div>
      </OutsideClick>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[40]"></div>
      )}
    </div>
  );
};
