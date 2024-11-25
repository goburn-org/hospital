import 'quill/dist/quill.snow.css'; // ES6
import 'quill-mention/dist/quill.mention.css'; // Import quill-mention styles
import { Mention, MentionBlot, MentionOption } from 'quill-mention'; // Ensure this is imported correctly
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import { useLatest } from '../utils/use-latest';

Quill.register({
  'blots/mention': MentionBlot,
  'modules/mention': Mention,
});

const atValues = [
  { id: '1', value: 'Fredrik Sundqvist' },
  { id: '2', value: 'Patrik Sjölin' },
];
const hashValues = [
  { id: '3', value: 'Fredrik Sundqvist 2' },
  { id: '4', value: 'Patrik Sjölin 2' },
];

const mention: Partial<MentionOption> = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['.'],
  source: function (searchTerm, renderList, mentionChar) {
    let values;

    if (mentionChar === '.') {
      values = atValues;
    } else {
      values = hashValues;
    }

    if (searchTerm.length === 0) {
      renderList(values, searchTerm);
    } else {
      const matches = [];
      for (let i = 0; i < values.length; i++)
        if (~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase()))
          matches.push(values[i]);
      renderList(matches, searchTerm);
    }
  },
};

const modules = {
  mention,
  toolbar: null,
};

export const CustomEditor = ({
  disabled,
  className,
  placeholder,
  onChange,
  initialValue,
}: {
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  initialValue?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const init = useRef(false);
  const latestCb = useLatest(onChange);

  useEffect(() => {
    if (ref.current && !init.current) {
      init.current = true;
      const quill = new Quill(ref.current, {
        theme: 'snow',
        modules: modules,
        readOnly: disabled,
        placeholder,
      });
      quill.keyboard.addBinding(
        { key: 9 }, // Keycode for Tab
        () => {
          console.log('here');
          const form = document.querySelector('form'); // Assuming inside a form
          const inputs = Array.from(
            form?.querySelectorAll(
              'input, textarea, button, select, [contenteditable=true]',
            ) ?? [],
          );
          const currentIndex = inputs.findIndex(
            (el) => el === document.activeElement,
          );

          if (currentIndex >= 0) {
            const nextInput = inputs[currentIndex + 1] || inputs[0]; // Loop back to the first input if needed
            (nextInput as any).focus?.();
          }
          return false; // Prevent default behavior (inserting spaces)
        },
      );
      quill.root.innerHTML = initialValue || '';

      quill.on('text-change', function () {
        latestCb.current && latestCb.current(quill.root.innerHTML);
      });
    }
  }, [disabled, initialValue, latestCb, placeholder]);
  return <div className={className} ref={ref}></div>;
};
