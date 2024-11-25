import { DetailedPatientVisit } from '@hospital/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  usePatientVisitDrawerState,
  useVisitDrawer,
} from '../../provider/patient-drawer-context-provider';
import { HttpService } from '../../utils/http';
import { VisitIdPatientId } from './use-patient-visit';

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

type Error<T> = {
  loading: false;
  data: null;
  error: T;
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

type State<T> = DataReady<T> | Loading | Error<T> | Idle | Stale<T>;

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
      `/patient/visit/${param.patientId}/${param.visitId}`,
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
  const state = usePatientVisitDrawerState();
  const { hide } = useVisitDrawer();
  const { state: data, get } = usePatientVisitDetails();
  useEffect(() => {
    if (state?.show) {
      const { patientId, visitId } = state;
      get({ patientId, visitId });
    }
  }, [get, state]);
  const isOpen = state?.show;

  return (
    <div>
      <div
        className={`fixed top-0 z-10 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          onClick={hide}
          className="p-2 bg-red-500 text-white rounded-md m-2"
        >
          Close Drawer
        </button>
        <div className="p-4">
          <h2 className="text-xl font-bold">Right-Side Drawer</h2>
          <p>This is a right-side drawer implemented with Tailwind CSS.</p>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50"></div>}
    </div>
  );
};
