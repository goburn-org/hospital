import Quill from 'quill';
import { Mention, MentionBlot, MentionOption } from 'quill-mention'; // Ensure this is imported correctly
import 'quill-mention/dist/quill.mention.css'; // Import quill-mention styles
import 'quill/dist/quill.snow.css'; // ES6
import { useEffect, useRef } from 'react';
import { useLatest } from '../utils/use-latest';

Quill.register({
  'blots/mention': MentionBlot,
  'modules/mention': Mention,
});

const atValues = [
  { id: 'dengue', value: { diag1: 'High fever', diag2: 'Nausea' } },
  { id: 'flu', value: { diag1: 'Runny nose', diag2: 'Body aches' } },
];

const mention: Partial<MentionOption> = {
  allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  mentionDenotationChars: ['.'],
  source: function (searchTerm, renderList, mentionChar) {
    let values;

    if (mentionChar === '.') {
      values = atValues;
    } else {
      return; // If other mention chars are needed, handle them here
    }

    // Match based on ID
    const matches = values.filter((item) =>
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    // Render the dropdown
    renderList(
      matches.map((item) => ({
        id: item.id,
        value: item.id, // Display the ID in dropdown
      })),
      searchTerm,
    );
  },
  onSelect: function (item, insertItem) {
    // Custom behavior on selecting an item
    const selectedDisease = atValues.find((d) => d.id === item.id);

    if (selectedDisease) {
      const symptoms = Object.values(selectedDisease.value).join(', ');
      insertItem(item); // Insert the disease name
      const quill = this.quill;
      const cursorPosition = quill.getSelection().index;
      quill.insertText(cursorPosition, `${symptoms}`); // Add symptoms
      quill.setSelection(cursorPosition + symptoms.length + 12); // Move cursor
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

      quill.root.innerHTML = initialValue || '';

      quill.on('text-change', function () {
        latestCb.current && latestCb.current(quill.root.innerHTML);
      });
    }
  }, [disabled, initialValue, latestCb, placeholder]);

  return <div className={className} ref={ref}></div>;
};
