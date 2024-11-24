import 'quill/dist/quill.snow.css'; // ES6
import 'quill-mention/dist/quill.mention.css'; // Import quill-mention styles
import { Mention, MentionBlot, MentionOption } from 'quill-mention'; // Ensure this is imported correctly
import { useEffect, useRef } from 'react';
import Quill from 'quill';

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

    if (mentionChar === '@') {
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

export const CustomEditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const init = useRef(false);

  useEffect(() => {
    if (ref.current && !init.current) {
      init.current = true;
      const quill = new Quill(ref.current, {
        theme: 'snow',
        modules: modules,
      });
      quill.on('text-change', function () {
        console.log(quill.getContents());
      });
    }
  }, []);
  return <div ref={ref}></div>;
};
